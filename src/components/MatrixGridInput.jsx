// src/components/MatrixGridInput.jsx
import React, { useState, useEffect, useRef } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { parseMatrixInput } from '../utils/matrixUtils';
import PropTypes from 'prop-types';

const MatrixGridInput = ({ value, onChange, index, formId }) => {
    const [grid, setGrid] = useState(() => {
        const initialGrid = value ? parseMatrixInput(value, [[""]], 1, 1) : [[""]];
        return initialGrid;
    });

    const [activeCell, setActiveCell] = useState(null);
    const previousGrid = useRef(grid);

    useEffect(() => {
        console.log("useEffect - Value:", value);
        console.log("useEffect - Previous grid:", previousGrid.current);
        const newGrid = parseMatrixInput(value, previousGrid.current);
        console.log("useEffect - Parsed newGrid:", newGrid);
        if (newGrid.length === 0 || newGrid[0].length === 0) {
            setGrid([[""]]);
        } else {
            setGrid(newGrid);
        }
        previousGrid.current = newGrid;
    }, [value]);

    const getCellId = (rowIdx, colIdx) => `cell-${formId}-${index}-${rowIdx}-${colIdx}`;

    const handleChange = (e, rowIdx, colIdx) => {
        const newGrid = [...grid.map(row => [...row])];
        const value = e.target.value;

        console.log("handleChange - Input value:", value);

        if (value === "-" || value === "" || !isNaN(value) || value === undefined) {
            newGrid[rowIdx][colIdx] = value || "";

            const maxCols = Math.max(...newGrid.map(row => row.length));
            newGrid.forEach(row => {
                while (row.length < maxCols) {
                    row.push("");
                }
            });

            setGrid(newGrid);

            const textValue = newGrid
                .map(row => row.map(cell => cell || "").join(" "))
                .join("\n");

            console.log("newGrid after change:", newGrid);
            console.log("textValue:", JSON.stringify(textValue));

            onChange({ target: { value: textValue } });

            setTimeout(() => {
                const el = document.getElementById(getCellId(rowIdx, colIdx));
                if (el) el.focus();
            }, 0);
        }
    };

    const handleKeyDown = (e, rowIdx, colIdx) => {
        const newGrid = [...grid.map(row => [...row])];
        const totalCols = newGrid[rowIdx].length;
        const totalRows = newGrid.length;

        if (e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            if (colIdx === totalCols - 1) {
                newGrid.forEach(row => row.push(""));
                setGrid(newGrid);
                const nextCellId = getCellId(rowIdx, colIdx + 1);
                setTimeout(() => {
                    const nextCell = document.getElementById(nextCellId);
                    if (nextCell) nextCell.focus();
                }, 0);
            } else {
                const nextCellId = getCellId(rowIdx, colIdx + 1);
                setTimeout(() => {
                    const nextCell = document.getElementById(nextCellId);
                    if (nextCell) nextCell.focus();
                }, 0);
            }
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (rowIdx === totalRows - 1) {
                newGrid.push(Array(totalCols).fill(""));
                setGrid(newGrid);
                const nextCellId = getCellId(rowIdx + 1, 0);
                setTimeout(() => {
                    const nextCell = document.getElementById(nextCellId);
                    if (nextCell) nextCell.focus();
                }, 0);
            } else {
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
                                <Tippy
                                    key={colIdx}
                                    content="Use Space to move right, Enter to move down"
                                    placement="top"
                                    delay={[500, 0]} // Show after 500ms hover, hide immediately
                                >
                                    <input
                                        id={getCellId(rowIdx, colIdx)}
                                        type="text"
                                        inputMode="numeric"
                                        className={`matrix-cell ${cell !== "" || activeCell === `${rowIdx}-${colIdx}` ? "active" : "inactive"}`}
                                        value={cell}
                                        onChange={(e) => handleChange(e, rowIdx, colIdx)}
                                        onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
                                        onFocus={() => handleFocus(rowIdx, colIdx)}
                                        onBlur={handleBlur}
                                        placeholder="0"
                                    />
                                </Tippy>
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
    formId: PropTypes.string.isRequired,
};

export default MatrixGridInput;