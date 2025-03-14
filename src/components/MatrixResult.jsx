import React from "react";
import PropTypes from 'prop-types';
import { Copy } from 'lucide-react';
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const MatrixResult = ({ result }) => {
  // Функція для конвертації результату в текстовий формат (сумісний з форматом вводу)
  const resultToText = () => {
    if (!result) return "";
    
    // Якщо результат є масивом (матриця)
    if (Array.isArray(result) && Array.isArray(result[0])) {
      return result.map(row => row.join(" ")).join("\n");
    }
    // Якщо результат є числом чи рядком
    return result.toString();
  };

  // Функція для конвертації матриці в LaTeX формат
  const matrixToLatex = (matrix) => {
    if (!Array.isArray(matrix) || !Array.isArray(matrix[0])) {
      return `\\(${matrix}\\)`;
    }

    const rows = matrix.map(row => row.join(" & ")).join(" \\\\ ");
    return `\\begin{pmatrix} ${rows} \\end{pmatrix}`;
  };

  // Функція для копіювання результату в буфер обміну
  const copyResult = () => {
    const textToCopy = resultToText();
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        console.log("Результат скопійовано в буфер обміну");
      })
      .catch(err => {
        console.error("Помилка при копіюванні результату:", err);
      });
  };

  if (!result) return null;

  return (
    <div className="result show">
      <h5>Результат:</h5>
      <Tippy content="Копіювати результат">
        <button type="button" className="result-copy-button" onClick={copyResult}>
          <Copy size={16} /> Копіювати
        </button>
      </Tippy>

      <div className="matrix-result-wrapper">
        {/* Тільки MathJax відображення */}
        <MathJaxContext>
          <div className="matrix-latex">
            <MathJax>
              {`\\(${Array.isArray(result) && Array.isArray(result[0]) 
                ? matrixToLatex(result) 
                : result}\\)`}
            </MathJax>
          </div>
        </MathJaxContext>
      </div>
    </div>
  );
};

MatrixResult.propTypes = {
  result: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    PropTypes.number,
    PropTypes.string,
  ])
};

export default MatrixResult;