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

