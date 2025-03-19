// matrixUtils.js
import { calculateDeterminant } from '../api/apiClient';

/**
 * Обробляє матрицю, замінюючи порожні або невалідні значення на 0
 * @param {Array} matrix - Матриця для обробки
 * @returns {Array} Оброблена матриця
 */
// Виправлена функція processMatrix в файлі matrixUtils.js
export const processMatrix = (matrix) => {
    return matrix.map(row =>
        row.map(val => {
            if (val === "" || val === undefined || val === null) {
                return 0;
            }
            // Спеціальна обробка для крапки та "-."
            if (val === "." || val === "-.") {
                return 0;
            }
            const num = Number(val);
            return isNaN(num) ? 0 : num;
        })
    );
};

/**
 * Парсить вхідний текст у матрицю
 * @param {string} input - Вхідний текст
 * @param {Array} previousGrid - Попередня матриця
 * @param {number} defaultRows - Кількість рядків за замовчуванням
 * @param {number} defaultCols - Кількість стовпців за замовчуванням
 * @returns {Array} Розібрана матриця
 */

// Виправлена функція parseMatrixInput в файлі matrixUtils.js
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
                    // Додаємо перевірку для крапки та "-."
                    if (trimmed === "" || trimmed === "-" || trimmed === "." || trimmed === "-.") {
                        parsedRow[colIdx] = trimmed;
                    } else {
                        // Не перетворюємо рядок на число, а залишаємо як є,
                        // якщо він відповідає шаблону дійсного числа
                        if (/^-?\d*\.?\d*$/.test(trimmed) && trimmed !== "") {
                            parsedRow[colIdx] = trimmed;
                        } else {
                            parsedRow[colIdx] = "";
                        }
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

/**
 * Валідує матриці для різних операцій
 * @param {Array} matrices - Масив матриць для валідації
 * @param {Function} apiCall - Функція API для виконання операції
 * @param {Object} options - Опції валідації
 * @returns {Object} Результат валідації {processedMatrices, error}
 */
export const validateMatrices = (matrices, apiCall, options = {}) => {
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
        if (processedMatrices.length !== 1) {
            return { processedMatrices: [], error: "Exactly one matrix is required." };
        }
        if (
            (apiCall.name === "calculateDeterminant" || 
             apiCall.name === "calculateAdjoint" || 
             apiCall.name === "calculateInverseMatrix") &&
            processedMatrices[0].length !== processedMatrices[0][0].length
        ) {
            return { processedMatrices: [], error: "This operation is only defined for square matrices." };
        }
        return { processedMatrices, error: null };
    }

    if (isPair) {
        if (processedMatrices.length !== 2) {
            return { processedMatrices: [], error: "Exactly two matrices are required." };
        }
        const [matrix1, matrix2] = processedMatrices;

        if (apiCall.name === "multiplyMatrices" || apiCall.name === "divideMatrices") {
            if (matrix1[0].length !== matrix2.length) {
                return { 
                    processedMatrices: [], 
                    error: "Number of columns in the first matrix must equal the number of rows in the second." 
                };
            }
            if (apiCall.name === "divideMatrices" && matrix2.length !== matrix2[0].length) {
                return { 
                    processedMatrices: [], 
                    error: "Second matrix must be square for division (A/B = A*B^(-1))." 
                };
            }
        } else {
            if (matrix1.length !== matrix2.length || matrix1[0].length !== matrix2[0].length) {
                return { 
                    processedMatrices: [], 
                    error: "Matrices must have the same dimensions."
                };
            }
        }
        return { processedMatrices, error: null };
    }

    if (processedMatrices.length < 2) {
        return { 
            processedMatrices: [], 
            error: "At least two matrices are required." 
        };
    }
    
    const [firstMatrix] = processedMatrices;
    if (processedMatrices.some(m => m.length !== firstMatrix.length || m[0].length !== firstMatrix[0].length)) {
        return { 
            processedMatrices: [], 
            error: "All matrices must have the same dimensions." 
        };
    }
    
    return { processedMatrices, error: null };
};

/**
 * Послідовно додає матриці
 * @param {Array} matrices - Масив матриць для додавання
 * @returns {Array} Результуюча матриця
 */
export const sequentialAddMatrices = async (matrices, addMatrices) => {
    console.log("Starting sequentialAddMatrices with matrices:", matrices);
    if (matrices.length < 2) throw new Error("Need at least 2 matrices");
    
    let result = [...matrices[0]];
    
    for (let i = 1; i < matrices.length; i++) {
        console.log(`Adding matrix ${i}:`, matrices[i], "to result:", result);
        result = await addMatrices(result, matrices[i]);
        console.log(`Result after adding matrix ${i}:`, result);
    }
    
    return result;
};

/**
 * Послідовно віднімає матриці
 * @param {Array} matrices - Масив матриць для віднімання
 * @returns {Array} Результуюча матриця
 */
export const sequentialSubtractMatrices = async (matrices, subtractMatrices) => {
    console.log("Starting sequentialSubtractMatrices with matrices:", matrices);
    if (matrices.length < 2) throw new Error("Need at least 2 matrices");
    
    let result = [...matrices[0]];
    
    for (let i = 1; i < matrices.length; i++) {
        console.log(`Subtracting matrix ${i}:`, matrices[i], "from result:", result);
        result = await subtractMatrices(result, matrices[i]);
        console.log(`Result after subtracting matrix ${i}:`, result);
    }
    
    return result;
};

/**
 * Обробляє надсилання форми для матричних операцій
 * @param {Array} inputs - Масив введених матриць
 * @param {Function} apiCall - Функція API для виконання операції
 * @param {Function} setResult - Функція для встановлення результату
 * @param {Function} setError - Функція для встановлення помилки
 * @param {Object} options - Опції обробки
 * @returns {Promise<void>}
 */
export const handleMatrixSubmit = async (inputs, apiCall, setResult, setError, options = {}) => {
    try {
        setError("");

        const processedMatrices = inputs.map(matrix => processMatrix(matrix));

        console.log("Processed matrices:", JSON.stringify(processedMatrices));

        const { processedMatrices: validatedMatrices, error: validationError } =
            validateMatrices(processedMatrices, apiCall, options);

        if (validationError) {
            setError(validationError);
            return;
        }

        let result;
        if (options.singleMatrix) {
            result = await apiCall(validatedMatrices[0]);
        } else if (options.isPair) {
            const [matrix1, matrix2] = validatedMatrices;
            
            // Check determinant for division operation
            if (apiCall.name === "divideMatrices") {
                try {
                    const det = await calculateDeterminant(matrix2);
                    if (det === 0) {
                        throw new Error("Division is impossible: second matrix has zero determinant");
                    }
                } catch (detError) {
                    setError(detError.message);
                    return;
                }
            }
            
            result = await apiCall(matrix1, matrix2);
        } else {
            result = await apiCall(validatedMatrices);
        }

        console.log("API Result:", result);
        setResult(result);

    } catch (error) {
        console.error("Operation error:", error);
        setError(error.response?.data?.message || error.message || "An error occurred.");
    }
};