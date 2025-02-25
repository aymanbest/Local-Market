import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { loginUser, clearAuth } from '../../../store/slices/auth/authSlice';
import { Eye, EyeClosed } from 'lucide-react';
import { getDefaultRoute } from '../../security/ProtectedRoute';

const Login = ({ adminOnly = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuth());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(loginUser({ email, password }));
      
      if (loginUser.fulfilled.match(resultAction)) {
        const role = resultAction.payload.user.role;
        
        if (adminOnly && role !== 'admin') {
          navigate('/');
          return;
        }
        
        // Always use default route for admin and producer roles
        if (role === 'admin' || role === 'producer') {
          navigate(getDefaultRoute(role), { replace: true });
        } else {
          // For customers, use previous page or default route
          const from = location.state?.from?.pathname || getDefaultRoute(role);
          navigate(from, { replace: true });
        }
      } else if (loginUser.rejected.match(resultAction)) {
        // Handle login error
        console.error('Login failed:', resultAction.payload);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-32 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Title */}
        <h1 className="text-4xl font-recoleta text-text text-center mb-2">
          WELCOME TO OUR MARKET {adminOnly ? '(ADMIN)' : ''}
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary">
            Register here
          </Link>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <div className="text-gray-400 uppercase text-xs mb-2">EMAIL</div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-inputBg border-border rounded-md px-4 py-3 text-text text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors duration-300"
                placeholder="john.doe@email.com"
              />
            </div>

            <div>
              <div className="text-gray-400 uppercase text-xs mb-2">PASSWORD</div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-inputBg border-border rounded-md px-4 py-3 text-text text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors duration-300"
                  placeholder="••••••••••"
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
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-md text-sm font-medium hover:bg-primaryHover transition-colors"
            disabled={status === 'loading'}
          >
            Login
          </button>

          <div className="text-center">
            <Link to="/forgot-password" className="text-sm">
              <span className="text-text">Forgot password?</span>{' '}
              <span className="text-primary">Reset here</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

