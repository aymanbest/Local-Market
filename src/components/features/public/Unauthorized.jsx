import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';
import Button from '../../common/ui/Button';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-lg w-full">
        <div className="bg-cardBg backdrop-blur-sm border border-border rounded-2xl p-8 shadow-lg animate-fade-in">
          <div className="relative">
            {/* Icon container with animated background */}
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-spin-slow" />
              <div className="absolute inset-2 bg-cardBg rounded-full flex items-center justify-center">
                <ShieldX className="w-12 h-12 text-primary animate-slide-down" />
              </div>
            </div>

            <h1 className="text-4xl font-recoleta text-text text-center mb-3 animate-slide-down">
              Access Denied
            </h1>
            <p className="text-textSecondary text-center mb-8 animate-slide-down">
              Sorry, you don't have permission to access this page. Please check your credentials or contact support.
            </p>

            {/* Buttons container */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
              <Button 
                onClick={() => navigate(-1)}
                className="group bg-cardBg hover:bg-primary/10 text-text px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 border border-border"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Go Back
              </Button>
              <Button 
                onClick={() => navigate('/')}
                className="bg-primary hover:bg-primaryHover text-white px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300"
              >
                <Home className="w-4 h-4" />
                Home Page
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 