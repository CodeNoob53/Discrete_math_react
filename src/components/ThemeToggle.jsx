import React, { useState, useEffect } from 'react';
import '../styles/ThemeToggle.css';

const ThemeToggle = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
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
    <div className="theme-toggle-container">
      <span className="theme-text">
        {isDarkTheme ? 'Dark Mode' : 'Light Mode'}
      </span>
      <div className="toggle-switch">
        <input
          type="checkbox"
          id="theme-toggle"
          className="checkbox"
          checked={!isDarkTheme}
          onChange={toggleTheme}
        />
        <label htmlFor="theme-toggle" className="switch-label">
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
};

export default ThemeToggle;