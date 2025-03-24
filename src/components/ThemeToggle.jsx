import React from 'react';
import '../styles/ThemeToggle.css';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDarkTheme, toggleTheme } = useTheme();

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