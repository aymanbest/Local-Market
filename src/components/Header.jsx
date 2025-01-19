import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, LogIn, CircleUser, Apple } from 'lucide-react';
import Button from './ui/Button';
import { logoutUser } from '../store/slices/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="px-4 pt-4">
      <header className="bg-[#1E1E1E] text-white rounded-xl max-w-7xl mx-auto">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-[#FF4500] hover:text-[#FF6D33] transition-colors">
                <Apple className="w-6 h-6" />
              </a>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8 font-medium">
              <Link to="/" className="text-white hover:text-[#FF4500] transition-colors">Home</Link>
              <Link to="/" className="text-white hover:text-[#FF4500] transition-colors">Store</Link>
              <Link to="/" className="text-white hover:text-[#FF4500] transition-colors">About</Link>
              <Link to="/" className="text-white hover:text-[#FF4500] transition-colors">Support</Link>
              <Link to="/" className="text-white hover:text-[#FF4500] transition-colors">FAQ</Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-6">
              <Link to="/cart" className="relative group flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-gray-300 group-hover:text-[#FF4500] transition-colors" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF4500] text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>
              <span className="h-6 w-px bg-white/20"></span>
              {isAuthenticated ? (
                <div className="relative">
                  <Link to="/account" className="h-12 flex items-center gap-3 pr-4 pl-1">
                    <CircleUser className="w-10 h-10 text-gray-300 hover:text-[#FF4500] transition-colors" />
                    <div>
                      <span className="block text-white/80 -mb-2">Hello,</span>
                      <span className="block text-white/80 font-semibold">{user.name}</span>
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login">
                    <Button variant="ghost" className="text-white hover:text-[#FF4500] font-medium">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-[#FF4500] hover:bg-[#FF6D33] text-white rounded-full px-6 h-12 flex items-center gap-2 font-medium">
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