import React, { useState } from "react";
import { calculateCacheMemoryParameters } from "../apiClient"; // API-запит перенесено
import "./../styles/Pages.css";
import "./../styles/Table.css";

const CacheMemoryCalculator = () => {
  const [inputs, setInputs] = useState({
    dramCapacity: "",
    dataBusWidth: "",
    wordsInLine: "",
    cashDivider: "",
    kValue: "",
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  // Перевірка валідності значень
  const validateInputs = () => {
    const { dramCapacity, dataBusWidth, wordsInLine, cashDivider, kValue } = inputs;
    if (!dramCapacity || !dataBusWidth || !wordsInLine || !cashDivider || !kValue) {
      setError("All fields are required!");
      return false;
    }
    if (
      Number(dramCapacity) <= 0 || Number(dataBusWidth) <= 0 || 
      Number(wordsInLine) <= 0 || Number(cashDivider) <= 0 || 
      Number(kValue) <= 0
    ) {
      setError("All values must be greater than zero!");
      return false;
    }
    if (
      Number(dramCapacity) > 1024 || Number(dataBusWidth) > 128 || 
      Number(wordsInLine) > 128 || Number(cashDivider) > 1024 || 
      Number(kValue) > 64
    ) {
      setError("Values exceed maximum allowed limits!");
      return false;
    }
    setError("");
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleClear = () => {
    setInputs({
      dramCapacity: "",
      dataBusWidth: "",
      wordsInLine: "",
      cashDivider: "",
      kValue: "",
    });
    setResults(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    console.log("Submitting data to backend:", inputs);

    try {
      const data = await calculateCacheMemoryParameters({
        ram_capacity: Number(inputs.dramCapacity),
        data_bus_width: Number(inputs.dataBusWidth),
        words_in_line: Number(inputs.wordsInLine),
        cache_divider: Number(inputs.cashDivider),
        k: Number(inputs.kValue),
      });
      console.log("Received results from backend:", data);
      setResults(data);
    } catch (err) {
      console.error("Error during API call:", err);
      setError("An error occurred while fetching results. Please try again.");
    }
  };

  return (
    <div className="formContainer wrapper">
      <div className="form-header"><h3>Cache Memory Calculator</h3></div>

      {/* Error Message */}
      {error && <p className="flashMessage show">{error}</p>}
      
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="cache-form">
        <table className="input-table">
          <thead>
            <tr>
              <th>RAM Capacity</th>
              <th>Data Bus Width</th>
              <th>Words in Line</th>
              <th>Cash Divider</th>
              <th>k (for s-a cache)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="number"
                  name="dramCapacity"
                  value={inputs.dramCapacity}
                  onChange={handleInputChange}
                  placeholder="(GB)"
                  min="1"
                  max="1024"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="dataBusWidth"
                  value={inputs.dataBusWidth}
                  onChange={handleInputChange}
                  placeholder="(bits)"
                  min="1"
                  max="128"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="wordsInLine"
                  value={inputs.wordsInLine}
                  onChange={handleInputChange}
                  placeholder="value"
                  min="1"
                  max="128"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="cashDivider"
                  value={inputs.cashDivider}
                  onChange={handleInputChange}
                  placeholder="value"
                  min="1"
                  max="1024"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="kValue"
                  value={inputs.kValue}
                  onChange={handleInputChange}
                  placeholder="value"
                  min="1"
                  max="64"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="buttons">
          <button type="submit">Submit</button>
          <button type="button" className="clear" onClick={handleClear}>
            Clear
          </button>
        </div>
      </form>

      {/* Results */}
      {results && (
        <div className="result-tables">
          <div className="result-table">
            <h4>k = 1 (direct-mapped)</h4>
            <table>
              <thead>
                <tr>
                  <th>TAG</th>
                  <th>SET</th>
                  <th>OFFSET</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{results.k_1.tag}</td>
                  <td>{results.k_1.set}</td>
                  <td>{results.k_1.offset}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="result-table">
            <h4>k = {inputs.kValue} (k-way associative)</h4>
            <table>
              <thead>
                <tr>
                  <th>TAG</th>
                  <th>SET</th>
                  <th>OFFSET</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{results.k.tag}</td>
                  <td>{results.k.set}</td>
                  <td>{results.k.offset}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="result-table">
            <h4>k = Number of cache lines (fully associative)</h4>
            <table>
              <thead>
                <tr>
                  <th>TAG</th>
                  <th>SET</th>
                  <th>OFFSET</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{results.k_lines.tag}</td>
                  <td>{results.k_lines.set}</td>
                  <td>{results.k_lines.offset}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CacheMemoryCalculator;
