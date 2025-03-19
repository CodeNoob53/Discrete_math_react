import React, { useState } from "react";

import PropTypes from 'prop-types';

import Tippy from "@tippyjs/react";

import MatrixResult from '../components/MatrixResult';
import MatrixGridInput from '../components/MatrixGridInput';
import { handleMatrixSubmit, parseMatrixInput, processMatrix, sequentialAddMatrices, sequentialSubtractMatrices } from '../utils/matrixUtils';
import { addMatrices, calculateAdjoint, calculateDeterminant, calculateInverseMatrix, calculateRank, divideMatrices, multiplyMatrices, multiplyMatrixByScalar, subtractMatrices } from "../apiClient";

import "tippy.js/dist/tippy.css";

import "./../styles/Matrix.css";

// Компонент OperationForm
const OperationForm = ({ title, onSubmit, matrices, setMatrices, result, error, clearForm, allowAdd = true, maxMatrices = null, maxRows, maxCols }) => {
    const [rawInputs, setRawInputs] = useState(matrices.map(m => m.map(row => row.join(" ")).join("\n")));
    const [activeMatrixIndex, setActiveMatrixIndex] = useState(null);
    const [resetKey, setResetKey] = useState(0);

    const handleClearForm = () => {
        const defaultMatrices = maxMatrices === 2 ? [[], []] : [[]]; // For maxMatrices=2, always keep 2 matrices
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
                            <li>Press <span className="keyword-o">Ctrl+Backspace</span> to delete empty <span className="keyword-lb">row/column</span></li>
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

            {/* Використовуємо новий компонент MatrixResult */}
            {result && <MatrixResult result={result} />}
        </div>
    );
};

OperationForm.propTypes = {
    title: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    matrices: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ])))).isRequired,
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

// Оголошуємо функції-обгортки для послідовних операцій
const sequentialAddMatricesWrapper = (matrices) => sequentialAddMatrices(matrices, addMatrices);
const sequentialSubtractMatricesWrapper = (matrices) => sequentialSubtractMatrices(matrices, subtractMatrices);

// Компонент для операції множення матриці на скаляр
const ScalarMultiplyForm = ({ onSubmit, matrices, setMatrices, scalar, setScalar, result, error, clearForm, maxRows, maxCols }) => {
    const [rawInputs, setRawInputs] = useState(matrices.map(m => m.map(row => row.join(" ")).join("\n")));
    const [activeMatrixIndex, setActiveMatrixIndex] = useState(null);
    const [resetKey, setResetKey] = useState(0);

    const handleClearForm = () => {
        clearForm();
        setResetKey(prev => prev + 1);
        setRawInputs([""]);
        setMatrices([parseMatrixInput("", [[""]], 1, 1)]);
        setScalar("1");
    };

    return (
        <div className="formContainer">
            <div className="form-header">
                <h3>Multiply Matrix by Scalar</h3>
                <Tippy content={
                    <div>
                        <p><strong>Input Format:</strong></p>
                        <ul>
                            <li>Enter a scalar value (can be decimal or negative)</li>
                            <li>Enter matrix values using the grid interface</li>
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
                            // Оновлена регулярна умова для скаляра
                            const value = e.target.value;
                            if (/^-?\.?$/.test(value) || /^-?\d*\.?\d*$/.test(value)) {
                                setScalar(value);
                            }
                        }}
                        placeholder="Enter scalar value"
                    />
                </div>

                <div className="matrices-container">
                    <div className="matrix-group">
                        <label htmlFor="matrix-0" className="matrix-label">
                            Matrix:
                        </label>
                        <div className="matrix-input-wrapper">
                            <Tippy content="Enter numbers in cells, Space for new column, Enter for new row">
                                <MatrixGridInput
                                    key={`matrix-0-${resetKey}`}
                                    value={rawInputs[0]}
                                    onChange={(e) => {
                                        const inputValue = e.target.value;
                                        if (/^[-0-9.\s\n]*$/.test(inputValue)) {
                                            setRawInputs([inputValue]);
                                            const updatedMatrix = parseMatrixInput(inputValue);
                                            setMatrices([updatedMatrix]);
                                        }
                                    }}
                                    index={0}
                                    formId={"multiply-by-scalar"}
                                    isActive={activeMatrixIndex === 0}
                                    setActiveMatrixIndex={setActiveMatrixIndex}
                                    maxRows={maxRows}
                                    maxCols={maxCols}
                                />
                            </Tippy>
                        </div>
                    </div>
                </div>

                <div className="buttons">
                    <button type="submit" className="submit">Calculate</button>
                    <button
                        type="button"
                        className="clear"
                        onClick={handleClearForm}
                    >
                        Clear
                    </button>
                </div>
            </form>

            {/* Використовуємо новий компонент MatrixResult */}
            {result && <MatrixResult result={result} />}
        </div>
    );
};

ScalarMultiplyForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    matrices: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ])))).isRequired,
    setMatrices: PropTypes.func.isRequired,
    scalar: PropTypes.string.isRequired,
    setScalar: PropTypes.func.isRequired,
    result: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
        PropTypes.number,
        PropTypes.string,
    ]),
    error: PropTypes.string,
    clearForm: PropTypes.func.isRequired,
    maxRows: PropTypes.number,
    maxCols: PropTypes.number,
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
    // Стан для операції множення на скаляр
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

    const clearForm = (setInputs, setResult, setError, maxMatrices = null, allowAdd = true) => {
        // Визначаємо початкову кількість матриць залежно від maxMatrices та allowAdd
        let defaultMatrices;
        if (!allowAdd && maxMatrices === 1) {
            defaultMatrices = [[]]; // Для операцій з однією матрицею
        } else if (!allowAdd && maxMatrices === 2) {
            defaultMatrices = [[], []]; // Для операцій з двома матрицями
        } else {
            defaultMatrices = [[], []]; // За замовчуванням
        }
        setInputs(defaultMatrices);
        setResult("");
        setError("");
    };

    // Обробник для множення матриці на скаляр
    const handleScalarMultiply = (e) => {
        e.preventDefault();
        setScalarMultiplyError("");

        try {
            // Перевірка валідності скаляра
            const scalarValue = parseFloat(scalar);
            if (isNaN(scalarValue)) {
                setScalarMultiplyError("Scalar must be a valid number");
                return;
            }

            // Обробка матриці
            const processedMatrix = processMatrix(scalarMultiplyInputs[0]);

            // Перевірка валідності матриці
            if (processedMatrix.length === 0 || processedMatrix.some(row => row.length === 0)) {
                setScalarMultiplyError("Matrix cannot be empty");
                return;
            }

            if (processedMatrix.some(row => row.some(val => isNaN(val)))) {
                setScalarMultiplyError("All matrix elements must be valid numbers");
                return;
            }

            // Виклик API для множення на скаляр
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
            {/* Використовуємо компонент OperationForm для всіх операцій */}
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

            {/* Спеціальна форма для множення матриці на скаляр */}
            <ScalarMultiplyForm
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
                maxCols={10}
                maxRows={10}
            />
        </div>
    );
};

export default Matrices;