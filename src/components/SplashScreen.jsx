import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/SplashScreen.css';
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
    <div className={`splash-screen ${isDarkTheme ? 'dark-theme' : 'light-theme'} ${animationComplete ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <div className="logo-container">
          {/* Логотип */}
          <div className="logo">
            <span className="logo-fx">fx</span>
            <div className="logo-divider">|</div>
            <div className="logo-text">
              <div className="logo-text-main">DISCRETE MATH</div>
              <div className="logo-text-sub">CALC EVERYTHING</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Прогрес-бар внизу екрану */}
      <div className="splash-progress-container">
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      </div>
    </div>
  );
};

SplashScreen.propTypes = {
  onFinished: PropTypes.func
};

export default SplashScreen;