import React, { useState } from 'react';
import { MathJax, MathJaxContext } from "better-react-mathjax";

import FlashMessage from "../components/FlashMessage/FlashMessage";
import "./../styles/Pages.css";

const SolvingRecurrenceRelations = () => {
  const formId = "recurrenceForm";
  const [recurrenceRelation, setRecurrenceRelation] = useState('');
  const [a1, setA1] = useState('');
  const [a2, setA2] = useState('');
  const [flashMessage, setFlashMessage] = useState('');
  const [result, setResult] = useState(''); // Added state for result

  const validateFields = () => {
    // Видалення пробілів з початку та кінця значень
    const trimmedRecurrenceRelation = recurrenceRelation.trim();
    const trimmedA1 = a1.trim();
    const trimmedA2 = a2.trim();
  
    // Логування введених значень
    console.log("Recurrence Relation:", trimmedRecurrenceRelation);
    console.log("a1:", trimmedA1);
    console.log("a2:", trimmedA2);
  
    // Перевірка на порожні значення
    if (!trimmedRecurrenceRelation || !trimmedA1 || !trimmedA2) {
      console.log("Validation failed: One or more fields are empty.");
      setFlashMessage("All fields are required!");
      return false;
    }
  
    // Перевірка, чи є `a1` та `a2` числами
    if (isNaN(Number(trimmedA1)) || isNaN(Number(trimmedA2))) {
      console.log("Validation failed: a1 or a2 is not a valid number.");
      setFlashMessage("a(1) and a(2) must be valid numbers!");
      return false;
    }
  
    // Якщо всі перевірки пройдені
    console.log("Validation passed: All fields are valid.");
    setFlashMessage("");
    return true;
  };
  
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateFields()) {
      return;
    }

    const data = { recurrence_relation: recurrenceRelation, a_1: a1, a_2: a2 };

    try {
      const response = await fetch('/recurrence_relations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);
      setResult(result.solution); // Assuming API response contains 'solution'
      setFlashMessage("Form submitted successfully!");
    } catch (error) {
      console.error('Error:', error);
      setFlashMessage("An error occurred during submission.");
    }
  };

  const handleClear = () => {
    setRecurrenceRelation('');
    setA1('');
    setA2('');
    setFlashMessage("Form cleared!");
    console.log("Form cleared!");
  };

  return (
    <MathJaxContext>
      <div className="solving-recurrence-relations wrapper">
       <div className='form-header'><h3>Solving Recurrence Relations</h3></div>

        {/* Flash Message */}
        {flashMessage && (<FlashMessage message={flashMessage} clearMessage={() => setFlashMessage("")}/>)}

        <form id="recurrenceForm" onSubmit={handleSubmit}>
          {/* Input for Recurrence Relation */}
          <div className="formGroup">
            <input
              type="text"
              id="recurrence_relation"
              name="recurrence_relation"
              value={recurrenceRelation}
              placeholder="Enter recurrence relation"
              onChange={(e) => setRecurrenceRelation(e.target.value)}
              style={{ flex: 1 }}
            />
            <label htmlFor="recurrence_relation" className="math"><MathJax inline>{`\\(=0\\)`}</MathJax></label>
          </div>

          {/* Fields for a1 and a2 */}
          <div className="formGroup">
            <label htmlFor="a_1" className="math">
              <MathJax inline>{`\\(a_1 =\\)`}</MathJax>
            </label>
            <input
              type="text"
              id="a_1"
              name="a_1"
              className="short"
              value={a1}
              onChange={(e) => setA1(e.target.value)}
            />
            <label htmlFor="a_2" className="math">
              <MathJax inline>{`\\(a_2 =\\)`}</MathJax>
            </label>
            <input
              type="text"
              id="a_2"
              name="a_2"
              className="short"
              value={a2}
              onChange={(e) => setA2(e.target.value)}
            />
          </div>
          {/* Buttons */}
          <div className="buttons">
            <button type="clear" formId={formId} onClear={handleClear} className='clear'>Clear</button>
            <button type="submit">Submit</button>

          </div>
        </form>

        {/* Result */}
        {result && (
          <div className="result">
            <MathJax>{result}</MathJax>
          </div>
        )}
      </div>
    </MathJaxContext>
  );
};

export default SolvingRecurrenceRelations;
