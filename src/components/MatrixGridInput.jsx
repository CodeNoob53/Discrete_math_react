import React, { useState, useEffect, useRef } from "react";
import "tippy.js/dist/tippy.css";
import Tippy from "@tippyjs/react";
import { parseMatrixInput } from '../utils/matrixUtils';
import PropTypes from 'prop-types';
import { Copy, Clipboard } from 'lucide-react';

const MatrixGridInput = ({ value, onChange, index, formId, isActive, setActiveMatrixIndex, maxRows, maxCols }) => {
    const [grid, setGrid] = useState(() => {
        const initialGrid = value ? parseMatrixInput(value, [[""]], 1, 1) : [[""]];
        return initialGrid;
    });
    const [activeCell, setActiveCell] = useState(null);
    const previousGrid = useRef(grid);
    const matrixRef = useRef(null);

    useEffect(() => {
        console.log("useEffect - Value:", value);
        console.log("useEffect - Previous grid:", previousGrid.current);
        let newGrid;
        if (!value.trim()) {
            // Якщо value порожнє, скидаємо до мінімальної сітки 1x1
            newGrid = [[""]];
        } else {
            newGrid = parseMatrixInput(value, previousGrid.current);
        }
        console.log("useEffect - Parsed newGrid:", newGrid);
        if (newGrid.length === 0 || newGrid[0].length === 0) {
            setGrid([[""]]);
        } else {
            setGrid(newGrid);
        }
        previousGrid.current = newGrid;
    }, [value]);

    // Додаємо обробник кліку поза матрицею
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Перевіряємо чи клік був зроблений поза матрицею і не на елементах управління
            const isClickOutsideControls = !event.target.closest('.matrix-controls');
            const isClickOutsideMatrix = matrixRef.current && !matrixRef.current.contains(event.target);

            if (isClickOutsideMatrix && isClickOutsideControls) {
                setActiveMatrixIndex(null); // Встановлюємо активний індекс матриці на null
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setActiveMatrixIndex]);

    const getCellId = (rowIdx, colIdx) => `cell-${formId}-${index}-${rowIdx}-${colIdx}`;

    // функція handleChange 
    const handleChange = (e, rowIdx, colIdx) => {
        const newGrid = [...grid.map(row => [...row])];
        const value = e.target.value;
    
        console.log("handleChange - Input value:", value);
    
        // Перевіряємо чи це крапка, порожній рядок, мінус, або відповідає шаблону валідного числа
        if (value === "" || value === "-" || value === "." || value === "-." || 
            /^-?\d*\.?\d*$/.test(value)) {
            newGrid[rowIdx][colIdx] = value || "";
    
            const maxCols = Math.max(...newGrid.map(row => row.length));
            newGrid.forEach(row => {
                while (row.length < maxCols) {
                    row.push("");
                }
            });
    
            setGrid(newGrid);
    
            // Створюємо точне текстове представлення матриці для збереження крапки
            const textValue = newGrid
                .map(row => row.map(cell => cell || "").join(" "))
                .join("\n");
    
            console.log("newGrid after change:", newGrid);
            console.log("textValue:", JSON.stringify(textValue));
    
            // Важливо! Передаємо значення напряму, щоб уникнути додаткової обробки
            onChange({ target: { value: textValue } });
    
            // Фокусуємо поле знову (може допомогти зі збереженням курсора)
            setTimeout(() => {
                const el = document.getElementById(getCellId(rowIdx, colIdx));
                if (el) {
                    el.focus();
                    // Встановлюємо курсор в кінець тексту
                    const valueLength = el.value.length;
                    el.setSelectionRange(valueLength, valueLength);
                }
            }, 0);
        }
    };

    const handleKeyDown = (e, rowIdx, colIdx) => {
        const newGrid = grid.map(row => [...row]);
        const totalCols = newGrid[0].length;
        const totalRows = newGrid.length;

        if (e.key === " ") {
            e.preventDefault();

            // Перевіряємо, чи це остання колонка
            if (colIdx === totalCols - 1) {
                // Додаємо новий стовпець тільки якщо це остання колонка
                if (totalCols < maxCols) {
                    newGrid.forEach(row => row.push(""));
                    setGrid(newGrid);
                    setTimeout(() => {
                        const nextCell = document.getElementById(getCellId(rowIdx, colIdx + 1));
                        if (nextCell) nextCell.focus();
                    }, 0);
                }
            } else {
                // Якщо не остання колонка, просто переходимо на наступний стовпець
                setTimeout(() => {
                    const nextCell = document.getElementById(getCellId(rowIdx, colIdx + 1));
                    if (nextCell) nextCell.focus();
                }, 0);
            }
        } else if (e.key === "Enter") {
            e.preventDefault();

            // Перевіряємо, чи це останній рядок
            if (rowIdx === totalRows - 1) {
                // Додаємо новий рядок тільки якщо це останній рядок
                if (totalRows < maxRows) {
                    newGrid.push(Array(totalCols).fill(""));
                    setGrid(newGrid);
                    setTimeout(() => {
                        const nextCell = document.getElementById(getCellId(rowIdx + 1, 0));
                        if (nextCell) nextCell.focus();
                    }, 0);
                }
            } else {
                // Якщо не останній рядок, просто переходимо на наступний рядок
                setTimeout(() => {
                    const nextCell = document.getElementById(getCellId(rowIdx + 1, colIdx));
                    if (nextCell) nextCell.focus();
                }, 0);
            }
        } else if (e.key === "Backspace" && e.ctrlKey) {
            e.preventDefault();
            // Видалення стовпця, якщо всі значення в ньому порожні
            if (newGrid.every(row => row[colIdx] === "")) {
                if (totalCols > 1) {
                    newGrid.forEach(row => row.splice(colIdx, 1));
                }
            }
            // Видалення рядка, якщо всі значення в ньому порожні
            if (newGrid[rowIdx].every(cell => cell === "")) {
                if (totalRows > 1) {
                    newGrid.splice(rowIdx, 1);
                }
            }
            setGrid(newGrid);
        }
    };

    const addRow = () => {
        if (grid.length < maxRows) {
            setGrid([...grid, Array(grid[0].length).fill("")]);
        }
    };

    const deleteRow = () => {
        if (grid.length > 1) {
            setGrid(grid.slice(0, -1));
        }
    };

    const addColumn = () => {
        if (grid[0].length < maxCols) {
            setGrid(grid.map(row => [...row, ""]));
        }
    };

    const deleteColumn = () => {
        if (grid[0].length > 1) {
            setGrid(grid.map(row => row.slice(0, -1)));
        }
    };

    const handleFocus = (rowIdx, colIdx) => {
        setActiveCell(`${rowIdx}-${colIdx}`);
        setActiveMatrixIndex(index); // Set this matrix as active
    };

    const handleBlur = () => {
        setActiveCell(null);
        // Не скидаємо activeMatrixIndex тут, оскільки це тепер обробляється через клік поза матрицею
    };

    // Функція для копіювання матриці
    const copyMatrix = () => {
        const matrixText = grid.map(row => row.map(cell => cell || "0").join(" ")).join("\n");
        navigator.clipboard.writeText(matrixText)
            .then(() => {
                // Можна показати повідомлення про успішне копіювання
                console.log("Матрицю скопійовано в буфер обміну");
            })
            .catch(err => {
                console.error("Помилка при копіюванні матриці:", err);
            });
    };

    // Функція для вставки матриці з буфера обміну
    const pasteMatrix = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            // Перевіряємо, чи текст у буфері обміну має формат матриці
            if (clipboardText.trim()) {
                const newValue = clipboardText.trim();
                onChange({ target: { value: newValue } });
            }
        } catch (err) {
            console.error("Помилка при вставці матриці:", err);
        }
    };

    return (
        <div className="matrix-wrapper" ref={matrixRef}>
            {/* Блок матриці з дужками */}
            <div className="matrix-brackets">
                <div className="matrix-grid">
                    {grid.map((row, rowIdx) => (
                        <div key={rowIdx} className="matrix-row">
                            {row.map((cell, colIdx) => (
                                <input
                                    key={colIdx}
                                    id={getCellId(rowIdx, colIdx)}
                                    type="text"
                                    className={`matrix-cell ${cell !== "" || activeCell === `${rowIdx}-${colIdx}` ? "active" : "inactive"
                                        }`}
                                    value={cell}
                                    onChange={(e) => handleChange(e, rowIdx, colIdx)}
                                    onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
                                    onFocus={() => handleFocus(rowIdx, colIdx)}
                                    onBlur={handleBlur}
                                    placeholder="0"
                                    inputMode="numeric"
                                    autoComplete="off"
                                    pattern="-?[0-9]*\.?[0-9]*"
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Кнопки копіювання/вставки - тепер винесені за межі matrix-brackets */}
            <div className="matrix-clipboard-controls">
                <Tippy content="Copy matrix">
                    <button
                        type="button"
                        className="matrix-copy-button"
                        onClick={copyMatrix}
                        aria-label="Copy matrix"
                    >
                        <Copy size={16} /> Copy
                    </button>
                </Tippy>
                <Tippy content="Paste matrix">
                    <button
                        type="button"
                        className="matrix-paste-button"
                        onClick={pasteMatrix}
                        aria-label="Paste matrix"
                    >
                        <Clipboard size={16} /> Paste
                    </button>
                </Tippy>
            </div>

            {/* Контроли для матриці */}
            {isActive && (
                <div className="matrix-controls">
                    <div className="matrix-c-wrapper">
                        <p>Rows</p>
                        <div className="row-controls">
                            <button type="button" className="add-row-button" onClick={addRow}>Add</button>
                            <button type="button" className="delete-row-button" onClick={deleteRow}>Del.</button>
                        </div>
                    </div>
                    <div className="matrix-c-wrapper">
                        <p>Collums</p>
                        <div className="col-controls">
                            <button type="button" className="add-col-button" onClick={addColumn}>Add</button>
                            <button type="button" className="delete-col-button" onClick={deleteColumn}>Del.</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

MatrixGridInput.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    formId: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    setActiveMatrixIndex: PropTypes.func.isRequired,
    maxRows: PropTypes.number.isRequired,
    maxCols: PropTypes.number.isRequired,
};

export default MatrixGridInput;