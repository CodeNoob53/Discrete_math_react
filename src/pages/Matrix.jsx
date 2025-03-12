import React, { useState, useEffect } from "react";
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
import "./../styles/Matrix.css";
import PropTypes from 'prop-types';

const MatrixGridInput = ({ value, onChange, index, formId }) => {
    const [grid, setGrid] = useState(() => {
        const initialGrid = value ? parseMatrixInput(value) : [["", ""], ["", ""]];
        return initialGrid;
    });

    const [activeCell, setActiveCell] = useState(null);

    // Оновлена функція parseMatrixInput
    const parseMatrixInput = (input) => {
        if (!input.trim()) return [["", "", ""], ["", "", ""]]; // Повертаємо 2x3 за замовчуванням для коректної структури

        const rows = input.trim().split("\n").map(row => row.trim().split(/\s+/));
        const maxCols = Math.max(...rows.map(row => row.length));

        return rows.map(row => {
            const parsedRow = row.map(val => {
                const trimmed = val.trim();
                if (trimmed === "" || trimmed === "-") return "";
                const num = parseFloat(trimmed);
                return isNaN(num) ? "" : num;
            });
            // Доповнюємо рядок порожніми значеннями до максимальної кількості стовпців
            while (parsedRow.length < maxCols) {
                parsedRow.push("");
            }
            return parsedRow;
        });
    };

    // Синхронізація grid з value лише при зміні зовнішнього value
    useEffect(() => {
        const newGrid = parseMatrixInput(value);
        if (newGrid.length === 0 || newGrid[0].length === 0) {
            setGrid([["", ""], ["", ""]]);
        } else {
            setGrid(newGrid);
        }
    }, [value]);

    const getCellId = (rowIdx, colIdx) => `cell-${formId}-${index}-${rowIdx}-${colIdx}`;

    const handleChange = (e, rowIdx, colIdx) => {
        const newGrid = [...grid.map(row => [...row])];
        newGrid[rowIdx][colIdx] = e.target.value;
        setGrid(newGrid);

        // Перетворюємо grid у текст, зберігаючи всі клітинки
        const textValue = newGrid.map(row => row.join(" ")).join("\n");
        onChange({ target: { value: textValue } });

        // Залишаємо фокус на тій же клітинці
        setTimeout(() => {
            const el = document.getElementById(getCellId(rowIdx, colIdx));
            if (el) el.focus();
        }, 0);
    };

    const handleKeyDown = (e, rowIdx, colIdx) => {
        const newGrid = [...grid.map(row => [...row])];
        const totalCols = newGrid[rowIdx].length;
        const totalRows = newGrid.length;

        if (e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            if (colIdx === totalCols - 1) {
                // Додаємо новий стовпець
                newGrid.forEach(row => row.push(""));
                setGrid(newGrid);
                // Використовуємо index для правильної ідентифікації форми
                const nextCellId = getCellId(rowIdx, colIdx + 1);
                setTimeout(() => {
                    const nextCell = document.getElementById(nextCellId);
                    if (nextCell) nextCell.focus();
                }, 0);
            } else {
                // Переходимо до наступної клітинки
                const nextCellId = getCellId(rowIdx, colIdx + 1);
                setTimeout(() => {
                    const nextCell = document.getElementById(nextCellId);
                    if (nextCell) nextCell.focus();
                }, 0);
            }
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (rowIdx === totalRows - 1) {
                // Додаємо новий рядок із такою ж кількістю стовпців
                newGrid.push(Array(totalCols).fill(""));
                setGrid(newGrid);
                // Використовуємо index для правильної ідентифікації форми
                const nextCellId = getCellId(rowIdx + 1, 0);
                setTimeout(() => {
                    const nextCell = document.getElementById(nextCellId);
                    if (nextCell) nextCell.focus();
                }, 0);
            } else {
                // Переходимо до першого стовпця наступного рядка
                const nextCellId = getCellId(rowIdx + 1, 0);
                setTimeout(() => {
                    const nextCell = document.getElementById(nextCellId);
                    if (nextCell) nextCell.focus();
                }, 0);
            }
        }
    };

    const handleFocus = (rowIdx, colIdx) => {
        setActiveCell(`${rowIdx}-${colIdx}`);
    };

    const handleBlur = () => {
        setActiveCell(null);
    };

    return (
        <div className="matrix-wrapper">
            <div className="matrix-brackets">
                <div className="matrix-grid">
                    {grid.map((row, rowIdx) => (
                        <div key={rowIdx} className="matrix-row">
                            {row.map((cell, colIdx) => (
                                <input
                                    key={colIdx}
                                    id={getCellId(rowIdx, colIdx)}
                                    type="text"
                                    className={`matrix-cell ${cell !== "" || activeCell === `${rowIdx}-${colIdx}`
                                        ? "active"
                                        : "inactive"
                                        }`}
                                    value={cell}
                                    onChange={(e) => handleChange(e, rowIdx, colIdx)}
                                    onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
                                    onFocus={() => handleFocus(rowIdx, colIdx)}
                                    onBlur={handleBlur}
                                    placeholder="0"
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

MatrixGridInput.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    formId: PropTypes.string.isRequired, // Додайте це
};

// Універсальний компонент форми для матриць
const OperationForm = ({ title, onSubmit, matrices, setMatrices, result, error, clearForm, allowAdd = true, maxMatrices = null }) => {
    const [rawInputs, setRawInputs] = useState(matrices.map(m => m.map(row => row.join(" ")).join("\n")));

    const parseMatrixInput = (input) => {
        if (!input.trim()) return [["", ""], ["", ""]];

        // Розбиваємо введення на рядки та стовпці
        let rows = input.trim().split("\n").map(row =>
            row.trim().split(/\s+/).map(val => {
                const trimmed = val.trim();
                return (trimmed === "" || trimmed === "-") ? "" :
                    (isNaN(parseFloat(trimmed)) ? "" : trimmed);
            })
        );

        // Знаходимо максимальну довжину рядка
        const maxCols = Math.max(...rows.map(row => row.length));

        // Вирівнюємо всі рядки до максимальної довжини
        rows = rows.map(row => {
            while (row.length < maxCols) {
                row.push("");
            }
            return row;
        });

        // Видаляємо пусті рядки
        rows = rows.filter(row => row.some(cell => cell !== ""));

        // Видаляємо пусті стовпці
        for (let col = maxCols - 1; col >= 0; col--) {
            const isEmptyColumn = rows.every(row => row[col] === "");
            if (isEmptyColumn) {
                rows = rows.map(row => {
                    row.splice(col, 1);
                    return row;
                });
            }
        }

        // Перевіряємо чи залишилися дані після очищення
        if (rows.length === 0 || rows[0].length === 0) {
            return [["", ""], ["", ""]];
        }

        return rows;
    };

    return (
        <div className="formContainer">
            <h4>{title}</h4>
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
                                        formId={title.replace(/\s+/g, '-').toLowerCase()} // Додайте цей проп
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

    const clearForm = (setInputs, setResult, setError, defaultMatrices = [[]]) => {
        setInputs(defaultMatrices);
        setResult("");
        setError("");
    };

    const validateInputs = (matrices, apiCall, options = {}) => {
        const { singleMatrix = false, isPair = false } = options;

        // Лог перед обробкою
        console.log("Matrices before processing:", JSON.stringify(matrices));

        // Копіюємо матриці та замінюємо "" на 0, конвертуємо в числа
        const processedMatrices = matrices.map(matrix =>
            matrix.map(row =>
                row.map(val => (val === "" || val === undefined || val === null ? 0 : Number(val)))
            )
        );

        // Лог після обробки
        console.log("Before validation (processed):", JSON.stringify(processedMatrices));

        // Перевіряємо, чи матриці валідні після заміни
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

            // Replace empty cells with 0 and convert to numbers
            const processedMatrices = inputs.map(matrix =>
                matrix.map(row =>
                    row.map(val => {
                        if (val === "" || val === undefined || val === null) {
                            return 0;
                        }
                        const num = Number(val);
                        return isNaN(num) ? 0 : num;
                    })
                )
            );

            // Log processed matrices for debugging
            console.log("Processed matrices:", JSON.stringify(processedMatrices));

            // Validate the processed matrices
            const { processedMatrices: validatedMatrices, error: validationError } =
                validateInputs(processedMatrices, apiCall, options);

            if (validationError) {
                setError(validationError);
                return;
            }

            // Call API based on operation type
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
                title="Calculate Adjoint (Adjugate)"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(adjointInputs, calculateAdjoint, setAdjointResult, setAdjointError, { singleMatrix: true });
                }}
                matrices={adjointInputs}
                setMatrices={setAdjointInputs}
                result={adjointResult}
                error={adjointError}
                clearForm={() => clearForm(setAdjointInputs, setAdjointResult, setAdjointError, [[]])}
                allowAdd={false}
                maxMatrices={1}
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
                clearForm={() => clearForm(setDivideInputs, setDivideResult, setDivideError, [[], []])}
                allowAdd={false}
                maxMatrices={2}
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
                clearForm={() => clearForm(setInverseInputs, setInverseResult, setInverseError, [[]])}
                allowAdd={false}
                maxMatrices={1}
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
                clearForm={() => clearForm(setRankInputs, setRankResult, setRankError, [[]])}
                allowAdd={false}
                maxMatrices={1}
            />
        </div>
    );
};

export default Matrices;