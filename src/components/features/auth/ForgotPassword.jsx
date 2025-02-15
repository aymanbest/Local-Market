import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../lib/axios';
import { Eye, EyeClosed } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1 for email, 2 for code and new password
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/api/auth/password-reset-request', { email });
      setSuccess(response.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/api/auth/password-reset-verify', {
        email,
        code,
        newPassword,
      });
      setSuccess(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-32 transition-colors duration-300">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-recoleta text-text text-center mb-2">
          Reset Password
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Remember your password?{' '}
          <Link to="/login" className="text-primary">
            Login here
          </Link>
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            {success}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestReset} className="space-y-6">
            <div>
              <div className="text-gray-400 uppercase text-xs mb-2">EMAIL</div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-inputBg border-border rounded-md px-4 py-3 text-text text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors duration-300"
                placeholder="Enter your email address"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-md text-sm font-medium hover:bg-primaryHover transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyReset} className="space-y-6">
            <div>
              <div className="text-gray-400 uppercase text-xs mb-2">RESET CODE</div>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-inputBg border-border rounded-md px-4 py-3 text-text text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors duration-300"
                placeholder="Enter the code from your email"
                required
              />
            </div>

            <div>
              <div className="text-gray-400 uppercase text-xs mb-2">NEW PASSWORD</div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-inputBg border-border rounded-md px-4 py-3 text-text text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors duration-300"
                  placeholder="Enter your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-text transition-colors"
                >
                  {showPassword ? (
                    <EyeClosed className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-md text-sm font-medium hover:bg-primaryHover transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword; 