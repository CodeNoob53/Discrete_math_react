import React, { useState } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { solveLinearEquations } from "../apiClient";
import "./../styles/Pages.css";

const SolveLinearEquations = () => {
    const [equations, setEquations] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const validateFields = () => {
        const trimmedEquations = equations.trim();
        if (!trimmedEquations) {
            setError("Field cannot be empty. Please enter at least one equation.");
            return false;
        }

        const equationsArray = trimmedEquations.split("\n").map(eq => eq.trim());
        if (equationsArray.some(eq => !/^[0-9xXyYZz\s+\-=]+$/.test(eq))) {
            setError(
                "Invalid format. Use numbers, variables (x, y), and operators (+, -, =)."
            );
            return false;
        }

        setError("");
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateFields()) return;

        try {
            const equationsArray = equations
                .split("\n")
                .map(eq => eq.trim())
                .filter(eq => eq !== "");

            console.log("Sending data to server:", JSON.stringify({ equations: equationsArray }));

            const solution = await solveLinearEquations(equationsArray);

            console.log("Received response from server:", solution);
            if (solution && typeof solution === "object") {
                setResult(solution);
            } else {
                setResult(null);
                setError("Invalid solution format received from the server.");
            }
        } catch (err) {
            console.error("Error response from server:", err.response?.data || err.message);
            setError(err.response?.data?.error || "Server error occurred.");
        }
    };

    const clearForm = () => {
        setEquations("");
        setResult(null);
        setError("");
    };

    return (
        <div className="formContainer">
            <h3>Solve Linear Equations</h3>
            {error && <p className="flashMessage show">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="formCol">
                    <label htmlFor="equations">Enter equations (one per line):</label>
                    <textarea
                        id="equations"
                        value={equations}
                        onChange={(e) => setEquations(e.target.value)}
                        placeholder="e.g., 3x + 2y = 3\n2y = 2x + 8"
                    />
                </div>
                <div className="buttons">
                    <button type="submit">Solve</button>
                    <button type="button" className="clear" onClick={clearForm}>
                        Clear
                    </button>
                </div>
            </form>
            {result ? (
                <div className="result show">
                    <h4>Solution:</h4>
                    <p>{`x = ${result.x}`}</p>
                    <p>{`y = ${result.y}`}</p>
                    <p>{`y = ${result.z}`}</p>
                </div>
            
            ) : null}
            <div className="form-instruction">
                <h4>Solve a system of linear equations. Example:</h4>
                <div className="example-box">
                    <MathJaxContext>
                        <MathJax inline>
                            {"\\[ \\begin{cases} 3x + 2y = 3 \\\\ 2y = 2x + 8 \\end{cases} \\]"}
                        </MathJax>
                    </MathJaxContext>
                    <p>Enter the equations in the input field as:</p>
                    <pre>3x + 2y = 3</pre>
                    <pre>2y = 2x + 8</pre>
                </div>
            </div>
        </div>
    );
};

export default SolveLinearEquations;
