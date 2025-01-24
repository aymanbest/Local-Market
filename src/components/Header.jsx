import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, LogIn, CircleUser, Apple, Sun, Moon } from 'lucide-react';
import Button from './ui/Button';
import { logoutUser } from '../store/slices/authSlice';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  

  return (
    <div className="px-4 pt-4">
      <header className="bg-headerBg text-text rounded-xl max-w-7xl mx-auto transition-colors duration-300">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              <a href="/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primaryHover transition-colors">
                <Apple className="w-6 h-6" />
              </a>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isDark ? (
                  <Sun className="w-6 h-6 text-primary animate-spin-slow" />
                ) : (
                  <Moon className="w-6 h-6 text-primary animate-spin-slow" />
                )}
              </button>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8 font-medium">
              <Link to="/" className="text-text hover:text-primary transition-colors">Home</Link>
              <Link to="/" className="text-text hover:text-primary transition-colors">Store</Link>
              <Link to="/" className="text-text hover:text-primary transition-colors">About</Link>
              <Link to="/" className="text-text hover:text-primary transition-colors">Support</Link>
              <Link to="/" className="text-text hover:text-primary transition-colors">FAQ</Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-6">
              <Link to="/cart" className="relative group flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-text group-hover:text-primary transition-colors" />
                {true && ( // TODO: Change to items.length > 0 
                  <span className="absolute -top-1 -right-1 bg-primary text-text text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>
              <span className="h-6 w-px dark:bg-white/20 bg-black/20 transition-colors duration-300"></span>
              {isAuthenticated && user ? (
                <div className="relative">
                  <Link to="/account" className="h-12 flex items-center gap-3 pr-4 pl-1">
                    <CircleUser className="w-10 h-10 text-gray-300 hover:text-[#FF4500] transition-colors" />
                    <div>
                      <span className="block text-white/80 -mb-2">Hello,</span>
                      <span className="block text-white/80 font-semibold">
                        {user.email || 'User'}
                      </span>
                    </div>
                  </Link>
                  {/* <button 
                    onClick={handleLogout}
                    className="absolute top-full right-0 mt-2 px-4 py-2 bg-[#1E1E1E] text-white rounded-md hover:bg-[#FF4500] transition-colors"
                  >
                    Logout
                  </button> */}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login">
                    <Button 
                      variant="ghost" 
                      className="text-text hover:text-primary font-medium transition-colors duration-300"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button 
                      className="bg-primary hover:bg-primaryHover text-white rounded-full px-6 h-12 flex items-center gap-2 font-medium transition-colors duration-300"
                    >
                      <CircleUser className="w-6 h-6" />
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header; 