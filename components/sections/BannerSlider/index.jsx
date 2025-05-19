import { useState, useEffect, useRef, useCallback } from 'react';
import BannerSlide from './BannerSlide';
import styles from './BannerSlider.module.css';
import Icon from '../../ui/icons/Icon';

const BannerSlider = ({ slides = [], autoplaySpeed = 5000 }) => {
  if (!slides.length) return null;
  
  // States
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Refs
  const slidesContainerRef = useRef(null);
  const autoplayTimerRef = useRef(null);
  
  // Responsive handler
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  // Infinite carousel setup
  const getVisibleSlides = () => {
    return [...slides, slides[0]];
  };
  
  // Navigation methods
  const goToSlide = useCallback((index) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentSlide(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
      
      if (index >= slides.length) {
        setCurrentSlide(0);
      }
    }, 500);
  }, [isTransitioning, slides.length]);
  
  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);
  
  const prevSlide = useCallback(() => {
    if (currentSlide === 0) {
      goToSlide(slides.length - 1);
    } else {
      goToSlide(currentSlide - 1);
    }
  }, [currentSlide, goToSlide, slides.length]);
  
  // Layout calculation
  const getTranslateValue = () => {
    if (isMobile) {
      return `translateX(-${currentSlide * 100}%)`;
    } else {
      const slideWidth = 80;
      const slideGap = 2;
      const totalMove = slideWidth + slideGap;
      
      return `translateX(-${currentSlide * totalMove}%)`;
    }
  };
  
  // Autoplay control
  useEffect(() => {
    const startAutoplay = () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      
      autoplayTimerRef.current = setInterval(() => {
        if (!isPaused) {
          nextSlide();
        }
      }, autoplaySpeed);
    };
    
    if (slides.length > 1) {
      startAutoplay();
    }
    
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [nextSlide, slides.length, autoplaySpeed, isPaused]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextSlide, prevSlide]);
  
  // Touch handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsPaused(true);
  };
  
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const swipeThreshold = isMobile ? 30 : 50;
    
    const isLeftSwipe = distance > swipeThreshold;
    const isRightSwipe = distance < -swipeThreshold;
    
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
    
    setTimeout(() => {
      setIsPaused(false);
    }, 1000);
  };
  
  // Mouse hover handlers
  const handleMouseEnter = () => !('ontouchstart' in window) && setIsPaused(true);
  const handleMouseLeave = () => !('ontouchstart' in window) && setIsPaused(false);
  
  const visibleSlides = getVisibleSlides();
  
  return (
    <section className={styles.bannerSection} aria-label="Banner Slider">
      <div className={styles.sliderWrapper}>
        <div 
          className={styles.sliderContainer}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            ref={slidesContainerRef}
            className={styles.slidesTrack}
            style={{ 
              transform: getTranslateValue(),
              transition: isTransitioning ? 'transform 500ms ease' : 'none'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {visibleSlides.map((slide, index) => (
              <div 
                key={`slide-${slide.id || index}`}
                className={`${styles.slideItem} ${index === currentSlide ? styles.activeSlide : ''}`}
              >
                <BannerSlide 
                  data={slide}
                  isActive={index === currentSlide}
                  priority={index === currentSlide || index === currentSlide + 1} 
                />
              </div>
            ))}
          </div>
        </div>
        
        {slides.length > 1 && (
          <>
            <button 
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={prevSlide}
              aria-label="Əvvəlki slayd"
              disabled={isTransitioning}
            >
              <Icon 
                name="arrowLeft" 
                size={25} 
                color="#EA2427" 
              />
            </button>
            
            <button 
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={nextSlide}
              aria-label="Növbəti slayd"
              disabled={isTransitioning}
            >
              <Icon 
                name="arrowRight" 
                size={25} 
                color="#EA2427" 
              />
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default BannerSlider;