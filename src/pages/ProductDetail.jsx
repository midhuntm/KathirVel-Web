import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { fetchOrnamentById } from '../services/api';

const ProductDetail = ({ ornaments }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [fullProduct, setFullProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const listProduct = useMemo(() => ornaments.find((item) => (item.id || item._id) === id), [ornaments, id]);
  const product = fullProduct || listProduct;

  useEffect(() => {
    let mounted = true;
    const loadFullProduct = async () => {
      try {
        setIsLoading(true);
        const item = await fetchOrnamentById(id);
        if (mounted) setFullProduct(item);
      } catch (error) {
        if (mounted) setFullProduct(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    loadFullProduct();
    return () => {
      mounted = false;
    };
  }, [id]);

  const images = useMemo(() => {
    if (!product) return [];
    const fromList = Array.isArray(product.images) ? product.images : [];
    const combined = [product.image, ...fromList].filter(Boolean);
    return [...new Set(combined)];
  }, [product]);

  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading && !product) {
    return <div style={{ padding: '8rem 5%', textAlign: 'center' }}>Loading product...</div>;
  }

  if (!product) {
    return <div style={{ padding: '8rem 5%', textAlign: 'center' }}>Product not found.</div>;
  }

  const onAddCart = () => dispatch(addToCart(product));
  const offPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <section style={{ padding: '7rem 5% 3rem', background: '#fff' }}>
      <div style={{ marginBottom: '1rem' }}>
        <button className="btn-secondary" onClick={() => navigate('/shop')}>
          Back to shop
        </button>
      </div>
      <div className="product-detail-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)', gap: '2rem' }}>
        <div>
          <div style={{ border: '1px solid #e8e8e8', borderRadius: '12px', overflow: 'hidden', height: '520px' }}>
            <img
              src={images[selectedImage]}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.8rem', flexWrap: 'wrap' }}>
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => setSelectedImage(index)}
                  style={{
                    border: selectedImage === index ? '2px solid #c69a4a' : '1px solid #ddd',
                    padding: 0,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    width: '76px',
                    height: '76px',
                  }}
                >
                  <img src={image} alt={`${product.name}-${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p style={{ color: '#6c6c6c', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{product.category || 'General'}</p>
          <h1 style={{ fontSize: '2.2rem', lineHeight: 1.25, marginBottom: '1rem' }}>{product.name}</h1>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.7rem', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700 }}>Rs. {Number(product.price).toFixed(2)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span style={{ color: '#777', textDecoration: 'line-through' }}>Rs. {Number(product.originalPrice).toFixed(2)}</span>
            )}
            {offPercent ? <span style={{ color: '#188038', fontWeight: 600 }}>{offPercent}% off</span> : null}
          </div>

          {product.description ? <p style={{ color: '#444', marginBottom: '1.5rem' }}>{product.description}</p> : null}

          <div style={{ display: 'grid', gap: '0.75rem', maxWidth: '360px' }}>
            <button className="btn-primary" onClick={onAddCart}>Add to cart</button>
            {product.amazonUrl ? (
              <a className="btn-secondary" href={product.amazonUrl} target="_blank" rel="noreferrer" style={{ textAlign: 'center' }}>
                Buy on Amazon
              </a>
            ) : null}
            {product.flipkartUrl ? (
              <a className="btn-secondary" href={product.flipkartUrl} target="_blank" rel="noreferrer" style={{ textAlign: 'center' }}>
                Buy on Flipkart
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
