import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <span style={{ 
          color: 'var(--color-gold)', 
          textTransform: 'uppercase', 
          letterSpacing: '4px',
          fontSize: '0.9rem',
          fontWeight: 600,
          display: 'block',
          marginBottom: '1rem'
        }} className="animate-fade-in">
          The 2026 Collection
        </span>
        
        <h1>
          Elegance in Every <span style={{ color: 'var(--color-gold)', fontStyle: 'italic' }}>Detail</span>
        </h1>
        
        <p>
          Discover handcrafted ornaments designed to bring timeless beauty and premium luxury to your special moments.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', animation: 'fadeIn 2s ease-out' }}>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Shop Collection <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
