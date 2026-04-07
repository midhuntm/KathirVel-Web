import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section style={{
      position: 'relative',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      paddingTop: '5rem'
    }}>
      {/* Background Image with Parallax */}
      <motion.div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          y: y1,
          opacity: opacity,
          backgroundImage: 'linear-gradient(to bottom, rgba(10, 10, 10, 0.3), var(--bg-primary)), url(/hero-ornament.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span style={{ 
            color: 'var(--accent-gold)', 
            textTransform: 'uppercase', 
            letterSpacing: '3px',
            fontSize: '0.9rem',
            fontWeight: 500,
            display: 'block',
            marginBottom: '1rem'
          }}>
            The 2026 Collection
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ 
            fontSize: 'clamp(3rem, 8vw, 6rem)', 
            marginBottom: '1.5rem',
            color: 'white',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}
        >
          Elegance in <br/>
          Every <span className="text-gold" style={{ fontStyle: 'italic' }}>Detail</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            maxWidth: '600px',
            margin: '0 auto 3rem auto',
            color: 'var(--text-primary)',
            fontSize: '1.1rem',
            textShadow: '0 2px 10px rgba(0,0,0,0.8)'
          }}
        >
          Discover handcrafted ornaments designed to bring timeless beauty and luxury to your special moments.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
        >
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem' }}>
            Shop Collection <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--text-secondary)'
        }}
      >
        <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          style={{ width: '1px', height: '30px', background: 'var(--accent-gold)' }}
        />
      </motion.div>
    </section>
  );
};

export default Hero;
