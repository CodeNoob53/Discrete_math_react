import React, { useState } from "react";
import PropTypes from "prop-types";

import { MathJax, MathJaxContext } from "better-react-mathjax";
import {
  calculateArrangement,
  calculateCombination,
  calculateCombinationWithRepetition,
  calculatePermutation,
  calculatePermutationWithRepetition,
} from "../apiClient";

const OperationForm = ({ title, onSubmit, inputs, setInputs, result, error, clearForm }) => (
  <div className="formContainer">
    <div className="form-header"><h3>{title}</h3></div>
    {error && <p className="flashMessage error">{error}</p>}
    <form onSubmit={onSubmit}>
      {inputs.n !== undefined && (
        <div className="formGroup">
          <label htmlFor="n">
            <MathJax inline>{`\\(n:\\)`}</MathJax>
          </label>
          <input
            type="text"
            id="n"
            value={inputs.n}
            onChange={(e) => setInputs({ ...inputs, n: e.target.value })}
            placeholder="Enter n"
            maxLength={3}
          />
        </div>
      )}
      {inputs.k !== undefined && (
        <div className="formGroup">
          <label htmlFor="k">
            <MathJax inline>{`\\(k:\\)`}</MathJax>
          </label>
          <input
            type="text"
            id="k"
            value={inputs.k}
            onChange={(e) => setInputs({ ...inputs, k: e.target.value })}
            placeholder="Enter k"
            maxLength={3}
          />
        </div>
      )}
      {inputs.elements && (
        <div className="formGroup counts-container">
          {inputs.elements.map((element, index) => (
            <div key={index} className="count-field">
              <label htmlFor={`count-${index}`}>Count {index + 1}:</label>
              <input
                type="number"
                id={`count-${index}`}
                value={element.count}
                onChange={(e) => {
                  const updatedElements = [...inputs.elements];
                  const newValue = e.target.value === "" ? "" : parseInt(e.target.value) || 0;
                  updatedElements[index].count = newValue;
                  setInputs({ ...inputs, elements: updatedElements });
                }}
                placeholder="Enter count"
                maxLength={3} // Обмеження довжини вводу до 3 символів
              />
            </div>
          ))}
          <button
            type="button"
            className="add-count-button"
            onClick={() =>
              setInputs({ ...inputs, elements: [...inputs.elements, { count: 1 }] })
            }
          >
            +
          </button>
        </div>
      )}

      <div className="buttons">
        <button type="submit" className="submit">
          Submit
        </button>
        <button
          type="button"
          onClick={() => {
            console.log("Clear button clicked. Resetting form.");
            clearForm();
          }}
          className="clear"
        >
          Clear
        </button>
      </div>
    </form>
    {result && (
      <div className="result">
        <h3>Result:</h3>
        <p>{result}</p>
      </div>
    )}
  </div>
);

