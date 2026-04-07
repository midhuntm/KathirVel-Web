import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      padding: '4rem 0 2rem 0',
      marginTop: '4rem'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem',
        marginBottom: '4rem'
      }}>
        
        <div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', letterSpacing: '2px' }}>
            AU<span className="text-gold">R</span>A
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '250px' }}>
            Elevating your spaces with timeless, handcrafted ornaments designed for luxury and elegance.
          </p>
        </div>

        <div>
          <h4 style={{ marginBottom: '1rem', fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Shop</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <li><a href="#">New Arrivals</a></li>
            <li><a href="#">Best Sellers</a></li>
            <li><a href="#">Glass Collection</a></li>
            <li><a href="#">Gold Plated</a></li>
          </ul>
        </div>

        <div>
          <h4 style={{ marginBottom: '1rem', fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Support</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Shipping & Returns</a></li>
            <li><a href="#">Care Guide</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h4 style={{ marginBottom: '1rem', fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Newsletter</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                padding: '0.75rem 1rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                width: '100%',
                borderRadius: '4px'
              }}
            />
            <button className="btn-primary" style={{ padding: '0.75rem 1rem' }}>
              Subscribe
            </button>
          </div>
        </div>

      </div>
      
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '2rem',
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-secondary)',
        fontSize: '0.8rem'
      }}>
        <p>&copy; {new Date().getFullYear()} Aura Ornaments. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="#">Instagram</a>
          <a href="#">Pinterest</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
