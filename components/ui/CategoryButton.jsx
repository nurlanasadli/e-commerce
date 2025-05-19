// components/sections/CategoryButton.jsx
import React from 'react';

// Optimallaşdırılmış Category Button komponenti
export const CategoryButton = React.memo(({ category, isActive, onClick }) => {
  // Click hadisəsini idarə edən funksiya - requestAnimationFrame ilə optimallaşdırılmış
  const handleClick = React.useCallback(() => {
    requestAnimationFrame(() => {
      onClick(category);
    });
  }, [category, onClick]);
  
  return (
    <button
      className={`category-button ${isActive ? 'category-button--active' : ''}`}
      onClick={handleClick}
      type="button"
    >
      {category === 'all' ? 'Hamısı' : category.charAt(0).toUpperCase() + category.slice(1)}
    </button>
  );
});

CategoryButton.displayName = 'CategoryButton';