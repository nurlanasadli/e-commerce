import { useState, useEffect, useCallback } from 'react';

const Slider = ({ slides = [], autoplay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(autoplay);
  
  const nextSlide = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  }, [slides.length]);
  
  const prevSlide = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };
  
  const goToSlide = (index) => {
    setCurrentIndex(index);
    if (isAutoplay) {
      setIsAutoplay(false);
      setTimeout(() => setIsAutoplay(true), 10000);
    }
  };
  
  // Autoplay functionality
  useEffect(() => {
    if (!isAutoplay || slides.length <= 1) return;
    
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [isAutoplay, interval, nextSlide, slides.length]);
  
  // Pause autoplay when hovering over slider
  const pauseAutoplay = () => setIsAutoplay(false);
  const resumeAutoplay = () => autoplay && setIsAutoplay(true);
  
  if (!slides.length) return null;
  
  return (
    <div 
      className="slider" 
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
    >
      <div className="slider__track-container">
        <div 
          className="slider__track" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="slider__slide">
              <img 
                src={slide.image} 
                alt={slide.title || `Slide ${index + 1}`} 
                className="slider__image" 
              />
              
              {(slide.title || slide.subtitle || slide.buttonText) && (
                <div className="slider__content">
                  {slide.subtitle && (
                    <p className="slider__subtitle">{slide.subtitle}</p>
                  )}
                  {slide.title && (
                    <h2 className="slider__title">{slide.title}</h2>
                  )}
                  {slide.description && (
                    <p className="slider__description">{slide.description}</p>
                  )}
                  {slide.buttonText && (
                    <button className="slider__button">{slide.buttonText}</button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {slides.length > 1 && (
        <>
          <button 
            className="slider__arrow slider__arrow--prev" 
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <span className="slider__arrow-icon">❮</span>
          </button>
          <button 
            className="slider__arrow slider__arrow--next" 
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <span className="slider__arrow-icon">❯</span>
          </button>
          
          <div className="slider__dots">
            {slides.map((_, index) => (
              <button 
                key={index} 
                className={`slider__dot ${index === currentIndex ? 'slider__dot--active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Slider;