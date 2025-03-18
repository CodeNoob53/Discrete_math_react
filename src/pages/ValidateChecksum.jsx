import React, { useState } from "react";
import { validateChecksum } from "../apiClient";
import "./../styles/Pages.css";

const ValidateChecksum = () => {
  const [messageReceived, setMessageReceived] = useState("");
  const [checksumReceived, setChecksumReceived] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const validateFields = () => {
    const trimmedMessage = messageReceived.trim();
    const trimmedChecksum = checksumReceived.trim();

    if (!trimmedMessage || !trimmedChecksum) {
      setError("Both fields are required!");
      return false;
    }

    const messageRegex = /^[01\s]+$/;
    const checksumRegex = /^[01]{8}$/;

    if (!messageRegex.test(trimmedMessage)) {
      setError("Message must only contain binary digits (0 and 1) and spaces.");
      return false;
    }

    if (!checksumRegex.test(trimmedChecksum)) {
      setError("Checksum must be exactly 8 binary digits (0 and 1).");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateFields()) return;

    try {
      const data = await validateChecksum(messageReceived, checksumReceived);
      setResult(
        `Checksum: ${data.checksum_calculated}, Verification: ${data.result_of_checksum_verification}`
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to validate checksum.");
    }
  };

  const handleClear = () => {
    setMessageReceived("");
    setChecksumReceived("");
    setResult("");
    setError("");
  };

  return (
    <div className="formContainer wrapper">
      <div className="form-header"><h3>Validate Checksum</h3></div>
      {error && <p className="flashMessage">{error}</p>}
      <form onSubmit={handleSubmit} className="validate-checksum-form">
        <div className="formGroup">
          <label htmlFor="messageReceived">Message Received:</label>
          <input
            type="text"
            id="messageReceived"
            value={messageReceived}
            onChange={(e) => setMessageReceived(e.target.value)}
            placeholder="Enter binary message"
          />
        </div>

        <div className="formGroup">
          <label htmlFor="checksumReceived">Checksum Received:</label>
          <input
            type="text"
            id="checksumReceived"
            value={checksumReceived}
            onChange={(e) => setChecksumReceived(e.target.value)}
            placeholder="Enter checksum (8 bits)"
          />
        </div>

        <div className="buttons">
          <button type="submit" className="submit">
            Validate
          </button>
          <button type="button" className="clear" onClick={handleClear}>
            Clear
          </button>
        </div>
      </form>

      {result && (
        <div className="result">
          <h4>Validation Result:</h4>
          <p className="decoded-result">{result}</p>
        </div>
      )}
    </div>
  );
};

export default ValidateChecksum;
