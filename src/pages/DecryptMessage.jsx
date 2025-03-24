import React, { useState } from "react";
import { decryptMessage } from "../api/apiClient";
import Result from '../components/result/Result';
import FlashMessage from "../components/FlashMessage/FlashMessage";
import "./../styles/Pages.css";

const DecryptMessage = () => {
  const [message, setMessage] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!message.trim() || !key.trim()) {
      setError("Both fields are required!");
      return;
    }

    try {
      setError("");
      const decrypted = await decryptMessage(message, key);
      // decrypted contains the API response result (e.g. decrypted message)
      setResult(decrypted);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClear = () => {
    setMessage("");
    setKey("");
    setResult("");
    setError("");
  };

  return (
    <div className="formContainer wrapper">
      <div className="form-header"><h3>Decrypt Message</h3></div>
      {error && (
        <FlashMessage 
          message={error} 
          clearMessage={() => setError("")} 
          type="error" 
        />
      )}
      <form onSubmit={handleSubmit} className="decrypt-form">
        <div className="formGroup">
          <label htmlFor="message">Message:</label>
          <input
            type="text"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter encrypted message"
          />
        </div>

        <div className="formGroup">
          <label htmlFor="key">Key:</label>
          <input
            type="text"
            id="key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter decryption key"
          />
        </div>

        <div className="buttons">
          <button type="submit" className="submit">
            Decrypt
          </button>
          <button type="button" className="clear" onClick={handleClear}>
            Clear
          </button>
        </div>
      </form>

      {result && <Result result={result} title="Result:" />}
    </div>
  );
};

export default DecryptMessage;
