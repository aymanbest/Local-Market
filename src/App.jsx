import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Header from './components/Header';
import MainPage from './components/MainPage';
import CustomerLayout from './layouts/CustomerLayout';
import ProducerLayout from './layouts/producer/ProducerLayout';
import AdminLayout from './layouts/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import AccountPage from './components/AccountPage';
import AdminHeader from './components/admin/AdminHeader';
import ProducerHeader from './components/producer/ProducerHeader';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <Router>
          <div className="min-h-screen bg-background transition-colors duration-300">
            <ConditionalHeader />
            <div className="pt-16">
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/customer/*" element={<CustomerLayout />} />
                <Route path="/producer/*" element={<ProducerLayout />} />
                <Route path="/admin/*" element={<AdminLayout />} />
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
    </ThemeProvider>
  );
}
function ConditionalHeader() {
  const location = useLocation(); 

  if (location.pathname.startsWith('/admin')) {
    return <AdminHeader />;
  } 
  
  if (location.pathname.startsWith('/producer')) {
    return <ProducerHeader />;
  }

  return <Header />;
}

export default App;

