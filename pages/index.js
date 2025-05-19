import BannerSection from '../components/sections/BannerSection';
import InfoCardsSection from '../components/sections/InfoCardsSection';
import ProductsSection from '../components/sections/ProductsSection';

export default function Home({ bannerData, featuresData, productsData }) {
  return (
    <main className="main">
      <BannerSection slides={bannerData} />
      <InfoCardsSection features={featuresData} />
      <ProductsSection products={productsData} />
    </main>
  );
}

// Server-side data fetching
export async function getServerSideProps() {
  // Düzgün API endpoint URL-ləri
  const ENDPOINTS = {
    banners: 'https://api.b-e.az/task/big-sliders',
    features: 'https://api.b-e.az/task/features',
    products: 'https://api.b-e.az/task/special-offer',
  };

  // Təhlükəsiz fetch üçün köməkçi funksiya
  const safeFetch = async (url) => {
    try {
      console.log(`Fetching from: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`API error: ${url} returned ${response.status} ${response.statusText}`);
        return [];
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching from ${url}:`, error.message);
      return [];
    }
  };

  try {
    // Paralel şəkildə məlumatları çək
    const [bannerData, featuresData, productsResponse] = await Promise.all([
      safeFetch(ENDPOINTS.banners),
      safeFetch(ENDPOINTS.features),
      safeFetch(ENDPOINTS.products),
    ]);
    
    // Debug üçün API cavablarını log et
    console.log('Products API response structure:', 
      Array.isArray(productsResponse) 
        ? `Array with ${productsResponse.length} items` 
        : typeof productsResponse
    );

    // API-dən gələn məhsul məlumatlarını emal et
    // API cavabı category qrupları olduğu üçün, onları düzgün formatda transformasiya edirik
    const processedProducts = [];
    
    if (Array.isArray(productsResponse)) {
      // Hər bir kateqoriya üçün
      productsResponse.forEach(category => {
        if (category && category.title && Array.isArray(category.products)) {
          // Kateqoriyadakı bütün məhsulları işlə və onlara kateqoriya əlavə et
          category.products.forEach(product => {
            // Məhsul məlumatlarını standartlaşdır və category sahəsini əlavə et
            processedProducts.push({
              id: product.id || `product-${Math.random().toString(36).substr(2, 9)}`,
              title: product.name || product.title || 'Məhsul adı',
              price: typeof product.price === 'number' ? product.price : parseFloat(product.price || 0),
              discount: typeof product.discount === 'number' ? product.discount : parseFloat(product.discount || 0),
              discounted_price: product.discounted_price || product.price,
              image: product.image || null,
              category: category.title || 'uncategorized',
              slug: product.slug || '',
              quantity: product.quantity || 0,
              perMonth: product.perMonth || null
            });
          });
        }
      });
    }
    
    console.log(`Processed ${processedProducts.length} products with categories`);

    // Props olaraq qaytar
    return {
      props: {
        bannerData: Array.isArray(bannerData) ? bannerData : [],
        featuresData: Array.isArray(featuresData) ? featuresData : [],
        productsData: processedProducts,
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error.message);
    
    return {
      props: {
        bannerData: [],
        featuresData: [],
        productsData: []
      },
    };
  }
}