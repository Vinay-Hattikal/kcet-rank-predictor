import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAdmin = localStorage.getItem('role') === 'admin';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Compare', path: '/compare' },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Admin', path: '/admin' });
  }

  return (
    <nav className="navbar glass">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{ backgroundColor: 'var(--primary)', padding: '8px', borderRadius: '12px', display: 'flex' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em' }}>CollegePredictor</span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-nav desktop-nav" style={{ display: 'none' }}>
           {navLinks.map(link => (
             <Link 
               key={link.path} 
               to={link.path} 
               className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
               style={{ 
                 padding: '0.5rem 1rem', 
                 color: location.pathname === link.path ? 'var(--primary)' : 'var(--text-muted)',
                 fontWeight: location.pathname === link.path ? '700' : '500',
                 textDecoration: 'none',
                 fontSize: '0.95rem',
                 transition: 'color 0.2s' 
               }}
             >
               {link.name}
             </Link>
           ))}
           {isAdmin && (
              <button 
                onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
              >
                Logout
              </button>
           )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          style={{ display: 'block', background: 'hsl(215, 20%, 95%)', border: 'none', cursor: 'pointer', padding: '10px', borderRadius: '12px', color: 'var(--text-main)' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {isOpen ? <path d="M18 6L6 18M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mobile-menu"
            style={{ 
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'var(--surface)',
              borderTop: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 100
            }}
          >
            <div className="container" style={{ padding: '1.5rem' }}>
              <div className="flex flex-col gap-4">
                {navLinks.map(link => (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    onClick={() => setIsOpen(false)}
                    style={{ 
                      fontSize: '1.125rem', 
                      padding: '1rem', 
                      borderRadius: '12px',
                      background: location.pathname === link.path ? 'var(--primary-light)' : 'transparent',
                      color: location.pathname === link.path ? 'var(--primary)' : 'var(--text-main)', 
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
                {isAdmin && (
                  <button 
                    onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                    className="btn btn-primary"
                    style={{ marginTop: '0.5rem' }}
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .navbar { height: 5rem; display: flex; align-items: center; position: sticky; top: 0; z-index: 1000; transition: box-shadow 0.3s; }
        .navbar-container { display: flex; justify-content: space-between; align-items: center; width: 100%; }
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; gap: 0.5rem; align-items: center; }
          .mobile-toggle { display: none !important; }
        }
        .nav-link { position: relative; border-radius: 8px; }
        .nav-link:hover { color: var(--primary) !important; background: var(--primary-light); }
        .nav-link.active::after { content: ''; position: absolute; bottom: 4px; left: 1rem; right: 1rem; height: 3px; background: var(--primary); border-radius: 4px; display: none; }
      `}} />
    </nav>
  );
};

export default Navbar;
