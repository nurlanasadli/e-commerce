import React from 'react';

export const CategoryButton = React.memo(({ category, isActive, onClick }) => {
  const handleClick = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const currentScrollY = window.scrollY;
    
    requestAnimationFrame(() => {
      onClick(category);
      
      requestAnimationFrame(() => {
        window.scrollTo(0, currentScrollY);
      });
    });
  }, [category, onClick]);
  
  return (
    <button
      className={`category-button ${isActive ? 'category-button--active' : ''}`}
      onClick={handleClick}
      type="button"
      aria-pressed={isActive}
      role="tab"
      style={{
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        WebkitTouchCallout: 'none'
      }}
    >
      {category === 'all' ? 'Hamısı' : category.charAt(0).toUpperCase() + category.slice(1)}
    </button>
  );
});

CategoryButton.displayName = 'CategoryButton';