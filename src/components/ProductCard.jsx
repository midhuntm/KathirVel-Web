import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        background: 'var(--bg-secondary)',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid var(--glass-border)',
        position: 'relative'
      }}
    >
      <div style={{ position: 'relative', height: '350px', overflow: 'hidden' }}>
        <motion.img 
          src={product.image} 
          alt={product.name}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        
        {/* Hover overlay with button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(transparent, rgba(10,10,10,0.9))',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: '1.5rem'
          }}
        >
          <motion.button
            initial={{ y: 20 }}
            animate={{ y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
            className="btn-primary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.5rem 1.5rem',
              fontSize: '0.9rem'
            }}
          >
            <ShoppingBag size={16} /> Add to Cart
          </motion.button>
        </motion.div>
      </div>

      <div style={{ padding: '1.5rem', textAlign: 'center' }}>
        <span style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '0.8rem', 
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          {product.category}
        </span>
        <h3 style={{ margin: '0.5rem 0', fontSize: '1.2rem', fontFamily: 'var(--font-serif)' }}>
          {product.name}
        </h3>
        <p style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>
          ${product.price}
        </p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
