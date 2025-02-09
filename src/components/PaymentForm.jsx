import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CreditCard, Bitcoin, Calendar, HelpCircle, Lock, Shield } from 'lucide-react';
import api from '../lib/axios';
import PaymentSuccess from './PaymentSuccess';
import { FaCcVisa, FaCcMastercard, FaBitcoin, FaLock, FaShieldAlt } from 'react-icons/fa';

const PaymentForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get('token');
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');

  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

  // Add loading state for initial data fetch
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: '',
    transactionHash: '',
    currency: 'USD'
  });

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        const config = {
          params: { accessToken }
        };
        
        const response = await api.get('/api/orders', config);
        const orderResponse = Array.isArray(response.data) ? response.data : [response.data];
        
        if (orderResponse[0]?.status === 'PAYMENT_COMPLETED') {
          navigate('/');
          return;
        }

        setPaymentMethod(orderResponse[0]?.paymentMethod);
        
        setOrderDetails(orderResponse);
      } catch (error) {
        setError('Failed to fetch order details');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      fetchOrderDetails();
    }
  }, [accessToken, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const config = {
      params: { accessToken }
    };

    const paymentData = {
      paymentMethod: paymentMethod,
      currency: 'USD',
      ...(paymentMethod === 'CARD' ? {
        cardNumber: formData.cardNumber,
        cardHolderName: formData.cardHolderName,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
      } : {
        transactionHash: formData.transactionHash,
      })
    };

    try {
      const response = await api.post(
        `/api/orders/pay`, 
        paymentData,
        config,
        { withCredentials: user ? true : false }
      );
      

      // Format the order data before setting it
      const formattedOrderData = {
        ordercheckout: accessToken,
        totalPrice: calculateTotal(),
        status: response.data.status || 'PAYMENT_COMPLETED'
      };
      
      setOrderData(formattedOrderData);
      setPaymentCompleted(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!orderDetails) return 0;
    return Array.isArray(orderDetails) 
      ? orderDetails.reduce((sum, order) => sum + (order.totalPrice || 0), 0)
      : orderDetails.totalPrice || 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text text-center">
          <p className="text-xl">{error}</p>
          <Link to="/" className="text-primary hover:text-primaryHover mt-4 block">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!orderDetails || orderDetails.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text text-center">
          <p className="text-xl">No order details found</p>
          <Link to="/" className="text-primary hover:text-primaryHover mt-4 block">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {paymentCompleted && orderData ? (
        <PaymentSuccess orderData={orderData} />
      ) : (
        <section className="py-8 md:py-16 bg-gradient-to-b from-background to-background/95">
          <div className="mx-auto max-w-screen-xl px-4">
            <div className="mx-auto max-w-5xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-text sm:text-3xl">
                  Secure Checkout
                </h2>
                <div className="flex items-center gap-2 text-green-500">
                  <FaLock className="h-5 w-5" />
                  <span className="text-sm font-medium">SSL Encrypted</span>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12">
                <form onSubmit={handleSubmit} className="w-full rounded-xl border border-border/40 bg-cardBg p-6 shadow-lg backdrop-blur-sm sm:p-8 lg:max-w-xl">
                  <div className="mb-6 flex items-center gap-2 pb-4 border-b border-border/40">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-text">
                      {paymentMethod === 'CARD' ? 'Secure Card Payment' : 'Secure Bitcoin Payment'}
                    </span>
                  </div>

                  {paymentMethod === 'CARD' ? (
                    <div className="mb-8 grid grid-cols-2 gap-6">
                      <div className="col-span-2">
                        <label className="mb-2 block text-sm font-medium text-text">
                          Card Holder Name*
                        </label>
                        <input
                          type="text"
                          className="block w-full rounded-lg border border-border/60 bg-inputBg p-3 text-base text-text placeholder:text-textSecondary/70 focus:border-primary focus:bg-cardBg focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                          placeholder="John Doe"
                          value={formData.cardHolderName}
                          onChange={(e) => setFormData({...formData, cardHolderName: e.target.value})}
                          required
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="mb-2 block text-sm font-medium text-text">
                          Card Number*
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="block w-full rounded-lg border border-border/60 bg-inputBg p-3 pe-12 text-base text-text placeholder:text-textSecondary/70 focus:border-primary focus:bg-cardBg focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                            required
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <FaCcVisa className="h-6 w-auto text-[#1434CB]" />
                            <FaCcMastercard className="h-6 w-auto text-[#EB001B]" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-text">
                          Expiry Date*
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="block w-full rounded-lg border border-border/60 bg-inputBg p-3 ps-11 text-base text-text placeholder:text-textSecondary/70 focus:border-primary focus:bg-cardBg focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                            required
                          />
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-textSecondary" />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 flex items-center gap-1 text-sm font-medium text-text">
                          CVV*
                          <button
                            type="button"
                            className="text-textSecondary hover:text-text transition-colors"
                            title="The last 3 digits on back of card"
                          >
                            <HelpCircle className="h-4 w-4" />
                          </button>
                        </label>
                        <input
                          type="text"
                          className="block w-full rounded-lg border border-border/60 bg-inputBg p-3 text-base text-text placeholder:text-textSecondary/70 focus:border-primary focus:bg-cardBg focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                          placeholder="•••"
                          value={formData.cvv}
                          onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mb-8">
                      <label className="mb-2 block text-sm font-medium text-text">
                        Transaction Hash*
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          className="block w-full rounded-lg border border-border/60 bg-inputBg p-3 ps-11 text-base text-text placeholder:text-textSecondary/70 focus:border-primary focus:bg-cardBg focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                          placeholder="Enter your transaction hash"
                          value={formData.transactionHash}
                          onChange={(e) => setFormData({...formData, transactionHash: e.target.value})}
                          required
                        />
                        <Bitcoin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-textSecondary" />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primaryHover focus:outline-none focus:ring-4 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <FaLock className="h-4 w-4" />
                    {loading ? 'Processing...' : 'Pay Securely Now'}
                  </button>

                  <div className="mt-6 flex items-center justify-center gap-2 text-sm text-textSecondary">
                    <FaShieldAlt className="h-4 w-4 text-green-500" />
                    <span>Your payment information is secure</span>
                  </div>
                </form>

                <div className="mt-8 grow lg:mt-0">
                  <div className="space-y-6 rounded-xl border border-border/40 bg-cardBg p-6 shadow-lg backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-text">Order Summary</h3>
                    
                    <div className="space-y-4">
                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base text-textSecondary">Subtotal</dt>
                        <dd className="text-base font-medium text-text">
                          ${calculateTotal().toFixed(2)}
                        </dd>
                      </dl>
                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base text-textSecondary">Service Fee</dt>
                        <dd className="text-base font-medium text-text">$0.00</dd>
                      </dl>
                    </div>

                    <dl className="flex items-center justify-between gap-4 border-t border-border/40 pt-4">
                      <dt className="text-lg font-bold text-text">Total</dt>
                      <dd className="text-lg font-bold text-primary">
                        ${calculateTotal().toFixed(2)}
                      </dd>
                    </dl>

                    <div className="rounded-lg bg-green-500/10 p-4 flex items-center gap-3">
                      <FaShieldAlt className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <p className="text-sm text-green-700">
                        Your transaction is protected with SSL encryption
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-8">
                      <FaCcVisa className="h-8 w-auto text-[#1434CB]" />
                      <FaCcMastercard className="h-8 w-auto text-[#EB001B]" />
                      {paymentMethod === 'BITCOIN' && (
                        <FaBitcoin className="h-8 w-auto text-[#F7931A]" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-textSecondary">
                      <Lock className="h-4 w-4" />
                      <span>256-bit SSL Encryption</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default PaymentForm; 