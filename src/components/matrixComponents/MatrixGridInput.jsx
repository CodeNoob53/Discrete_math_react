import React, { useState, useEffect, useRef } from "react";
import "tippy.js/dist/tippy.css";
import Tippy from "@tippyjs/react";
import { parseMatrixInput } from '../../utils/matrixUtils';
import PropTypes from 'prop-types';
import { Copy, Clipboard } from 'lucide-react';
import "./../../styles/MatrixControls.css";

const MatrixGridInput = ({ value, onChange, index, formId, isActive, setActiveMatrixIndex, maxRows, maxCols }) => {
    const [grid, setGrid] = useState(() => {
        const initialGrid = value ? parseMatrixInput(value, [[""]], 1, 1) : [[""]];
        return initialGrid;
    });
    const [activeCell, setActiveCell] = useState(null);
    const previousGrid = useRef(grid);
    const matrixRef = useRef(null);
    const isUpdatingRef = useRef(false); // Для відстеження стану оновлення

    // Оновлений useEffect який враховує стан оновлення
    useEffect(() => {
        // Якщо зміни відбуваються всередині компонента, пропускаємо зовнішнє оновлення
        if (isUpdatingRef.current) {
            isUpdatingRef.current = false;
            return;
        }

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
    // Додамо відстеження стану клавіатури
const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

// Відстежуємо появу клавіатури через події фокусу на полях вводу
useEffect(() => {
  const handleFocus = () => {
    // При фокусі на полі вводу вважаємо, що клавіатура відкрита
    setIsKeyboardVisible(true);
  };

  const handleBlur = () => {
    // При втраті фокусу вважаємо, що клавіатура закрита
    setIsKeyboardVisible(false);
  };

  // Додаємо слухачі подій до всіх полів вводу матриці
  const inputFields = matrixRef.current?.querySelectorAll('input') || [];
  inputFields.forEach(input => {
    input.addEventListener('focus', handleFocus);
    input.addEventListener('blur', handleBlur);
  });

  return () => {
    // Очищення слухачів
    inputFields.forEach(input => {
      input.removeEventListener('focus', handleFocus);
      input.removeEventListener('blur', handleBlur);
    });
  };
}, [grid]); // Перераховуємо при зміні грід, оскільки поля можуть змінюватися

    const getCellId = (rowIdx, colIdx) => `cell-${formId}-${index}-${rowIdx}-${colIdx}`;

    // Універсальна функція для оновлення сітки і передачі змін назовні
    const updateGridAndNotify = (newGrid) => {
        isUpdatingRef.current = true; // Вказуємо, що оновлення йде зсередини
        setGrid(newGrid);
        
        // Створюємо текстове представлення для передачі назовні
        const textValue = newGrid
            .map(row => row.map(cell => cell || "").join(" "))
            .join("\n");
        
        // Викликаємо onChange з новим значенням
        onChange({ target: { value: textValue } });
        
        // Зберігаємо поточну сітку для подальшого використання
        previousGrid.current = newGrid;
    };

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
    
            // Використовуємо універсальну функцію для оновлення
            updateGridAndNotify(newGrid);
    
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
                    updateGridAndNotify(newGrid);
                    
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
                    updateGridAndNotify(newGrid);
                    
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
            updateGridAndNotify(newGrid);
        }
    };

    // Переписані функції для додавання/видалення рядків та стовпців з використанням updateGridAndNotify
    const addRow = () => {
        if (grid.length < maxRows) {
            const newGrid = [...grid, Array(grid[0].length).fill("")];
            console.log("Adding row, new grid:", newGrid);
            updateGridAndNotify(newGrid);
        }
    };

    const deleteRow = () => {
        if (grid.length > 1) {
            const newGrid = grid.slice(0, -1);
            console.log("Deleting row, new grid:", newGrid);
            updateGridAndNotify(newGrid);
        }
    };

    const addColumn = () => {
        if (grid[0].length < maxCols) {
            const newGrid = grid.map(row => [...row, ""]);
            console.log("Adding column, new grid:", newGrid);
            updateGridAndNotify(newGrid);
        }
    };

    const deleteColumn = () => {
        if (grid[0].length > 1) {
            const newGrid = grid.map(row => row.slice(0, -1));
            console.log("Deleting column, new grid:", newGrid);
            updateGridAndNotify(newGrid);
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
    
    // Функція для створення одиничної матриці
    const createIdentityMatrix = () => {
        const size = Math.max(grid.length, grid[0].length);
        const newGrid = Array(size).fill().map((_, rowIdx) => 
            Array(size).fill().map((_, colIdx) => rowIdx === colIdx ? "1" : "0")
        );
        updateGridAndNotify(newGrid);
    };
    
    // Функція для створення нульової матриці
    const createZeroMatrix = () => {
        const rows = grid.length;
        const cols = grid[0].length;
        const newGrid = Array(rows).fill().map(() => Array(cols).fill("0"));
        updateGridAndNotify(newGrid);
    };
    
    // Функція для транспонування матриці
    const transposeMatrix = () => {
        const rows = grid.length;
        const cols = grid[0].length;
        const newGrid = Array(cols).fill().map((_, colIdx) => 
            Array(rows).fill().map((_, rowIdx) => grid[rowIdx][colIdx] || "0")
        );
        updateGridAndNotify(newGrid);
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

            {/* Кнопки копіювання/вставки */}
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
                <div className={`matrix-controls ${isKeyboardVisible ? 'keyboard-active' : ''}`}>
                    <div className="matrix-c-wrapper">
                        <p>Rows</p>
                        <div className="row-controls">
                            <button type="button" className="add-row-button" onClick={addRow} aria-label="Додати рядок">Add</button>
                            <button type="button" className="delete-row-button" onClick={deleteRow} aria-label="Видалити рядок">Del.</button>
                        </div>
                    </div>
                    <div className="matrix-c-wrapper">
                        <p>Columns</p>
                        <div className="col-controls">
                            <button type="button" className="add-col-button" onClick={addColumn} aria-label="Додати стовпець">Add</button>
                            <button type="button" className="delete-col-button" onClick={deleteColumn} aria-label="Видалити стовпець">Del.</button>
                        </div>
                    </div>
                    <div className="matrix-c-wrapper">
                        <p>Special</p>
                        <div className="special-controls">
                            <Tippy content="Одинична матриця">
                                <button 
                                    type="button" 
                                    className="special-matrix-button" 
                                    onClick={createIdentityMatrix}
                                    aria-label="Створити одиничну матрицю"
                                >
                                    I
                                </button>
                            </Tippy>
                            <Tippy content="Нульова матриця">
                                <button 
                                    type="button" 
                                    className="special-matrix-button" 
                                    onClick={createZeroMatrix}
                                    aria-label="Створити нульову матрицю"
                                >
                                    0
                                </button>
                            </Tippy>
                            <Tippy content="Транспонувати матрицю">
                                <button 
                                    type="button" 
                                    className="special-matrix-button" 
                                    onClick={transposeMatrix}
                                    aria-label="Транспонувати матрицю"
                                >
                                    T
                                </button>
                            </Tippy>
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