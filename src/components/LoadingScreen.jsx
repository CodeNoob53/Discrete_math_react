import React, { useEffect, useState } from 'react';
import styles from '../styles/LoadingScreen.module.css';
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
    <div className={`${styles.loadingScreen} ${isDarkTheme ? styles.darkTheme : styles.lightTheme}`}>
      <div className={styles.loadingContent}>
        {/* Логотип як у SplashScreen */}
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <span className={styles.logoFx}>fx</span>
            <div className={styles.logoDivider}>|</div>
            <div className={styles.logoText}>
              <div className={styles.logoTextMain}>DISCRETE MATH</div>
              <div className={styles.logoTextSub}>CALC EVERYTHING</div>
            </div>
          </div>
        </div>
        
        <div className={styles.loadingText}>
          <h2>Завантаження...</h2>
          <p className={styles.pageName}>{pageName}</p>
        </div>
      </div>
      
      {/* Винесений лоадер внизу екрану */}
      <div className={styles.bottomLoaderContainer}>
        {/* Стилізований лоадер */}
        <div className={styles.loader}>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;