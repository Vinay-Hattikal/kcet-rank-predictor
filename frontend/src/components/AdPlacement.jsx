import { motion } from 'framer-motion';

const AdPlacement = ({ type = 'horizontal', label = 'Sponsored' }) => {
  // In production, this would contain the <ins> tag for Google AdSense
  // For now, we provide a premium-looking placeholder
  
  const styles = {
    horizontal: {
      width: '100%',
      height: '100px',
      margin: '2rem 0'
    },
    vertical: {
      width: '250px',
      height: '600px',
      margin: '0 1rem'
    },
    rectangle: {
      width: '300px',
      height: '250px',
      margin: '1rem'
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="ad-container"
      style={{
        ...styles[type],
        background: 'linear-gradient(135deg, hsl(215, 20%, 95%), hsl(215, 20%, 98%))',
        border: '1px dashed var(--border-color)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <span style={{ 
        position: 'absolute', 
        top: '4px', 
        right: '8px', 
        fontSize: '0.65rem', 
        color: 'var(--text-muted)',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {label}
      </span>
      
      <div style={{ padding: '1rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Ad Space</p>
        <div style={{ 
          width: '32px', 
          height: '2px', 
          background: 'var(--border-color)', 
          margin: '0 auto',
          borderRadius: '1px' 
        }} />
      </div>

      {/* Animation Overlay */}
      <motion.div 
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          pointerEvents: 'none'
        }}
      />
    </motion.div>
  );
};

export default AdPlacement;
