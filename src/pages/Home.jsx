import React from 'react';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';

function Home({ ornaments, isLoading, error }) {
  return (
    <>
      <Hero />
      <ProductGrid products={ornaments} isLoading={isLoading} error={error} />
    </>
  );
}

export default Home;
