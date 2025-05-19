// contexts/ProductContext.js

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';

// Context yaratmaq
const ProductContext = createContext(null);

// Constants
const PLACEHOLDER_IMAGE = '/product-placeholder.svg';
const DEFAULT_REVIEW_COUNT = 6;

// Debug helper
const debug = (message, data) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[ProductContext] ${message}`, data);
  }
};

/**
 * Map formatında localStorage-a məlumat yazmaq və oxumaq üçün yardımçı funksiya
 * @param {string} key - localStorage key
 * @param {function} setter - React state setter
 */
const loadMapFromStorage = (key, setter) => {
  if (typeof window === 'undefined') return;
  
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const items = JSON.parse(saved);
      const map = items.reduce((acc, id) => {
        acc[String(id)] = true;
        return acc;
      }, {});
      setter(map);
    }
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
  }
};

/**
 * Map formatından array formatına çevirmək və localStorage-a yazmaq
 * @param {string} key - localStorage key
 * @param {object} map - ID map obyekti
 */
const saveMapToStorage = (key, map) => {
  if (typeof window === 'undefined') return;
  
  try {
    const array = Object.keys(map);
    localStorage.setItem(key, JSON.stringify(array));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
};

/**
 * ProductProvider - layihə üçün ProductContext provider komponenti
 */
export const ProductProvider = ({ children }) => {
  // State for active category filter
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // State for product interactions
  const [favoriteMap, setFavoriteMap] = useState({});
  const [cartMap, setCartMap] = useState({});
  const [comparisonMap, setComparisonMap] = useState({});
  
  // Products state
  const [products, setProducts] = useState([]);
  
  // Initialize state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadMapFromStorage('favorites', setFavoriteMap);
      loadMapFromStorage('cartItems', setCartMap);
      loadMapFromStorage('comparisons', setComparisonMap);
    }
  }, []);
  
  // Cross-tab localStorage sync
  useEffect(() => {
    const handleStorageChange = (e) => {
      const updateStateFromStorage = (key, setter) => {
        if (e.key === key) {
          loadMapFromStorage(key, setter);
        }
      };
      
      updateStateFromStorage('favorites', setFavoriteMap);
      updateStateFromStorage('cartItems', setCartMap);
      updateStateFromStorage('comparisons', setComparisonMap);
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);
  
  // Toggle functions
  const toggleFavorite = useCallback((productId, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const id = String(productId);
    
    setFavoriteMap(prev => {
      const newMap = { ...prev };
      
      if (newMap[id]) {
        delete newMap[id];
      } else {
        newMap[id] = true;
      }
      
      saveMapToStorage('favorites', newMap);
      return newMap;
    });
  }, []);
  
  const toggleCart = useCallback((productId, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const id = String(productId);
    
    setCartMap(prev => {
      const newMap = { ...prev };
      
      if (newMap[id]) {
        delete newMap[id];
      } else {
        newMap[id] = true;
      }
      
      saveMapToStorage('cartItems', newMap);
      return newMap;
    });
  }, []);
  
  const toggleComparison = useCallback((productId, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const id = String(productId);
    
    setComparisonMap(prev => {
      const newMap = { ...prev };
      
      if (newMap[id]) {
        delete newMap[id];
      } else {
        newMap[id] = true;
      }
      
      saveMapToStorage('comparisons', newMap);
      return newMap;
    });
  }, []);
  
  // Helper functions
  const formatPrice = useCallback((price) => {
    if (typeof price !== 'number' || isNaN(price)) return '0.00';
    return price.toFixed(2);
  }, []);
  
  const getProductImageUrl = useCallback((imageUrl) => {
    if (!imageUrl) {
      return PLACEHOLDER_IMAGE;
    }
    
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    } else if (imageUrl.startsWith('/')) {
      return `https://api.b-e.az${imageUrl}`;
    } else {
      return `/${imageUrl}`;
    }
  }, []);
  
  const getInstallmentPrice = useCallback((product) => {
    if (!product || !product.perMonth) return null;
    return {
      price: product.perMonth.price || 0,
      month: product.perMonth.month || 12
    };
  }, []);
  
  // Derived state
  const categoryProductsMap = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) {
      return { all: [] };
    }
    
    const map = { all: products };
    products.forEach(product => {
      const category = product?.category;
      if (category) {
        if (!map[category]) {
          map[category] = [];
        }
        map[category].push(product);
      }
    });
    
    return map;
  }, [products]);
  
  const categories = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) {
      return ['all'];
    }
    
    const allCategories = products
      .map(product => product?.category)
      .filter(Boolean);
    
    return ['all', ...new Set(allCategories)];
  }, [products]);
  
  const filteredProducts = useMemo(() => {
    return categoryProductsMap[activeCategory] || [];
  }, [categoryProductsMap, activeCategory]);
  
  const normalizedProducts = useMemo(() => {
    return filteredProducts.map(product => {
      const productId = String(product?.id || 
        `product-${product?.title?.replace(/\s+/g, '-').toLowerCase() || Date.now()}`);
      
      return {
        id: productId,
        title: product?.title || 'Məhsul adı',
        discountedPrice: Number(product?.discounted_price) || Number(product?.price) || 0,
        originalPrice: Number(product?.price) || 0,
        imageUrl: getProductImageUrl(product?.image),
        hasDiscount: product?.discount > 0,
        discount: product?.discount,
        installment: getInstallmentPrice(product),
        reviewCount: product?.reviewCount !== undefined ? product.reviewCount : DEFAULT_REVIEW_COUNT,
        isFavorite: !!favoriteMap[productId],
        isInCart: !!cartMap[productId],
        isInComparison: !!comparisonMap[productId],
        rawData: product
      };
    });
  }, [
    filteredProducts, 
    favoriteMap, 
    cartMap, 
    comparisonMap, 
    getProductImageUrl, 
    getInstallmentPrice
  ]);
  
  // API ilə məlumatların yüklənməsi
  const setProductsData = useCallback((data) => {
    setProducts(data);
    setIsLoading(false);
  }, []);
  
  // Category dəyişimi
  const changeCategory = useCallback((category) => {
    setActiveCategory(category);
  }, []);
  
  // Context value - bütün lazımi funksiyalar və state dəyişənləri
  const contextValue = useMemo(() => ({
    // State
    products,
    isLoading,
    activeCategory,
    categories,
    normalizedProducts,
    
    // Actions
    setProductsData,
    changeCategory,
    toggleFavorite,
    toggleCart,
    toggleComparison,
    
    // Helpers
    formatPrice,
    getProductImageUrl
  }), [
    products,
    isLoading,
    activeCategory,
    categories,
    normalizedProducts,
    setProductsData,
    changeCategory,
    toggleFavorite,
    toggleCart,
    toggleComparison,
    formatPrice,
    getProductImageUrl
  ]);
  
  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

// Context-i istifadə etmək üçün xüsusi hook
export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};