import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const PaymentSuccess = ({ orderData }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <img 
          src="/success.svg" 
          alt="Payment Success" 
          className="w-32 h-32 mx-auto"
        />
        
        <h1 className="text-3xl font-bold text-text">
          Payment Successful!
        </h1>
        
        <div className="space-y-2">
          <p className="text-textSecondary">
            Order #{orderData.ordercheckout || 'N/A'} has been confirmed
          </p>
          <p className="text-textSecondary">
            Amount paid: ${(orderData.totalPrice || 0).toFixed(2)}
          </p>
        </div>

        <div className="p-4 bg-cardBg border border-border rounded-lg">
          <p className="text-sm text-textSecondary">
            You will be automatically redirected to the home page in 10 seconds.
            If not, please click <Link to="/" className="text-primary hover:text-primaryHover underline">here</Link>
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Link 
            to="/"
            className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primaryHover transition-colors duration-300"
          >
            Go to Home
          </Link>
          <Link 
            to={`/orders/bundle/${orderData.ordercheckout}?token=${orderData.accessToken}`}
            className="px-6 py-2 border border-border text-text rounded-full hover:bg-cardBg transition-colors duration-300"
          >
            View Order
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 