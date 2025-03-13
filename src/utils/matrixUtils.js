// matrixUtils.js
export const processMatrix = (matrix) => {
    return matrix.map(row =>
        row.map(val => {
            if (val === "" || val === undefined || val === null) {
                return 0;
            }
            const num = Number(val);
            return isNaN(num) ? 0 : num;
        })
    );
};

export const parseMatrixInput = (input, previousGrid = [[""]], defaultRows = 1, defaultCols = 1) => {
    console.log("Input to parseMatrixInput:", JSON.stringify(input));
    console.log("Previous grid:", previousGrid);

    if (!input.trim()) {
        return Array(defaultRows).fill().map(() => Array(defaultCols).fill(""));
    }

    const rows = input.split("\n");
    const maxRows = Math.max(rows.length, previousGrid.length || defaultRows);

    const rowCols = rows.map(row => {
        const cells = row.split(" ").map(cell => cell.trim());
        return cells.length;
    });
    const maxCols = Math.max(...rowCols, previousGrid[0]?.length || defaultCols);

    const newGrid = Array(maxRows)
        .fill()
        .map((_, rowIdx) => {
            const rowFromInput = rows[rowIdx] ? rows[rowIdx].split(" ") : [];
            const parsedRow = Array(maxCols).fill("");

            // Спочатку заповнюємо рядок із вхідного тексту
            rowFromInput.forEach((val, colIdx) => {
                if (colIdx < maxCols) {
                    const trimmed = val.trim();
                    if (trimmed === "" || trimmed === "-") {
                        parsedRow[colIdx] = trimmed;
                    } else {
                        const num = parseFloat(trimmed);
                        parsedRow[colIdx] = isNaN(num) ? "" : num;
                    }
                }
            });

            // Використовуємо previousGrid лише для доповнення, якщо клітинка не була явно змінена
            if (previousGrid[rowIdx]) {
                previousGrid[rowIdx].forEach((prevVal, colIdx) => {
                    // Доповнюємо лише якщо клітинка не була змінена (не порожня у вхідному тексті)
                    if (colIdx < maxCols && rowFromInput[colIdx] === undefined && prevVal !== undefined) {
                        parsedRow[colIdx] = prevVal;
                    }
                });
            }
            return parsedRow;
        });

    while (newGrid.length < previousGrid.length) {
        newGrid.push(Array(maxCols).fill(""));
    }

    console.log("Parsed grid:", newGrid);
    return newGrid;
};