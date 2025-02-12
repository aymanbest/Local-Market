import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import Header from './components/Header';
import MainPage from './components/MainPage';
import CustomerLayout from './layouts/CustomerLayout';
import ProducerLayout from './layouts/producer/ProducerLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import AccountPage from './components/AccountPage';
import { ThemeProvider } from './context/ThemeContext';
import Store from './components/Store';
import Preloader from './components/Preloader';
import BecomeSeller from './components/BecomeSeller';
import FAQ from './components/FAQ';
import ProductDetails from './components/ProductDetails';
import PaymentForm from './components/PaymentForm';
import PaymentSuccess from './components/PaymentSuccess';
import OrderBundle from './components/OrderBundle';
import useLoading from './hooks/useLoading';
import OrderHistory from './components/OrderHistory';
import SellerApplication from './components/SellerApplication';
import MyReviews from './components/MyReviews';
import AdminLayout from './layouts/AdminLayout';
import SecurityPage from './components/SecurityPage';
import ToastContainer from './components/ui/ToastContainer';
import WebSocketInitializer from './components/WebSocketInitializer';
import Support from './components/Support';
import About from './components/About';
import WelcomeCoupon from './components/WelcomeCoupon';


// Create a separate component for content that needs Redux
const AppContent = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const isLoading = useLoading();

  useEffect(() => {
    // Initial app load simulation
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
    <Router>
      <WebSocketInitializer />
      {(initialLoading || isLoading) && <Preloader />}
      <div className={`min-h-screen bg-background transition-colors duration-300 ${initialLoading ? 'hidden' : ''}`}>
        <Header />
        <div className="pt-28 md:pt-32">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<PaymentForm />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/success" element={<PaymentSuccess />} />
            <Route path="/customer/*" element={<CustomerLayout />} />
            <Route path="/producer/*" element={<ProducerLayout />} />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route path="/account/orders" element={<OrderHistory />} />
            <Route path="/orders/bundle/:bundleId" element={<OrderBundle />} />
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
            <Route path="/account/reviews" element={
              <ProtectedRoute>
                <MyReviews />
              </ProtectedRoute>
            } />
            <Route path="/admin/*" element={<AdminLayout />} />
            <Route path="/admin/login" element={<Login adminOnly />} />
            <Route 
              path="/account/security" 
              element={
                <ProtectedRoute>
                  <SecurityPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
        <ToastContainer />
        <WelcomeCoupon />
      </div>
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

