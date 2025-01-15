import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import MainPage from './components/MainPage';
import CustomerLayout from './layouts/CustomerLayout';
import ProducerLayout from './layouts/ProducerLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Cart from './components/Cart';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/customer/*" element={<ProtectedRoute role="customer"><CustomerLayout /></ProtectedRoute>} />
          <Route path="/producer/*" element={<ProtectedRoute role="producer"><ProducerLayout /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;

