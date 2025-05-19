import { useState, useEffect, useRef, useCallback } from 'react';
import BannerSlide from './BannerSlide';
import styles from './BannerSlider.module.css';
import Icon from '../../ui/icons/Icon';

const BannerSlider = ({ slides = [], autoplaySpeed = 5000 }) => {
  // Ensure we have at least one slide
  if (!slides.length) return null;
  
  // State management
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Refs
  const slidesContainerRef = useRef(null);
  const autoplayTimerRef = useRef(null);
  
  // Check if we're on mobile/tablet on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth <= 992;
      setIsMobile(mobile);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  // Create a "circular" array of slides for infinite effect
  const getVisibleSlides = () => {
    // For true infinite carousel, we need to create a circular array
    // that repeats the first slide after the last slide
    return [...slides, slides[0]];
  };
  
  // Move to specific slide with animation
  const goToSlide = useCallback((index) => {
    if (isTransitioning) return;
    
    // Start transition
    setIsTransitioning(true);
    
    // Regular slide change
    setCurrentSlide(index);
    
    // End transition after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
      
      // If we've reached the "clone" at the end, immediately jump back to the first slide
      if (index >= slides.length) {
        setCurrentSlide(0);
      }
    }, 500);
  }, [isTransitioning, slides.length]);
  
  // Navigate to next slide
  const nextSlide = useCallback(() => {
    const nextIndex = currentSlide + 1;
    goToSlide(nextIndex);
  }, [currentSlide, goToSlide]);
  
  // Navigate to previous slide
  const prevSlide = useCallback(() => {
    // If at first slide, go to the last original slide
    if (currentSlide === 0) {
      goToSlide(slides.length - 1);
    } else {
      goToSlide(currentSlide - 1);
    }
  }, [currentSlide, goToSlide, slides.length]);
  
  // Calculate translate value for sliding animation
  const getTranslateValue = () => {
    // For mobile (under 992px), we want to use 100% width per slide with NO gap
    if (isMobile) {
      return `translateX(-${currentSlide * 100}%)`;
    } else {
      // For desktop, we use 80% for main slide + 2% gap (allowing 20% of next slide to show)
      const slideWidth = 80;
      const slideGap = 2;
      const totalMove = slideWidth + slideGap;
      
      return `translateX(-${currentSlide * totalMove}%)`;
    }
  };
  
  // Autoplay functionality
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
    
    // Cleanup interval on unmount
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [nextSlide, slides.length, autoplaySpeed, isPaused]);
  
  // Handle keyboard navigation
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
  
  // Touch event handlers with improved sensitivity
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    // Pause autoplay during touch
    setIsPaused(true);
  };
  
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    // For mobile, use smaller threshold for easier swiping
    const swipeThreshold = isMobile ? 30 : 50;
    
    const isLeftSwipe = distance > swipeThreshold;
    const isRightSwipe = distance < -swipeThreshold;
    
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    
    // Reset touch positions
    setTouchStart(null);
    setTouchEnd(null);
    
    // Resume autoplay after touch
    setTimeout(() => {
      setIsPaused(false);
    }, 1000);
  };
  
  // Pause autoplay on hover (only on non-touch devices)
  const handleMouseEnter = () => !('ontouchstart' in window) && setIsPaused(true);
  const handleMouseLeave = () => !('ontouchstart' in window) && setIsPaused(false);
  
  // Get the circular slide array
  const visibleSlides = getVisibleSlides();
  
  return (
    <section className={styles.bannerSection} aria-label="Banner Slider">
      {/* Slider Wrapper - allows arrows to extend outside */}
      <div className={styles.sliderWrapper}>
        {/* Main Slider Container - with overflow hidden */}
        <div 
          className={styles.sliderContainer}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Main Slider Track - uses transform for smooth animation */}
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
            {/* Map through the circular slide array (original slides + first slide repeated) */}
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
        
        {/* Navigation Buttons - these are outside of the overflow: hidden container */}
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