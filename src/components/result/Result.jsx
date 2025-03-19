import React from "react";
import PropTypes from 'prop-types';
import { Copy } from 'lucide-react';
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const Result = ({ result, title = "Результат:" }) => {
  // Функція для конвертації результату в текстовий формат (сумісний з форматом вводу)
  const resultToText = () => {
    if (!result) return "";
    
    // Якщо результат є масивом (матриця)
    if (Array.isArray(result) && Array.isArray(result[0])) {
      return result.map(row => row.join(" ")).join("\n");
    }
    // Якщо результат є масивом (вектор)
    else if (Array.isArray(result)) {
      return result.join(",");
    }
    // Якщо результат є числом чи рядком
    return result.toString();
  };

  // Функція для конвертації матриці або вектора в LaTeX формат
  const matrixToLatex = (matrix) => {
    if (!Array.isArray(matrix)) {
      return `${matrix}`;
    }
    
    // Якщо це простий масив чисел (вектор)
    if (Array.isArray(matrix) && !Array.isArray(matrix[0])) {
      // Відобразити як вектор-стовпець
      const elements = matrix.join(" \\\\ ");
      return `\\begin{pmatrix} ${elements} \\end{pmatrix}`;
    }
    
    // Якщо це матриця (масив масивів)
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
      <h5>{title}</h5>
      <Tippy content="Копіювати результат">
        <button type="button" className="result-copy-button" onClick={copyResult}>
          <Copy size={16} /> Копіювати
        </button>
      </Tippy>

      <div className="result-wrapper">
        {Array.isArray(result) ? (
          // MathJax відображення для матриць і векторів
          <MathJaxContext>
            <div className="result-latex">
              <MathJax>
                {`\\(${matrixToLatex(result)}\\)`}
              </MathJax>
            </div>
          </MathJaxContext>
        ) : (
          // Звичайне відображення для скалярних значень та рядків
          <div className="result-text">
            {result}
          </div>
        )}
      </div>
    </div>
  );
};

Result.propTypes = {
  result: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.number,
    PropTypes.string,
  ]),
  title: PropTypes.string
};

export default Result;