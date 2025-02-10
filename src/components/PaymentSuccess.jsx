import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';

const PaymentSuccess = ({ orderData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const detectSize = () => {
    setWindowDimension({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  const handleDownloadReceipt = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/receipt?accessToken=${displayData.accessToken}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `receipt_${displayData.ordercheckout}_${timestamp}.pdf`;
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading receipt:', error);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', detectSize);
    return () => window.removeEventListener('resize', detectSize);
  }, []);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (location.pathname !== '/success') {
  //       navigate('/');
  //     }
  //   }, 10000);

  //   return () => clearTimeout(timer);
  // }, [navigate, location]);

  // Use mock data for development route
  const mockOrderData = {
    ordercheckout: "DEV123456",
    totalPrice: 199.99,
    ordercheckout: "mock-token"
  };

  const displayData = location.pathname === '/success' ? mockOrderData : orderData;
  console.log(displayData);

  if (!displayData && location.pathname !== '/success') {
    return (
      <div className="h-[calc(100vh-8rem)] bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
      <Confetti
        width={windowDimension.width}
        height={windowDimension.height}
        numberOfPieces={200}
        recycle={false}
        colors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD']}
      />
      <div className="max-w-xl w-full text-center space-y-5">
        <img 
          src="/success.svg" 
          alt="Payment Success" 
          className="w-32 h-32 mx-auto"
        />
        
        <h1 className="text-3xl md:text-4xl font-bold text-text">
          Payment Successful!
        </h1>
        
        <div className="space-y-2">
          <p className="text-textSecondary text-lg">
            Order #{displayData.ordercheckout || 'N/A'} has been confirmed
          </p>
          <p className="text-textSecondary text-xl font-semibold">
            Amount paid: ${(displayData.totalPrice || 0).toFixed(2)}
          </p>
        </div>

        <div className="p-4 bg-cardBg border border-border rounded-lg">
          <p className="text-base text-textSecondary">
            You will be automatically redirected to the home page in 10 seconds.
            If not, please click <Link to="/" className="text-primary hover:text-primaryHover underline font-medium">here</Link>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-center gap-4">
            <Link 
              to="/"
              className="px-6 py-2.5 bg-primary text-white text-base font-medium rounded-full hover:bg-primaryHover transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Go to Home
            </Link>
            <Link 
              to={`/orders/bundle/${displayData.ordercheckout}?token=${displayData.ordercheckout}`}
              className="px-6 py-2.5 border border-border text-base font-medium text-text rounded-full hover:bg-cardBg transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              View Order
            </Link>
          </div>
          
          <button 
            onClick={handleDownloadReceipt}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-base font-medium text-textSecondary hover:text-text transition-colors duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Get PDF Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 