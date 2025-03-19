import React, { useState } from "react";
import PropTypes from 'prop-types';
import Tippy from "@tippyjs/react";
import MatrixResult from '../components/MatrixResult';
import MatrixGridInput from '../components/MatrixGridInput';
import { handleMatrixSubmit, parseMatrixInput, processMatrix, sequentialAddMatrices, sequentialSubtractMatrices } from '../utils/matrixUtils';
import { addMatrices, calculateAdjoint, calculateDeterminant, calculateInverseMatrix, calculateRank, divideMatrices, multiplyMatrices, multiplyMatrixByScalar, subtractMatrices, solveLinearSystem } from "../api/apiClient";
import "tippy.js/dist/tippy.css";
import "./../styles/Matrix.css";

// Updated universal OperationForm including scalar input support
const OperationForm = ({ title, onSubmit, matrices, setMatrices, scalar, setScalar, result, error, clearForm, allowAdd = true, maxMatrices = null, maxRows, maxCols, includeScalar = false }) => {
    const [rawInputs, setRawInputs] = useState(matrices.map(m => m.map(row => row.join(" ")).join("\n")));
    const [activeMatrixIndex, setActiveMatrixIndex] = useState(null);
    const [resetKey, setResetKey] = useState(0);

    const handleClearForm = () => {
        const defaultMatrices = maxMatrices === 2 ? [[], []] : [[]];
        clearForm();
        setResetKey(prev => prev + 1);
        setRawInputs(defaultMatrices.map(() => ""));
        setMatrices(defaultMatrices.map(() => parseMatrixInput("", [[""]], 1, 1)));
        if (includeScalar && setScalar) setScalar("1");
    };

    return (
        <div className="formContainer">
            <div className="form-header">
                <h3>{title}</h3>
                <Tippy content={
                    <div>
                        <p><strong>Input Format:</strong></p>
                        <ul>
                            <li>Use dot (<span className="keyword-o">.</span>) for decimals</li>
                            <li>Press <span className="keyword-o">Space</span> to add a column</li>
                            <li>Press <span className="keyword-o">Enter</span> to add a row</li>
                            <li>Empty cells are treated as zeros</li>
                            <li>Use negative sign (<span className="keyword-o">-</span>) for negative numbers</li>
                        </ul>
                    </div>
                } placement="right" interactive={true}>
                    <button type="button" className="faq-button">
                        <span className="material-symbols-outlined">help</span>
                        FAQ
                    </button>
                </Tippy>
            </div>
            {error && <p className="flashMessage show">{error}</p>}
            <form onSubmit={onSubmit}>
                {includeScalar && (
                    <div className="scalar-input-container">
                        <label htmlFor="scalar-value" className="scalar-label">Scalar Value:</label>
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
                    {matrices.map((_matrix, index) => (
                        <div className="matrix-group" key={index}>
                            <label htmlFor={`matrix-${index}`} className="matrix-label">
                                {includeScalar ? "Matrix:" : `Matrix ${index + 1}:`}
                            </label>
                            <div className="matrix-input-wrapper">
                                <Tippy content={includeScalar ? "Enter numbers in cells" : "Enter numbers in cells, Space for new column, Enter for new row (e.g., 1 2.5 3\n4 5.5 6)"}>
                                    <MatrixGridInput
                                        key={`matrix-${index}-${resetKey}`}
                                        value={rawInputs[index]}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            if (/^[-0-9.\s\n]*$/.test(inputValue)) {
                                                const newRawInputs = [...rawInputs];
                                                newRawInputs[index] = inputValue;
                                                setRawInputs(newRawInputs);
                                                const updatedMatrices = newRawInputs.map(raw => parseMatrixInput(raw));
                                                setMatrices(updatedMatrices);
                                            }
                                        }}
                                        index={index}
                                        formId={title.replace(/\s+/g, '-').toLowerCase()}
                                        isActive={activeMatrixIndex === index}
                                        setActiveMatrixIndex={setActiveMatrixIndex}
                                        maxRows={maxRows}
                                        maxCols={maxCols}
                                    />
                                </Tippy>
                                {index >= 2 && allowAdd && (
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
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </Tippy>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {allowAdd && (!maxMatrices || matrices.length < maxMatrices) && (
                    <div className="formGroup addButtonGroup">
                        <Tippy content="Add a new matrix field" placement="right">
                            <button
                                type="button"
                                className="add-count-button"
                                onClick={() => {
                                    setMatrices([...matrices, []]);
                                    setRawInputs([...rawInputs, ""]);
                                }}
                            >
                                <span className="material-symbols-outlined">add</span>
                            </button>
                        </Tippy>
                    </div>
                )}
                <div className="buttons">
                    <button type="submit" className="submit">{includeScalar ? "Calculate" : "Submit"}</button>
                    <button type="button" className="clear" onClick={handleClearForm}>Clear</button>
                </div>
            </form>
            {result && <MatrixResult result={result} />}
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

// Removed separate ScalarMultiplyForm component

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
            if (processedMatrix.length === 0 || processedMatrix.some(row => row.length === 0)) {
                setScalarMultiplyError("Matrix cannot be empty");
                return;
            }
            if (processedMatrix.some(row => row.some(val => isNaN(val)))) {
                setScalarMultiplyError("All matrix elements must be valid numbers");
                return;
            }
            multiplyMatrixByScalar(processedMatrix, scalarValue)
                .then(result => {
                    setScalarMultiplyResult(result);
                })
                .catch(error => {
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
                maxCols={10}
                maxRows={10}
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
                maxCols={10}
                maxRows={10}
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
                maxCols={10}
                maxRows={10}
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
                maxCols={10}
                maxRows={10}
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
                maxCols={10}
                maxRows={10}
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
                maxCols={10}
                maxRows={10}
            />
        </div>
    );
};

export default Matrices;