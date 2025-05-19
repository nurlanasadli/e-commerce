import { useState, useRef, useEffect } from 'react';
import { Icon } from '../ui/icons';

const MainNavigation = () => {
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('Sumqayıt şəhəri...');
  const [isScrolled, setIsScrolled] = useState(false);
  const regionDropdownRef = useRef(null);
  
  const regions = ['Bakı', 'Ağsu', 'Şabran', 'Yevlax'];
  
  // Handle scroll event to update header state
  useEffect(() => {
    const handleScroll = () => {
      // Check if the page is scrolled beyond a threshold (e.g., 50px)
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check on mount
    handleScroll();
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close region dropdown if clicked outside
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target)) {
        setIsRegionDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle region selection
  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setIsRegionDropdownOpen(false);
  };
  
  // Toggle region dropdown
  const toggleRegionDropdown = () => {
    setIsRegionDropdownOpen(!isRegionDropdownOpen);
  };
  
  return (
    <nav className={`main-navigation ${isScrolled ? 'main-navigation--sticky' : ''}`}>
      <div className="main-navigation__container">
        {/* Logo */}
        <a href="/" className="main-navigation__logo">
          <img 
            src="/images/logos/logo.svg" 
            alt="Wemark" 
            className="main-navigation__logo-image" 
          />
        </a>
        
        {/* Catalog Button */}
        <button className="catalog-button">
          <span className="catalog-button__icon">
            <Icon name="catalog" size={20} color="white" />
          </span>
          <span className="catalog-button__text">Kataloq</span>
        </button>
        
        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            className="search-bar__input"
            placeholder="Məhsul axtar..."
            aria-label="Məhsul axtar"
          />
          <Icon 
            name="search" 
            size={20} 
            className="search-bar__icon" 
          />
        </div>
        
        {/* Region Select */}
        <div className="region-select" ref={regionDropdownRef}>
          <button 
            className="region-select__button"
            onClick={toggleRegionDropdown}
            aria-expanded={isRegionDropdownOpen}
            aria-haspopup="listbox"
          >
            <span className="region-select__text">{selectedRegion}</span>
            <Icon 
              name="chevronDown" 
              size={16} 
              className={`region-select__arrow ${isRegionDropdownOpen ? 'region-select__arrow--open' : ''}`} 
            />
          </button>
          
          {isRegionDropdownOpen && (
            <div className="region-select__dropdown" role="listbox">
              {regions.map(region => (
                <button 
                  key={region}
                  className="region-select__option"
                  onClick={() => handleRegionSelect(region)}
                  role="option"
                  aria-selected={selectedRegion === region}
                >
                  {region}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="main-navigation__actions">
          {/* Compare Button */}
          <button className="action-button" aria-label="Müqayisə et">
            <Icon name="compare" size={24} className="action-button__icon" />
          </button>
          
          {/* Cart Button */}
          <button className="action-button" aria-label="Səbət">
            <Icon name="cart" size={24} className="action-button__icon" />
          </button>
          
          {/* Favorites Button */}
          <button className="action-button" aria-label="Sevimlilər">
            <Icon name="heart" size={24} className="action-button__icon" />
          </button>
          
          {/* Login Button */}
          <button className="action-button" aria-label="Profil">
            <Icon name="user" size={24} className="action-button__icon" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;