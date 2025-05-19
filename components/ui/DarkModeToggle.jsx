import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from './icons';

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(null);
  
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setIsDarkMode(currentTheme === 'dark');
    
    const handleThemeChange = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDarkMode(theme === 'dark');
    };
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' && 
          mutation.attributeName === 'data-theme'
        ) {
          handleThemeChange();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);
  
  const toggleDarkMode = () => {
    if (isDarkMode !== null) {
      const newTheme = isDarkMode ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      setIsDarkMode(!isDarkMode);
    }
  };
  
  if (isDarkMode === null) {
    return null;
  }
  
  return (
    <button 
      className={`dark-mode-toggle ${isDarkMode ? 'is-dark-mode' : ''}`}
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      type="button"
    >
      <MoonIcon 
        size={15} 
        color="#FFFFFF" 
        className="dark-mode-toggle__moon-icon" 
      />
      
      <div className="dark-mode-toggle__circle" />
      
      <SunIcon 
        size={15} 
        color="#FFFFFF" 
        className="dark-mode-toggle__sun-icon" 
      />
    </button>
  );
};

export default DarkModeToggle;