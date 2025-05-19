import Link from 'next/link';
import Image from 'next/image'; // Bu əsas dəyişiklikdir
import { useState } from 'react';
import styles from './BannerSlider.module.css';

const BannerSlide = ({ data, isActive, priority = false }) => {
  const { id, image, title, description, buttonText, url } = data;
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };
  
  return (
    <div 
      className={`${styles.slide} ${isActive ? styles.activeSlide : ''}`}
      aria-hidden={!isActive}
      role="group"
      aria-roledescription="slide"
    >
      <Link href={url || '#'} className={styles.slideLink}>
        <div className={styles.imageContainer}>
          <Image 
            src={image} 
            alt={title || "Banner slide"}
            fill // Bu avtomatik responsive edir
            className={`${styles.slideImage} ${isImageLoaded ? styles.imageLoaded : ''}`}
            priority={priority}
            draggable={false}
            onLoad={handleImageLoad}
            sizes="(max-width: 768px) 100vw, (max-width: 992px) 100vw, 80vw" // Responsive sizes
            style={{
              objectFit: 'cover',
              objectPosition: 'center 20%' // İnsanın tam görünməsi üçün daha yuxarı
            }}
            quality={90} // Keyfiyyəti artır
            placeholder="blur" // Loading zamanı blur effect
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=" // Transparent placeholder
          />
          
          {(title || description || buttonText) && (  
            <div className={styles.slideContent}>
              {title && (
                <h2 className={styles.slideTitle}>
                  {title}
                </h2>
              )}
              
              {description && (
                <p className={styles.slideDescription}>
                  {description}
                </p>
              )}
              
              {buttonText && (
                <button className={styles.slideButton} aria-label={buttonText}>
                  {buttonText}
                </button>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default BannerSlide;