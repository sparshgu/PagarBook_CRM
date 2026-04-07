import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggleButton.css';

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className="theme-toggle-btn" onClick={toggleTheme}>
      {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
    </button>
  );
}
