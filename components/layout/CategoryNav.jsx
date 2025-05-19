import { useState, useEffect, useRef } from 'react';
import DarkModeToggle from '../ui/DarkModeToggle';
import { ArrowDownIcon, HamburgerIcon } from '../ui/icons';

const CategoryNav = () => {

  const [activeCategory, setActiveCategory] = useState('Kampaniyalar');
  const [activeLanguage, setActiveLanguage] = useState('Aze');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const categories = [
    'Kampaniyalar',
    'Xidmətlər',
    'Mağazalar',
    'Aylıq ödəniş',
    'Digər'
  ];
  
  const languages = {
    Aze: 'Aze',
    En: 'En',
    Ru: 'Ru'
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 769);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobileView) return;
    
    const activeElement = document.querySelector('.category-nav__item--active');
    if (activeElement) {
      const container = document.querySelector('.category-nav__categories');
      const containerWidth = container?.offsetWidth;
      
      if (window.innerWidth < 992 && activeElement && container) {
        const activeElementLeft = activeElement.offsetLeft;
        const activeElementWidth = activeElement.offsetWidth;
        const scrollPosition = activeElementLeft - (containerWidth / 2) + (activeElementWidth / 2);
        
        container.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: 'smooth'
        });
      }
    }
  }, [activeCategory, isMobileView]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
  
  const handleLanguageChange = (lang) => {
    setActiveLanguage(lang);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    
    if (isMobileView) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="category-nav">
      <div className="category-nav__container">
        <button 
          className="category-nav__hamburger"
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-label="Menu"
        >
          <HamburgerIcon size={24} color="currentColor" />
        </button>
        
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
  
  <ul className={`category-nav__language-dropdown-menu ${isDropdownOpen ? 'visible' : ''}`}>
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
</div>
          
          <DarkModeToggle />
        </div>
      </div>
      
      <div 
        className={`category-nav__mobile-overlay ${isMobileMenuOpen ? 'category-nav__mobile-overlay--active' : ''}`}
        onClick={toggleMobileMenu}
      ></div>
      
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