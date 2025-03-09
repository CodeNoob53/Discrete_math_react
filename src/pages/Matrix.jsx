import React, { useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import {
    addMatrices,
    subtractMatrices,
    multiplyMatrices,
    calculateDeterminant,
    transposeMatrix,
} from "../apiClient";
import "./../styles/Matrix.css";

// Універсальний компонент форми для матриць
const OperationForm = ({ title, onSubmit, matrices, setMatrices, result, error, clearForm, allowAdd = true, maxMatrices = null }) => {
    const [rawInputs, setRawInputs] = useState(matrices.map(m => m.map(row => row.join(",")).join(";")));

    return (
        <div className="formContainer">
            <h4>{title}</h4>
            {error && <p className="flashMessage show">{error}</p>}
            <form onSubmit={onSubmit}>
                {matrices.map((matrix, index) => (
                    <div className="formGroup" key={index}>
                        <label htmlFor={`matrix-${index}`}>Matrix {index + 1}:</label>
                        <Tippy content="Enter rows separated by semicolons, numbers in rows by commas (e.g., 1,2;3,4)">
                            <textarea
                                id={`matrix-${index}`}
                                className="matrix-input"
                                value={rawInputs[index]}
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    if (/^[-0-9,;\s]*$/.test(inputValue)) {
                                        const newRawInputs = [...rawInputs];
                                        newRawInputs[index] = inputValue;
                                        setRawInputs(newRawInputs);

                                        const updatedMatrices = [...matrices];
                                        updatedMatrices[index] = inputValue
                                            .split(";")
                                            .map(row =>
                                                row.split(",").map(v => {
                                                    const trimmed = v.trim();
                                                    if (trimmed === "" || trimmed === "-") return "";
                                                    const num = parseFloat(trimmed);
                                                    return isNaN(num) ? "" : num;
                                                })
                                            )
                                            .filter(row => row.some(v => v !== ""));
                                        setMatrices(updatedMatrices);
                                    }
                                }}
                                placeholder="e.g., 1,2;3,4"
                                rows="3"
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
                                    }}
                                >
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </Tippy>
                        )}
                    </div>
                ))}
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
                        onClick={() => {
                            clearForm();
                            setRawInputs(matrices.map(() => ""));
                        }}
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

// Функція для послідовного додавання багатьох матриць
const sequentialAddMatrices = async (matrices) => {
    if (matrices.length < 2) throw new Error("Need at least 2 matrices");
    let result = [...matrices[0]];
    for (let i = 1; i < matrices.length; i++) {
        result = await addMatrices(result, matrices[i]);
    }
    return result;
};

// Функція для послідовного віднімання багатьох матриць
const sequentialSubtractMatrices = async (matrices) => {
    if (matrices.length < 2) throw new Error("Need at least 2 matrices");
    let result = [...matrices[0]];
    for (let i = 1; i < matrices.length; i++) {
        result = await subtractMatrices(result, matrices[i]);
    }
    return result;
};

// Головний компонент для матриць
const Matrices = () => {
    const [addInputs, setAddInputs] = useState([[], []]);
    const [subtractInputs, setSubtractInputs] = useState([[], []]);
    const [multiplyInputs, setMultiplyInputs] = useState([[], []]);
    const [determinantInputs, setDeterminantInputs] = useState([[]]);
    const [transposeInputs, setTransposeInputs] = useState([[]]);

    const [addResult, setAddResult] = useState("");
    const [subtractResult, setSubtractResult] = useState("");
    const [multiplyResult, setMultiplyResult] = useState("");
    const [determinantResult, setDeterminantResult] = useState("");
    const [transposeResult, setTransposeResult] = useState("");

    const [addError, setAddError] = useState("");
    const [subtractError, setSubtractError] = useState("");
    const [multiplyError, setMultiplyError] = useState("");
    const [determinantError, setDeterminantError] = useState("");
    const [transposeError, setTransposeError] = useState("");

    const clearForm = (setInputs, setResult, setError, defaultMatrices = [[]]) => {
        setInputs(defaultMatrices);
        setResult("");
        setError("");
    };

    const validateInputs = (matrices, apiCall, options = {}) => {
        const { singleMatrix = false, isPair = false } = options;

        // Перевірка, чи всі елементи є числами
        for (const matrix of matrices) {
            if (matrix.length === 0 || matrix.some(row => row.length === 0 || row.some(val => isNaN(val) || val === ""))) {
                return "All inputs must be valid numbers and matrices cannot be empty.";
            }
        }

        // Валідація для операцій з однією матрицею
        if (singleMatrix) {
            if (matrices.length !== 1) return "Exactly one matrix is required.";
            if (apiCall === calculateDeterminant && matrices[0].length !== matrices[0][0].length) {
                return "Determinant is only defined for square matrices.";
            }
            return null;
        }

        // Валідація для операцій із двома матрицями
        if (isPair) {
            if (matrices.length !== 2) return "Exactly two matrices are required.";
            const [matrix1, matrix2] = matrices;

            if (apiCall === multiplyMatrices) {
                if (matrix1[0].length !== matrix2.length) {
                    return "Number of columns in the first matrix must equal the number of rows in the second.";
                }
            } else { // Для додавання та віднімання
                if (matrix1.length !== matrix2.length || matrix1[0].length !== matrix2[0].length) {
                    return "Matrices must have the same dimensions.";
                }
            }
            return null;
        }

        // Валідація для кількох матриць (додавання або віднімання)
        if (matrices.length < 2) return "At least two matrices are required.";
        const [firstMatrix] = matrices;
        if (matrices.some(m => m.length !== firstMatrix.length || m[0].length !== firstMatrix[0].length)) {
            return "All matrices must have the same dimensions.";
        }
        return null;
    };

    const handleSubmit = async (inputs, apiCall, setResult, setError, options = {}) => {
        try {
            setError("");
            const validationError = validateInputs(inputs, apiCall, options);
            if (validationError) {
                setError(validationError);
                return;
            }

            let result;
            if (options.singleMatrix) {
                result = await apiCall(inputs[0]);
            } else if (options.isPair) {
                const [matrix1, matrix2] = inputs;
                result = await apiCall(matrix1, matrix2);
            } else if (apiCall === sequentialAddMatrices || apiCall === sequentialSubtractMatrices) {
                // Для послідовного додавання/віднімання кількох матриць
                result = await apiCall(inputs);
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
                title="Add Multiple Matrices"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(addInputs, sequentialAddMatrices, setAddResult, setAddError);
                }}
                matrices={addInputs}
                setMatrices={setAddInputs}
                result={addResult}
                error={addError}
                clearForm={() => clearForm(setAddInputs, setAddResult, setAddError, [[], []])}
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
                clearForm={() => clearForm(setSubtractInputs, setSubtractResult, setSubtractError, [[], []])}
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
                clearForm={() => clearForm(setMultiplyInputs, setMultiplyResult, setMultiplyError, [[], []])}
                allowAdd={false}
                maxMatrices={2}
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
                clearForm={() => clearForm(setDeterminantInputs, setDeterminantResult, setDeterminantError, [[]])}
                allowAdd={false}
                maxMatrices={1}
            />
            <OperationForm
                title="Transpose Matrix"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(transposeInputs, transposeMatrix, setTransposeResult, setTransposeError, { singleMatrix: true });
                }}
                matrices={transposeInputs}
                setMatrices={setTransposeInputs}
                result={transposeResult}
                error={transposeError}
                clearForm={() => clearForm(setTransposeInputs, setTransposeResult, setTransposeError, [[]])}
                allowAdd={false}
                maxMatrices={1}
            />
        </div>
    );
};

export default Matrices;