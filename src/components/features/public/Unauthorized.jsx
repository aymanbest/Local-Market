import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldX, Home, ArrowLeft, AlertTriangle, XCircle, Info } from 'lucide-react';
import Button from '../../common/ui/Button';
import Unauthorized401 from '../../common/icons/Unauthorized401';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-1/4 top-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute left-1/4 bottom-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl w-full">
        <div className="bg-cardBg/50 backdrop-blur-lg border border-border rounded-2xl p-8 shadow-2xl animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="space-y-8">
              {/* Error Status Card */}
              <div className="relative overflow-hidden rounded-2xl border border-red-200/20 bg-gradient-to-br from-red-500/5 via-cardBg to-cardBg animate-slide-down">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-400" />
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full p-3 bg-red-500/10">
                      <XCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-text mb-1">
                        Access Denied
                      </h2>
                      <p className="text-sm text-textSecondary">
                        You don't have permission to access this resource
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up">
                {/* Error Code Card */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-red-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
                  <div className="relative p-4 bg-cardBg border border-border rounded-xl flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Info className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-textSecondary">Error Code</div>
                      <div className="text-xl font-semibold text-text">401</div>
                    </div>
                  </div>
                </div>

                {/* Status Card */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-primary rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
                  <div className="relative p-4 bg-cardBg border border-border rounded-xl flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-red-500/10">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <div className="text-sm text-textSecondary">Status</div>
                      <div className="text-xl font-semibold text-text">Unauthorized</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Help Text */}
              <div className="bg-cardBg/50 border border-border rounded-xl p-4 animate-slide-up">
                <p className="text-sm text-textSecondary leading-relaxed">
                  If you believe this is an error, please try logging in again or contact our support team for assistance.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
                <Button 
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="group flex items-center gap-2 hover:border-primary/50"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Go Back
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                >
                  <Home className="w-4 h-4" />
                  Return Home
                </Button>
              </div>
            </div>

            {/* Right side - Illustration */}
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent rounded-2xl" />
              <div className="relative transform hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl animate-pulse-slow" />
                <Unauthorized401 className="w-full h-full relative z-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 