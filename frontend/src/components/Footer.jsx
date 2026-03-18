import React from 'react';

const Footer = () => {
  return (
    <footer className="glass" style={{ marginTop: '4rem', padding: '3rem 0', borderTop: '1px solid var(--border-color)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <div style={{ backgroundColor: 'var(--primary)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <span style={{ fontWeight: '800', fontSize: '1.1rem', letterSpacing: '-0.02em' }}>College<span className="gradient-text">Predictor</span></span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '400px', marginBottom: '1.5rem' }}>
              Empowering students with data-driven insights for KCET & COMEDK engineering admissions since 2024.
            </p>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
               <a href="mailto:debugspheres@gmail.com" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                 debugspheres@gmail.com
               </a>
               <a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
               </a>
            </div>
          </div>

          <div style={{ flex: '1 1 500px' }}>
            <div style={{ backgroundColor: 'var(--primary-light)', padding: '1.5rem', borderRadius: '16px', border: '1px dashed var(--primary)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', color: 'var(--primary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Important Disclaimer</h4>
              </div>
              <p style={{ color: 'var(--primary)', opacity: 0.8, fontSize: '0.85rem', lineHeight: '1.5', fontWeight: '500' }}>
                These prediction results are generated based on historical cutoff trends and should be used for reference purposes only. 
                Verify all information with official counseling authorities.
              </p>
            </div>
            
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
               <span style={{ backgroundColor: 'gold', width: '8px', height: '8px', borderRadius: '50%' }} />
               Need 1-to-1 Personalised Strategy? Contact <strong style={{color: 'var(--text-main)'}}>debugspheres@gmail.com</strong>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>&copy; 2024 College Predictor. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
             <a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>Privacy Policy</a>
             <a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
