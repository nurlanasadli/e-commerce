import React from 'react';
import { HeartIcon, CartAddIcon, CommentIcon, StarIcon, CompareIcon } from './icons';
import { useProductContext } from '../../contexts/ProductContext';

// Constants
const PLACEHOLDER_IMAGE = '/product-placeholder.svg';
const REVIEW_TEXT = 'Rəy';

// Memoized icon components
const MemoizedHeartIcon = React.memo(HeartIcon);
const MemoizedCartAddIcon = React.memo(CartAddIcon);
const MemoizedCommentIcon = React.memo(CommentIcon);
const MemoizedStarIcon = React.memo(StarIcon);
const MemoizedCompareIcon = React.memo(CompareIcon);

const ProductCard = ({ product }) => {
  if (!product) return null;
  
  const { toggleFavorite, toggleCart, toggleComparison, formatPrice } = useProductContext();

  const {
    id,
    title,
    discountedPrice,
    originalPrice,
    imageUrl,
    hasDiscount,
    discount,
    installment,
    reviewCount = 6,
    isFavorite,
    isInCart,
    isInComparison
  } = product;

  const handleToggleFavorite = React.useCallback((e) => {
    toggleFavorite(id, e);
  }, [id, toggleFavorite]);

  const handleToggleCart = React.useCallback((e) => {
    toggleCart(id, e);
  }, [id, toggleCart]);

  const handleToggleComparison = React.useCallback((e) => {
    toggleComparison(id, e);
  }, [id, toggleComparison]);

  const handleImageError = React.useCallback((e) => {
    e.target.onerror = null;
    e.target.src = PLACEHOLDER_IMAGE;
  }, []);

  return (
    <>
      {hasDiscount && (
        <span className="product-card__discount">-{discount}%</span>
      )}
      
      <div className="product-card__image-container">
        <button 
          className={`product-card__compare ${isInComparison ? 'product-card__compare--active' : ''}`}
          onClick={handleToggleComparison}
          onTouchEnd={handleToggleComparison}
          aria-label="Müqayisə et"
          type="button"
        >
          <MemoizedCompareIcon 
            size={18} 
            color={isInComparison ? "#e53935" : "#3F3F3F"} 
          />
        </button>
        
        <img 
          src={imageUrl || PLACEHOLDER_IMAGE}
          alt={title} 
          className="product-card__image"
          loading="lazy"
          onError={handleImageError}
        />
      </div>
      
      <div className="product-card__content">
        <div className="product-card__rating">
          <div className="product-card__stars-container">
            <MemoizedStarIcon size={15} />
            <span className="product-card__rating-value">4.6</span>
          </div>
          
          <div className="product-card__reviews">
            <MemoizedCommentIcon size={16} color="#9CA3AF" />
            <span className="product-card__reviews-count">{reviewCount} {REVIEW_TEXT}</span>
          </div>
        </div>

        <h3 className="product-card__title">{title}</h3>
        
        <div className="product-card__pricing-container">
      <div className="product-card__price-wrapper">
        {hasDiscount && (
          <span className="product-card__old-price">{formatPrice(originalPrice)} ₼</span>
        )}
        <span className="product-card__price">{formatPrice(discountedPrice)} ₼</span>
      </div>
      
      {installment && (
        <div className="installment-wrapper">
          <span className="installment__period">{installment.month} ay</span>
          <span className="installment__price">{formatPrice(installment.price)} ₼</span>
        </div>
      )}
    </div>
        
        <div className="product-card__actions">
          <button 
            className={`product-card__button ${isInCart ? 'product-card__button--active' : ''}`}
            onClick={handleToggleCart}
            onTouchEnd={handleToggleCart}
            type="button"
            aria-label="Səbətə əlavə et"
          >
            <MemoizedCartAddIcon 
              size={17} 
              className="product-card__button-icon product-card__button-icon-left"
              color="currentColor"
            />
            <span className="product-card__button-text"></span>
          </button>
          
          <button 
            className={`product-card__wishlist ${isFavorite ? 'product-card__wishlist--active' : ''}`}
            onClick={handleToggleFavorite}
            onTouchEnd={handleToggleFavorite}
            aria-label={isFavorite ? "Sevimlilərə əlavə et" : "Sevimlilərdən çıxart"}
            type="button"
            data-product-id={id}
          >
            <MemoizedHeartIcon 
              size={24} 
              color="currentColor" 
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default React.memo(ProductCard);