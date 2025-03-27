import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/SplashScreen.module.css';
import { useTheme } from '../contexts/ThemeContext';

const SplashScreen = ({ onFinished }) => {
  const [animationComplete, setAnimationComplete] = useState(false);
  const { isDarkTheme } = useTheme();

  useEffect(() => {
    // Встановлюємо таймер для анімації (3 секунди)
    const animationTimer = setTimeout(() => {
      setAnimationComplete(true);
      
      // Викликаємо callback, коли анімація завершилась
      if (onFinished) onFinished();
    }, 3000);

    return () => clearTimeout(animationTimer);
  }, [onFinished]);

  return (
    <div className={`${styles.splashScreen} ${isDarkTheme ? styles.darkTheme : styles.lightTheme} ${animationComplete ? styles.fadeOut : ''}`}>
      <div className={styles.splashContent}>
        <div className={styles.logoContainer}>
          {/* Логотип */}
          <div className={styles.logo}>
            <span className={styles.logoFx}>fx</span>
            <div className={styles.logoDivider}>|</div>
            <div className={styles.logoText}>
              <div className={styles.logoTextMain}>DISCRETE MATH</div>
              <div className={styles.logoTextSub}>CALC EVERYTHING</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Прогрес-бар внизу екрану */}
      <div className={styles.splashProgressContainer}>
        <div className={styles.loadingBar}>
          <div className={styles.loadingProgress}></div>
        </div>
      </div>
    </div>
  );
};

SplashScreen.propTypes = {
  onFinished: PropTypes.func
};

export default SplashScreen;