import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://api.b-e.az" />
        <link rel="dns-prefetch" href="https://img.b-e.az" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
          media="print" 
          onLoad="this.media='all'" 
        />
        <noscript>
          <link 
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" 
            rel="stylesheet" 
          />
        </noscript>
        
        <link 
          rel="preload" 
          href="/fonts/SFPRODISPLAYREGULAR.OTF" 
          as="font" 
          type="font/otf" 
          crossOrigin="anonymous"
        />
        <link 
          rel="preload" 
          href="/fonts/SFPRODISPLAYMEDIUM.OTF" 
          as="font" 
          type="font/otf" 
          crossOrigin="anonymous"
        />
        <link 
          rel="preload" 
          href="/fonts/SFPRODISPLAYBOLD.OTF" 
          as="font" 
          type="font/otf" 
          crossOrigin="anonymous"
        />
        
        <style dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: 'SF Pro Display';
              src: url('/fonts/SFPRODISPLAYREGULAR.OTF') format('opentype');
              font-weight: 400;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: 'SF Pro Display';
              src: url('/fonts/SFPRODISPLAYMEDIUM.OTF') format('opentype');
              font-weight: 500;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: 'SF Pro Display';
              src: url('/fonts/SFPRODISPLAYBOLD.OTF') format('opentype');
              font-weight: 700;
              font-style: normal;
              font-display: swap;
            }
          `
        }} />
        
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}