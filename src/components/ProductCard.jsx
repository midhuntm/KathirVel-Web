import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../store/cartSlice';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productId = product.id || product._id;
  const primaryImage =
    product.image ||
    (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null) ||
    'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart(product));
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${productId}`)}
      className="product-card"
      style={{
        background: 'var(--color-white)',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid var(--color-gray-light)',
        boxShadow: isHovered ? 'var(--shadow-hover)' : 'var(--shadow-subtle)',
        transition: 'all var(--transition-smooth)',
        position: 'relative'
      }}
    >
      <div style={{ position: 'relative', height: '350px', overflow: 'hidden' }}>
        <motion.img 
          src={primaryImage}
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
            background: 'linear-gradient(transparent, rgba(26,26,26,0.8))',
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
            onClick={handleAddToCart}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.6rem 1.5rem',
              fontSize: '0.9rem',
              borderRadius: '4px'
            }}
          >
            <ShoppingBag size={16} /> Add to Cart
          </motion.button>
        </motion.div>
      </div>

      <div style={{ padding: '1.5rem', textAlign: 'center' }}>
        <span style={{ 
          color: 'var(--color-charcoal)', 
          fontSize: '0.8rem', 
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          {product.category}
        </span>
        <h3 style={{ margin: '0.5rem 0', fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: 'var(--color-black)' }}>
          {product.name}
        </h3>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)' }}>
          <span style={{ color: 'var(--color-black)', fontWeight: 600 }}>
            Rs. {Number(product.price).toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <>
              <span style={{ color: 'var(--color-charcoal)', textDecoration: 'line-through', fontSize: '0.9rem', opacity: 0.7 }}>
                Rs. {Number(product.originalPrice).toFixed(2)}
              </span>
              <span style={{ color: '#28a745', fontWeight: 600, fontSize: '0.9rem' }}>
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
