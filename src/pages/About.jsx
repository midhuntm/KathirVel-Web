import React from 'react';

const About = () => (
  <section style={{ padding: '7rem 5% 4rem', background: 'linear-gradient(180deg, #fffdf8 0%, #f8f4ec 100%)', minHeight: '80vh' }}>
    <div className="container" style={{ maxWidth: '920px' }}>
      <p style={{ textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-gold-dark)', fontWeight: 600 }}>About Kathir Vel</p>
      <h1 style={{ fontSize: '3rem', margin: '0.6rem 0 1.2rem' }}>Handcrafted Jewelry with a Modern Touch</h1>
      <p style={{ color: 'var(--color-charcoal)', fontSize: '1.05rem', lineHeight: 1.9 }}>
        Kathir Vel curates timeless ornaments inspired by South Indian artistry and everyday elegance. Each piece is selected for quality,
        finish, and comfort so customers can wear statement jewelry with confidence.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        {[
          ['Craft Focus', 'Detailed finishing, skin-safe materials, and premium quality checks.'],
          ['Design Language', 'Traditional silhouettes refined for modern styling.'],
          ['Customer Promise', 'Transparent pricing and careful product curation.'],
        ].map(([title, text]) => (
          <article key={title} style={{ background: '#fff', borderRadius: '12px', padding: '1.2rem', border: '1px solid #ece3d1' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{title}</h3>
            <p style={{ color: '#4c4c4c' }}>{text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default About;
