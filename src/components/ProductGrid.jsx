import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.2 } },
};

const sortOptions = {
  newest: 'Date, new to old',
  priceLowHigh: 'Price, low to high',
  priceHighLow: 'Price, high to low',
  nameAZ: 'Name, A to Z',
};

const ProductGrid = ({ products, isLoading, error }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const categories = useMemo(() => {
    const counts = {};
    (products || []).forEach((item) => {
      const key = item.category || 'General';
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
  }, [products]);

  const normalizedProducts = useMemo(
    () =>
      (products || []).map((item, index) => ({
        ...item,
        _index: index,
        _price: Number(item.price || 0),
        _inStock: !item.soldOut,
      })),
    [products],
  );

  const filteredProducts = useMemo(() => {
    let next = [...normalizedProducts];

    if (selectedCategories.length > 0) {
      next = next.filter((item) => selectedCategories.includes(item.category || 'General'));
    }

    if (inStockOnly) {
      next = next.filter((item) => item._inStock);
    }

    if (maxPrice !== '' && !Number.isNaN(Number(maxPrice))) {
      next = next.filter((item) => item._price <= Number(maxPrice));
    }

    if (sortBy === 'priceLowHigh') next.sort((a, b) => a._price - b._price);
    if (sortBy === 'priceHighLow') next.sort((a, b) => b._price - a._price);
    if (sortBy === 'nameAZ') next.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'newest') next.sort((a, b) => b._index - a._index);

    return next;
  }, [normalizedProducts, selectedCategories, inStockOnly, maxPrice, sortBy]);

  const toggleCategory = (category) => {
    setSelectedCategories((current) =>
      current.includes(category) ? current.filter((item) => item !== category) : [...current, category],
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setInStockOnly(false);
    setMaxPrice('');
    setSortBy('newest');
  };

  return (
    <section className="product-grid-container" style={{ padding: '2.5rem 5% 4rem', background: 'linear-gradient(180deg, #fbfaf7 0%, #f3f1ed 100%)' }}>
      <div className="shop-layout" style={{ display: 'grid', gridTemplateColumns: '280px minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
        <aside
          className="filters-panel"
          style={{
            position: 'sticky',
            top: '90px',
            alignSelf: 'start',
            background: 'linear-gradient(180deg, #f7f6f3 0%, #f1efea 100%)',
            border: '1px solid #e3ded1',
            borderRadius: '16px',
            padding: '1.2rem 1rem 1.3rem',
            boxShadow: '0 12px 26px rgba(33, 28, 14, 0.08)',
          }}
        >
          <h3 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>Filters</h3>
          <p style={{ color: '#555', marginBottom: '1rem' }}>{filteredProducts.length} products</p>

          {selectedCategories.length > 0 && (
            <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {selectedCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  style={{ border: '1px solid #d8ceb4', borderRadius: '999px', padding: '0.35rem 0.7rem', cursor: 'pointer', background: '#fff' }}
                >
                  {category} ×
                </button>
              ))}
            </div>
          )}

          <label style={{ display: 'grid', gap: '0.35rem', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 600 }}>Sort by</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} style={{ padding: '0.6rem', border: '1px solid #dbd3c1', borderRadius: '9px', background: '#fff' }}>
              {Object.entries(sortOptions).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} />
            In stock only
          </label>

          <label style={{ display: 'grid', gap: '0.35rem', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 600 }}>Max price</span>
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="Ex: 500"
              style={{ padding: '0.6rem', border: '1px solid #dbd3c1', borderRadius: '9px', background: '#fff' }}
            />
          </label>

          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Product type</p>
            <div style={{ display: 'grid', gap: '0.45rem' }}>
              {categories.map(([category, count]) => (
                <label key={category} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                  />
                  <span>
                    {category} <span style={{ color: '#777' }}>({count})</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button onClick={clearFilters} className="btn-secondary" style={{ width: '100%' }}>
            Clear filters
          </button>
        </aside>

        <div>
          {isLoading && <p style={{ textAlign: 'center', padding: '4rem' }}>Loading curated pieces...</p>}
          {!isLoading && error && <p style={{ textAlign: 'center', color: 'red', padding: '4rem' }}>{error}</p>}
          {!isLoading && !error && products && products.length === 0 && (
            <p style={{ textAlign: 'center', padding: '4rem' }}>Our collection is currently being updated.</p>
          )}

          {!isLoading && !error && (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="products-wrapper">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div key={product.id || product._id} variants={itemVariants} initial="hidden" animate="show" exit="exit" layout>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredProducts.length === 0 && products.length > 0 && (
                <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem 0' }}>No products match this filter.</p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
