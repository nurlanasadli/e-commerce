import { useState, useRef, useEffect } from 'react';
import { Icon } from '../ui/icons';

const MainNavigation = () => {
  // States
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('Sumqayıt şəhəri...');
  const [isScrolled, setIsScrolled] = useState(false);
  const regionDropdownRef = useRef(null);
  
  const regions = ['Bakı', 'Ağsu', 'Şabran', 'Yevlax'];
  
  // Scroll handler for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target)) {
        setIsRegionDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Event handlers
  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setIsRegionDropdownOpen(false);
  };
  
  const toggleRegionDropdown = () => {
    setIsRegionDropdownOpen(!isRegionDropdownOpen);
  };
  
  return (
    <nav className={`main-navigation ${isScrolled ? 'main-navigation--sticky' : ''}`}>
      <div className="main-navigation__container">
        <a href="/" className="main-navigation__logo">
          <img 
            src="/images/logos/logo.svg" 
            alt="Wemark" 
            className="main-navigation__logo-image" 
          />
        </a>
        
        <button className="catalog-button">
          <span className="catalog-button__icon">
            <Icon name="catalog" size={20} color="white" />
          </span>
          <span className="catalog-button__text">Kataloq</span>
        </button>
        
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
        
        <div className="main-navigation__actions">
          <button className="action-button" aria-label="Müqayisə et">
            <Icon name="compare" size={24} className="action-button__icon" />
          </button>
          
          <button className="action-button" aria-label="Səbət">
            <Icon name="cart" size={24} className="action-button__icon" />
          </button>
          
          <button className="action-button" aria-label="Sevimlilər">
            <Icon name="heart" size={24} className="action-button__icon" />
          </button>
          
          <button className="action-button" aria-label="Profil">
            <Icon name="user" size={24} className="action-button__icon" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;