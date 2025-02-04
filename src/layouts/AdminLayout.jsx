import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Dashboard from '../components/admin/Dashboard';
import UserManagement from '../components/admin/UserManagement';
import ProductManagement from '../components/admin/ProductManagement';
import ApplicationManagement from '../components/admin/ApplicationManagement';
import ReviewManagement from '../components/admin/ReviewManagement';
import { useTheme } from '../context/ThemeContext';
import AccountPage from '../components/AccountPage';
import SecurityPage from '../components/SecurityPage';
import ProtectedRoute from '../components/ProtectedRoute';

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
          <Route path="/profile" element={<AccountPage adminOnly={true} />} />
          <Route 
                  path="/profile/security" 
                  element={
                    <ProtectedRoute adminOnly>
                      <SecurityPage adminOnly={true} />
                    </ProtectedRoute>
                  } 
                />
        </Routes>
      </div>
      </>

  );
};

export default AdminLayout; 