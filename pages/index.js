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

export async function getServerSideProps() {
  const ENDPOINTS = {
    banners: 'https://api.b-e.az/task/big-sliders',
    features: 'https://api.b-e.az/task/features',
    products: 'https://api.b-e.az/task/special-offer',
  };

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
    const [bannerData, featuresData, productsResponse] = await Promise.all([
      safeFetch(ENDPOINTS.banners),
      safeFetch(ENDPOINTS.features),
      safeFetch(ENDPOINTS.products),
    ]);
    
    console.log('Products API response structure:', 
      Array.isArray(productsResponse) 
        ? `Array with ${productsResponse.length} items` 
        : typeof productsResponse
    );

    const processedProducts = [];
    
    if (Array.isArray(productsResponse)) {
      productsResponse.forEach(category => {
        if (category && category.title && Array.isArray(category.products)) {
          category.products.forEach(product => {
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