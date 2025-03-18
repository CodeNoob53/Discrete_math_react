import React, { useState } from "react";
import { encodeHamming, decodeHamming } from "../apiClient";
import "./../styles/Pages.css";

const HammingCode = () => {
  const [encodeInput, setEncodeInput] = useState("");
  const [encodedData, setEncodedData] = useState("");
  const [decodeInput, setDecodeInput] = useState("");
  const [decodedData, setDecodedData] = useState("");
  const [syndrome, setSyndrome] = useState("");
  const [flashMessage, setFlashMessage] = useState("");

  const handleEncode = async (e) => {
    e.preventDefault();
    try {
      setFlashMessage("");
      const result = await encodeHamming(encodeInput);
      setEncodedData(result.hamming_code);
    } catch (err) {
      setFlashMessage("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDecode = async (e) => {
    e.preventDefault();
    try {
      setFlashMessage("");
      const result = await decodeHamming(decodeInput);
      setDecodedData(result.hamming_data);
      setSyndrome(result.syndrome);
    } catch (err) {
      setFlashMessage("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const clearEncodeForm = () => {
    setEncodeInput("");
    setEncodedData("");
  };

  const clearDecodeForm = () => {
    setDecodeInput("");
    setDecodedData("");
    setSyndrome("");
  };

  return (
    <div className="hamming-code wrapper">
      {/* Flash Message */}
      {flashMessage && <p className="flashMessage">{flashMessage}</p>}
      {/* Encode Form */}
      <div className="formContainer">
        <div className="form-header"><h3>Encode Hamming Code</h3></div>
        <form onSubmit={handleEncode} className="hamming-form">
          <div className="formGroup">
            <label htmlFor="encodeInput">4-bit Input:</label>
            <input
              type="text"
              id="encodeInput"
              value={encodeInput}
              onChange={(e) => setEncodeInput(e.target.value)}
              placeholder="e.g., 1010"
            />
          </div>
          <div className="buttons">
            <button type="submit" className="submit">Encode</button>
            <button type="button" className="clear" onClick={clearEncodeForm}>Clear</button>
          </div>
        </form>
        {encodedData && (
          <div className="result">
            <h5>Encoded Data:</h5>
            <p>{encodedData}</p>
          </div>
        )}
      </div>

      {/* Decode Form */}
      <div className="formContainer">
        <div className="form-header"><h3>Decode Hamming Code</h3></div>
        <form onSubmit={handleDecode} className="hamming-form">
          <div className="formGroup">
            <label htmlFor="decodeInput">7-bit Input:</label>
            <input
              type="text"
              id="decodeInput"
              value={decodeInput}
              onChange={(e) => setDecodeInput(e.target.value)}
              placeholder="e.g., 1010101"
            />
          </div>
          <div className="buttons">
            <button type="submit" className="submit">Decode</button>
            <button type="button" className="clear" onClick={clearDecodeForm}>Clear</button>
          </div>
        </form>
        {(decodedData || syndrome) && (
          <div className="result">
            {decodedData && (
              <>
                <h5>Decoded Data:</h5>
                <p>{decodedData}</p>
              </>
            )}
            {syndrome && (
              <>
                <h5>Syndrome:</h5>
                <p>{syndrome}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HammingCode;
