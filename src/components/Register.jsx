import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../store/slices/authSlice';
import { Eye, EyeClosed } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    firstname: '',
    lastname: '',
    password: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen bg-background flex flex-col items-center pt-32 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Title */}
        <h1 className="text-4xl font-recoleta text-text text-center mb-2">
          WELCOME TO OUR MARKET
        </h1>
        <p className="text-center text-textSecondary mb-8">
          Already registered?{' '}
          <Link to="/login" className="text-primary hover:text-primaryHover transition-colors">
            Login here
          </Link>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-textSecondary uppercase text-xs mb-2">First Name</div>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="w-full bg-inputBg border-border rounded-md px-4 py-3 text-text text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors duration-300"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <div className="text-textSecondary uppercase text-xs mb-2">Last Name</div>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="w-full bg-inputBg border-border rounded-md px-4 py-3 text-text text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors duration-300"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div>
              <div className="text-textSecondary uppercase text-xs mb-2">Email</div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-inputBg border-border rounded-md px-4 py-3 text-text text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors duration-300"
                placeholder="john.doe@email.com"
                required
              />
            </div>

            <div>
              <div className="text-textSecondary uppercase text-xs mb-2">Username</div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-inputBg border-border rounded-md px-4 py-3 text-text text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors duration-300"
                placeholder="johndoe"
                required
              />
            </div>

            <div>
              <div className="text-textSecondary uppercase text-xs mb-2">Password</div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-inputBg border-border rounded-md px-4 py-3 text-text text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors duration-300"
                  placeholder="••••••••••"
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
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primaryHover text-white py-3 rounded-md text-sm font-medium transition-colors duration-300"
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