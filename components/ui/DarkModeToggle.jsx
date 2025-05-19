// components/ui/DarkModeToggle.jsx - Optimized version
import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from './icons';

const DarkModeToggle = () => {
  // Initialize with null to prevent flash of incorrect state
  const [isDarkMode, setIsDarkMode] = useState(null);
  
  // Initialize theme state with proper synchronization
  useEffect(() => {
    // Get current theme from document attribute
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    // Set dark mode state based on current theme
    setIsDarkMode(currentTheme === 'dark');
    
    // Set up event listener for theme changes from other sources
    const handleThemeChange = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDarkMode(theme === 'dark');
    };
    
    // Listen for changes in the data-theme attribute
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
    
    // Start observing the document element
    observer.observe(document.documentElement, { attributes: true });
    
    // Clean up observer on component unmount
    return () => observer.disconnect();
  }, []);
  
  const toggleDarkMode = () => {
    // Only toggle if state has been initialized
    if (isDarkMode !== null) {
      const newTheme = isDarkMode ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      setIsDarkMode(!isDarkMode);
    }
  };
  
  // Don't render until state is initialized
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
      {/* Both icons are always in the DOM */}
      <MoonIcon 
        size={15} 
        color="#FFFFFF" 
        className="dark-mode-toggle__moon-icon" 
      />
      
      {/* Moving circle */}
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