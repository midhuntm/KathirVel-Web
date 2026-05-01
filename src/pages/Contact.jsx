import React from 'react';

const Contact = () => (
  <section style={{ padding: '7rem 5% 4rem', background: '#f7f7f7', minHeight: '80vh' }}>
    <div className="container" style={{ maxWidth: '920px' }}>
      <p style={{ textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-gold-dark)', fontWeight: 600 }}>Contact</p>
      <h1 style={{ fontSize: '3rem', margin: '0.6rem 0 1.2rem' }}>Let’s Connect</h1>
      <p style={{ color: 'var(--color-charcoal)', marginBottom: '1.5rem' }}>
        For product questions, support, or custom requests, reach us using the details below.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.2rem', border: '1px solid #e9e9e9' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>Email</h3>
          <p>support@kathirvel.com</p>
        </div>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.2rem', border: '1px solid #e9e9e9' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>Phone</h3>
          <p>+91 90000 00000</p>
        </div>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.2rem', border: '1px solid #e9e9e9' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>Location</h3>
          <p>Coimbatore, Tamil Nadu</p>
        </div>
      </div>
    </div>
  </section>
);

export default Contact;
