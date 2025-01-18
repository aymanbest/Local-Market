import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../store/slices/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(resultAction)) {
      navigate('/');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center pt-32">
      <div className="w-full max-w-md">
        {/* Title */}
        <h1 className="text-4xl font-staatliches text-white text-center mb-2 ">
          WELCOME TO OUR MARKET
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Already registered?{' '}
          <Link to="/login" className="text-[#FF4500]">
            Login here
          </Link>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <div className="text-gray-400 uppercase text-xs mb-2">EMAIL</div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#1E1E1E] border-none rounded-md px-4 py-3 text-white text-sm focus:ring-0"
                placeholder="john.doe@email.com"
              />
            </div>

            <div>
              <div className="text-gray-400 uppercase text-xs mb-2">USERNAME</div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-[#1E1E1E] border-none rounded-md px-4 py-3 text-white text-sm focus:ring-0"
                placeholder="real_dude"
              />
            </div>

            <div>
              <div className="text-gray-400 uppercase text-xs mb-2">PASSWORD</div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
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
            Register
          </button>

          {error && (
            <div className="text-red-500 text-center text-sm">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register; 