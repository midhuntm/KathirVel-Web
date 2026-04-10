import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

const ProductGrid = ({ products, isLoading, error }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Derive unique categories from products
  const categories = useMemo(() => {
    if (!products) return ['All'];
    const uniqueCats = new Set(products.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(uniqueCats)];
  }, [products]);

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (selectedCategory === 'All') return products;
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <section className="product-grid-container" style={{ padding: '6rem 5%' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', fontWeight: 600 }}>
            Featured
          </span>
          <h2 className="product-grid-title" style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>Curated Selections</h2>
          <div style={{ width: '60px', height: '2px', background: 'var(--color-gold)', margin: '0 auto 2.5rem auto' }} />
          
          {/* Category Filter */}
          {!isLoading && !error && products && products.length > 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '1rem', 
              flexWrap: 'wrap',
              marginBottom: '3rem'
            }}>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: '0.6rem 1.5rem',
                    borderRadius: '999px',
                    border: `1px solid ${selectedCategory === category ? 'var(--color-gold)' : 'var(--color-gray-light)'}`,
                    background: selectedCategory === category ? 'var(--color-gold)' : 'transparent',
                    color: selectedCategory === category ? 'var(--color-white)' : 'var(--color-charcoal)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    fontWeight: selectedCategory === category ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all var(--transition-smooth)'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.borderColor = 'var(--color-gold)';
                      e.currentTarget.style.color = 'var(--color-black)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.borderColor = 'var(--color-gray-light)';
                      e.currentTarget.style.color = 'var(--color-charcoal)';
                    }
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {isLoading && (
          <p style={{ textAlign: 'center', color: 'var(--color-charcoal)', padding: '4rem' }}>
            Loading curated pieces...
          </p>
        )}

        {!isLoading && error && (
          <p style={{ textAlign: 'center', color: 'red', padding: '4rem' }}>
            {error}
          </p>
        )}

        {!isLoading && !error && products && products.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--color-charcoal)', padding: '4rem' }}>
            Our collection is currently being updated. Please check back shortly.
          </p>
        )}

        {!isLoading && !error && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="products-wrapper"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div 
                  key={product.id || product._id} 
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  layout
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredProducts.length === 0 && products.length > 0 && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--color-charcoal)', padding: '2rem 0' }}
              >
                No pieces found in this category.
              </motion.p>
            )}
          </motion.div>
        )}
        
        {!isLoading && !error && filteredProducts.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '5rem' }}>
            <button className="btn-secondary">View All Pieces</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
