import React from 'react';
import { Routes, Route } from 'react-router-dom'
import ProductManagement from '../../features/producer/ProductManagement';
import OrderManagement from '../../features/producer/OrderManagement';
import Analytics from '../../features/producer/Analytics';
import AccountPage from '../../features/public/AccountPage';
import SecurityPage from '../../features/auth/SecurityPage';
import ProtectedRoute from '../../security/ProtectedRoute';
import Support from '../../features/producer/Support';

const ProducerLayout = () => {

  return (
    <div className="max-w-7xl mx-auto px-4">
      <Routes>
        <Route path="/" element={<ProductManagement />} />
        <Route path="/products" element={<ProductManagement />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/support" element={<Support />} />
        <Route path="/profile" element={<AccountPage producerOnly={true} />} />
        <Route 
          path="/profile/security" 
          element={
            <ProtectedRoute producerOnly>
              <SecurityPage producerOnly={true} />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
};


export default ProducerLayout;