const Combinatorics = () => {
  const [arrangementInputs, setArrangementInputs] = useState({ n: "", k: "" });
  const [combinationInputs, setCombinationInputs] = useState({ n: "", k: "" });
  const [combinationRepInputs, setCombinationRepInputs] = useState({ n: "", k: "" });
  const [permutationInputs, setPermutationInputs] = useState({ n: "" });
  const [permutationRepInputs, setPermutationRepInputs] = useState({ n: "", elements: [{ count: 1 }] });

  const [arrangementResult, setArrangementResult] = useState("");
  const [combinationResult, setCombinationResult] = useState("");
  const [combinationRepResult, setCombinationRepResult] = useState("");
  const [permutationResult, setPermutationResult] = useState("");
  const [permutationRepResult, setPermutationRepResult] = useState("");

  const [arrangementFlash, setArrangementFlash] = useState("");
  const [combinationFlash, setCombinationFlash] = useState("");
  const [combinationRepFlash, setCombinationRepFlash] = useState("");
  const [permutationFlash, setPermutationFlash] = useState("");
  const [permutationRepFlash, setPermutationRepFlash] = useState("");

  const clearForm = (setInputs, defaultInputs, setResult, setFlash) => {
    if (typeof setInputs === "function") {
      const updatedDefaults = { ...defaultInputs };
      if (updatedDefaults.elements) {
        updatedDefaults.elements = [{ count: 1 }];
      }
      setInputs(updatedDefaults);
    }
    setResult("");
    setFlash("");
  };

  const validateElements = (elements) => {
    for (const element of elements) {
      if (!Number.isInteger(element.count) || element.count <= 0) {
        return "All counts must be positive integers.";
      }
    }
    return null;
  };

  const validateInputs = (n, k = null, setResult) => {
    if (!n && k === null) {
      setResult("");
      return "Both fields 'n' and 'k' are required.";
    }
    if (!n) {
      setResult("");
      return "The field 'n' is required.";
    }
    if (isNaN(n) || n <= 0 || !Number.isInteger(parseFloat(n))) {
      setResult("");
      return "The value of 'n' must be a positive integer.";
    }
    if (k !== null) {
      if (!k) {
        setResult("");
        return "The field 'k' is required.";
      }
      if (isNaN(k) || k < 0 || !Number.isInteger(parseFloat(k)) || parseInt(k) > parseInt(n)) {
        setResult("");
        return "Invalid value for 'k'.";
      }
    }
    return null;
  };

  const handleSubmit = async (e, calculateFunction, inputs, needsK, setResult, setFlash) => {
    e.preventDefault();
    const { n, k, elements } = inputs;

    if (elements) {
      const elementsError = validateElements(elements);
      if (elementsError) {
        setFlash(elementsError);
        setTimeout(() => setFlash(""), 5000);
        return;
      }
    }

    const validationError = validateInputs(n, needsK ? k : null, setResult);
    if (validationError) {
      setFlash(validationError);
      setTimeout(() => setFlash(""), 5000);
      return;
    }

    try {
      // Якщо потрібно k, передаємо її, якщо ні - передаємо elements
      const resultData = needsK
        ? await calculateFunction(parseInt(n), parseInt(k))
        : await calculateFunction(parseInt(n), elements);
      setResult(resultData);
      setFlash("");
    } catch (err) {
      setFlash("An error occurred during the calculation.");
      setTimeout(() => setFlash(""), 5000);
    }
  };

  return (
    <MathJaxContext>
      <div className=" wrapper combinatorics">
        <OperationForm
          title={<MathJax inline>{"Arrangement \\(A(n, k)\\)"}</MathJax>}
          onSubmit={(e) =>
            handleSubmit(
              e,
              calculateArrangement,
              arrangementInputs,
              true,
              setArrangementResult,
              setArrangementFlash
            )
          }
          inputs={arrangementInputs}
          setInputs={setArrangementInputs}
          result={arrangementResult}
          error={arrangementFlash}
          clearForm={() => clearForm(setArrangementInputs, { n: "", k: "" }, setArrangementResult, setArrangementFlash)}
        />

        <OperationForm
          title={<MathJax inline>{"Combination \\(C(n, k)\\)"}</MathJax>}
          onSubmit={(e) =>
            handleSubmit(
              e,
              calculateCombination,
              combinationInputs,
              true,
              setCombinationResult,
              setCombinationFlash
            )
          }
          inputs={combinationInputs}
          setInputs={setCombinationInputs}
          result={combinationResult}
          error={combinationFlash}
          clearForm={() => clearForm(setCombinationInputs, { n: "", k: "" }, setCombinationResult, setCombinationFlash)}
        />

        <OperationForm
          title={<MathJax inline>{"Combination with Repetition \\(C'(n, k)\\)"}</MathJax>}
          onSubmit={(e) =>
            handleSubmit(
              e,
              calculateCombinationWithRepetition,
              combinationRepInputs,
              true,
              setCombinationRepResult,
              setCombinationRepFlash
            )
          }
          inputs={combinationRepInputs}
          setInputs={setCombinationRepInputs}
          result={combinationRepResult}
          error={combinationRepFlash}
          clearForm={() => clearForm(setCombinationRepInputs, { n: "", k: "" }, setCombinationRepResult, setCombinationRepFlash)}
        />

        <OperationForm
          title={<MathJax inline>{"Permutation \\(P(n)\\)"}</MathJax>}
          onSubmit={(e) =>
            handleSubmit(
              e,
              calculatePermutation,
              permutationInputs,
              false,
              setPermutationResult,
              setPermutationFlash
            )
          }
          inputs={permutationInputs}
          setInputs={setPermutationInputs}
          result={permutationResult}
          error={permutationFlash}
          clearForm={() => clearForm(setPermutationInputs, { n: "" }, setPermutationResult, setPermutationFlash)}
        />

        <OperationForm
          title={<MathJax inline>{"Permutation with Repetition \\(P'(n)\\)"}</MathJax>}
          onSubmit={(e) =>
            handleSubmit(
              e,
              calculatePermutationWithRepetition,
              permutationRepInputs,
              false,
              setPermutationRepResult,
              setPermutationRepFlash
            )
          }
          inputs={permutationRepInputs}
          setInputs={setPermutationRepInputs}
          result={permutationRepResult}
          error={permutationRepFlash}
          clearForm={() => clearForm(setPermutationRepInputs, { n: "", elements: [{ count: 1 }] }, setPermutationRepResult, setPermutationRepFlash)}
        />
      </div>
    </MathJaxContext>
  );
};
OperationForm.propTypes = {
  title: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
  inputs: PropTypes.object.isRequired,
  setInputs: PropTypes.func.isRequired,
  result: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  error: PropTypes.string,
  clearForm: PropTypes.func.isRequired,
};

export default Combinatorics;
