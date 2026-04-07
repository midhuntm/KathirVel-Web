import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const MOCK_PRODUCTS = [
  { id: 1, name: 'The Royal Sapphire', price: 145, category: 'Silver Collection', image: '/product-1.png' },
  { id: 2, name: 'Golden Sunburst', price: 185, category: 'Gold Plated', image: '/hero-ornament.png' }, // reusing hero temporarily
  { id: 3, name: 'Midnight Sparkle', price: 120, category: 'Glass Collection', image: '/product-1.png' },
  { id: 4, name: 'Ethereal Pearl', price: 210, category: 'Signature', image: '/hero-ornament.png' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const ProductGrid = () => {
  return (
    <section id="collections" style={{ padding: '8rem 0' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>
            Featured
          </span>
          <h2 style={{ fontSize: '3rem', marginTop: '0.5rem' }}>Curated Selections</h2>
          <div style={{ width: '60px', height: '2px', background: 'var(--accent-gold)', margin: '2rem auto' }} />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2.5rem'
          }}
        >
          {MOCK_PRODUCTS.map(product => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
        
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <button className="btn-outline">View All Pieces</button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
