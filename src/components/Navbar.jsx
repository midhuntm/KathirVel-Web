import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
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
        <a href="#" style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', fontWeight: 600, letterSpacing: '2px' }}>
          VETRI<span className="text-gold">VEL</span>
        </a>

        {/* Desktop Links */}
        <div style={{ display: 'none' }} className="desktop-nav">
          <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', alignItems: 'center' }}>
            {['Collections', 'Story', 'Gifting'].map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`} style={{ fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
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
              {['Collections', 'Story', 'Gifting'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
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
        .cart-btn {
          transition: all 0.2s ease;
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;
