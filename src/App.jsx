import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Header from './components/Header';
import MainPage from './components/MainPage';
import CustomerLayout from './layouts/CustomerLayout';
import ProducerLayout from './layouts/ProducerLayout';
import AdminLayout from './layouts/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import AccountPage from './components/AccountPage';
import AdminHeader from './components/admin/AdminHeader';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-[#0a0a0a]">
          <ConditionalHeader />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/customer/*" element={<ProtectedRoute role="customer"><CustomerLayout /></ProtectedRoute>} />
              <Route path="/producer/*" element={<ProtectedRoute role="producer"><ProducerLayout /></ProtectedRoute>} />
              <Route path="/admin/*" element={<AdminLayout />} />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </Provider>
  );
}
function ConditionalHeader() { const location = useLocation(); const shouldShowHeader = !location.pathname.startsWith('/admin/'); return shouldShowHeader ? <Header /> : <AdminHeader/>; }
export default App;

