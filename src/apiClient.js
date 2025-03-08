import axios from "axios";

// Використання змінної оточення для базового URL
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// API для декодування повідомлення
export const decryptMessage = async (message, key) => {
  try {
    const response = await axios.post(`${BASE_URL}/decrypt_message`, {
      message,
      key,
    });
    return response.data;
  } catch (error) {
    console.error("Error in decryptMessage:", error.response?.data || error.message);
    throw error;
  }
};

// API для кодування за Хеммінгом
export const encodeHamming = async (hammingData) => {
  try {
    const response = await axios.post(`${BASE_URL}/hamming/encode`, {
      hamming_data: hammingData,
    });
    return response.data;
  } catch (error) {
    console.error("Error in encodeHamming:", error.response?.data || error.message);
    throw error;
  }
};

// API для декодування Хеммінга
export const decodeHamming = async (hammingCode) => {
  try {
    const response = await axios.post(`${BASE_URL}/hamming/decode`, {
      hamming_code: hammingCode,
    });
    return response.data; // Повертає синдром і декодовані дані
  } catch (error) {
    console.error("Error in decodeHamming:", error.response?.data || error.message);
    throw error;
  }
};

// API для різниці множин
export const calculateSetDifference = async (set1, set2) => {
  try {
    const response = await axios.post(`${BASE_URL}/sets/difference`, { set1, set2 });
    return response.data.result;
  } catch (error) {
    console.error("Error in calculateSetDifference:", error.response?.data || error.message);
    throw error;
  }
};

// API для об'єднання множин
export const calculateSetUnion = async (set1, set2) => {
  try {
    const response = await axios.post(`${BASE_URL}/sets/union`, { set1, set2 });
    return response.data.result;
  } catch (error) {
    console.error("Error in calculateSetUnion:", error.response?.data || error.message);
    throw error;
  }
};

// API для перетину множин
export const calculateSetIntersection = async (set1, set2) => {
  try {
    const response = await axios.post(`${BASE_URL}/sets/intersection`, { set1, set2 });
    return response.data.result;
  } catch (error) {
    console.error("Error in calculateSetIntersection:", error.response?.data || error.message);
    throw error;
  }
};

// API для комбінаторики
export const calculateArrangement = async (n, k) => {
  try {
    const response = await axios.post(`${BASE_URL}/combinatorics/arrangement`, { n, k });
    return response.data.result;
  } catch (error) {
    console.error("Error in calculateArrangement:", error.response?.data || error.message);
    throw error;
  }
};

export const calculateCombination = async (n, k) => {
  try {
    const response = await axios.post(`${BASE_URL}/combinatorics/combination`, { n, k });
    return response.data.result;
  } catch (error) {
    console.error("Error in calculateCombination:", error.response?.data || error.message);
    throw error;
  }
};

export const calculateCombinationWithRepetition = async (n, k) => {
  try {
    const response = await axios.post(`${BASE_URL}/combinatorics/combination-with-repetition`, { n, k });
    return response.data.result;
  } catch (error) {
    console.error("Error in calculateCombinationWithRepetition:", error.response?.data || error.message);
    throw error;
  }
};

export const calculatePermutation = async (n) => {
  try {
    const response = await axios.post(`${BASE_URL}/combinatorics/permutation`, { n });
    return response.data.result;
  } catch (error) {
    console.error("Error in calculatePermutation:", error.response?.data || error.message);
    throw error;
  }
};

export const calculatePermutationWithRepetition = async (n, elements) => {
  console.log("Sending request with:", { n, elements }); // Debug log
  try {
    const response = await axios.post(`${BASE_URL}/combinatorics/permutation-with-repetition`, {
      n,
      elements,
    });
    return response.data.result;
  } catch (error) {
    console.error("Error in calculatePermutationWithRepetition:", error.response?.data || error.message);
    throw error;
  }
};

// API для валідації хеш
export const validateChecksum = async (messageReceived, checksumReceived) => {
  try {
    const response = await axios.post(`${BASE_URL}/validate_checksum`, {
      message_received: messageReceived,
      checksum_received: checksumReceived,
    });
    return response.data;
  } catch (error) {
    console.error("Error in validateChecksum:", error.response?.data || error.message);
    throw error;
  }
};
// API для розрахунку кешування пам'яті
export const calculateCacheMemoryParameters = async (data) => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  try {
    const response = await axios.post(`${BASE_URL}/calculate-cache-memory-parameters`, data);
    return response.data;
  } catch (error) {
    console.error("Error in calculateCacheMemoryParameters:", error.response?.data || error.message);
    throw error;
  }
};


export const solveLinearEquations = async (equations) => {
  try {
    console.log("Preparing to send request to API...");
    console.log("Data being sent:", JSON.stringify({ equations }));

    const response = await axios.post(`${BASE_URL}/solve-linear-equations`, { equations });
    console.log("Response from API:", response.data);

    return response.data.solution;
  } catch (error) {
    console.error("Error in solveLinearEquations:", error.response?.data || error.message);
    throw error;
  }
};


