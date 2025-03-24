import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SplashScreen from './components/SplashScreen';
import LoadingScreen from './components/LoadingScreen';
import { ThemeProvider } from './contexts/ThemeContext';

const AppWrapper = ({ children }) => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  // Логіка для Splash Screen і Loading Screen
  useEffect(() => {
    // Перевіряємо, чи має показуватись SplashScreen
    const splashShown = sessionStorage.getItem('splashScreenShown');
    
    if (!splashShown) {
      // Якщо splash ще не показували в цій сесії, показуємо його
      setShowSplash(true);
      // Відзначаємо, що splash показали в цій сесії
      sessionStorage.setItem('splashScreenShown', 'true');
    } else {
      // Інакше показуємо LoadingScreen
      setIsLoading(true);
      
      const timer = setTimeout(() => {
        setIsLoading(false);
        setIsAppReady(true); // Показуємо основний контент тільки після завершення LoadingScreen
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Обробник для перезавантаження сторінки
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Встановлюємо флаг, що сторінка перезавантажується
      sessionStorage.setItem('pageReloaded', 'true');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Перевіряємо, чи було перезавантаження
    const wasReloaded = sessionStorage.getItem('pageReloaded') === 'true';
    const splashShown = sessionStorage.getItem('splashScreenShown') === 'true';
    
    if (wasReloaded && splashShown && !showSplash) {
      // Якщо сторінка була перезавантажена (а не новий запуск сесії)
      setIsLoading(true);
      sessionStorage.removeItem('pageReloaded');
      
      const timer = setTimeout(() => {
        setIsLoading(false);
        setIsAppReady(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [showSplash]);

  // Обробник завершення SplashScreen
  const handleSplashFinished = () => {
    setShowSplash(false);
    
    // Відразу показуємо додаток без LoadingScreen
    setIsAppReady(true);
  };

  return (
    <ThemeProvider>
      {showSplash && (
        <SplashScreen onFinished={handleSplashFinished} />
      )}
      
      {isLoading && !showSplash && !isAppReady && (
        <LoadingScreen />
      )}
      
      {/* Показуємо основний контент лише тоді, коли isAppReady = true 
          і немає ні SplashScreen, ні LoadingScreen */}
      {isAppReady && !showSplash && children}
    </ThemeProvider>
  );
};

AppWrapper.propTypes = {
  children: PropTypes.node.isRequired
};

export default AppWrapper;