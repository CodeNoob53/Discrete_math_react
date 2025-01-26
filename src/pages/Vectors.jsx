import React, { useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import {
  addVectors,
  calculateCrossProduct,
  calculateDotProduct,
  calculateMagnitude,
  findNegativeVector,
  findStartPoint,
  subtractVectors,
} from "../apiClient";

const OperationForm = ({ title, onSubmit, vectors, setVectors, result, error, clearForm, allowAdd = true }) => (
  <div className="formContainer">
    <h4>{title}</h4>
    {error && <p className="flashMessage show">{error}</p>}
    <form onSubmit={onSubmit}>
      {vectors.map((vector, index) => (
        <div className="formGroup" key={index}>
          <label htmlFor={`vector-${index}`}>Vector {index + 1}:</label>
          <Tippy content="Enter comma-separated numbers (e.g., 1,2,3)">
            <input
              type="text"
              id={`vector-${index}`}
              className="shortInput"
              value={vector.join(",")}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (/^[0-9,.\s-]*$/.test(inputValue)) {
                  const updatedVectors = [...vectors];
                  updatedVectors[index] = inputValue
                    .split(",")
                    .map((v) => (v.trim() === "" ? "" : Number(v)));
                  setVectors(updatedVectors);
                }
              }}
              placeholder="e.g., 1,2,3"
              inputMode="numeric"
            />
          </Tippy>
          {index >= 2 && (
            <Tippy content="Remove this vector field" placement="right">
              <button
                type="button"
                className="delete-field-button"
                onClick={() => setVectors(vectors.filter((_, i) => i !== index))}
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
              onClick={() => setVectors([...vectors, []])}
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
        <button type="button" className="clear" onClick={clearForm}>
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


const Vectors = () => {
  const [addInputs, setAddInputs] = useState([[], []]);
  const [crossInputs, setCrossInputs] = useState([[], []]);
  const [dotInputs, setDotInputs] = useState([[], []]);
  const [startInputs, setStartInputs] = useState([[], []]);
  const [magnitudeInputs, setMagnitudeInputs] = useState([[]]);
  const [negativeInputs, setNegativeInputs] = useState([[]]);
  const [subtractInputs, setSubtractInputs] = useState([[], []]);

  const [addResult, setAddResult] = useState("");
  const [crossResult, setCrossResult] = useState("");
  const [dotResult, setDotResult] = useState("");
  const [startResult, setStartResult] = useState("");
  const [magnitudeResult, setMagnitudeResult] = useState("");
  const [negativeResult, setNegativeResult] = useState("");
  const [subtractResult, setSubtractResult] = useState("");

  const [addError, setAddError] = useState("");
  const [crossError, setCrossError] = useState("");
  const [dotError, setDotError] = useState("");
  const [startError, setStartError] = useState("");
  const [magnitudeError, setMagnitudeError] = useState("");
  const [negativeError, setNegativeError] = useState("");
  const [subtractError, setSubtractError] = useState("");

  const clearForm = (setInputs, setResult, setError, defaultVectors = [[]]) => {
    setInputs(defaultVectors);
    setResult("");
    setError("");
  };

  const validateInputs = (vectors) => {
    for (const vector of vectors) {
      if (vector.some((val) => isNaN(val))) {
        return "All inputs must be numbers.";
      }
      if (vector.length === 0 || vector.every((val) => val === "")) {
        return "Fields cannot be empty.";
      }
    }
    return null;
  };

  const handleSubmit = async (inputs, apiCall, setResult, setError) => {
    const validationError = validateInputs(inputs[0]);
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      setError("");
  
      // Лог даних, які відправляються на сервер
      console.group("API Request");
      console.log("%cSending data to server:", "color: blue; font-weight: bold;", JSON.stringify(inputs, null, 2));
  
      const result = await apiCall(...inputs);
  
      // Лог відповіді сервера
      console.log("%cResponse from server:", "color: green; font-weight: bold;", JSON.stringify(result, null, 2));
      console.groupEnd();
  
      setResult(result);
    } catch (err) {
      console.group("API Error");
      console.error("%cError response from server:", "color: red; font-weight: bold;", err.message || "Unknown error");
      console.groupEnd();
  
      setError(err.message || "An error occurred during the calculation.");
    }
  };
  
  return (
    <div>
      <OperationForm
        title="Add Multiple Vectors"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit([addInputs], addVectors, setAddResult, setAddError);
        }}
        vectors={addInputs}
        setVectors={setAddInputs}
        result={addResult}
        error={addError}
        clearForm={() => clearForm(setAddInputs, setAddResult, setAddError)}
      />
      <OperationForm
        title="Calculate Cross Product"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit([crossInputs], calculateCrossProduct, setCrossResult, setCrossError);
        }}
        vectors={crossInputs}
        setVectors={setCrossInputs}
        result={crossResult}
        error={crossError}
        clearForm={() => clearForm(setCrossInputs, setCrossResult, setCrossError)}
      />
      <OperationForm
        title="Calculate Dot Product"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit([dotInputs], calculateDotProduct, setDotResult, setDotError);
        }}
        vectors={dotInputs}
        setVectors={setDotInputs}
        result={dotResult}
        error={dotError}
        clearForm={() => clearForm(setDotInputs, setDotResult, setDotError)}
      />
      <OperationForm
        title="Find Start Point"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit([startInputs], findStartPoint, setStartResult, setStartError);
        }}
        vectors={startInputs}
        setVectors={setStartInputs}
        result={startResult}
        error={startError}
        clearForm={() => clearForm(setStartInputs, setStartResult, setStartError)}
      />
      <OperationForm
        title="Calculate Magnitude"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit([magnitudeInputs], calculateMagnitude, setMagnitudeResult, setMagnitudeError);
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
          handleSubmit([negativeInputs], findNegativeVector, setNegativeResult, setNegativeError);
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
          handleSubmit([subtractInputs], subtractVectors, setSubtractResult, setSubtractError);
        }}
        vectors={subtractInputs}
        setVectors={setSubtractInputs}
        result={subtractResult}
        error={subtractError}
        clearForm={() => clearForm(setSubtractInputs, setSubtractResult, setSubtractError)}
      />
    </div>
  );
};

export default Vectors;
