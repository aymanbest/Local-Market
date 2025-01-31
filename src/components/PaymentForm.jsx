import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CreditCard, Bitcoin, Calendar, HelpCircle } from 'lucide-react';
import api from '../lib/axios';
import PaymentSuccess from './PaymentSuccess';
import { FaCcVisa, FaCcMastercard, FaBitcoin } from 'react-icons/fa';

const PaymentForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get('token');
  const { token } = useSelector((state) => state.auth);
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
          params: { accessToken },
          ...(token && { headers: { Authorization: `Bearer ${token}` } })
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
  }, [accessToken, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const config = {
      params: { accessToken },
      ...(token && { headers: { Authorization: `Bearer ${token}` } })
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
        config
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
        <section className="py-8 md:py-16 bg-background">
          <div className="mx-auto max-w-screen-xl px-4">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-xl font-semibold text-text sm:text-2xl">
                {paymentMethod === 'CARD' ? 'Card Payment' : 'Bitcoin Payment'}
              </h2>

              <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12">
                <form onSubmit={handleSubmit} className="w-full rounded-lg border border-border bg-cardBg p-4 shadow-sm sm:p-6 lg:max-w-xl lg:p-8">
                  {paymentMethod === 'CARD' ? (
                    <div className="mb-6 grid grid-cols-2 gap-4">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="mb-2 block text-sm font-medium text-textSecondary">
                          Card Holder Name*
                        </label>
                        <input
                          type="text"
                          className="block w-full rounded-lg border border-border bg-inputBg p-2.5 text-sm text-text focus:border-primary focus:ring-1 focus:ring-primary"
                          placeholder="John Doe"
                          value={formData.cardHolderName}
                          onChange={(e) => setFormData({...formData, cardHolderName: e.target.value})}
                          required
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label className="mb-2 block text-sm font-medium text-textSecondary">
                          Card Number*
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="block w-full rounded-lg border border-border bg-inputBg p-2.5 pe-10 text-sm text-text focus:border-primary focus:ring-1 focus:ring-primary"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                            required
                          />
                          <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-textSecondary" />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-textSecondary">
                          Expiry Date*
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="block w-full rounded-lg border border-border bg-inputBg p-2.5 ps-9 text-sm text-text focus:border-primary focus:ring-1 focus:ring-primary"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                            required
                          />
                          <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-textSecondary" />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 flex items-center gap-1 text-sm font-medium text-textSecondary">
                          CVV*
                          <button
                            type="button"
                            className="text-textSecondary hover:text-text"
                            title="The last 3 digits on back of card"
                          >
                            <HelpCircle className="h-4 w-4" />
                          </button>
                        </label>
                        <input
                          type="text"
                          className="block w-full rounded-lg border border-border bg-inputBg p-2.5 text-sm text-text focus:border-primary focus:ring-1 focus:ring-primary"
                          placeholder="•••"
                          value={formData.cvv}
                          onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <label className="mb-2 block text-sm font-medium text-textSecondary">
                        Transaction Hash*
                      </label>
                      <input
                        type="text"
                        className="block w-full rounded-lg border border-border bg-inputBg p-2.5 text-sm text-text focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="Enter your transaction hash"
                        value={formData.transactionHash}
                        onChange={(e) => setFormData({...formData, transactionHash: e.target.value})}
                        required
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primaryHover focus:outline-none focus:ring-4 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Pay Now'}
                  </button>
                </form>

                <div className="mt-6 grow sm:mt-8 lg:mt-0">
                  <div className="space-y-4 rounded-lg border border-border bg-cardBg p-6">
                    <div className="space-y-2">
                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-textSecondary">Subtotal</dt>
                        <dd className="text-base font-medium text-text">
                        ${calculateTotal().toFixed(2)}
                        </dd>
                      </dl>
                      <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-textSecondary">Service Fee</dt>
                        <dd className="text-base font-medium text-text">$0.00</dd>
                      </dl>
                    </div>

                    <dl className="flex items-center justify-between gap-4 border-t border-border pt-2">
                      <dt className="text-base font-bold text-text">Total</dt>
                      <dd className="text-base font-bold text-text">
                      ${calculateTotal().toFixed(2)}
                      </dd>
                    </dl>
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-8">
                    <FaCcVisa className="h-8 w-auto text-[#1434CB]" />
                    <FaCcMastercard className="h-8 w-auto text-[#EB001B]" />
                    {paymentMethod === 'BITCOIN' && (
                      <FaBitcoin className="h-8 w-auto text-[#F7931A]" />
                    )}
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