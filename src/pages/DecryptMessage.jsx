import React, { useState } from "react";
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
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/decrypt_message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, key }),
      });

      if (!response.ok) {
        throw new Error("Failed to decrypt the message.");
      }

      const data = await response.json();
      setResult(data.message);
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
    <div className="formContainer">
      <h3>Decrypt Message</h3>
      {error && <p className="flashMessage">{error}</p>}
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

      {result && (
        <div className="result">
          <h4>Decrypted Message:</h4>
          <p className="decoded-result">{result}</p>
        </div>
      )}
    </div>
  );
};

export default DecryptMessage;
