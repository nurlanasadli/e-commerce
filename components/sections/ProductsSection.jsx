import React, { useEffect } from 'react';
import Card from '../ui/Card';
import ProductCard from '../ui/ProductCard';
import { CategoryButton } from '../ui/CategoryButton';
import { useProductContext } from '../../contexts/ProductContext';

const MemoizedCategoryButton = React.memo(CategoryButton);

const ProductsSection = ({ products = [] }) => {
  const {
    isLoading,
    setProductsData,
    categories,
    activeCategory,
    changeCategory,
    normalizedProducts
  } = useProductContext();
  
  useEffect(() => {
    setProductsData(products);
  }, [products, setProductsData]);
  
  useEffect(() => {
    const scrollToActiveCategory = () => {
      const filtersContainer = document.querySelector('.products-section__filters');
      const activeButton = document.querySelector('.category-button--active');
      
      if (filtersContainer && activeButton) {
        if (window.innerWidth <= 480) {
          filtersContainer.scrollLeft = 0;
        } else if (activeCategory === categories[0]) {
          filtersContainer.scrollLeft = 0;
        } else {
          const containerWidth = filtersContainer.offsetWidth;
          const buttonLeft = activeButton.offsetLeft;
          const buttonWidth = activeButton.offsetWidth;
          
          const scrollTo = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
          
          filtersContainer.scrollLeft = Math.max(0, scrollTo);
        }
      }
    };
    
    const initialScrollTimeout = setTimeout(scrollToActiveCategory, 50);
    
    window.addEventListener('resize', scrollToActiveCategory);
    
    return () => {
      window.removeEventListener('resize', scrollToActiveCategory);
      clearTimeout(initialScrollTimeout);
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