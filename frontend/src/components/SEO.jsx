import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  ogImage = '/og-image.png',
  ogType = 'website',
  canonical: propCanonical,
  structuredData
}) => {
  const [canonicalURL, setCanonicalURL] = useState('');

  useEffect(() => {
    setCanonicalURL(propCanonical || window.location.href);
  }, [propCanonical]);

  const siteName = 'Rank2College';
  const fullTitle = title ? `${title} | ${siteName}` : 'KCET & COMEDK Rank Predictor 2026';

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": siteName,
    "url": canonicalURL || "https://rank2college.in",
    "description": description || "Predict your Karnataka engineering college admission chances with Rank2College.",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web"
  };

  return (
    <Helmet>
      {/* Standard SEO */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || "Personalized KCET & COMEDK Rank Predictor by Rank2College. Get accurate admission chances for Karnataka engineering colleges based on 2025-26 cutoff trends."} />
      <meta name="keywords" content={keywords || "KCET 2026 rank predictor, COMEDK college predictor 2026, Rank2College, KCET cutoff analysis, Karnataka engineering admission predictor, best rank predictor for KCET"} />
      {canonicalURL && <link rel="canonical" href={canonicalURL} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {canonicalURL && <meta property="og:url" content={canonicalURL} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      {structuredData ? (
         <script type="application/ld+json">
           {JSON.stringify(structuredData)}
         </script>
      ) : (
        <script type="application/ld+json">
          {JSON.stringify(defaultStructuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
