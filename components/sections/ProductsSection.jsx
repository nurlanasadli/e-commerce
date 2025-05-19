// components/sections/ProductsSection.jsx

import React, { useEffect } from 'react';
import Card from '../ui/Card';
import ProductCard from '../ui/ProductCard';
import { CategoryButton } from '../ui/CategoryButton';
import { useProductContext } from '../../contexts/ProductContext';

// Memoized CategoryButton
const MemoizedCategoryButton = React.memo(CategoryButton);

const ProductsSection = ({ products = [] }) => {
  // Get everything we need from context
  const {
    isLoading,
    setProductsData,
    categories,
    activeCategory,
    changeCategory,
    normalizedProducts
  } = useProductContext();
  
  // Load products into context
  useEffect(() => {
    setProductsData(products);
  }, [products, setProductsData]);
  
  useEffect(() => {
  // Aktiv kategori dəyişəndə və ya səhifə yükləndikdə
  const scrollToActiveCategory = () => {
    const filtersContainer = document.querySelector('.products-section__filters');
    const activeButton = document.querySelector('.category-button--active');
    
    if (filtersContainer && activeButton) {
      // Kiçik ekranlarda həmişə scroll-u sıfırlayırıq
      if (window.innerWidth <= 480) {
        // Sıfır pozisiyasına scroll
        filtersContainer.scrollLeft = 0;
      } else if (activeCategory === categories[0]) {
        // İlk kategori aktiv olduqda da sıfır pozisiyasına scroll
        filtersContainer.scrollLeft = 0;
      } else {
        // Digər hallarda mərkəzləşdirmə
        const containerWidth = filtersContainer.offsetWidth;
        const buttonLeft = activeButton.offsetLeft;
        const buttonWidth = activeButton.offsetWidth;
        
        const scrollTo = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
        
        filtersContainer.scrollTo({
          left: Math.max(0, scrollTo),
          behavior: 'smooth'
        });
      }
    }
  };

  // İlkin scroll - komponent mount olduqdan sonra işə salınır
  const initialScrollTimeout = setTimeout(scrollToActiveCategory, 100);
  
  // Əlavə təminat - touch cihazlar üçün məcburi scroll reset
  const forceScrollReset = setTimeout(() => {
    const filtersContainer = document.querySelector('.products-section__filters');
    if (filtersContainer) {
      filtersContainer.scrollLeft = 0;
    }
  }, 300);
  
  // Window resize event-i zamanı yenidən hesablama
  window.addEventListener('resize', scrollToActiveCategory);
  
  // Cleanup - komponent unmount olduqda
  return () => {
    window.removeEventListener('resize', scrollToActiveCategory);
    clearTimeout(initialScrollTimeout);
    clearTimeout(forceScrollReset);
  };
}, [activeCategory, categories]);
  
  if (isLoading) {
    return (
      <section className="products-section">
        <div className="container">
          <div className="products-section__header">
            <div className="products-section__title-container">
              <span className="products-section__subheading">Xüsusi təkliflər</span>
              <h2 className="products-section__title">Payız gəldi, şərtlər daha da sadələşdi!</h2>
            </div>
            <div className="products-section__filters">
              {[1, 2, 3].map((i) => (
                <button key={i} className="category-button" disabled>
                  Loading...
                </button>
              ))}
            </div>
          </div>
          
          <div className="products-grid">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="product-card product-card--skeleton">
                <div className="product-card__image-container"></div>
                <div className="product-card__content">
                  <div className="product-card__title"></div>
                  <div className="product-card__price"></div>
                  <div className="product-card__button"></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  // Empty state
  if (!normalizedProducts || normalizedProducts.length === 0) {
    return (
      <div className="products-section products-section--empty">
        Məhsullar tapılmadı
      </div>
    );
  }
  
  return (
    <section className="products-section">
      <div className="container">
        <div className="products-section__header">
          <div className="products-section__title-container">
            <span className="products-section__subheading">Xüsusi təkliflər</span>
            <h2 className="products-section__title">Payız gəldi, şərtlər daha da sadələşdi!</h2>
          </div>
          
          <div className="products-section__filters">
            {categories.map((category) => (
              <MemoizedCategoryButton
                key={category}
                category={category}
                isActive={activeCategory === category}
                onClick={changeCategory}
              />
            ))}
          </div>
        </div>
        
        <div className="products-grid">
          {normalizedProducts.map((product) => (
            <Card key={product.id} className="product-card">
              <ProductCard product={product} />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(ProductsSection);