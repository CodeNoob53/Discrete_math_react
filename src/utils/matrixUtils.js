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
// Оновлена функція validateMatrices з додатковими перевірками та детальнішими повідомленнями
export const validateMatrices = (matrices, apiCall, options = {}) => {
    const { singleMatrix = false, isPair = false } = options;

    console.log("Matrices before processing:", JSON.stringify(matrices));

    const processedMatrices = matrices.map(matrix => processMatrix(matrix));

    console.log("Before validation (processed):", JSON.stringify(processedMatrices));

    // Перевірка на порожні матриці
    for (let i = 0; i < processedMatrices.length; i++) {
        const matrix = processedMatrices[i];
        if (matrix.length === 0 || matrix.some(row => row.length === 0)) {
            return { 
                processedMatrices: [], 
                error: {
                    message: `Matrix ${i + 1} cannot be empty.`,
                    type: "error"
                }
            };
        }
        
        // Перевірка на валідні числа
        if (matrix.some(row => row.some(val => isNaN(val)))) {
            return { 
                processedMatrices: [], 
                error: {
                    message: `Matrix ${i + 1} contains invalid numeric values.`,
                    type: "error"
                }
            };
        }
        
        // Перевірка на консистентність розмірів рядків
        const rowLengths = matrix.map(row => row.length);
        if (Math.min(...rowLengths) !== Math.max(...rowLengths)) {
            return { 
                processedMatrices: [], 
                error: {
                    message: `Matrix ${i + 1} has inconsistent row lengths. All rows must have the same number of columns.`,
                    type: "warning"
                }
            };
        }
    }

    // Валідація для операцій з однією матрицею
    if (singleMatrix) {
        if (processedMatrices.length !== 1) {
            return { 
                processedMatrices: [], 
                error: {
                    message: "This operation requires exactly one matrix.",
                    type: "error"
                }
            };
        }
        
        const matrix = processedMatrices[0];
        
        // Перевірка для детермінанту, оберненої та приєднаної матриці
        if (
            (apiCall.name === "calculateDeterminant" || 
             apiCall.name === "calculateAdjoint" || 
             apiCall.name === "calculateInverseMatrix") 
        ) {
            if (matrix.length !== matrix[0].length) {
                return { 
                    processedMatrices: [], 
                    error: {
                        message: "Operation requires a square matrix (same number of rows and columns).",
                        type: "error"
                    }
                };
            }
            
            // Додаткова перевірка для оберненої матриці
            if (apiCall.name === "calculateInverseMatrix" && matrix.length === 1 && matrix[0][0] === 0) {
                return { 
                    processedMatrices: [], 
                    error: {
                        message: "Cannot compute inverse: determinant is zero.",
                        type: "error"
                    }
                };
            }
        }
        
        // Додаткова перевірка для системи лінійних рівнянь
        if (apiCall.name === "solveLinearSystem") {
            // Перевірка, що останній стовпець - це стовпець вільних членів
            if (matrix[0].length < 2) {
                return { 
                    processedMatrices: [], 
                    error: {
                        message: "System of equations must have at least one variable and constants column.",
                        type: "error"
                    }
                };
            }
            
            // Перевірка сумісності системи рівнянь (можна додати більше перевірок)
            if (matrix.length > matrix[0].length - 1) {
                return { 
                    processedMatrices: [], 
                    error: {
                        message: "The system may be overdetermined (more equations than variables).",
                        type: "warning"
                    }
                };
            }
        }
        
        return { processedMatrices, error: null };
    }

    // Валідація для пари матриць
    if (isPair) {
        if (processedMatrices.length !== 2) {
            return { 
                processedMatrices: [], 
                error: {
                    message: "This operation requires exactly two matrices.",
                    type: "error"
                }
            };
        }
        
        const [matrix1, matrix2] = processedMatrices;

        // Спеціальні перевірки для множення матриць
        if (apiCall.name === "multiplyMatrices" || apiCall.toString().includes("multiplyMatrices")) {
            console.log("Validating matrix multiplication");
            
            // Ensure neither matrix is empty and each has at least one row and one column
            if (!matrix1.length || !matrix2.length || !matrix1[0].length || !matrix2[0].length) {
                return { 
                    processedMatrices: [], 
                    error: {
                        message: "Matrix multiplication error: one or both matrices are empty.",
                        type: "error"
                    }
                };
            }
            
            console.log("Matrix 1 columns:", matrix1[0].length, "Matrix 2 rows:", matrix2.length);
            if (matrix1[0].length !== matrix2.length) {
                return { 
                    processedMatrices: [], 
                    error: {
                        message: "Matrix multiplication error: number of columns in the first matrix must equal the number of rows in the second.",
                        type: "error"
                    }
                };
            }
        } 
        // Спеціальні перевірки для ділення матриць
        else if (apiCall.name === "divideMatrices") {
            if (matrix1[0].length !== matrix2.length) {
                return { 
                    processedMatrices: [], 
                    error: {
                        message: "Matrix division error: dimensions are incompatible.",
                        type: "error"
                    }
                };
            }
            
            if (matrix2.length !== matrix2[0].length) {
                return { 
                    processedMatrices: [], 
                    error: {
                        message: "Division requires a square second matrix (for computing inverse).",
                        type: "error"
                    }
                };
            }
        } 
        // Для додавання та віднімання матриць
        else {
            if (matrix1.length !== matrix2.length || matrix1[0].length !== matrix2[0].length) {
                return { 
                    processedMatrices: [], 
                    error: {
                        message: "Addition/subtraction requires matrices of the same dimensions.",
                        type: "error"
                    }
                };
            }
        }
        
        return { processedMatrices, error: null };
    }

    // Валідація для операцій з кількома матрицями
    if (processedMatrices.length < 2) {
        return { 
            processedMatrices: [], 
            error: {
                message: "This operation requires at least two matrices.",
                type: "error"
            }
        };
    }
    
    // Перевірка на однакові розміри для додавання/віднімання
    const [firstMatrix] = processedMatrices;
    const firstDimensions = `${firstMatrix.length}x${firstMatrix[0].length}`;
    
    for (let i = 1; i < processedMatrices.length; i++) {
        const matrix = processedMatrices[i];
        const dimensions = `${matrix.length}x${matrix[0].length}`;
        
        if (matrix.length !== firstMatrix.length || matrix[0].length !== firstMatrix[0].length) {
            return { 
                processedMatrices: [], 
                error: {
                    message: `Matrix ${i + 1} has dimensions ${dimensions}, but should be ${firstDimensions} like the first matrix.`,
                    type: "error"
                }
            };
        }
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
                        setError({
                            message: "Division is impossible: second matrix has zero determinant.",
                            type: "error"
                        });
                        return;
                    }
                } catch (detError) {
                    setError({
                        message: detError.message || "Error checking determinant.",
                        type: "error"
                    });
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
        setError({
            message: error.response?.data?.message || error.message || "An error occurred during calculation.",
            type: "error"
        });
    }
};