import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  ogImage = '/og-image.png',
  ogType = 'website',
  canonical = window.location.href
}) => {
  const siteName = 'Rank2College';
  const fullTitle = title ? `${title} | ${siteName}` : 'KCET & COMEDK Rank Predictor 2024';

  return (
    <Helmet>
      {/* Standard SEO */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || "Personalized KCET & COMEDK Rank Predictor by Rank2College. Get accurate admission chances for Karnataka engineering colleges based on 2024-25 cutoff trends."} />
      <meta name="keywords" content={keywords || "KCET 2024 rank predictor, COMEDK college predictor 2024, Rank2College, KCET cutoff analysis, Karnataka engineering admission predictor, best rank predictor for KCET"} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": siteName,
          "url": canonical,
          "description": description || "Predict your Karnataka engineering college admission chances with Rank2College.",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Web"
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
