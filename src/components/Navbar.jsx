import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, UserCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ currentUser, onLoginClick, onLogoutClick, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '1rem 0',
        transition: 'all 0.3s ease',
        background: isScrolled ? 'var(--glass-bg)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(12px)' : 'none',
        borderBottom: isScrolled ? '1px solid var(--glass-border)' : '1px solid transparent'
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        {/* Logo */}
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
          style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', fontWeight: 600, letterSpacing: '2px' }}
        >
          VETRI<span className="text-gold">VEL</span>
        </a>

        {/* Desktop Links */}
        <div style={{ display: 'none' }} className="desktop-nav">
          <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', alignItems: 'center' }}>
            {['Collections', 'Story', 'Gifting', ...(currentUser?.role?.toLowerCase() === 'admin' ? ['Orders'] : [])].map((item) => (
              <li key={item}>
                <a 
                  href={`#${item.toLowerCase()}`} 
                  onClick={() => {
                    const view = item === 'Orders' ? 'admin' : 'home';
                    onNavigate(view);
                  }}
                  style={{ fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button
            className="login-btn"
            onClick={() => { if (!currentUser) onLoginClick(); else onLogoutClick(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-primary)',
              border: '1px solid var(--glass-border)',
              borderRadius: '999px',
              padding: '0.6rem 1rem',
              background: 'rgba(255,255,255,0.03)'
            }}
          >
            <UserCircle2 size={18} />
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {currentUser ? currentUser.name : 'Login'}
            </span>
          </button>

          <button className="cart-btn" style={{ position: 'relative', color: 'var(--text-primary)' }}>
            <ShoppingBag size={20} />
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-8px',
              background: 'var(--accent-gold)',
              color: 'var(--bg-primary)',
              fontSize: '0.6rem',
              fontWeight: 600,
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>0</span>
          </button>

          <button
            className="mobile-menu-btn"
            style={{ color: 'var(--text-primary)' }}
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              background: 'var(--bg-primary)',
              zIndex: 100,
              padding: '2rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
              <span style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', fontWeight: 600 }}>
                AU<span className="text-gold">R</span>A
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: 'var(--text-primary)' }}
              >
                <X size={24} />
              </button>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '2rem', listStyle: 'none' }}>
              {['Collections', 'Story', 'Gifting', ...(currentUser?.role?.toLowerCase() === 'admin' ? ['Orders'] : [])].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    onClick={() => {
                      const view = item === 'Orders' ? 'admin' : 'home';
                      onNavigate(view);
                      setMobileMenuOpen(false);
                    }}
                    style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)' }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: block !important; }
          .mobile-menu-btn { display: none !important; }
        }
        .cart-btn:hover {
          color: var(--accent-gold) !important;
          transform: scale(1.1);
        }
        .login-btn:hover {
          color: var(--accent-gold) !important;
          border-color: rgba(212, 175, 55, 0.45) !important;
          transform: translateY(-1px);
        }
        .cart-btn {
          transition: all 0.2s ease;
        }
        .login-btn {
          transition: all 0.2s ease;
        }
        @media (max-width: 767px) {
          .login-btn span {
            display: none;
          }
          .login-btn {
            padding: 0.6rem;
          }
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;
