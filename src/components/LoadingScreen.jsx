import React, { useMemo } from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import '../styles/LoadingScreen.css';

const formulas = [
  '\\sum_{k=1}^n k^2 = \\frac{n(n+1)(2n+1)}{6}',
  '(p \\land q) \\to r',
  '\\phi \\land (\\phi \\to \\psi) \\vdash \\psi',
  '\\varnothing \\subseteq A',
  'A \\cup B = B \\cup A',
  '\\gcd(a, b) = \\gcd(b, a \\bmod b)',
  'a_n = 3a_{n-1} + 2a_{n-2}',
  '\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)',
  'e^{i\\pi} + 1 = 0',
  '\\frac{d}{dx} e^x = e^x',
  '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1',
  '\\sum_{n=0}^{\\infty} \\frac{1}{n!} = e',
  '\\int_{0}^{\\infty} e^{-x^2} \\, dx = \\frac{\\sqrt{\\pi}}{2}',
  '\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\epsilon_0}',
  '\\frac{d}{dx} \\ln x = \\frac{1}{x}',
  '\\sum_{k=0}^{n-1} ar^k = a \\frac{1-r^n}{1-r}',
  '\\oint_{C} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_{S} (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S}'
];

// Випадковий кут від 0 до 360
function getRandomAngle() {
  return Math.random() * 360;
}

// Отримати X, Y за кутом (angleDeg) і радіусом (radius)
function polarToCartesian(angleDeg, radius) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: radius * Math.cos(rad),
    y: radius * Math.sin(rad),
  };
}

const LoadingScreen = () => {
  // Запам’ятовуємо (start, end) для кожної формули, щоб не змінювались при кожному ререндері
  const positions = useMemo(() => {
    return formulas.map(() => {
      const angle = getRandomAngle();

      // Початкова радіальна відстань: від 150px до 250px
      // (мертва зона 0..150px, де формули не з’являються)
      const startRadius = 250 + Math.random() * 100; // 150..250

      // Кінцева відстань: від 300px до 500px
      // (формули відлітають значно далі)
      const endRadius = 300 + Math.random() * 200; // 300..500

      // Координати для старту та кінця
      const start = polarToCartesian(angle, startRadius);
      const end = polarToCartesian(angle, endRadius);

      return { start, end };
    });
  }, []);

  return (
    <div className="loading-screen">
      {/* Куб-спінер */}
      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* Заголовок */}
      <h1 className="loading-header">
        Discrete
        <span className="loading-sub-header">Math Calc</span>
      </h1>

      <MathJaxContext>
        {formulas.map((formula, index) => {
          const { start, end } = positions[index];

          // Встановлюємо CSS-змінні для анімації
          const style = {
            '--start-x': `${start.x}px`,
            '--start-y': `${start.y}px`,
            '--end-x': `${end.x}px`,
            '--end-y': `${end.y}px`,
            // Невелика затримка, щоб формули з’являлися не всі одночасно
            animationDelay: `${index * 0.15}s`,
          };

          return (
            <div key={index} className="floating-formula" style={style}>
              <MathJax>{`\\[${formula}\\]`}</MathJax>
            </div>
          );
        })}
      </MathJaxContext>
    </div>
  );
};

export default LoadingScreen;
