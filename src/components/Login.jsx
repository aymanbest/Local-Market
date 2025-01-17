import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../store/slices/authSlice';
import { Leaf, LogIn, KeyRound, User, ArrowLeft } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import Label from './ui/Label';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';

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
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center pt-32">
      <div className="w-full max-w-md">
        {/* Title */}
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          WELCOME TO REALDUDESINC
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
                className="w-full bg-[#1E1E1E] border-none rounded-md px-4 py-3 text-white text-sm focus:ring-0"
                placeholder="john.doe@email.com"
              />
            </div>

            <div>
              <div className="text-gray-400 uppercase text-xs mb-2">PASSWORD</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1E1E1E] border-none rounded-md px-4 py-3 text-white text-sm focus:ring-0"
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
              <span className="text-white">Forgot password?</span>{' '}
              <span className="text-[#FF4500]">Reset here</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

