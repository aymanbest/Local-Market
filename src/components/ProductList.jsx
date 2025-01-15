import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';
import { mockProducts } from '../mockData';

const ProductList = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Available Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;

