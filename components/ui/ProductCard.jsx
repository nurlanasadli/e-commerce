import React, { useCallback, useState, useEffect, useRef } from 'react';
import { HeartIcon, CartAddIcon, CommentIcon, StarIcon, CompareIcon } from './icons';
import { useProductContext } from '../../contexts/ProductContext';
import { useToggleAnimation } from '../../hooks/useToggleAnimation';

const PLACEHOLDER_IMAGE = '/product-placeholder.svg';
const REVIEW_TEXT = 'Rəy';

const MemoizedHeartIcon = React.memo(HeartIcon);
const MemoizedCartAddIcon = React.memo(CartAddIcon);
const MemoizedCommentIcon = React.memo(CommentIcon);
const MemoizedStarIcon = React.memo(StarIcon);
const MemoizedCompareIcon = React.memo(CompareIcon);

const ProductCard = ({ product }) => {
  if (!product) return null;
  
  const { toggleFavorite, toggleCart, toggleComparison, formatPrice } = useProductContext();
  
  const { elementRef: cartButtonRef, animateToggle: animateCartToggle } = useToggleAnimation();
  const { elementRef: wishlistButtonRef, animateToggle: animateWishlistToggle } = useToggleAnimation();
  
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
  
  
  const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite);
  const [localIsInCart, setLocalIsInCart] = useState(isInCart);
  const [localIsInComparison, setLocalIsInComparison] = useState(isInComparison);
  
  useEffect(() => {
    if (isFavorite !== localIsFavorite) setLocalIsFavorite(isFavorite);
    if (isInCart !== localIsInCart) setLocalIsInCart(isInCart);
    if (isInComparison !== localIsInComparison) setLocalIsInComparison(isInComparison);
  }, [isFavorite, isInCart, isInComparison]);
  
  const lastFavoriteState = useRef(localIsFavorite);
  const lastCartState = useRef(localIsInCart);
  
  const handleToggleFavorite = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newState = !localIsFavorite;
    
    if (lastFavoriteState.current !== newState) {
      setLocalIsFavorite(newState);
      lastFavoriteState.current = newState;
      animateWishlistToggle(newState);
      
      requestAnimationFrame(() => {
        toggleFavorite(id);
      });
    }
  }, [id, toggleFavorite, localIsFavorite, animateWishlistToggle]);

useEffect(() => {
  const handleOutsideClick = (e) => {
    if (e.target.closest('.product-card') && 
        !e.target.closest('.product-card__compare')) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  document.addEventListener('click', handleOutsideClick);
  
  return () => {
    document.removeEventListener('click', handleOutsideClick);
  };
}, []);

  const handleToggleCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newState = !localIsInCart;
    
    if (lastCartState.current !== newState) {
      setLocalIsInCart(newState);
      lastCartState.current = newState;
      animateCartToggle(newState);
      
      requestAnimationFrame(() => {
        toggleCart(id);
      });
    }
  }, [id, toggleCart, localIsInCart, animateCartToggle]);


const handleToggleComparison = useCallback((e) => {
  e.preventDefault();
  e.stopPropagation();
  
  const button = e.currentTarget;
  const wasActive = localIsInComparison;
  
  setLocalIsInComparison(!wasActive);
    if (wasActive) {
    button.classList.remove('product-card__compare--active');
    button.classList.add('product-card__compare--deactivating');
    
    setTimeout(() => {
      button.classList.remove('product-card__compare--deactivating');
    }, 500);
  } else {
    button.classList.add('product-card__compare--active');
  }
    requestAnimationFrame(() => {
    toggleComparison(id);
  });
}, [id, toggleComparison, localIsInComparison]);
   

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
  data-prevent-propagation="true"
>
  <MemoizedCompareIcon 
    size={18} 
    color={localIsInComparison ? "#e3935" : "#3F3F3F"} 
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