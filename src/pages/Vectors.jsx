import React, { useState } from "react";
import PropTypes from "prop-types";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import {
  addVectors,
  calculateCrossProduct,
  calculateDotProduct,
  calculateMagnitude,
  findNegativeVector,
  subtractVectors,
} from "../apiClient";

const OperationForm = ({ title, onSubmit, vectors, setVectors, result, error, clearForm, allowAdd = true }) => {
  // Store raw input values before conversion to numbers
  const [rawInputs, setRawInputs] = useState(vectors.map(v => v.join(",")));

  return (
    <div className="formContainer">
      <div className="form-header"><h3>{title}</h3></div>
      {error && <p className="flashMessage show">{error}</p>}
      <form onSubmit={onSubmit}>
        {vectors.map((index) => (
          <div className="formGroup" key={index}>
            <label htmlFor={`vector-${index}`}>Vector {index + 1}:</label>
            <Tippy content="Enter comma-separated numbers (e.g., 1,2,3)">
              <input
                type="text"
                id={`vector-${index}`}
                className="shortInput"
                value={rawInputs[index]}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (/^[-0-9,.\s]*$/.test(inputValue)) {
                    // Update raw input
                    const newRawInputs = [...rawInputs];
                    newRawInputs[index] = inputValue;
                    setRawInputs(newRawInputs);

                    // Convert to numbers, but only for complete numbers
                    const updatedVectors = [...vectors];
                    updatedVectors[index] = inputValue
                      .split(",")
                      .map(v => {
                        const trimmed = v.trim();
                        if (trimmed === "" || trimmed === "-") return "";
                        const num = parseFloat(trimmed);
                        return isNaN(num) ? "" : num;
                      });
                    setVectors(updatedVectors);
                  }
                }}
                placeholder="e.g., 1,2,3"
                inputMode="numeric"
              />
            </Tippy>
            {index >= 2 && allowAdd && (
              <Tippy content="Remove this vector field" placement="right">
                <button
                  type="button"
                  className="delete-field-button"
                  onClick={() => {
                    setVectors(vectors.filter((_, i) => i !== index));
                    setRawInputs(rawInputs.filter((_, i) => i !== index));
                  }}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </Tippy>
            )}
          </div>
        ))}
        {allowAdd && (
          <div className="formGroup addButtonGroup">
            <Tippy content="Add a new vector field" placement="right">
              <button
                type="button"
                className="add-count-button"
                onClick={() => {
                  setVectors([...vectors, []]);
                  setRawInputs([...rawInputs, ""]);
                }}
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </Tippy>
          </div>
        )}
        <div className="buttons">
          <button type="submit" className="submit">
            Submit
          </button>
          <button 
            type="button" 
            className="clear" 
            onClick={() => {
              clearForm();
              setRawInputs(vectors.map(() => ""));
            }}
          >
            Clear
          </button>
        </div>
      </form>
      {result && (
        <div className="result show">
          <h5>Result:</h5>
          <p>{Array.isArray(result) ? result.join(", ") : result}</p>
        </div>
      )}
    </div>
  );
};


