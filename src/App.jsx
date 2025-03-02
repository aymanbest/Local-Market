import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import store, { persistor } from './store/store';
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
import Preloader from './components/features/preloader/Preloader';
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
import AuthPersistence from './components/common/AuthPersistence';
import { PersistGate } from 'redux-persist/integration/react';

// Create a separate component for the main content
const MainContent = () => {
  const isLoading = useLoading();
  const location = useLocation();
  const [initialLoad, setInitialLoad] = useState(true);
  const [navigationLoading, setNavigationLoading] = useState(false);
  
  // Track route changes to show preloader on navigation
  useEffect(() => {
    // On first load, the preloader will be shown by default through useLoading
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }
    
    // For subsequent route changes, briefly show the preloader
    setNavigationLoading(true);
    
    // Scroll to top when route changes
    window.scrollTo(0, 0);
    
    // Hide the navigation preloader after a short delay
    const timer = setTimeout(() => {
      setNavigationLoading(false);
    }, 800); // Show for 800ms during navigation
    
    return () => clearTimeout(timer);
  }, [location.pathname, initialLoad]);
  
  return (
    <>
      <AuthPersistence />
      {(isLoading || navigationLoading) && <Preloader />}
      <WebSocketInitializer />
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="pt-28 md:pt-32">
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
        </main>
        <Footer />
      </div>
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <Router>
            <MainContent />
          </Router>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;

