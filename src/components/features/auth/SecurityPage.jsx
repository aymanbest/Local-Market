import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock, Check, X, AlertTriangle, Shield } from 'lucide-react';
import { changePassword, resetStatus } from '../../../store/slices/common/securitySlice';

const SecurityPage = ({ adminOnly = false, producerOnly = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.security);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  
  const [validationError, setValidationError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
  });

  useEffect(() => {
    return () => {
      dispatch(resetStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (success && !isAuthenticated) {
      const timer = setTimeout(() => {
        navigate('/login', { 
          replace: true,
          state: { message: 'Please login again with your new password' }
        });
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [success, isAuthenticated, navigate]);

  const checkPasswordStrength = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(requirements).filter(Boolean).length;
    setPasswordStrength({ score, requirements });
  };

  useEffect(() => {
    checkPasswordStrength(formData.newPassword);
  }, [formData.newPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (passwordStrength.score < 3) {
      setValidationError('Please create a stronger password');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setValidationError('New passwords do not match');
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setValidationError('New password must be different from current password');
      return;
    }

    try {
      await dispatch(changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      })).unwrap();
      
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      console.error('Failed to change password:', err);
    }
  };

  const getStrengthColor = (score) => {
    if (score <= 1) return 'bg-red-500';
    if (score === 2) return 'bg-yellow-500';
    if (score === 3) return 'bg-blue-500';
    if (score >= 4) return 'bg-green-500';
    return 'bg-gray-300';
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-recoleta font-semibold uppercase">Security Settings</h1>
          </div>
          <Link 
            to={adminOnly ? "/admin/profile" : producerOnly ? "/producer/profile" : "/account"} 
            className="rounded-full border border-border hover:bg-cardBg transition flex gap-2 items-center px-4 py-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Account</span>
          </Link>
        </div>

        <hr className="border-border mb-6" />

        <div className="max-w-md mx-auto bg-cardBg p-8 rounded-xl shadow-lg border border-border">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Change Your Password</h2>
            <p className="text-textSecondary text-sm">
              Please ensure your new password meets our security requirements
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Old Password */}
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.old ? "text" : "password"}
                  value={formData.oldPassword}
                  onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                  className="w-full bg-inputBg border-border rounded-lg pl-10 pr-12 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-text"
                >
                  {showPasswords.old ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full bg-inputBg border-border rounded-lg pl-10 pr-12 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-text"
                >
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              <div className="mt-2">
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div
                      key={index}
                      className={`h-1 w-full rounded-full ${
                        index <= passwordStrength.score
                          ? getStrengthColor(passwordStrength.score)
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className={`flex items-center gap-2 ${passwordStrength.requirements.length ? 'text-green-500' : 'text-textSecondary'}`}>
                    {passwordStrength.requirements.length ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    At least 8 characters
                  </div>
                  <div className={`flex items-center gap-2 ${passwordStrength.requirements.uppercase ? 'text-green-500' : 'text-textSecondary'}`}>
                    {passwordStrength.requirements.uppercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    Uppercase letter
                  </div>
                  <div className={`flex items-center gap-2 ${passwordStrength.requirements.lowercase ? 'text-green-500' : 'text-textSecondary'}`}>
                    {passwordStrength.requirements.lowercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    Lowercase letter
                  </div>
                  <div className={`flex items-center gap-2 ${passwordStrength.requirements.number ? 'text-green-500' : 'text-textSecondary'}`}>
                    {passwordStrength.requirements.number ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    Number
                  </div>
                  <div className={`flex items-center gap-2 ${passwordStrength.requirements.special ? 'text-green-500' : 'text-textSecondary'}`}>
                    {passwordStrength.requirements.special ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    Special character
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-inputBg border-border rounded-lg pl-10 pr-12 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-text"
                >
                  {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Messages */}
            {(error || validationError) && (
              <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm">{error?.message || validationError}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-2 text-green-500 bg-green-50 p-3 rounded-lg">
                <Check className="w-5 h-5" />
                <span className="text-sm">Password changed successfully!</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primaryHover text-white py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage; 