const Vectors = () => {
  const [addInputs, setAddInputs] = useState([[], []]);
  const [crossInputs, setCrossInputs] = useState([[], []]);
  const [dotInputs, setDotInputs] = useState([[], []]);
  const [magnitudeInputs, setMagnitudeInputs] = useState([[]]);
  const [negativeInputs, setNegativeInputs] = useState([[]]);
  const [subtractInputs, setSubtractInputs] = useState([[], []]);

  const [addResult, setAddResult] = useState("");
  const [crossResult, setCrossResult] = useState("");
  const [dotResult, setDotResult] = useState("");
  const [magnitudeResult, setMagnitudeResult] = useState("");
  const [negativeResult, setNegativeResult] = useState("");
  const [subtractResult, setSubtractResult] = useState("");

  const [addError, setAddError] = useState("");
  const [crossError, setCrossError] = useState("");
  const [dotError, setDotError] = useState("");
  const [magnitudeError, setMagnitudeError] = useState("");
  const [negativeError, setNegativeError] = useState("");
  const [subtractError, setSubtractError] = useState("");

  const clearForm = (setInputs, setResult, setError, defaultVectors = [[]]) => {
    setInputs(defaultVectors);
    setResult("");
    setError("");
  };

  const validateInputs = (vectors, apiCall, options = {}) => {
    const { singleVector = false, isPair = false } = options;

    // Validate that all vector components are valid numbers
    for (const vector of vectors) {
      if (vector.some((val) => isNaN(val) || val === "")) {
        return "All inputs must be valid numbers.";
      }
      if (vector.length === 0) {
        return "Vectors cannot be empty.";
      }
    }

    // Validation for single vector operations
    if (singleVector) {
      return null; // No additional validation needed for single vector operations
    }

    // Validation for pair operations (like dot product and cross product)
    if (isPair) {
      if (vectors.length !== 2) {
        return "Exactly two vectors are required.";
      }

      const [vector1, vector2] = vectors;
      if (vector1.length !== vector2.length) {
        return "Both vectors must have the same length.";
      }

      if (apiCall === calculateCrossProduct && vector1.length !== 3) {
        return "Cross product is only defined for 3D vectors.";
      }
      
      return null;
    }

    // Validation for multiple vector operations (add/subtract)
    if (vectors.length < 2) {
      return "At least two vectors are required.";
    }

    // Check that all vectors have the same dimension
    const firstVectorLength = vectors[0].length;
    if (vectors.some(v => v.length !== firstVectorLength)) {
      return "All vectors must have the same number of dimensions.";
    }

    return null;
  };

  const handleSubmit = async (inputs, apiCall, setResult, setError, options = {}) => {
    const { singleVector = false, isPair = false } = options;

    try {
      setError("");

      const validationError = validateInputs(inputs, apiCall, options);
      if (validationError) {
        setError(validationError);
        return;
      }

      let result;
      if (singleVector) {
        result = await apiCall(inputs[0]);
      } else if (isPair) {
        const [vector1, vector2] = inputs;
        result = await apiCall(vector1, vector2);
      } else {
        result = await apiCall({ vectors: inputs });
      }

      setResult(result);
    } catch (error) {
      console.error("Operation error:", error);
      setError(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div>
      <OperationForm
        title="Add Multiple Vectors"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(addInputs, addVectors, setAddResult, setAddError);
        }}
        vectors={addInputs}
        setVectors={setAddInputs}
        result={addResult}
        error={addError}
        clearForm={() => clearForm(setAddInputs, setAddResult, setAddError, [[], []])}
      />
      <OperationForm
        title="Calculate Cross Product"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(crossInputs, calculateCrossProduct, setCrossResult, setCrossError, { isPair: true });
        }}
        vectors={crossInputs}
        setVectors={setCrossInputs}
        result={crossResult}
        error={crossError}
        clearForm={() => clearForm(setCrossInputs, setCrossResult, setCrossError, [[], []])}
        allowAdd={false}
      />
      <OperationForm
        title="Calculate Dot Product"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(dotInputs, calculateDotProduct, setDotResult, setDotError, { isPair: true });
        }}
        vectors={dotInputs}
        setVectors={setDotInputs}
        result={dotResult}
        error={dotError}
        clearForm={() => clearForm(setDotInputs, setDotResult, setDotError, [[], []])}
        allowAdd={false}
      />
      <OperationForm
        title="Calculate Magnitude"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(magnitudeInputs, calculateMagnitude, setMagnitudeResult, setMagnitudeError, { singleVector: true });
        }}
        vectors={magnitudeInputs}
        setVectors={setMagnitudeInputs}
        result={magnitudeResult}
        error={magnitudeError}
        clearForm={() => clearForm(setMagnitudeInputs, setMagnitudeResult, setMagnitudeError, [[]])}
        allowAdd={false}
      />
      <OperationForm
        title="Calculate Negative Vector"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(negativeInputs, findNegativeVector, setNegativeResult, setNegativeError, { singleVector: true });
        }}
        vectors={negativeInputs}
        setVectors={setNegativeInputs}
        result={negativeResult}
        error={negativeError}
        clearForm={() => clearForm(setNegativeInputs, setNegativeResult, setNegativeError, [[]])}
        allowAdd={false}
      />
      <OperationForm
        title="Subtract Multiple Vectors"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(subtractInputs, subtractVectors, setSubtractResult, setSubtractError);
        }}
        vectors={subtractInputs}
        setVectors={setSubtractInputs}
        result={subtractResult}
        error={subtractError}
        clearForm={() => clearForm(setSubtractInputs, setSubtractResult, setSubtractError, [[], []])}
      />
    </div>
  );
};
OperationForm.propTypes = {
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  vectors: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  setVectors: PropTypes.func.isRequired,
  result: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  error: PropTypes.string,
  clearForm: PropTypes.func.isRequired,
  allowAdd: PropTypes.bool,
};
export default Vectors;