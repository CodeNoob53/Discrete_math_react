import React, { useState, useEffect } from 'react';
import '../styles/ThemeToggle.css';

const ThemeToggle = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  useEffect(() => {
    document.body.className = isDarkTheme ? 'dark-theme' : 'light-theme';
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
