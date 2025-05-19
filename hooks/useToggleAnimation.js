// hooks/useToggleAnimation.js
import { useEffect, useRef } from 'react';

/**
 * A custom hook that manages toggle animation states with optimal performance.
 * Handles browser repaints and css transition management.
 * 
 * @returns {{elementRef: React.RefObject, animateToggle: (isActive: boolean) => void}}
 */
export function useToggleAnimation() {
  const elementRef = useRef(null);

  const forceRepaint = (element) => {
    if (!element) return;
    
   
    const reflow = element.offsetHeight;
    
   
    requestAnimationFrame(() => {
      element.classList.add('force-repaint');
      
      requestAnimationFrame(() => {
        element.classList.remove('force-repaint');
      });
    });
  };

  /**
   * Applies animation classes based on toggle state
   * Ensures proper class management and cleanup
   * 
   * @param {boolean} isActive Current active state
   */
  const animateToggle = (isActive) => {
    if (!elementRef.current) return;
    
    const element = elementRef.current;
    
    
    forceRepaint(element);
    
    element.classList.remove('animate-toggle-on', 'animate-toggle-off');
    
    requestAnimationFrame(() => {
      element.classList.add(isActive ? 'animate-toggle-on' : 'animate-toggle-off');
    });
    
    const cleanupClasses = () => {
      if (element) {
        element.classList.remove('animate-toggle-on', 'animate-toggle-off');
      }
    };
    
    element.addEventListener('animationend', cleanupClasses, { once: true });
  };

  useEffect(() => {
    return () => {
      if (elementRef.current) {
        const element = elementRef.current;
        element.classList.remove('animate-toggle-on', 'animate-toggle-off', 'force-repaint');
        
        element.removeEventListener('animationend', () => {});
        element.removeEventListener('transitionend', () => {});
      }
    };
  }, []);

  return { elementRef, animateToggle };
}