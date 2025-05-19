import { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import '../styles/main.css';
import { ProductProvider } from '../contexts/ProductContext';

export default function App({ Component, pageProps }) {
  // Dark mode initialization on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Helper function to set theme
        const applyTheme = (theme) => {
          document.documentElement.setAttribute('data-theme', theme);
          localStorage.setItem('theme', theme);
        };
        
        // Check if user has a theme preference in localStorage
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
          // Use saved theme preference
          applyTheme(savedTheme);
        } else {
          // Check if user prefers dark mode at OS level
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          // Apply theme based on OS preference
          applyTheme(prefersDark ? 'dark' : 'light');
        }
        
        // Listen for OS theme preference changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleColorSchemeChange = (e) => {
          // Only apply OS preference if no saved theme exists
          if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
          }
        };
        
        // Modern event listener
        mediaQuery.addEventListener('change', handleColorSchemeChange);
        
        // Cleanup
        return () => {
          mediaQuery.removeEventListener('change', handleColorSchemeChange);
        };
      } catch (error) {
        console.error('Error initializing theme:', error);
      }
    }
  }, []);
  
  return (
    <ProductProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ProductProvider>
  );
}