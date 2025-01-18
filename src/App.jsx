import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Header from './components/Header';
import MainPage from './components/MainPage';
import CustomerLayout from './layouts/CustomerLayout';
import ProducerLayout from './layouts/ProducerLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-[#0a0a0a]">
          <Header />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/customer/*" element={<ProtectedRoute role="customer"><CustomerLayout /></ProtectedRoute>} />
              <Route path="/producer/*" element={<ProtectedRoute role="producer"><ProducerLayout /></ProtectedRoute>} />
              <Route path="/admin/*" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>} />
            </Routes>
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;

