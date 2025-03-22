import React, { useState } from "react";

import PropTypes from "prop-types";

import Tippy from "@tippyjs/react";

import Result from "../components/result/Result";
import MatrixGridInput from "../components/matrixComponents/MatrixGridInput";
import FAQModal from "../components/matrixComponents/faq/FAQModal";
import FlashMessage from "../components/flashMessage/FlashMessage";
import { handleMatrixSubmit, parseMatrixInput, processMatrix, sequentialAddMatrices, sequentialSubtractMatrices } from "../utils/matrixUtils";
import { addMatrices, calculateAdjoint, calculateDeterminant, calculateInverseMatrix, calculateRank, divideMatrices, multiplyMatrices, multiplyMatrixByScalar, solveLinearSystem, subtractMatrices } from "../api/apiClient";
import "tippy.js/dist/tippy.css";
import { HelpCircle, Trash, Plus } from 'lucide-react';

import "./../styles/Matrix.css";

// Updated universal OperationForm including scalar input support
const OperationForm = ({
  title,
  onSubmit,
  matrices,
  setMatrices,
  scalar,
  setScalar,
  result,
  error,
  clearForm,
  allowAdd = true,
  maxMatrices = null,
  maxRows,
  maxCols,
  includeScalar = false,
}) => {
  const [rawInputs, setRawInputs] = useState(matrices.map((m) => m.map((row) => row.join(" ")).join("\n")));
  const [activeMatrixIndex, setActiveMatrixIndex] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [isFAQOpen, setIsFAQOpen] = useState(false); // Додаємо стан для модального вікна

  const handleClearForm = () => {
    const defaultMatrices = maxMatrices === 2 ? [[], []] : [[]];
    clearForm();
    setResetKey((prev) => prev + 1);
    setRawInputs(defaultMatrices.map(() => ""));
    setMatrices(defaultMatrices.map(() => parseMatrixInput("")));
    if (includeScalar && setScalar) setScalar("1");
  };

  // Функція для додавання нової матриці
  const addMatrix = () => {
    setMatrices([...matrices, []]);
    setRawInputs([...rawInputs, ""]);
  };

  return (
    <div className="formContainer">
      <div className="form-header">
        <h3>{title}</h3>
        <button 
          type="button" 
          className="faq-button"
          onClick={() => setIsFAQOpen(true)}
        >
          <HelpCircle size={18} />
          FAQ
        </button>
      </div>
      {error && <FlashMessage message={error} clearMessage={() => {}} type="error" />}
      <form onSubmit={onSubmit}>
        {includeScalar && (
          <div className="scalar-input-container">
            <label htmlFor="scalar-value" className="scalar-label">
              Scalar Value:
            </label>
            <input
              id="scalar-value"
              type="text"
              className="scalar-input short"
              value={scalar}
              onChange={(e) => {
                const value = e.target.value;
                if (/^-?\.?$/.test(value) || /^-?\d*\.?\d*$/.test(value)) {
                  setScalar(value);
                }
              }}
              placeholder="Enter scalar value"
            />
          </div>
        )}
        <div className="matrices-container">
          {matrices.map((_, index) => (
            <div className="matrix-group" key={index}>
              <div className="matrix-label-container">
                <label htmlFor={`matrix-${index}`} className="matrix-label">
                  {includeScalar ? "Matrix:" : `Matrix ${index + 1}:`}
                </label>
                {/* Кнопки управління матрицями */}
                {index >= 2 && allowAdd && (
                  <div className="matrix-buttons">
                    <Tippy content="Remove this matrix field" placement="right">
                      <button
                        type="button"
                        className="delete-field-button"
                        onClick={() => {
                          setMatrices(matrices.filter((_, i) => i !== index));
                          setRawInputs(rawInputs.filter((_, i) => i !== index));
                          if (activeMatrixIndex === index) setActiveMatrixIndex(null);
                        }}
                      >
                        <Trash size={18} />
                      </button>
                    </Tippy>
                  </div>
                )}
              </div>
              <div className="matrix-input-wrapper">
                <MatrixGridInput
                  key={`matrix-${index}-${resetKey}`}
                  value={rawInputs[index]}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (/^[-0-9.\s\n]*$/.test(inputValue)) {
                      const newRawInputs = [...rawInputs];
                      newRawInputs[index] = inputValue;
                      setRawInputs(newRawInputs);
                      const updatedMatrices = newRawInputs.map((raw) => parseMatrixInput(raw));
                      setMatrices(updatedMatrices);
                    }
                  }}
                  index={index}
                  formId={title.replace(/\s+/g, "-").toLowerCase()}
                  isActive={activeMatrixIndex === index}
                  setActiveMatrixIndex={setActiveMatrixIndex}
                  maxRows={maxRows}
                  maxCols={maxCols}
                />
              </div>
            </div>
          ))}
          
          {/* Комірка для додавання нової матриці */}
          {allowAdd && (!maxMatrices || matrices.length < maxMatrices) && (
            <div className="add-matrix-cell" onClick={addMatrix}>
              <Tippy content="Add a new matrix" placement="top">
                <button
                  type="button"
                  className="add-count-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Запобігаємо подвійному спрацьовуванню
                    addMatrix();
                  }}
                >
                  <Plus size={18} />
                </button>
              </Tippy>
            </div>
          )}
        </div>
        <div className="buttons">
          <button type="submit" className="submit">
            {includeScalar ? "Calculate" : "Submit"}
          </button>
          <button type="button" className="clear" onClick={handleClearForm}>
            Clear
          </button>
        </div>
      </form>
      {result && <Result result={result} title="Результат:" />}
      
      {/* Модальне вікно FAQ */}
      <FAQModal isOpen={isFAQOpen} onClose={() => setIsFAQOpen(false)} />
    </div>
  );
};

