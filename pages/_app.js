import { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import '../styles/main.css';
import { ProductProvider } from '../contexts/ProductContext';

export default function App({ Component, pageProps }) {
  // Theme initialization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const applyTheme = (theme) => {
          document.documentElement.setAttribute('data-theme', theme);
          localStorage.setItem('theme', theme);
        };
        
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
          applyTheme(savedTheme);
        } else {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          applyTheme(prefersDark ? 'dark' : 'light');
        }
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleColorSchemeChange = (e) => {
          if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
          }
        };
        
        mediaQuery.addEventListener('change', handleColorSchemeChange);
        
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