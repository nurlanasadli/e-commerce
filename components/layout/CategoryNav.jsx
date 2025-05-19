import { useState, useEffect, useRef } from 'react';
import DarkModeToggle from '../ui/DarkModeToggle';
import { ArrowDownIcon, HamburgerIcon } from '../ui/icons';

const CategoryNav = () => {
  // Active category state
  const [activeCategory, setActiveCategory] = useState('Kampaniyalar');
  
  // Active language state
  const [activeLanguage, setActiveLanguage] = useState('Aze');
  
  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mobile view state
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Refs
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Category list
  const categories = [
    'Kampaniyalar',
    'Xidmətlər',
    'Mağazalar',
    'Aylıq ödəniş',
    'Digər'
  ];
  
  // Languages list
  const languages = {
    Aze: 'Aze',
    En: 'En',
    Ru: 'Ru'
  };

  // Handle responsive view
  useEffect(() => {
    const handleResize = () => {
      // Set mobile view state based on window width
      // Changed from 768 to 769 to match the CSS breakpoint
      setIsMobileView(window.innerWidth < 769);
    };
    
    // Initial check
    handleResize();
    
    // Add resize event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Center active category on scroll (for desktop/tablet)
  useEffect(() => {
    // Only run if not in mobile view
    if (isMobileView) return;
    
    // Find the active category element
    const activeElement = document.querySelector('.category-nav__item--active');
    if (activeElement) {
      // Check if we're on tablet where scrolling is needed
      const container = document.querySelector('.category-nav__categories');
      const containerWidth = container?.offsetWidth;
      
      if (window.innerWidth < 992 && activeElement && container) {
        // Calculate position to center the active element
        const activeElementLeft = activeElement.offsetLeft;
        const activeElementWidth = activeElement.offsetWidth;
        const scrollPosition = activeElementLeft - (containerWidth / 2) + (activeElementWidth / 2);
        
        // Smooth scroll to position
        container.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: 'smooth'
        });
      }
    }
  }, [activeCategory, isMobileView]);
  
  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close language dropdown if clicked outside
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      
      // Close mobile menu if clicked outside
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Set body overflow hidden when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);
  
  // Handle language change
  const handleLanguageChange = (lang) => {
    setActiveLanguage(lang);
    setIsDropdownOpen(false);
  };

  // Toggle language dropdown
  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Handle category selection
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    
    // Close mobile menu after selection on mobile
    if (isMobileView) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="category-nav">
      <div className="category-nav__container">
        {/* Hamburger menu button (shows only on mobile) */}
        <button 
          className="category-nav__hamburger"
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-label="Menu"
        >
          <HamburgerIcon size={24} color="currentColor" />
        </button>
        
        {/* Desktop categories - not hidden by JS, but by CSS media query */}
        <div className="category-nav__categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-nav__item ${
                activeCategory === category ? 'category-nav__item--active' : ''
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="category-nav__actions">
          <a href="#" className="category-nav__prev-version">
            Əvvəlki versiyaya keçid
          </a>
          
          <div className="category-nav__language-dropdown" ref={dropdownRef}>
            <button 
              className="category-nav__language-toggle"
              onClick={toggleDropdown}
              type="button"
            >
              {languages[activeLanguage]}
              <ArrowDownIcon 
                size={10} 
                className={`category-nav__language-arrow ${isDropdownOpen ? 'category-nav__language-arrow--open' : ''}`}
              />
            </button>
            
            {isDropdownOpen && (
              <ul className="category-nav__language-dropdown-menu">
                {Object.keys(languages).map(lang => (
                  <li key={lang}>
                    <button
                      className={`category-nav__language-option ${
                        activeLanguage === lang ? 'category-nav__language-option--active' : ''
                      }`}
                      onClick={() => handleLanguageChange(lang)}
                      type="button"
                    >
                      {languages[lang]}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <DarkModeToggle />
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      <div 
        className={`category-nav__mobile-overlay ${isMobileMenuOpen ? 'category-nav__mobile-overlay--active' : ''}`}
        onClick={toggleMobileMenu}
      ></div>
      
      {/* Mobile Menu */}
      <div 
        className={`category-nav__mobile-menu ${isMobileMenuOpen ? 'category-nav__mobile-menu--active' : ''}`}
        ref={mobileMenuRef}
      >
        <div className="category-nav__mobile-header">
          <h3 className="category-nav__mobile-title">Kateqoriyalar</h3>
          <button 
            className="category-nav__mobile-close"
            onClick={toggleMobileMenu}
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>
        
        <ul className="category-nav__mobile-categories">
          {categories.map((category) => (
            <li key={category} className="category-nav__mobile-item">
              <button
                className={`category-nav__mobile-button ${
                  activeCategory === category ? 'category-nav__mobile-button--active' : ''
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default CategoryNav;