OperationForm.propTypes = {
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  matrices: PropTypes.arrayOf(PropTypes.array).isRequired,
  setMatrices: PropTypes.func.isRequired,
  scalar: PropTypes.string,
  setScalar: PropTypes.func,
  result: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    PropTypes.number,
    PropTypes.string,
  ]),
  error: PropTypes.string,
  clearForm: PropTypes.func.isRequired,
  allowAdd: PropTypes.bool,
  maxMatrices: PropTypes.number,
  maxRows: PropTypes.number,
  maxCols: PropTypes.number,
  includeScalar: PropTypes.bool,
};

// Wrapper functions for sequential operations
const sequentialAddMatricesWrapper = (matrices) => sequentialAddMatrices(matrices, addMatrices);
const sequentialSubtractMatricesWrapper = (matrices) => sequentialSubtractMatrices(matrices, subtractMatrices);

const Matrices = () => {
  const [addInputs, setAddInputs] = useState([[], []]);
  const [subtractInputs, setSubtractInputs] = useState([[], []]);
  const [multiplyInputs, setMultiplyInputs] = useState([[], []]);
  const [determinantInputs, setDeterminantInputs] = useState([[]]);
  const [adjointInputs, setAdjointInputs] = useState([[]]);
  const [divideInputs, setDivideInputs] = useState([[], []]);
  const [inverseInputs, setInverseInputs] = useState([[]]);
  const [rankInputs, setRankInputs] = useState([[]]);
  // State for scalar multiplication operation
  const [scalarMultiplyInputs, setScalarMultiplyInputs] = useState([[]]);
  const [scalarMultiplyResult, setScalarMultiplyResult] = useState("");
  const [scalarMultiplyError, setScalarMultiplyError] = useState("");
  const [scalar, setScalar] = useState("1");

  const [addResult, setAddResult] = useState("");
  const [subtractResult, setSubtractResult] = useState("");
  const [multiplyResult, setMultiplyResult] = useState("");
  const [determinantResult, setDeterminantResult] = useState("");
  const [adjointResult, setAdjointResult] = useState("");
  const [divideResult, setDivideResult] = useState("");
  const [inverseResult, setInverseResult] = useState("");
  const [rankResult, setRankResult] = useState("");

  const [addError, setAddError] = useState("");
  const [subtractError, setSubtractError] = useState("");
  const [multiplyError, setMultiplyError] = useState("");
  const [determinantError, setDeterminantError] = useState("");
  const [adjointError, setAdjointError] = useState("");
  const [divideError, setDivideError] = useState("");
  const [inverseError, setInverseError] = useState("");
  const [rankError, setRankError] = useState("");

  // New state hooks for solving linear system
  const [solveInputs, setSolveInputs] = useState([[]]);
  const [solveResult, setSolveResult] = useState("");
  const [solveError, setSolveError] = useState("");

  const clearForm = (setInputs, setResult, setError, maxMatrices = null, allowAdd = true) => {
    let defaultMatrices;
    if (!allowAdd && maxMatrices === 1) {
      defaultMatrices = [[]];
    } else if (!allowAdd && maxMatrices === 2) {
      defaultMatrices = [[], []];
    } else {
      defaultMatrices = [[], []];
    }
    setInputs(defaultMatrices);
    setResult("");
    setError("");
  };

  // Handler for scalar multiplication
  const handleScalarMultiply = (e) => {
    e.preventDefault();
    setScalarMultiplyError("");

    try {
      const scalarValue = parseFloat(scalar);
      if (isNaN(scalarValue)) {
        setScalarMultiplyError("Scalar must be a valid number");
        return;
      }
      const processedMatrix = processMatrix(scalarMultiplyInputs[0]);
      if (processedMatrix.length === 0 || processedMatrix.some((row) => row.length === 0)) {
        setScalarMultiplyError("Matrix cannot be empty");
        return;
      }
      if (processedMatrix.some((row) => row.some((val) => isNaN(val)))) {
        setScalarMultiplyError("All matrix elements must be valid numbers");
        return;
      }
      multiplyMatrixByScalar(processedMatrix, scalarValue)
        .then((result) => {
          setScalarMultiplyResult(result);
        })
        .catch((error) => {
          setScalarMultiplyError(error.message || "An error occurred during calculation");
        });
    } catch (error) {
      setScalarMultiplyError("Error processing input: " + error.message);
    }
  };

  return (
    <div className="wrapper">
      <OperationForm
        title="Add Multiple Matrices"
        onSubmit={(e) => {
          e.preventDefault();
          handleMatrixSubmit(addInputs, sequentialAddMatricesWrapper, setAddResult, setAddError);
        }}
        matrices={addInputs}
        setMatrices={setAddInputs}
        result={addResult}
        error={addError}
        clearForm={() => clearForm(setAddInputs, setAddResult, setAddError, null, true)}
        maxCols={5}
        maxRows={5}
      />
      <OperationForm
        title="Subtract Multiple Matrices"
        onSubmit={(e) => {
          e.preventDefault();
          handleMatrixSubmit(subtractInputs, sequentialSubtractMatricesWrapper, setSubtractResult, setSubtractError);
        }}
        matrices={subtractInputs}
        setMatrices={setSubtractInputs}
        result={subtractResult}
        error={subtractError}
        clearForm={() => clearForm(setSubtractInputs, setSubtractResult, setSubtractError, null, true)}
        maxCols={5}
        maxRows={5}
      />
      <OperationForm
        title="Multiply Two Matrices"
        onSubmit={(e) => {
          e.preventDefault();
          handleMatrixSubmit(multiplyInputs, multiplyMatrices, setMultiplyResult, setMultiplyError, { isPair: true });
        }}
        matrices={multiplyInputs}
        setMatrices={setMultiplyInputs}
        result={multiplyResult}
        error={multiplyError}
        clearForm={() => clearForm(setMultiplyInputs, setMultiplyResult, setMultiplyError, 2, false)}
        allowAdd={false}
        maxMatrices={2}
        maxCols={5}
        maxRows={5}
      />
      <OperationForm
        title="Calculate Determinant"
        onSubmit={(e) => {
          e.preventDefault();
          handleMatrixSubmit(determinantInputs, calculateDeterminant, setDeterminantResult, setDeterminantError, { singleMatrix: true });
        }}
        matrices={determinantInputs}
        setMatrices={setDeterminantInputs}
        result={determinantResult}
        error={determinantError}
        clearForm={() => clearForm(setDeterminantInputs, setDeterminantResult, setDeterminantError, 1, false)}
        allowAdd={false}
        maxMatrices={1}
        maxCols={8}
        maxRows={8}
      />
      <OperationForm
        title="Calculate Adjoint (Adjugate)"
        onSubmit={(e) => {
          e.preventDefault();
          handleMatrixSubmit(adjointInputs, calculateAdjoint, setAdjointResult, setAdjointError, { singleMatrix: true });
        }}
        matrices={adjointInputs}
        setMatrices={setAdjointInputs}
        result={adjointResult}
        error={adjointError}
        clearForm={() => clearForm(setAdjointInputs, setAdjointResult, setAdjointError, 1, false)}
        allowAdd={false}
        maxMatrices={1}
        maxCols={8}
        maxRows={8}
      />
      <OperationForm
        title="Divide Two Matrices (A/B = A*B^(-1))"
        onSubmit={(e) => {
          e.preventDefault();
          handleMatrixSubmit(divideInputs, divideMatrices, setDivideResult, setDivideError, { isPair: true });
        }}
        matrices={divideInputs}
        setMatrices={setDivideInputs}
        result={divideResult}
        error={divideError}
        clearForm={() => clearForm(setDivideInputs, setDivideResult, setDivideError, 2, false)}
        allowAdd={false}
        maxMatrices={2}
        maxCols={5}
        maxRows={5}
      />
      <OperationForm
        title="Calculate Inverse"
        onSubmit={(e) => {
          e.preventDefault();
          handleMatrixSubmit(inverseInputs, calculateInverseMatrix, setInverseResult, setInverseError, { singleMatrix: true });
        }}
        matrices={inverseInputs}
        setMatrices={setInverseInputs}
        result={inverseResult}
        error={inverseError}
        clearForm={() => clearForm(setInverseInputs, setInverseResult, setInverseError, 1, false)}
        allowAdd={false}
        maxMatrices={1}
        maxCols={8}
        maxRows={8}
      />
      <OperationForm
        title="Calculate Rank"
        onSubmit={(e) => {
          e.preventDefault();
          handleMatrixSubmit(rankInputs, calculateRank, setRankResult, setRankError, { singleMatrix: true });
        }}
        matrices={rankInputs}
        setMatrices={setRankInputs}
        result={rankResult}
        error={rankError}
        clearForm={() => clearForm(setRankInputs, setRankResult, setRankError, 1, false)}
        allowAdd={false}
        maxMatrices={1}
        maxCols={8}
        maxRows={8}
      />
      <OperationForm
        title="Multiply Matrix by Scalar"
        onSubmit={handleScalarMultiply}
        matrices={scalarMultiplyInputs}
        setMatrices={setScalarMultiplyInputs}
        scalar={scalar}
        setScalar={setScalar}
        result={scalarMultiplyResult}
        error={scalarMultiplyError}
        clearForm={() => {
          setScalarMultiplyInputs([[]]);
          setScalarMultiplyResult("");
          setScalarMultiplyError("");
          setScalar("1");
        }}
        includeScalar={true}
        maxCols={8}
        maxRows={8}
      />
      <OperationForm
        title="Solve System of Linear Equations (Gaussian Elimination)"
        onSubmit={(e) => {
          e.preventDefault();
          handleMatrixSubmit(solveInputs, solveLinearSystem, setSolveResult, setSolveError, { singleMatrix: true });
        }}
        matrices={solveInputs}
        setMatrices={setSolveInputs}
        result={solveResult}
        error={solveError}
        clearForm={() => clearForm(setSolveInputs, setSolveResult, setSolveError, 1, false)}
        allowAdd={false}
        maxMatrices={1}
        maxCols={8}
        maxRows={8}
      />
    </div>
  );
};

export default Matrices;