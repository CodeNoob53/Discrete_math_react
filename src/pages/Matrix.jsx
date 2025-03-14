import React, { useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import {
    addMatrices,
    subtractMatrices,
    multiplyMatrices,
    calculateDeterminant,
    calculateAdjoint,
    divideMatrices,
    calculateInverseMatrix,
    calculateRank,
} from "../apiClient";
import { parseMatrixInput, processMatrix } from '../utils/matrixUtils';
import "./../styles/Matrix.css";
import PropTypes from 'prop-types';
import MatrixGridInput from '../components/MatrixGridInput';

const OperationForm = ({ title, onSubmit, matrices, setMatrices, result, error, clearForm, allowAdd = true, maxMatrices = null, maxRows, maxCols }) => {
    const [rawInputs, setRawInputs] = useState(matrices.map(m => m.map(row => row.join(" ")).join("\n")));
    const [activeMatrixIndex, setActiveMatrixIndex] = useState(null);
    const [resetKey, setResetKey] = useState(0);

    const handleClearForm = () => {
        const defaultMatrices = title.includes("Multiple") ? [[], []] : [[]]; // Для "Multiple" — 2 матриці, інакше 1
        clearForm();
        setResetKey(prev => prev + 1);
        setRawInputs(defaultMatrices.map(() => ""));
        setMatrices(defaultMatrices.map(() => parseMatrixInput("", [[""]], 1, 1)));
    };

    return (
        <div className="formContainer">
            <div className="form-header">
                <h3>{title}</h3>
                <Tippy content={
                    <div>
                        <p><strong>Input Format:</strong></p>
                        <ul>
                            <li>Use dot (<span className="keyword-o">.</span>) for decimal numbers (e.g., 1<span className="keyword-o">.</span>5)</li>
                            <li>Press <span className="keyword-o">Space</span> to add a new <span className="keyword-lb">column</span></li>
                            <li>Press <span className="keyword-o">Enter</span> to add a new <span className="keyword-lb">row</span></li>
                            <li><span className="keyword-lb">Empty cells</span> are treated as <span className="keyword-lb">zeros</span></li>
                            <li>Use negative sign (<span className="keyword-o">-</span>) for <span className="keyword-lb">negative numbers</span></li>
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
                <div className="matrices-container">
                    {matrices.map((matrix, index) => (
                        <div className="matrix-group" key={index}>
                            <label htmlFor={`matrix-${index}`} className="matrix-label">
                                Matrix {index + 1}:
                            </label>
                            <div className="matrix-input-wrapper">
                                <Tippy content="Enter numbers in cells, Space for new column, Enter for new row (e.g., 1 2.5 3\n4 5.5 6)">
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
                                        isActive={activeMatrixIndex === index} // Pass active state
                                        setActiveMatrixIndex={setActiveMatrixIndex} // Pass setter
                                        maxRows={maxRows} // додано
                                        maxCols={maxCols} // додано
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
                                                if (activeMatrixIndex === index) setActiveMatrixIndex(null); // Reset if deleted matrix was active
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
                    <button type="submit" className="submit">Submit</button>
                    <button
                        type="button"
                        className="clear"
                        onClick={handleClearForm}
                    >
                        Clear
                    </button>
                </div>
            </form>
            {result && (
                <div className="result show">
                    <h5>Result:</h5>
                    {Array.isArray(result) && Array.isArray(result[0]) ? (
                        <table className="matrix-result">
                            <tbody>
                                {result.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((cell, colIndex) => (
                                            <td key={colIndex}>{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>{result}</p>
                    )}
                </div>
            )}
        </div>
    );
};

// Update PropTypes to include new props if needed (not strictly necessary here)
OperationForm.propTypes = {
    title: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    matrices: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))).isRequired,
    setMatrices: PropTypes.func.isRequired,
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
};

// Функції для послідовних операцій
const sequentialAddMatrices = async (matrices) => {
    if (matrices.length < 2) throw new Error("Need at least 2 matrices");
    let result = [...matrices[0]];
    for (let i = 1; i < matrices.length; i++) {
        result = await addMatrices(result, matrices[i]);
    }
    return result;
};

const sequentialSubtractMatrices = async (matrices) => {
    if (matrices.length < 2) throw new Error("Need at least 2 matrices");
    let result = [...matrices[0]];
    for (let i = 1; i < matrices.length; i++) {
        result = await subtractMatrices(result, matrices[i]);
    }
    return result;
};

// Головний компонент
const Matrices = () => {
    const [addInputs, setAddInputs] = useState([[], []]);
    const [subtractInputs, setSubtractInputs] = useState([[], []]);
    const [multiplyInputs, setMultiplyInputs] = useState([[], []]);
    const [determinantInputs, setDeterminantInputs] = useState([[]]);
    const [adjointInputs, setAdjointInputs] = useState([[]]);
    const [divideInputs, setDivideInputs] = useState([[], []]);
    const [inverseInputs, setInverseInputs] = useState([[]]);
    const [rankInputs, setRankInputs] = useState([[]]);

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

    const clearForm = (setInputs, setResult, setError, maxMatrices = null, allowAdd = true) => {
        // Визначаємо початкову кількість матриць залежно від maxMatrices та allowAdd
        let defaultMatrices;
        if (!allowAdd && maxMatrices === 1) {
            defaultMatrices = [[]]; // Для операцій з однією матрицею
        } else if (!allowAdd && maxMatrices === 2) {
            defaultMatrices = [[], []]; // Для операцій з двома матрицями
        } else {
            defaultMatrices = [[], []]; // Для операцій із множинними матрицями за замовчуванням
        }
        setInputs(defaultMatrices);
        setResult("");
        setError("");
    };

    const validateInputs = (matrices, apiCall, options = {}) => {
        const { singleMatrix = false, isPair = false } = options;

        console.log("Matrices before processing:", JSON.stringify(matrices));

        const processedMatrices = matrices.map(matrix => processMatrix(matrix));

        console.log("Before validation (processed):", JSON.stringify(processedMatrices));

        for (const matrix of processedMatrices) {
            if (matrix.length === 0 || matrix.some(row => row.length === 0)) {
                return { processedMatrices: [], error: "Matrices cannot be empty." };
            }
            if (matrix.some(row => row.some(val => isNaN(val)))) {
                return { processedMatrices: [], error: "All inputs must be valid numbers." };
            }
        }

        if (singleMatrix) {
            if (processedMatrices.length !== 1) return { processedMatrices: [], error: "Exactly one matrix is required." };
            if (
                (apiCall === calculateDeterminant || apiCall === calculateAdjoint || apiCall === calculateInverseMatrix) &&
                processedMatrices[0].length !== processedMatrices[0][0].length
            ) {
                return { processedMatrices: [], error: "This operation is only defined for square matrices." };
            }
            return { processedMatrices, error: null };
        }

        if (isPair) {
            if (processedMatrices.length !== 2) return { processedMatrices: [], error: "Exactly two matrices are required." };
            const [matrix1, matrix2] = processedMatrices;

            if (apiCall === multiplyMatrices || apiCall === divideMatrices) {
                if (matrix1[0].length !== matrix2.length) {
                    return { processedMatrices: [], error: "Number of columns in the first matrix must equal the number of rows in the second." };
                }
                if (apiCall === divideMatrices && matrix2.length !== matrix2[0].length) {
                    return { processedMatrices: [], error: "Second matrix must be square for division (A/B = A*B^(-1))." };
                }
            } else {
                if (matrix1.length !== matrix2.length || matrix1[0].length !== matrix2[0].length) {
                    return { processedMatrices: [], error: "Matrices must have the same dimensions." };
                }
            }
            return { processedMatrices, error: null };
        }

        if (processedMatrices.length < 2) return { processedMatrices: [], error: "At least two matrices are required." };
        const [firstMatrix] = processedMatrices;
        if (processedMatrices.some(m => m.length !== firstMatrix.length || m[0].length !== firstMatrix[0].length)) {
            return { processedMatrices: [], error: "All matrices must have the same dimensions." };
        }
        return { processedMatrices, error: null };
    };

    const handleSubmit = async (inputs, apiCall, setResult, setError, options = {}) => {
        try {
            setError("");

            const processedMatrices = inputs.map(matrix => processMatrix(matrix));

            console.log("Processed matrices:", JSON.stringify(processedMatrices));

            const { processedMatrices: validatedMatrices, error: validationError } =
                validateInputs(processedMatrices, apiCall, options);

            if (validationError) {
                setError(validationError);
                return;
            }

            let result;
            if (options.singleMatrix) {
                result = await apiCall(validatedMatrices[0]);
            } else if (options.isPair) {
                const [matrix1, matrix2] = validatedMatrices;
                result = await apiCall(matrix1, matrix2);
            } else if (apiCall === sequentialAddMatrices || apiCall === sequentialSubtractMatrices) {
                result = await apiCall(validatedMatrices);
            }

            console.log("API Result:", result);
            setResult(result);

        } catch (error) {
            console.error("Operation error:", error);
            setError(error.response?.data?.message || "An error occurred.");
        }
    };

    return (
        <div>
            <OperationForm
                title="Add Multiple Matrices"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(addInputs, sequentialAddMatrices, setAddResult, setAddError);
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
                    handleSubmit(subtractInputs, sequentialSubtractMatrices, setSubtractResult, setSubtractError);
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
                    handleSubmit(multiplyInputs, multiplyMatrices, setMultiplyResult, setMultiplyError, { isPair: true });
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
                    handleSubmit(determinantInputs, calculateDeterminant, setDeterminantResult, setDeterminantError, { singleMatrix: true });
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
                    handleSubmit(adjointInputs, calculateAdjoint, setAdjointResult, setAdjointError, { singleMatrix: true });
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
                    handleSubmit(divideInputs, divideMatrices, setDivideResult, setDivideError, { isPair: true });
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
                    handleSubmit(inverseInputs, calculateInverseMatrix, setInverseResult, setInverseError, { singleMatrix: true });
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
                    handleSubmit(rankInputs, calculateRank, setRankResult, setRankError, { singleMatrix: true });
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
        </div>
    );
};

export default Matrices;