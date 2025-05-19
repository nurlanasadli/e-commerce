import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';

const ProductContext = createContext(null);

const PLACEHOLDER_IMAGE = '/product-placeholder.svg';
const DEFAULT_REVIEW_COUNT = 6;

const debug = (message, data) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[ProductContext] ${message}`, data);
  }
};

// Improved storage utility
class StorageManager {
  static loadMapFromStorage(key) {
    if (typeof window === 'undefined') return {};
    
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const items = JSON.parse(saved);
        const map = Array.isArray(items) 
          ? items.reduce((acc, id) => {
              acc[String(id)] = true;
              return acc;
            }, {})
          : items;
        return map;
      }
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
    }
    
    return {};
  }

  static saveMapToStorage(key, map) {
    if (typeof window === 'undefined') return;
    
    try {
      // For backward compatibility we still save as array
      const array = Object.keys(map);
      localStorage.setItem(key, JSON.stringify(array));
      
      // Dispatch a custom event to notify other tabs
      window.dispatchEvent(new CustomEvent('storage-updated', { 
        detail: { key, data: array } 
      }));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  }
}

export const ProductProvider = ({ children }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  const [favoriteMap, setFavoriteMap] = useState({});
  const [cartMap, setCartMap] = useState({});
  const [comparisonMap, setComparisonMap] = useState({});
  
  const [products, setProducts] = useState([]);
  
  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFavoriteMap(StorageManager.loadMapFromStorage('favorites'));
      setCartMap(StorageManager.loadMapFromStorage('cartItems'));
      setComparisonMap(StorageManager.loadMapFromStorage('comparisons'));
    }
  }, []);
  
  // Cross-tab sync
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'favorites') {
        setFavoriteMap(StorageManager.loadMapFromStorage('favorites'));
      } else if (e.key === 'cartItems') {
        setCartMap(StorageManager.loadMapFromStorage('cartItems'));
      } else if (e.key === 'comparisons') {
        setComparisonMap(StorageManager.loadMapFromStorage('comparisons'));
      }
    };
    
    const handleCustomStorageEvent = (e) => {
      if (e.detail?.key === 'favorites') {
        setFavoriteMap(StorageManager.loadMapFromStorage('favorites'));
      } else if (e.detail?.key === 'cartItems') {
        setCartMap(StorageManager.loadMapFromStorage('cartItems'));
      } else if (e.detail?.key === 'comparisons') {
        setComparisonMap(StorageManager.loadMapFromStorage('comparisons'));
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('storage-updated', handleCustomStorageEvent);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('storage-updated', handleCustomStorageEvent);
      };
    }
  }, []);
  
  // Improved toggle functions with callback for UI updates
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
      
      // Update localStorage
      StorageManager.saveMapToStorage('favorites', newMap);
      return newMap;
    });
    
    // Return the new state for immediate UI updates
    return !favoriteMap[id];
  }, [favoriteMap]);
  
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
      
      // Update localStorage
      StorageManager.saveMapToStorage('cartItems', newMap);
      return newMap;
    });
    
    // Return the new state for immediate UI updates
    return !cartMap[id];
  }, [cartMap]);
  
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
      
      // Update localStorage
      StorageManager.saveMapToStorage('comparisons', newMap);
      return newMap;
    });
    
    // Return the new state for immediate UI updates
    return !comparisonMap[id];
  }, [comparisonMap]);
  
  // Remaining methods (formatPrice, getProductImageUrl, etc.) stay the same
  
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
  
  // Rest of the context implementation remains unchanged...

  // Categories and filtered products logic
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
  
  const setProductsData = useCallback((data) => {
    setProducts(data);
    setIsLoading(false);
  }, []);
  
  const changeCategory = useCallback((category) => {
    setActiveCategory(category);
  }, []);
  
  // Product counts
  const favoriteProductsCount = useMemo(() => {
    return Object.keys(favoriteMap).length;
  }, [favoriteMap]);
  
  const cartProductsCount = useMemo(() => {
    return Object.keys(cartMap).length;
  }, [cartMap]);
  
  const comparisonProductsCount = useMemo(() => {
    return Object.keys(comparisonMap).length;
  }, [comparisonMap]);
  
  const contextValue = useMemo(() => ({
    products,
    isLoading,
    activeCategory,
    categories,
    normalizedProducts,
    
    favoriteProductsCount,
    cartProductsCount,
    comparisonProductsCount,
    
    setProductsData,
    changeCategory,
    toggleFavorite,
    toggleCart,
    toggleComparison,
    
    formatPrice,
    getProductImageUrl
  }), [
    products,
    isLoading,
    activeCategory,
    categories,
    normalizedProducts,
    
    favoriteProductsCount,
    cartProductsCount,
    comparisonProductsCount,
    
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

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};