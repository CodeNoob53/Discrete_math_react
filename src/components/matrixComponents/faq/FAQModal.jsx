import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MathJax } from 'better-react-mathjax';
import './FAQModal.css';
import { X, Calculator, Plus, Minus, X as Multiply, Divide, Hash, Percent, ArrowRightLeft, Square, ChevronDown, ChevronUp, Keyboard, AlertCircle, BookOpen } from 'lucide-react';

// Компонент акордеону
const Accordion = ({ title, icon, isOpen, onToggle, children }) => {
  return (
    <div className="faq-accordion">
      <div className="faq-accordion-header" onClick={onToggle}>
        <div className="faq-accordion-title">
          {icon && <span className="faq-accordion-icon">{icon}</span>}
          <h3>{title}</h3>
        </div>
        <button className="faq-accordion-toggle">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      {isOpen && <div className="faq-accordion-content">{children}</div>}
    </div>
  );
};

Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

const FAQModal = ({ isOpen, onClose }) => {
  const [accordions, setAccordions] = useState({
    basics: true,      // Відкритий за замовчуванням
    operations: false,
    shortcuts: false,
    tips: false,
  });

  const toggleAccordion = (key) => {
    setAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="faq-modal-overlay" onClick={onClose}>
      <div className="faq-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="faq-modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <h2 className="faq-modal-title">Довідка з роботи з матрицями</h2>

        <div className="faq-scroll-container">
          {/* Секція 1: Основи роботи з матрицями */}
          <Accordion
            title="Основи роботи з матрицями"
            icon={<Calculator size={20} />}
            isOpen={accordions.basics}
            onToggle={() => toggleAccordion('basics')}
          >
            <div className="faq-content">
              <h4>Як вводити матриці</h4>
              <ul>
                <li>Для десяткових чисел використовуйте <strong className="keyword-o">крапку (.)</strong>, наприклад: 3.14.</li>
                <li>Розділяйте елементи в рядку <strong className="keyword-o">пробілом</strong>.</li>
                <li>Для нового рядка натисніть <strong className="keyword-o">Enter</strong>.</li>
                <li>Від’ємні числа позначайте <strong className="keyword-o">мінусом (-)</strong>, наприклад: -5.</li>
                <li>Порожні клітинки автоматично заповнюються нулями.</li>
              </ul>

              <h4>Редагування матриць</h4>
              <ul>
                <li>Клацніть на матрицю, щоб активувати кнопки керування.</li>
                <li>Додавайте або видаляйте рядки та стовпці кнопками <strong>&quot;Add&quot;</strong> і <strong>&quot;Del.&quot;</strong>.</li>
                <li>Копіюйте (<strong>&quot;Copy&quot;</strong>) та вставляйте (<strong>&quot;Paste&quot;</strong>) матриці через буфер обміну.</li>
                <li>Для видалення порожнього рядка чи стовпця натисніть <strong className="keyword-o">Ctrl+Backspace</strong>.</li>
              </ul>
            </div>
          </Accordion>

          {/* Секція 2: Доступні операції */}
          <Accordion
            title="Доступні операції"
            icon={<Hash size={20} />}
            isOpen={accordions.operations}
            onToggle={() => toggleAccordion('operations')}
          >
            <div className="faq-operations-grid">
              <div className="faq-operation-item">
                <div className="faq-operation-header">
                  <Plus size={18} />
                  <h4>Додавання</h4>
                </div>
                <p>Додає кілька матриць однакового розміру.</p>
                <div className="faq-formula">
                  <MathJax>{"\\(C = A + B, \\text{ де } c_{ij} = a_{ij} + b_{ij}\\)"}</MathJax>
                </div>
              </div>

              <div className="faq-operation-item">
                <div className="faq-operation-header">
                  <Minus size={18} />
                  <h4>Віднімання</h4>
                </div>
                <p>Віднімає матриці однакового розміру послідовно.</p>
                <div className="faq-formula">
                  <MathJax>{"\\(C = A - B, \\text{ де } c_{ij} = a_{ij} - b_{ij}\\)"}</MathJax>
                </div>
              </div>

              <div className="faq-operation-item">
                <div className="faq-operation-header">
                  <Multiply size={18} />
                  <h4>Множення</h4>
                </div>
                <p>Множить дві матриці, де стовпці першої дорівнюють рядкам другої.</p>
                <div className="faq-formula">
                  <MathJax>{"\\(C = A \\times B, \\text{ де } c_{ij} = \\sum_k a_{ik} \\cdot b_{kj}\\)"}</MathJax>
                </div>
              </div>

              <div className="faq-operation-item">
                <div className="faq-operation-header">
                  <Percent size={18} />
                  <h4>Множення на скаляр</h4>
                </div>
                <p>Множить усі елементи матриці на задане число.</p>
                <div className="faq-formula">
                  <MathJax>{"\\(C = k \\cdot A, \\text{ де } c_{ij} = k \\cdot a_{ij}\\)"}</MathJax>
                </div>
              </div>

              <div className="faq-operation-item">
                <div className="faq-operation-header">
                  <Hash size={18} />
                  <h4>Визначник</h4>
                </div>
                <p>Обчислює визначник квадратної матриці.</p>
                <div className="faq-formula">
                  <MathJax>{"\\(\\det(A)\\)"}</MathJax>
                </div>
              </div>

              <div className="faq-operation-item">
                <div className="faq-operation-header">
                  <ArrowRightLeft size={18} />
                  <h4>Обернена матриця</h4>
                </div>
                <p>Знаходить обернену матрицю, якщо визначник ≠ 0.</p>
                <div className="faq-formula">
                  <MathJax>{"\\(A^{-1} = \\frac{\\text{adj}(A)}{\\det(A)}\\)"}</MathJax>
                </div>
              </div>

              <div className="faq-operation-item">
                <div className="faq-operation-header">
                  <ArrowRightLeft size={18} />
                  <h4>Приєднана матриця</h4>
                </div>
                <p>Обчислює приєднану (ад’юнкту) квадратної матриці.</p>
                <div className="faq-formula">
                  <MathJax>{"\\(\\text{adj}(A)_{ij} = (-1)^{i+j} \\cdot \\det(M_{ji})\\)"}</MathJax>
                </div>
              </div>

              <div className="faq-operation-item">
                <div className="faq-operation-header">
                  <Divide size={18} />
                  <h4>Ділення</h4>
                </div>
                <p>Ділить матриці як A × B⁻¹, друга матриця має бути квадратною.</p>
                <div className="faq-formula">
                  <MathJax>{"\\(A / B = A \\cdot B^{-1}\\)"}</MathJax>
                </div>
              </div>

              <div className="faq-operation-item">
                <div className="faq-operation-header">
                  <Hash size={18} />
                  <h4>Ранг</h4>
                </div>
                <p>Визначає ранг матриці за допомогою метода Гаусса.</p>
                <div className="faq-formula">
                  <MathJax>{"\\(\\text{rank}(A)\\)"}</MathJax>
                </div>
              </div>

              <div className="faq-operation-item">
                <div className="faq-operation-header">
                  <Square size={18} />
                  <h4>Розв’язання СЛАР</h4>
                </div>
                <p>Розв’язує систему лінійних рівнянь методом Гаусса.</p>
                <div className="faq-formula">
                  <MathJax>{"\\(A \\cdot \\vec{x} = \\vec{b}\\)"}</MathJax>
                </div>
              </div>
            </div>
          </Accordion>

          {/* Секція 3: Клавіатурні скорочення */}
          <Accordion
            title="Клавіатурні скорочення"
            icon={<Keyboard size={20} />}
            isOpen={accordions.shortcuts}
            onToggle={() => toggleAccordion('shortcuts')}
          >
            <div className="faq-keyboard-shortcuts">
              <ul>
                <li><strong className="keyword-o">Пробіл</strong> — додає новий стовпець у поточному рядку.</li>
                <li><strong className="keyword-o">Enter</strong> — додає новий рядок у матриці.</li>
                <li><strong className="keyword-o">Ctrl+Backspace</strong> — видаляє порожній рядок або стовпець.</li>
                <li><strong className="keyword-o">Ctrl+C</strong> — копіює матрицю в буфер обміну.</li>
                <li><strong className="keyword-o">Ctrl+V</strong> — вставляє матрицю з буфера обміну.</li>
              </ul>
            </div>
          </Accordion>

          {/* Секція 4: Поради */}
          <Accordion
            title="Корисні поради"
            icon={<Plus size={20} />}
            isOpen={accordions.tips}
            onToggle={() => toggleAccordion('tips')}
          >
            <div className="faq-tips">
              <ul>
                <li>Для швидкого очищення форми натисніть <strong>&quot;Clear&quot;</strong>.</li>
                <li>Копіюйте великі матриці з таблиць (наприклад, Excel) через <strong>&quot;Paste&quot;</strong>.</li>
                <li>Для СЛАР додайте стовпець вільних членів праворуч від матриці коефіцієнтів.</li>
                <li>Перевіряйте розмірність матриць перед операціями множення чи ділення.</li>
                <li>Використовуйте десяткові дроби замість звичайних для точних обчислень.</li>
              </ul>
            </div>
          </Accordion>
          <Accordion title="Поширені помилки" icon={<AlertCircle size={20} />} isOpen={accordions.errors} onToggle={() => toggleAccordion('errors')}>
            <ul>
              <li>Введення коми замість крапки у десяткових числах.</li>
              <li>Неправильна розмірність для операцій множення.</li>
              <li>Спроба обчислення оберненої матриці при визначнику = 0.</li>
            </ul>
          </Accordion>

          <Accordion title="Приклади матриць" icon={<BookOpen size={20} />} isOpen={accordions.examples} onToggle={() => toggleAccordion('examples')}>
            <div>
              <p>2x2 матриця:</p>
              <MathJax>{'\\[ \\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix} \\]'}</MathJax>
              <p>3x3 одинична матриця:</p>
              <MathJax>{'\\[ \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{bmatrix} \\]'}</MathJax>
            </div>
          </Accordion>

          <div className="faq-modal-footer">
            <button className="faq-modal-close-button" onClick={onClose}>Закрити</button>
          </div>
        </div>
      </div>
    </div>
  );
};

FAQModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FAQModal;