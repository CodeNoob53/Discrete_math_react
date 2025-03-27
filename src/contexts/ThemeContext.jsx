// Переконаємося, що функціонал ThemeContext працює належним чином з новим Header
import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

// Створюємо контекст
const ThemeContext = createContext();

// Хук для використання теми в компонентах
export const useTheme = () => useContext(ThemeContext);

// Провайдер теми
export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true; // За замовчуванням темна тема
  });

  const toggleTheme = () => {
    // Додаємо клас "theme-transition-active" перед зміною теми
    document.body.classList.add('theme-transition-active');
    
    // Змінюємо тему
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    // Через 500ms (після завершення переходу) видаляємо клас
    setTimeout(() => {
      document.body.classList.remove('theme-transition-active');
    }, 500);
  };

  // Застосовуємо тему до body
  useEffect(() => {
    document.body.className = isDarkTheme ? 'dark-theme' : 'light-theme';
    // Додаємо клас transition active при першому завантаженні
    document.body.classList.add('theme-transition-active');
    
    // Через 500ms видаляємо клас
    const timer = setTimeout(() => {
      document.body.classList.remove('theme-transition-active');
    }, 500);
    
    return () => clearTimeout(timer);
  }, [isDarkTheme]);

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ThemeContext;