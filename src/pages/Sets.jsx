import React, { useState } from "react";
import "./../styles/Pages.css";
import { calculateSetDifference, calculateSetUnion, calculateSetIntersection } from "../apiClient";

const Sets = () => {
  const [differenceInputs, setDifferenceInputs] = useState({ set1: "", set2: "" });
  const [differenceResult, setDifferenceResult] = useState("");
  const [unionInputs, setUnionInputs] = useState({ set1: "", set2: "" });
  const [unionResult, setUnionResult] = useState("");
  const [intersectionInputs, setIntersectionInputs] = useState({ set1: "", set2: "" });
  const [intersectionResult, setIntersectionResult] = useState("");
  const [error, setError] = useState("");

  const validateInputs = (set1, set2) => {
    if (!set1 || !set2) {
      setError("Both sets must be provided.");
      return false;
    }
    const isValid = (input) => input.split(",").every((item) => !isNaN(item.trim()));
    if (!isValid(set1) || !isValid(set2)) {
      setError("All set elements must be numbers.");
      return false;
    }
    return true;
  };

  const handleCalculate = async (operation) => {
    try {
      setError("");
      let result;
      if (operation === "difference") {
        if (!validateInputs(differenceInputs.set1, differenceInputs.set2)) return;
        result = await calculateSetDifference(
          differenceInputs.set1.split(",").map((item) => item.trim()),
          differenceInputs.set2.split(",").map((item) => item.trim())
        );
        setDifferenceResult(result.join(", "));
      } else if (operation === "union") {
        if (!validateInputs(unionInputs.set1, unionInputs.set2)) return;
        result = await calculateSetUnion(
          unionInputs.set1.split(",").map((item) => item.trim()),
          unionInputs.set2.split(",").map((item) => item.trim())
        );
        setUnionResult(result.join(", "));
      } else if (operation === "intersection") {
        if (!validateInputs(intersectionInputs.set1, intersectionInputs.set2)) return;
        result = await calculateSetIntersection(
          intersectionInputs.set1.split(",").map((item) => item.trim()),
          intersectionInputs.set2.split(",").map((item) => item.trim())
        );
        setIntersectionResult(result.join(", "));
      }
    } catch (err) {
      setError("An error occurred during the calculation. Please check your inputs.");
    }
  };

  const clearForm = (operation) => {
    if (operation === "difference") {
      setDifferenceInputs({ set1: "", set2: "" });
      setDifferenceResult("");
    } else if (operation === "union") {
      setUnionInputs({ set1: "", set2: "" });
      setUnionResult("");
    } else if (operation === "intersection") {
      setIntersectionInputs({ set1: "", set2: "" });
      setIntersectionResult("");
    }
  };

  return (
    <div className="sets">
      {error && <p className="flashMessage error">{error}</p>}
      <form className="formContainer difference-container" onSubmit={(e) => { e.preventDefault(); handleCalculate("difference"); }}>
        <h4>Difference</h4>
        <div className="inputGroup">
          <span>{"{"}</span>
          <input
            type="text"
            placeholder="10, 20, 30"
            value={differenceInputs.set1}
            onChange={(e) => setDifferenceInputs({ ...differenceInputs, set1: e.target.value })}
          />
          <span>{"}"}</span>
          <span>-</span>
          <span>{"{"}</span>
          <input
            type="text"
            placeholder="20, 40, 50"
            value={differenceInputs.set2}
            onChange={(e) => setDifferenceInputs({ ...differenceInputs, set2: e.target.value })}
          />
          <span>{"}"}</span>
          <span>=</span>
          <span>{"{"}</span>
          <input type="text" value={differenceResult} readOnly />
          <span>{"}"}</span>
        </div>
        <div className="buttons">
          <button type="submit" className="submit">Submit</button>
          <button type="button" onClick={() => clearForm("difference")} className="clear">Clear</button>
        </div>
      </form>

      <form className="formContainer union-container" onSubmit={(e) => { e.preventDefault(); handleCalculate("union"); }}>
        <h4>Union</h4>
        <div className="inputGroup">
          <span>{"{"}</span>
          <input
            type="text"
            placeholder="10, 20, 30"
            value={unionInputs.set1}
            onChange={(e) => setUnionInputs({ ...unionInputs, set1: e.target.value })}
          />
          <span>{"}"}</span>
          <span>∪</span>
          <span>{"{"}</span>
          <input
            type="text"
            placeholder="20, 40, 50"
            value={unionInputs.set2}
            onChange={(e) => setUnionInputs({ ...unionInputs, set2: e.target.value })}
          />
          <span>{"}"}</span>
          <span>=</span>
          <span>{"{"}</span>
          <input type="text" value={unionResult} readOnly />
          <span>{"}"}</span>
        </div>
        <div className="buttons">
          <button type="submit" className="submit">Submit</button>
          <button type="button" onClick={() => clearForm("union")} className="clear">Clear</button>
        </div>
      </form>

      <form className="formContainer intersection-container" onSubmit={(e) => { e.preventDefault(); handleCalculate("intersection"); }}>
        <h4>Intersection</h4>
        <div className="inputGroup">
          <span>{"{"}</span>
          <input
            type="text"
            placeholder="10, 20, 30"
            value={intersectionInputs.set1}
            onChange={(e) => setIntersectionInputs({ ...intersectionInputs, set1: e.target.value })}
          />
          <span>{"}"}</span>
          <span>∩</span>
          <span>{"{"}</span>
          <input
            type="text"
            placeholder="20, 40, 50"
            value={intersectionInputs.set2}
            onChange={(e) => setIntersectionInputs({ ...intersectionInputs, set2: e.target.value })}
          />
          <span>{"}"}</span>
          <span>=</span>
          <span>{"{"}</span>
          <input type="text" value={intersectionResult} readOnly />
          <span>{"}"}</span>
        </div>
        <div className="buttons">
          <button type="submit" className="submit">Submit</button>
          <button type="button" onClick={() => clearForm("intersection")} className="clear">Clear</button>
        </div>
      </form>
    </div>
  );
};

export default Sets;
