import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import Header from './components/features/public/Header';
import MainPage from './components/features/public/MainPage';
import ProducerLayout from './components/layouts/producer/ProducerLayout';
import ProtectedRoute, { RedirectIfAuthenticated } from './components/security/ProtectedRoute';
import Login from './components/features/auth/Login';
import Register from './components/features/auth/Register';
import Cart from './components/features/public/Cart';
import AccountPage from './components/features/public/AccountPage';
import { ThemeProvider } from './context/ThemeContext';
import Store from './components/features/product/Store';
import Preloader from './components/features/public/Preloader';
import BecomeSeller from './components/features/public/BecomeSeller';
import FAQ from './components/features/public/FAQ';
import ProductDetails from './components/features/product/ProductDetails';
import PaymentForm from './components/features/order/PaymentForm';
import PaymentSuccess from './components/features/public/PaymentSuccess';
import OrderBundle from './components/features/order/OrderBundle';
import useLoading from './hooks/useLoading';
import OrderHistory from './components/features/order/OrderHistory';
import SellerApplication from './components/features/producer/SellerApplication';
import MyReviews from './components/features/product/MyReviews';
import AdminLayout from './components/layouts/admin/AdminLayout';
import SecurityPage from './components/features/auth/SecurityPage';
import WebSocketInitializer from './components/common/WebSocketInitializer';
import Support from './components/features/public/Support';
import About from './components/features/public/About';
import WelcomeCoupon from './components/features/promotions/WelcomeCoupon';
import Unauthorized from './components/features/public/Unauthorized';
import ForgotPassword from './components/features/auth/ForgotPassword';
import NotFound from './components/features/public/NotFound';
import { ROLES } from './components/security/ProtectedRoute';
import TermsOfService from './components/features/public/TermsOfService';
import Footer from './components/features/public/Footer';

// Create a separate component for the main content
const MainContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isProducerRoute = location.pathname.startsWith('/producer');
  const [initialLoading, setInitialLoading] = useState(true);
  const isLoading = useLoading();

  useEffect(() => {
    // Initial app load
    window.onload = () => {
      setTimeout(() => {
        setInitialLoading(false);
      }, 1000);
    };

    setTimeout(() => {
      setInitialLoading(false);
    }, 3000);
  }, []);

  return (
    <>
      <WebSocketInitializer />
      {(initialLoading || isLoading) && <Preloader />}
      <div className={`min-h-screen bg-background transition-colors duration-300 ${initialLoading ? 'hidden' : ''}`}>
        <Header />
        <div className="pt-28 md:pt-32">
          <Routes>
            <Route path='*' element={<NotFound />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={
                <RedirectIfAuthenticated>
                  <Login />
                </RedirectIfAuthenticated>
            } />
            <Route path="/register" element={
                <RedirectIfAuthenticated>
                  <Register />
                </RedirectIfAuthenticated>
            } />
            <Route path="/forgot-password" element={
                <RedirectIfAuthenticated>
                  <ForgotPassword />
                </RedirectIfAuthenticated>
            } />
            <Route path="/cart" element={<Cart />} />
            <Route 
              path="/payment" 
              element={
                  <PaymentForm />
              } 
            />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/success" element={<PaymentSuccess />} />
            <Route 
              path="/producer/*" 
              element={
                <ProtectedRoute allowedRoles={[ROLES.PRODUCER]}>
                  <ProducerLayout />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.PRODUCER, ROLES.ADMIN]}>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/account/orders" 
              element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/orders/bundle/:bundleId" 
              element={
                  <OrderBundle />
              } 
            />
            <Route
              path="/account/apply-seller"
              element={
                <ProtectedRoute>
                  <SellerApplication />
                </ProtectedRoute>
              }
            />
            <Route path="/category/:categoryName" element={<Store />} />
            <Route path="/store" element={<Store />} />
            <Route path="/become-seller" element={<BecomeSeller />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/faq/:category" element={<FAQ />} />
            <Route path="/store/products/:id" element={<ProductDetails />} />
            <Route path="/support" element={<Support />} />
            <Route path="/about" element={<About />} />
            <Route 
              path="/account/reviews" 
              element={
                <ProtectedRoute>
                  <MyReviews />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <AdminLayout />
                </ProtectedRoute>
              } 
            />
            <Route path="/admin/login" element={
                <RedirectIfAuthenticated>
                  <Login adminOnly />
                </RedirectIfAuthenticated>
            } />
            <Route 
              path="/account/security" 
              element={
                <ProtectedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.PRODUCER, ROLES.ADMIN]}>
                  <SecurityPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/tos" element={<TermsOfService />} />
          </Routes>
        </div>
        {!isAdminRoute && !isProducerRoute && (
          <>
            <WelcomeCoupon />
            <Footer />
          </>
        )}
      </div>
    </>
  );
};

// AppContent component with Router
const AppContent = () => {
  return (
    <Router>
      <MainContent />
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;

