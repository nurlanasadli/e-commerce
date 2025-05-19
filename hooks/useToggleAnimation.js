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
  
  /**
   * Forces a browser repaint to ensure smooth transitions
   * Uses passive approach to prevent layout thrashing
   */
  const forceRepaint = (element) => {
    if (!element) return;
    
    // Retrieve offsetHeight to force reflow
    // eslint-disable-next-line no-unused-vars
    const reflow = element.offsetHeight;
    
    // Optimize repainting with requestAnimationFrame
    requestAnimationFrame(() => {
      element.classList.add('force-repaint');
      
      // Remove class in next animation frame to avoid blocking
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
    
    // Force repaint for clean transition
    forceRepaint(element);
    
    // Remove existing animation classes
    element.classList.remove('animate-toggle-on', 'animate-toggle-off');
    
    // Apply appropriate animation class
    requestAnimationFrame(() => {
      element.classList.add(isActive ? 'animate-toggle-on' : 'animate-toggle-off');
    });
    
    // Clean up animation classes when transition ends
    const cleanupClasses = () => {
      if (element) {
        element.classList.remove('animate-toggle-on', 'animate-toggle-off');
      }
    };
    
    // Use once: true to avoid memory leaks
    element.addEventListener('animationend', cleanupClasses, { once: true });
  };

  // Cleanup listeners and classes on unmount
  useEffect(() => {
    return () => {
      if (elementRef.current) {
        const element = elementRef.current;
        element.classList.remove('animate-toggle-on', 'animate-toggle-off', 'force-repaint');
        
        // Remove all possible event listeners
        element.removeEventListener('animationend', () => {});
        element.removeEventListener('transitionend', () => {});
      }
    };
  }, []);

  return { elementRef, animateToggle };
}