// API for adding vectors
export const addVectors = async ({ vectors }) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/vectors/add`, { vectors });
    return response.data.result;
  } catch (error) {
    console.error("Error in addVectors:", error.response?.data || error.message);
    throw error;
  }
};

// Calculate cross product
export const calculateCrossProduct = async (vector1, vector2) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/vectors/cross-product`, {
      vector1,
      vector2,
    });
    return response.data.result;
  } catch (error) {
    console.error("Error in calculateCrossProduct:", error.response?.data || error.message);
    throw error;
  }
};


// Calculate dot product
export const calculateDotProduct = async (vector1, vector2) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/vectors/dot-product`, { vector1, vector2 });
    return response.data.result;
  } catch (error) {
    console.error("Error in calculateDotProduct:", error.response?.data || error.message);
    throw error;
  }
};

// Magnitude for single vector
export const calculateMagnitude = async (vector) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/vectors/magnitude`, { vector });
    return response.data.result;
  } catch (error) {
    console.error("Error in calculateMagnitude:", error.response?.data || error.message);
    throw error;
  }
};

// API for finding negative vector
export const findNegativeVector = async (vector) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/vectors/negative`, { vector });
    return response.data.result;
  } catch (error) {
    console.error("Error in findNegativeVector:", error.response?.data || error.message);
    throw error;
  }
};

// API for subtracting vectors
export const subtractVectors = async ({ vectors }) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/vectors/subtract`, { vectors });
    return response.data.result;
  } catch (error) {
    console.error("Error in subtractVectors:", error.response?.data || error.message);
    throw error;
  }
};


export const findStartPoint = async (vector, endPoint) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/vectors/find-start-point`, {
      vector,
      endPoint,
    });
    return response.data.result;
  } catch (error) {
    console.error("Error in findStartPoint:", error.response?.data || error.message);
    throw error;
  }
};

export const addMatrices = async (matrix1, matrix2) => {
  try {
    const response = await axios.post(`${BASE_URL}/matrix/add`, { matrix1, matrix2 });
    return response.data.result;
  } catch (error) {
    console.error("Error in addMatrices:", error.response?.data || error.message);
    throw error;
  }
};

export const subtractMatrices = async (matrix1, matrix2) => {
  try {
    const response = await axios.post(`${BASE_URL}/matrix/subtract`, { matrix1, matrix2 });
    return response.data.result;
  } catch (error) {
    console.error("Error in subtractMatrices:", error.response?.data || error.message);
    throw error;
  }
};

export const multiplyMatrices = async (matrix1, matrix2) => {
  try {
    const response = await axios.post(`${BASE_URL}/matrix/multiply`, { matrix1, matrix2 });
    return response.data.result;
  } catch (error) {
    console.error("Error in multiplyMatrices:", error.response?.data || error.message);
    throw error;
  }
};

export const divideMatrices = async (matrix1, matrix2) => {
  try {
    const response = await axios.post(`${BASE_URL}/matrix/divide`, { matrix1, matrix2 });
    return response.data.result;
  } catch (error) {
    console.error("Error in divideMatrices:", error.response?.data || error.message);
    throw error;
  }
};

export const calculateDeterminant = async (matrix) => {
  try {
    const response = await axios.post(`${BASE_URL}/matrix/determinant`, { matrix });
    return response.data.result;
  } catch (error) {
    console.error("Error in calculateDeterminant:", error.response?.data || error.message);
    throw error;
  }
};

export const calculateInverseMatrix = async (matrix) => {
  try {
    const response = await axios.post(`${BASE_URL}/matrix/inverse`, { matrix });
    return response.data.result;
  } catch (error) {
    console.error("Error in calculateInverseMatrix:", error.response?.data || error.message);
    throw error;
  }
};

export const calculateRank = async (matrix) => {
  try {
    const response = await axios.post(`${BASE_URL}/matrix/rank`, { matrix });
    return response.data.result;
  } catch (error) {
    console.error("Error in calculateRank:", error.response?.data || error.message);
    throw error;
  }
};

export const calculateAdjoint = async (matrix) => {
  try {
    const response = await axios.post(`${BASE_URL}/matrix/adjoint`, { matrix });
    return response.data.result;
  } catch (error) {
    console.error("Error in calculateAdjoint:", error.response?.data || error.message);
    throw error;
  }
};

export const transposeMatrix = async (matrix) => {
  console.log("Sending request to /matrix/transpose with:", JSON.stringify({ matrix }));
  try {
    const response = await axios.post(`${BASE_URL}/matrix/transpose`, { matrix });
    console.log("Response:", response.data);
    return response.data.result;
  } catch (error) {
    console.error("Error in transposeMatrix:", error.response?.data || error.message);
    throw error;
  }
};

