import React, { useEffect, useState } from 'react';
import '../styles/LoadingScreen.css';
import { useTheme } from '../contexts/ThemeContext';

const LoadingScreen = () => {
  const { isDarkTheme } = useTheme();
  const [pageName, setPageName] = useState('Калькулятор дискретної математики');
  
  // Отримуємо поточний шлях з window.location
  useEffect(() => {
    const pathname = window.location.pathname;
    
    const pathMap = {
      '/': 'Головна сторінка',
      '/sets': 'Множини',
      '/decrypt': 'Дешифрування повідомлень',
      '/hamming': 'Код Хеммінга',
      '/validate_checksum': 'Перевірка контрольної суми',
      '/combinatorics': 'Комбінаторика',
      '/cache_calc': 'Калькулятор кеш-пам\'яті',
      '/solve_linear_equations': 'Розв\'язання лінійних рівнянь',
      '/vectors': 'Операції з векторами',
      '/matrix': 'Операції з матрицями'
    };
    
    setPageName(pathMap[pathname] || 'Калькулятор дискретної математики');
    
    // Логування для налагодження
    console.log('LoadingScreen рендериться', {
      pathname,
      pageName: pathMap[pathname] || 'Калькулятор дискретної математики',
      isDarkTheme
    });
  }, [isDarkTheme]); // Додана залежність isDarkTheme

  return (
    <div className={`loading-screen ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      <div className="loading-content">
        {/* Логотип як у SplashScreen */}
        <div className="logo-container">
          <div className="logo">
            <span className="logo-fx">fx</span>
            <div className="logo-divider">|</div>
            <div className="logo-text">
              <div className="logo-text-main">DISCRETE MATH</div>
              <div className="logo-text-sub">CALC EVERYTHING</div>
            </div>
          </div>
        </div>
        
        <div className="loading-text">
          <h2>Завантаження...</h2>
          <p className="page-name">{pageName}</p>
        </div>
      </div>
      
      {/* Винесений лоадер внизу екрану */}
      <div className="bottom-loader-container">
        {/* Стилізований лоадер */}
        <div className="loader">
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;