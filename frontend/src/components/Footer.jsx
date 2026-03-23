import { Link } from 'react-router-dom';
import { Mail, Instagram, ShieldCheck, ExternalLink, GraduationCap, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="footer" style={{ marginTop: '6rem', padding: '5rem 0 3rem', background: 'var(--surface)', borderTop: '1px solid var(--border-color)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
          
          {/* Brand Column */}
          <div style={{ flex: '1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ backgroundColor: 'var(--primary)', padding: '8px', borderRadius: '12px', display: 'flex' }}>
                <GraduationCap size={20} color="white" />
              </div>
              <span style={{ fontWeight: '900', fontSize: '1.35rem', letterSpacing: '-0.03em' }}>Rank2<span className="gradient-text">College</span></span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.7', maxWidth: '380px', marginBottom: '2rem', fontWeight: 500 }}>
              Helping students navigate the complex KCET & COMEDK counseling process with data-driven accuracy since 2024.
            </p>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
               <a href="mailto:mail-debugspheres@gmail.com" className="btn btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                 <Mail size={16} /> mail-debugspheres@gmail.com
               </a>
               <motion.a 
                whileHover={{ scale: 1.05, color: 'var(--primary)' }}
                href="https://www.instagram.com/mycetguide" 
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem' }}
               >
                 <Instagram size={20} /> @mycetguide
               </motion.a>
               <motion.a 
                whileHover={{ scale: 1.05, color: 'var(--text-main)' }}
                href="https://github.com/Vinay-Hattikal/kcet-rank-predictor" 
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem' }}
               >
                 <Github size={20} /> GitHub
               </motion.a>
            </div>
          </div>

          {/* Info Column */}
          <div style={{ flex: '1' }}>
            <div style={{ background: 'var(--primary-light)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--primary)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>
                <ShieldCheck size={20} />
                <h4 style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Usage Policy</h4>
              </div>
              <p style={{ color: 'var(--primary-dark)', opacity: 0.9, fontSize: '0.9rem', lineHeight: '1.6', fontWeight: '500' }}>
                Prediction algorithm uses historical trends for estimation. Final seats are governed by official counseling authorities. Verify data on official portals.
              </p>
              {/* Subtle background decoration */}
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', background: 'var(--primary)', opacity: 0.05, borderRadius: '50%' }}></div>
            </div>
            
            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
               <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--secondary)' }}></div>
               Need Expert Help? <Link to="/contact" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>Contact Strategy Team <ExternalLink size={14} /></Link>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div style={{ paddingTop: '2.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>&copy; 2024 Rank2College by <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>Debug Spheres</span>. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
             <Link to="/about" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>About</Link>
             <Link to="/contact" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>Contact</Link>
             <Link to="/privacy-policy" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>Privacy</Link>
             <Link to="/terms-of-service" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>Terms</Link>
             <Link to="/disclaimer" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
