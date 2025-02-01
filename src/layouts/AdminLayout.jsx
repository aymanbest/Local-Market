import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Dashboard from '../components/admin/Dashboard';
import UserManagement from '../components/admin/UserManagement';
// import ProductManagement from '../components/admin/ProductManagement';
// import ReviewManagement from '../components/admin/ReviewManagement';
import { useTheme } from '../context/ThemeContext';

const AdminLayout = () => {
  const { isDark } = useTheme();
  
  return (
    <>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UserManagement />} />
          {/* <Route path="/products" element={<ProductManagement />} />
          <Route path="/reviews" element={<ReviewManagement />} /> */}
        </Routes>
      </div>
      </>
  );
};

export default AdminLayout; 