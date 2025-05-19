import Image from 'next/image';
import Link from 'next/link';
import styles from './BannerSlider.module.css';

const BannerSlide = ({ data, isActive, priority = false }) => {
  const { id, image, title, description, buttonText, url } = data;
  
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
            alt={title || 'Banner slide'}
            fill
            sizes="(max-width: 992px) 100vw, 80vw"
            priority={priority}
            quality={90}
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIj48c3RvcCBzdG9wLWNvbG9yPSIjZjVmNWY1IiBvZmZzZXQ9IjIwJSIgLz48c3RvcCBzdG9wLWNvbG9yPSIjZWVlIiBvZmZzZXQ9IjUwJSIgLz48c3RvcCBzdG9wLWNvbG9yPSIjZjVmNWY1IiBvZmZzZXQ9IjcwJSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiNmNWY1ZjUiIC8+PHJlY3QgaWQ9InIiIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0idXJsKCNnKSIgLz48YW5pbWF0ZSB4bGluazpocmVmPSIjciIgYXR0cmlidXRlTmFtZT0ieCI8L2FuaW1hdGU+PC9zdmc+"
          />
        </div>
        
        {(title || description) && (
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
              <button className={styles.slideButton}>
                {buttonText}
              </button>
            )}
          </div>
        )}
      </Link>
    </div>
  );
};

export default BannerSlide;