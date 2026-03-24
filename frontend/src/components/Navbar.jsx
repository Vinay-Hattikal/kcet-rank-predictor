import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Menu, X, LogOut, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isAdmin = localStorage.getItem('role') === 'admin';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Compare', path: '/compare', icon: '⚖️' },
    { name: 'Blog', path: '/blog', icon: '📝' },
    { name: 'Premium', path: '/premium-counseling', icon: '⭐' },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Admin', path: '/admin', icon: '🔐' });
  }

  return (
    <nav
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      style={{
        height: '5rem',
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-color)' : '1px solid transparent'
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <motion.div
            whileHover={{ rotate: 5 }}
            style={{ backgroundColor: 'var(--primary)', padding: '10px', borderRadius: '14px', display: 'flex', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)' }}
          >
            <GraduationCap size={24} color="white" />
          </motion.div>
          <span className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.03em' }}>Rank2College</span>
        </Link>

        {/* Desktop Nav */}
        <div className="desktop-nav" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              style={{
                padding: '0.6rem 1.25rem',
                color: location.pathname === link.path ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: location.pathname === link.path ? '800' : '600',
                textDecoration: 'none',
                fontSize: '0.95rem',
                borderRadius: 'var(--radius-md)',
                transition: 'all 0.2s ease',
                background: location.pathname === link.path ? 'var(--primary-light)' : 'transparent'
              }}
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <button
              onClick={() => { localStorage.clear(); window.location.href = '/'; }}
              className="btn btn-secondary"
              style={{ marginLeft: '1rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <motion.button
          className="mobile-toggle"
          onClick={() => setIsOpen(true)}
          whileTap={{ scale: 0.93 }}
          style={{
            background: 'var(--primary-light)',
            border: 'none',
            cursor: 'pointer',
            padding: '10px',
            borderRadius: '12px',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Menu size={24} />
        </motion.button>
      </div>

      {/* Mobile Side Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop — clicking this closes the menu */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(6px)',
                zIndex: 1998
              }}
            />

            {/* Drawer Panel */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: 'min(85vw, 310px)',
                background: 'white',
                zIndex: 1999,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '-8px 0 40px rgba(0,0,0,0.2)',
                borderRadius: '24px 0 0 24px',
                overflow: 'hidden'
              }}
            >
              {/* ── Drawer Header ── */}
              <div style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                padding: '2rem 1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '12px', display: 'flex' }}>
                    <GraduationCap size={20} color="white" />
                  </div>
                  <span style={{ color: 'white', fontWeight: '900', fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
                    Rank2College
                  </span>
                </div>
                {/* ✕ Close Button inside drawer */}
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'white',
                    transition: 'background 0.2s'
                  }}
                >
                  <X size={22} />
                </button>
              </div>

              {/* ── Nav Links ── */}
              <div style={{ flex: 1, padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', overflowY: 'auto' }}>
                <p style={{
                  fontSize: '0.72rem', fontWeight: '800', color: '#9ca3af',
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  paddingLeft: '0.5rem', marginBottom: '0.5rem'
                }}>
                  Pages
                </p>

                {navLinks.map((link, i) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 + 0.05 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.85rem 1rem',
                          borderRadius: '14px',
                          background: isActive
                            ? 'linear-gradient(135deg, #ede9fe, #e0e7ff)'
                            : '#f9fafb',
                          border: isActive ? '1.5px solid #a5b4fc' : '1.5px solid transparent',
                          color: isActive ? '#4f46e5' : '#374151',
                          fontWeight: isActive ? '800' : '600',
                          fontSize: '1rem',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '1.2rem' }}>{link.icon}</span>
                          {link.name}
                        </div>
                        <ChevronRight size={16} style={{ opacity: 0.35 }} />
                      </Link>
                    </motion.div>
                  );
                })}

                {isAdmin && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                    <button
                      onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                      style={{
                        width: '100%',
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.85rem 1rem', borderRadius: '14px',
                        background: '#fef2f2', border: '1.5px solid #fca5a5',
                        color: '#dc2626', fontWeight: '700', fontSize: '1rem',
                        cursor: 'pointer', marginTop: '0.25rem'
                      }}
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </motion.div>
                )}
              </div>

              {/* ── Bottom CTA ── */}
              <div style={{ padding: '1rem', borderTop: '1px solid #f3f4f6' }}>
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    padding: '1rem', borderRadius: '14px',
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    color: 'white', fontWeight: '800', fontSize: '1rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 15px rgba(79,70,229,0.4)'
                  }}
                >
                  ⚡ Predict My College — Free
                </Link>
                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.6rem', fontWeight: 500 }}>
                  100% Free · No Signup Required
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .desktop-nav { display: none !important; }
        .mobile-toggle { display: flex !important; }
        @media (min-width: 992px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        .nav-link:hover { color: var(--primary) !important; background: var(--primary-light) !important; }
      `}</style>
    </nav>
  );
};

export default Navbar;
