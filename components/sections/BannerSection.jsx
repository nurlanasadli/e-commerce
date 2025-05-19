import BannerSlider from './BannerSlider';

const BannerSection = ({ slides = [] }) => {
  if (!slides.length) {
    return <div className="banner-section banner-section--empty">Loading banner...</div>;
  }

  return (
    <section className="banner-section">
      <BannerSlider slides={slides} />
    </section>
  );
};

export default BannerSection;