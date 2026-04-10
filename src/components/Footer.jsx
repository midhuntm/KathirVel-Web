import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--color-gray-light)',
      padding: '4rem 5% 2rem 5%',
      backgroundColor: 'var(--color-white)'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '3rem',
        marginBottom: '4rem',
        alignItems: 'start'
      }}>

        <div>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', letterSpacing: '2px', fontFamily: 'var(--font-heading)', color: 'var(--color-gold-dark)', textTransform: 'uppercase' }}>
            Kathir <span style={{ color: 'var(--color-black)' }}>Vel</span>
          </h3>
          <p style={{ color: 'var(--color-charcoal)', fontSize: '0.95rem', maxWidth: '280px', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
            Elevating your spaces with timeless, handcrafted ornaments designed meticulously for luxury and absolute elegance.
          </p>
        </div>

        <div>
          <h4 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-black)' }}>Shop</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--color-charcoal)', fontSize: '0.95rem', fontFamily: 'var(--font-body)' }}>
            <li><a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>New Arrivals</a></li>
            <li><a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>Best Sellers</a></li>
            <li><a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>Glass Collection</a></li>
            <li><a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>Gold Plated</a></li>
          </ul>
        </div>

        <div>
          <h4 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-black)' }}>Support</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--color-charcoal)', fontSize: '0.95rem', fontFamily: 'var(--font-body)' }}>
            <li><a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>FAQ</a></li>
            <li><a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>Shipping & Returns</a></li>
            <li><a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>Care Guide</a></li>
            <li><a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h4 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-black)' }}>Newsletter</h4>
          <p style={{ color: 'var(--color-charcoal)', fontSize: '0.95rem', marginBottom: '1rem', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                background: 'var(--color-white)',
                border: '1px solid var(--color-gray-light)',
                padding: '0.8rem 1.2rem',
                color: 'var(--color-black)',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                width: '100%',
                borderRadius: '4px',
                fontSize: '0.95rem'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-gold)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-gray-light)'}
            />
            <button className="btn-primary" style={{ padding: '0.8rem 1.5rem', whiteSpace: 'nowrap' }}>
              Subscribe
            </button>
          </div>
        </div>

      </div>

      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '2.5rem',
        borderTop: '1px solid var(--color-gray-light)',
        color: 'var(--color-charcoal)',
        fontSize: '0.9rem',
        fontFamily: 'var(--font-body)',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <p>&copy; {new Date().getFullYear()} Kathir Vel. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>Instagram</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>Pinterest</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
