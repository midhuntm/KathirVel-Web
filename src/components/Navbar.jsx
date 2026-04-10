import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, UserCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

const Navbar = ({ currentUser, onLoginClick, onLogoutClick, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="navbar" style={{
      background: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'var(--color-white)',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none'
    }}>
      <div className="navbar-brand" onClick={() => onNavigate('home')}>
        Kathir Vel
      </div>

      <div className="navbar-links desktop-nav">
        {['Shop', 'About', 'Contact', ...(currentUser?.role?.toLowerCase() === 'admin' ? ['Admin'] : [])].map((item) => (
          <a
            key={item}
            className="navbar-link"
            onClick={() => onNavigate(item.toLowerCase() === 'admin' ? 'admin' : 'home')}
          >
            {item}
          </a>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button
          onClick={() => currentUser ? onLogoutClick() : onLoginClick()}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'var(--color-charcoal)', fontWeight: 500 }}
        >
          <UserCircle2 size={24} />
          <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }} className="user-name-desktop">
            {currentUser ? currentUser.name : 'Login'}
          </span>
        </button>

        <button
          onClick={() => onNavigate('cart')}
          style={{ position: 'relative', background: 'transparent', color: 'var(--color-charcoal)' }}
        >
          <ShoppingBag size={24} />
          {cartCount > 0 && (
            <span style={{
              position: 'absolute', top: -8, right: -10,
              background: 'var(--color-gold)', color: 'var(--color-white)',
              fontSize: '0.7rem', width: '20px', height: '20px',
              borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>
              {cartCount}
            </span>
          )}
        </button>

        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)} style={{ background: 'transparent' }}>
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile menu (simplified for elegance) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%',
              background: 'var(--color-white)', zIndex: 200, padding: '2rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <div className="navbar-brand">Kathir Vel</div>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'transparent' }}><X size={28} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {['Shop', 'About', 'Contact', ...(currentUser?.role?.toLowerCase() === 'admin' ? ['Admin'] : [])].map((item) => (
                <a
                  key={item}
                  onClick={() => { onNavigate(item.toLowerCase() === 'admin' ? 'admin' : 'home'); setMobileMenuOpen(false); }}
                  style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--color-charcoal)' }}
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
