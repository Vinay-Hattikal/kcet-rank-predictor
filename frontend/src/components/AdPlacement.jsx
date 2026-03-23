import { useEffect } from 'react';
import { motion } from 'framer-motion';

const AdPlacement = ({ type = 'horizontal', adSlot, adClient = 'ca-pub-YOUR_PUBLISHER_ID' }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn('AdSense error:', e);
    }
  }, []);

  const styles = {
    horizontal: { width: '100%', minHeight: '100px', margin: '2rem 0' },
    vertical: { width: '250px', minHeight: '600px', margin: '0 1rem' },
    rectangle: { width: '300px', minHeight: '250px', margin: '1rem' }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="ad-container"
      style={{
        ...styles[type],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
      {/* Real AdSense Tag */}
      <ins className="adsbygoogle"
           style={{ display: 'block', width: '100%', height: '100%' }}
           data-ad-client={adClient}
           data-ad-slot={adSlot}
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      
      {/* Placeholder Fallback (only visible if ad doesn't load) */}
      <div style={{ position: 'absolute', zIndex: -1, color: '#9ca3af', fontSize: '0.75rem' }}>
        Advertisement Space
      </div>
    </motion.div>
  );
};

export default AdPlacement;
