import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Dashboard from '../../features/admin/Dashboard';
import UserManagement from '../../features/admin/UserManagement';
import ProductManagement from '../../features/admin/ProductManagement';
import ApplicationManagement from '../../features/admin/ApplicationManagement';
import ReviewManagement from '../../features/admin/ReviewManagement';
import CouponManagement from '../../features/admin/CouponManagement';
import Support from '../../features/admin/Support';
import { useTheme } from '../../../context/ThemeContext';
import AccountPage from '../../features/public/AccountPage';
import SecurityPage from '../../features/auth/SecurityPage';
import ProtectedRoute from '../../security/ProtectedRoute';
import CategoriesManagement from '../../features/admin/CategoriesManagement';

const AdminLayout = () => {
  const { isDark } = useTheme();
  
  return (
    <>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/applications" element={<ApplicationManagement />} />
          <Route path="/reviews" element={<ReviewManagement />} />
          <Route path="/coupons" element={<CouponManagement />} />
          <Route path="/support" element={<Support />} />
          <Route path="/profile" element={<AccountPage adminOnly={true} />} />
          <Route 
                  path="/profile/security" 
                  element={
                    <ProtectedRoute adminOnly>
                      <SecurityPage adminOnly={true} />
                    </ProtectedRoute>
                  } 
                />
          <Route path="/categories" element={<CategoriesManagement />} />
        </Routes>
      </div>
      </>

  );
};

export default AdminLayout; 