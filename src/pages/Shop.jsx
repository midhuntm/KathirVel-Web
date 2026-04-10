import React from 'react';
import ProductGrid from '../components/ProductGrid';

const Shop = ({ ornaments, isLoading, error }) => {
  return (
    <div style={{ paddingTop: '5rem', minHeight: '80vh', background: 'var(--color-white)' }}>
      <div style={{ textAlign: 'center', padding: '4rem 5% 0 5%' }}>
         <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', color: 'var(--color-black)' }}>All Collections</h1>
         <p style={{ color: 'var(--color-charcoal)', maxWidth: '600px', margin: '1rem auto' }}>
             Explore our full range of premium handcrafted ornaments tailored for your refined taste.
         </p>
      </div>
      <ProductGrid products={ornaments} isLoading={isLoading} error={error} />
    </div>
  );
};

export default Shop;
