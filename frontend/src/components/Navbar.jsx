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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Compare', path: '/compare' },
    { name: 'Premium', path: '/premium-counseling' },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Admin', path: '/admin' });
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
        background: scrolled ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
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

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          style={{ background: 'var(--primary-light)', border: 'none', cursor: 'pointer', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)', zIndex: 999 }}
            />
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'var(--surface)',
                borderTop: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 1000,
                overflow: 'hidden'
              }}
            >
              <div className="container" style={{ padding: '2rem 1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {navLinks.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      style={{
                        fontSize: '1.25rem',
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-lg)',
                        background: location.pathname === link.path ? 'var(--primary-light)' : 'var(--bg-color)',
                        color: location.pathname === link.path ? 'var(--primary)' : 'var(--text-main)',
                        fontWeight: '800',
                        textDecoration: 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      {link.name}
                      <ChevronRight size={18} opacity={0.5} />
                    </Link>
                  ))}
                  {isAdmin && (
                    <button
                      onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                      className="btn btn-primary"
                      style={{ marginTop: '1rem', padding: '1.25rem' }}
                    >
                      <LogOut size={20} /> Logout Account
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .desktop-nav { display: none !important; }
        .mobile-toggle { display: block !important; }
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
