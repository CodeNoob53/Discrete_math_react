import axios from "axios";
import PropTypes from "prop-types";
// оновив API-клієнт, тепер він використовує універсальну функцію sendRequest для всіх API-запитів.
// виправив помилки ESLint у пропсах sendRequest, щоб вони були правильно визначені.
// видалив зайві імпорти та виправив форматування коду.
// заєбався :)
// Базова URL-адреса API, визначена у змінних середовища
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Універсальна функція для виконання запитів до API
const sendRequest = async (endpoint, data) => {
  try {
    const response = await axios.post(`${BASE_URL}/${endpoint}`, data);
    return response.data.result;
  } catch (error) {
    console.error(`Error in ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
};

/** === Операції з матрицями === */
export const addMatrices = async (matrix1, matrix2) => sendRequest("matrix/add", { matrix1, matrix2 });
export const subtractMatrices = async (matrix1, matrix2) => sendRequest("matrix/subtract", { matrix1, matrix2 });
export const multiplyMatrices = async (matrix1, matrix2) => sendRequest("matrix/multiply", { matrix1, matrix2 });
export const divideMatrices = async (matrix1, matrix2) => sendRequest("matrix/divide", { matrix1, matrix2 });
export const calculateDeterminant = async (matrix) => sendRequest("matrix/determinant", { matrix });
export const calculateInverseMatrix = async (matrix) => sendRequest("matrix/inverse", { matrix });
export const calculateRank = async (matrix) => sendRequest("matrix/rank", { matrix });
export const calculateAdjoint = async (matrix) => sendRequest("matrix/adjoint", { matrix });

/** === Операції з множинами === */
export const calculateSetDifference = async (set1, set2) => sendRequest("sets/difference", { set1, set2 });
export const calculateSetUnion = async (set1, set2) => sendRequest("sets/union", { set1, set2 });
export const calculateSetIntersection = async (set1, set2) => sendRequest("sets/intersection", { set1, set2 });

/** === Операції з комбінаторики === */
export const calculateArrangement = async (n, k) => sendRequest("combinatorics/arrangement", { n, k });
export const calculateCombination = async (n, k) => sendRequest("combinatorics/combination", { n, k });
export const calculateCombinationWithRepetition = async (n, k) => sendRequest("combinatorics/combination-with-repetition", { n, k });
export const calculatePermutation = async (n) => sendRequest("combinatorics/permutation", { n });
export const calculatePermutationWithRepetition = async (n, elements) => sendRequest("combinatorics/permutation-with-repetition", { n, elements });

/** === Операції з векторами === */
export const addVectors = async ({ vectors }) => sendRequest("api/vectors/add", { vectors });
export const calculateCrossProduct = async (vector1, vector2) => sendRequest("api/vectors/cross-product", { vector1, vector2 });
export const calculateDotProduct = async (vector1, vector2) => sendRequest("api/vectors/dot-product", { vector1, vector2 });
export const calculateMagnitude = async (vector) => sendRequest("api/vectors/magnitude", { vector });
export const findNegativeVector = async (vector) => sendRequest("api/vectors/negative", { vector });
export const subtractVectors = async ({ vectors }) => sendRequest("api/vectors/subtract", { vectors });
export const findStartPoint = async (vector, endPoint) => sendRequest("api/vectors/find-start-point", { vector, endPoint });

/** === Інші операції === */
export const decryptMessage = async (message, key) => sendRequest("decrypt_message", { message, key });
export const encodeHamming = async (hammingData) => sendRequest("hamming/encode", { hamming_data: hammingData });
export const decodeHamming = async (hammingCode) => sendRequest("hamming/decode", { hamming_code: hammingCode });
export const validateChecksum = async (messageReceived, checksumReceived) => sendRequest("validate_checksum", { message_received: messageReceived, checksum_received: checksumReceived });
export const calculateCacheMemoryParameters = async (data) => sendRequest("calculate-cache-memory-parameters", data);
export const solveLinearEquations = async (equations) => sendRequest("solve-linear-equations", { equations });

// Виправлення ESLint помилок у пропсах
sendRequest.propTypes = {
  endpoint: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};

