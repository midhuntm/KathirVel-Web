import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

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

const ProductGrid = ({ products, isLoading, error }) => {
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
          {isLoading && (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Loading ornaments from MongoDB...
            </p>
          )}

          {!isLoading && error && (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#ffb3b3' }}>
              {error}
            </p>
          )}

          {!isLoading && !error && products.length === 0 && (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No ornaments found in the backend collection yet.
            </p>
          )}

          {!isLoading && !error && products.map((product, index) => (
            <motion.div key={product.id || product._id || index} variants={itemVariants}>
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
