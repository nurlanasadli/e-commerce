// ProductCard.jsx - Updated Toggle Logic
import React, { useCallback, useState, useEffect, useRef } from 'react';
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
  
  // Create local state to handle UI updates before the context state is updated
  const [localIsFavorite, setLocalIsFavorite] = useState(false);
  const [localIsInCart, setLocalIsInCart] = useState(false);
  const [localIsInComparison, setLocalIsInComparison] = useState(false);
  
  const cartButtonRef = useRef(null);
  const wishlistButtonRef = useRef(null);
  
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
  
  // Sync local state with context
  useEffect(() => {
    setLocalIsFavorite(isFavorite);
    setLocalIsInCart(isInCart);
    setLocalIsInComparison(isInComparison);
  }, [isFavorite, isInCart, isInComparison]);
  
  // Force browser repaint to ensure CSS changes are applied
  const forceRepaint = useCallback((element) => {
    if (!element) return;
    
    // Read property to force a browser reflow/repaint
    // eslint-disable-next-line no-unused-vars
    const reflow = element.offsetHeight;
    
    // For Safari & iOS Webkit, add and remove a class
    element.classList.add('force-repaint');
    setTimeout(() => {
      element.classList.remove('force-repaint');
    }, 10);
  }, []);

  const handleToggleFavorite = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Update local state immediately for responsive UI
    setLocalIsFavorite(prev => !prev);
    
    // Force CSS update
    forceRepaint(wishlistButtonRef.current);
    
    // Call context method
    toggleFavorite(id);
  }, [id, toggleFavorite, forceRepaint]);

  const handleToggleCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Update local state immediately for responsive UI
    setLocalIsInCart(prev => !prev);
    
    // Force CSS update
    forceRepaint(cartButtonRef.current);
    
    // Call context method
    toggleCart(id);
  }, [id, toggleCart, forceRepaint]);

  const handleToggleComparison = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Update local state immediately for responsive UI
    setLocalIsInComparison(prev => !prev);
    
    // Call context method
    toggleComparison(id);
  }, [id, toggleComparison]);

  const handleImageError = useCallback((e) => {
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
          className={`product-card__compare ${localIsInComparison ? 'product-card__compare--active' : ''}`}
          onClick={handleToggleComparison}
          aria-label="Müqayisə et"
          type="button"
        >
          <MemoizedCompareIcon 
            size={18} 
            color={localIsInComparison ? "#e53935" : "#3F3F3F"} 
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
            ref={cartButtonRef}
            className={`product-card__button ${localIsInCart ? 'product-card__button--active' : ''}`}
            onClick={handleToggleCart}
            type="button"
            aria-label={localIsInCart ? "Səbətə keç" : "Səbətə əlavə et"}
          >
            <MemoizedCartAddIcon 
              size={17} 
              className="product-card__button-icon product-card__button-icon-left"
              color="currentColor"
            />
            <span className="product-card__button-text"></span>
          </button>
          
          <button 
            ref={wishlistButtonRef}
            className={`product-card__wishlist ${localIsFavorite ? 'product-card__wishlist--active' : ''}`}
            onClick={handleToggleFavorite}
            aria-label={localIsFavorite ? "Sevimlilərdən çıxart" : "Sevimlilərə əlavə et"}
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