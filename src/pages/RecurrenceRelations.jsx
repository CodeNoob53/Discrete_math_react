import React from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import "./../styles/Pages.css";

const RecurrenceRelations = () => {
  const formId = "recurrenceForm";

  return (
    <MathJaxContext>
      <div className="formContainer wrapper">
        <h3>Recurrence Relations</h3>
        <form id={formId}>
          <div className="formGroup">
            <label htmlFor="recurrence_relation" className="math">
              <MathJax inline>{`\\(a_n =\\)`}</MathJax>
            </label>
            <input
              type="text"
              id="recurrence_relation"
              placeholder="3 * a(n-3) + 2 * a(n-2) + a(n-1)"
              style={{ flex: 1 }}
            />
          </div>

          <div className="formGroup">
            <label htmlFor="a_1" className="math">
              <MathJax inline>{`\\(a_1 =\\)`}</MathJax>
            </label>
            <input type="text" id="a_1" name="a_1" className="short" />
            <label htmlFor="a_2" className="math">
              <MathJax inline>{`\\(a_2 =\\)`}</MathJax>
            </label>
            <input type="text" id="a_2" name="a_2" className="short" />
            <label htmlFor="a_3" className="math">
              <MathJax inline>{`\\(a_3 =\\)`}</MathJax>
            </label>
            <input type="text" id="a_3" name="a_3" className="short" />
          </div>

          <div className="result">
            <p>
              <MathJax inline>{`\\(a_4 =\\)`}</MathJax> Example value here
            </p>
            <p>
              <MathJax inline>{`\\(a_5 =\\)`}</MathJax> Example value here
            </p>
            <p>
              <MathJax inline>{`\\(a_6 =\\)`}</MathJax> Example value here
            </p>
            <p>
              <MathJax inline>{`\\(a_7 =\\)`}</MathJax> Example value here
            </p>
            <p>
              <MathJax inline>{`\\(a_8 =\\)`}</MathJax> Example value here
            </p>
            <p>
              <MathJax inline>{`\\(a_9 =\\)`}</MathJax> Example value here
            </p>
            <p>
              <MathJax inline>{`\\(a_{10} =\\)`}</MathJax> Example value here
            </p>
          </div>

          <div className="buttons">

          </div>
        </form>
      </div>
    </MathJaxContext>
  );
};

export default RecurrenceRelations