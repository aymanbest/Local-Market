import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../store/slices/authSlice';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser({ username, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-32 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Title */}
        <h1 className="text-4xl font-staatliches text-text text-center mb-2">
          WELCOME TO OUR MARKET
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#FF4500]">
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-inputBg border-border rounded-md px-4 py-3 text-text text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors duration-300"
                placeholder="john.doe@email.com"
              />
            </div>

            <div>
              <div className="text-gray-400 uppercase text-xs mb-2">PASSWORD</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-inputBg border-border rounded-md px-4 py-3 text-text text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors duration-300"
                placeholder="••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF4500] text-white py-3 rounded-md text-sm font-medium hover:bg-[#FF6D33] transition-colors"
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

