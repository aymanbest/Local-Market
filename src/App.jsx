import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Header from './components/Header';
import MainPage from './components/MainPage';
import CustomerLayout from './layouts/CustomerLayout';
import ProducerLayout from './layouts/producer/ProducerLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import AccountPage from './components/AccountPage';
import ProducerHeader from './components/producer/ProducerHeader';
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
// import SecurityPage from './components/SecurityPage';
import SellerApplication from './components/SellerApplication';
import MyReviews from './components/MyReviews';
import AdminLayout from './layouts/AdminLayout';


function App() {
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
    <ThemeProvider>
      <Provider store={store}>
        <Router>
          {(initialLoading || isLoading) && <Preloader />}
          <div className={`min-h-screen bg-background transition-colors duration-300 ${initialLoading ? 'hidden' : ''}`}>
            <Header />
            <div className="pt-16">
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/payment" element={<PaymentForm />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/customer/*" element={<CustomerLayout />} />
                <Route path="/producer/*" element={<ProducerLayout />} />
                {/* <Route element={<ProtectedRoute />}> */}
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <AccountPage />
                    </ProtectedRoute>
                  }
                />
                {/* <Route path="/account/security" element={<SecurityPage />} /> */}
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
                <Route path="/account/reviews" element={
                  <ProtectedRoute>
                    <MyReviews />
                  </ProtectedRoute>
                } />
                <Route path="/admin/*" element={<AdminLayout />} />
              </Routes>
            </div>
          </div>
        </Router>
      </Provider>
    </ThemeProvider>
  );
}
// function ConditionalHeader() {
//   const location = useLocation();

//   if (location.pathname.startsWith('/admin')) {
//     return null;
//   }

//   if (location.pathname.startsWith('/producer')) {
//     return <ProducerHeader />;
//   }

//   return <Header />;
// }

export default App;

