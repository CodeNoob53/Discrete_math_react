import React, { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import { Copy } from 'lucide-react';
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import "./Result.css";

const Result = ({ result, title = "Result:" }) => {
  const [visible, setVisible] = useState(false);
  const [previousResult, setPreviousResult] = useState(null);
  const [alreadyVisible, setAlreadyVisible] = useState(false);
  const resultRef = useRef(null);
  
  // Ефект для контролю появи/зникнення результату
  useEffect(() => {
    if (result !== null && result !== undefined) {
      // Якщо компонент вже видимий, просто оновлюємо вміст без повторної анімації
      if (visible) {
        setPreviousResult(result);
      } else {
        // Зберігаємо попередній результат і показуємо з анімацією
        setPreviousResult(result);
        setAlreadyVisible(true);
        
        // Затримка перед показом для плавності
        setTimeout(() => {
          setVisible(true);
        }, 50);
      }
    } else {
      // Приховуємо результат
      setVisible(false);
      
      // Після закінчення анімації скидаємо флаг
      setTimeout(() => {
        setAlreadyVisible(false);
      }, 500);
    }
  }, [result, visible]);

  // Функція для конвертації результату в текстовий формат
  const resultToText = () => {
    const currentResult = result || previousResult;
    if (currentResult === null || currentResult === undefined) return "";
    
    // Якщо результат є масивом (матриця)
    if (Array.isArray(currentResult) && Array.isArray(currentResult[0])) {
      return currentResult.map(row => row.join(" ")).join("\n");
    }
    // Якщо результат є масивом (вектор)
    else if (Array.isArray(currentResult)) {
      return currentResult.join(" ");
    }
    // Якщо результат є числом чи рядком
    return String(currentResult);
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
        console.log("Result copied to clipboard");
        // Можна додати візуальний зворотній зв'язок
        const button = document.querySelector('.result-copy-button');
        if (button) {
          const originalText = button.innerHTML;
          button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!';
          setTimeout(() => {
            button.innerHTML = originalText;
          }, 2000);
        }
      })
      .catch(err => {
        console.error("Error copying result:", err);
      });
  };

  // Перевірка, чи це числовий результат (включаючи 0)
  const isNumericResult = (value) => {
    return typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)));
  };

  // Якщо немає ні поточного, ні попереднього результату - не показуємо компонент
  if (result === null && result === undefined && previousResult === null) return null;

  const currentResult = result !== null && result !== undefined ? result : previousResult;
  
  // Додаткова перевірка для безпеки
  if (currentResult === null || currentResult === undefined) return null;

  // Визначаємо клас на основі того, чи була вже анімація
  const animationClass = alreadyVisible ? 'content-change' : (visible ? 'show' : 'hide');

  return (
    <div ref={resultRef} className={`result ${animationClass}`}>
      <h5>{title}</h5>
      <Tippy content="Copy result">
        <button type="button" className="result-copy-button" onClick={copyResult}>
          <Copy size={16} /> Copy
        </button>
      </Tippy>

      <div className="result-wrapper">
        {Array.isArray(currentResult) ? (
          // MathJax відображення для матриць і векторів
          <MathJaxContext>
            <div className="result-latex">
              <MathJax key={JSON.stringify(currentResult)}>
                {`\\(${matrixToLatex(currentResult)}\\)`}
              </MathJax>
            </div>
          </MathJaxContext>
        ) : (
          // Покращене відображення для скалярних значень та рядків
          <div className="result-text">
            {isNumericResult(currentResult) ? (
              <MathJaxContext>
                <MathJax key={String(currentResult)}>{`\\(${currentResult}\\)`}</MathJax>
              </MathJaxContext>
            ) : (
              String(currentResult)
            )}
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