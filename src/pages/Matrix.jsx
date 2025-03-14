import React, { useState } from "react";
import PropTypes from 'prop-types';
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import {
    addMatrices,
    subtractMatrices,
    multiplyMatrices,
    calculateDeterminant,
    calculateAdjoint,
    divideMatrices,
    calculateInverseMatrix,
    calculateRank,
    postMatrixSubtract  // додано
} from "../apiClient";
import { 
    parseMatrixInput, 
    sequentialAddMatrices, 
    sequentialSubtractMatrices,
    handleMatrixSubmit 
} from '../utils/matrixUtils';
import "./../styles/Matrix.css";
import MatrixGridInput from '../components/MatrixGridInput';

// Додаємо компонент для кнопки копіювання результату
const CopyButton = ({ content, tooltip = "Копіювати" }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        // Конвертуємо матрицю в текстовий формат для копіювання
        let textToCopy = '';
        
        if (Array.isArray(content) && Array.isArray(content[0])) {
            // Матриця - конвертуємо в текстовий формат
            textToCopy = content.map(row => row.join(' ')).join('\n');
        } else {
            // Звичайне значення (наприклад, детермінант)
            textToCopy = content.toString();
        }

        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            })
            .catch(err => console.error('Помилка копіювання:', err));
    };

    return (
        <Tippy content={isCopied ? "Скопійовано!" : tooltip} placement="top">
            <button className="result-copy-button" onClick={handleCopy}>
                <span className="material-symbols-outlined">content_copy</span>
                {isCopied ? "Скопійовано" : "Копіювати"}
            </button>
        </Tippy>
    );
};

CopyButton.propTypes = {
    content: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])))
    ]).isRequired,
    tooltip: PropTypes.string
};

// Компонент для відображення матриці з використанням MathJax
const MatrixDisplay = ({ matrix }) => {
    if (!Array.isArray(matrix) || !Array.isArray(matrix[0])) {
        return <p>{matrix}</p>;
    }

    // Створюємо LaTeX-представлення матриці
    const matrixLatex = `\\begin{pmatrix} 
        ${matrix.map(row => row.join(' & ')).join(' \\\\ ')} 
    \\end{pmatrix}`;

    return (
        <MathJax inline>{"\\(" + matrixLatex + "\\)"}</MathJax>
    );
};

MatrixDisplay.propTypes = {
    matrix: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])))
    ]).isRequired
};

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
                    {/* Додаємо кнопку копіювання до результату */}
                    <CopyButton content={result} tooltip="Копіювати результат" />
                    
                    {/* Відображаємо результат через MathJax */}
                    {Array.isArray(result) && Array.isArray(result[0]) ? (
                        <div className="matrix-result-wrapper">
                            <MatrixDisplay matrix={result} />
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
                        </div>
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
    maxRows: PropTypes.number,
    maxCols: PropTypes.number,
};

// Оголошуємо функції-обгортки для послідовних операцій
const sequentialAddMatricesWrapper = (matrices) => sequentialAddMatrices(matrices, addMatrices);
const sequentialSubtractMatricesWrapper = (matrices) => sequentialSubtractMatrices(matrices, subtractMatrices);

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
    
    // Нові стани для postMatrixSubtract
    const [postSubtractInputs, setPostSubtractInputs] = useState([[], []]);
    const [postSubtractResult, setPostSubtractResult] = useState("");
    const [postSubtractError, setPostSubtractError] = useState("");

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

    return (
        <MathJaxContext>
            <div>
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
                    title="Post Matrix Subtract"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleMatrixSubmit(postSubtractInputs, postMatrixSubtract, setPostSubtractResult, setPostSubtractError, { isPair: true });
                    }}
                    matrices={postSubtractInputs}
                    setMatrices={setPostSubtractInputs}
                    result={postSubtractResult}
                    error={postSubtractError}
                    clearForm={() => clearForm(setPostSubtractInputs, setPostSubtractResult, setPostSubtractError, 2, false)}
                    allowAdd={false}
                    maxMatrices={2}
                    maxCols={8}
                    maxRows={8}
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
            </div>
        </MathJaxContext>
    );
};

export default Matrices;