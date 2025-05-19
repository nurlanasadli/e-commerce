import { memo } from 'react';
import Card from '../ui/Card';

// Performance optimization with React.memo
const InfoCard = memo(({ icon, title, description }) => (
  <Card className="info-card">
    <div className="info-card__icon">
      <img 
        src={icon} 
        alt=""  
        className="info-card__icon-img" 
        loading="lazy" 
        width={24} 
        height={24}
      />
    </div>
    <div className="info-card__content">
      <h3 className="info-card__title">{title}</h3>
      <p className="info-card__description">{description}</p>
    </div>
  </Card>
));

InfoCard.displayName = 'InfoCard'; 

const InfoCardsSection = ({ features = [] }) => {
  if (!features.length) {
    return (
      <section className="info-cards-section info-cards-section--empty" aria-hidden="true">
        <div className="container">
          <div className="info-cards-grid">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="info-card info-card--skeleton">
                <div className="info-card__icon info-card__icon--skeleton" />
                <div className="info-card__content">
                  <div className="info-card__title--skeleton" />
                  <div className="info-card__description--skeleton" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="info-cards-section">
      <div className="container">
        <div className="info-cards-grid">
          {features.map((feature, index) => (
            <InfoCard 
              key={feature.id || index}
              icon={feature.icon} 
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoCardsSection;