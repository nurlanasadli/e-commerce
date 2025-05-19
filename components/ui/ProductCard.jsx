// components/ui/ProductCard.jsx
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { HeartIcon, CartAddIcon, CommentIcon, StarIcon, CompareIcon } from './icons';
import { useProductContext } from '../../contexts/ProductContext';
import { useToggleAnimation } from '../../hooks/useToggleAnimation';

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
  
  // Animate toggle hooks
  const { elementRef: cartButtonRef, animateToggle: animateCartToggle } = useToggleAnimation();
  const { elementRef: wishlistButtonRef, animateToggle: animateWishlistToggle } = useToggleAnimation();
  
  // Destructure product properties
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
  
  
  // Local states for immediate UI updates
  const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite);
  const [localIsInCart, setLocalIsInCart] = useState(isInCart);
  const [localIsInComparison, setLocalIsInComparison] = useState(isInComparison);
  
  // Sync with context state when it changes
  useEffect(() => {
    if (isFavorite !== localIsFavorite) setLocalIsFavorite(isFavorite);
    if (isInCart !== localIsInCart) setLocalIsInCart(isInCart);
    if (isInComparison !== localIsInComparison) setLocalIsInComparison(isInComparison);
  }, [isFavorite, isInCart, isInComparison]);
  
  // Prevent repeated renders on same state
  const lastFavoriteState = useRef(localIsFavorite);
  const lastCartState = useRef(localIsInCart);
  
  // Handle Wishlist toggle with optimized animation
  const handleToggleFavorite = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newState = !localIsFavorite;
    
    // Only update and animate if state actually changes
    if (lastFavoriteState.current !== newState) {
      setLocalIsFavorite(newState);
      lastFavoriteState.current = newState;
      animateWishlistToggle(newState);
      
      // Use requestAnimationFrame for smoother transition
      requestAnimationFrame(() => {
        toggleFavorite(id);
      });
    }
  }, [id, toggleFavorite, localIsFavorite, animateWishlistToggle]);

  // Handle Cart toggle with optimized animation
  const handleToggleCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newState = !localIsInCart;
    
    // Only update and animate if state actually changes
    if (lastCartState.current !== newState) {
      setLocalIsInCart(newState);
      lastCartState.current = newState;
      animateCartToggle(newState);
      
      // Use requestAnimationFrame for smoother transition
      requestAnimationFrame(() => {
        toggleCart(id);
      });
    }
  }, [id, toggleCart, localIsInCart, animateCartToggle]);

  // Handle Comparison toggle
  const handleToggleComparison = useCallback((e) => {
  e.preventDefault();
  e.stopPropagation();
  
  setLocalIsInComparison(!localIsInComparison);
  
  requestAnimationFrame(() => {
    toggleComparison(id);
  });
}, [id, toggleComparison, localIsInComparison]);

  // Optimize image error handling
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
  data-product-id={id}
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
              className="product-card__button-icon"
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

// Performance optimization with memo
export default React.memo(ProductCard);