import React, { useState } from "react";
import { encodeHamming, decodeHamming } from "../api/apiClient";
import FlashMessage from "../components/flashMessage/FlashMessage";
import Result from "../components/result/Result";
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
      {flashMessage && (
        <FlashMessage 
          message={flashMessage} 
          clearMessage={() => setFlashMessage("")} 
          type="error" 
        />
      )}

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
          <Result result={encodedData} title="Encoded Data:" />
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
          <>
            {decodedData && (
              <Result result={decodedData} title="Decoded Data:" />
            )}
            {syndrome && (
              <Result result={syndrome} title="Syndrome:" />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HammingCode;
