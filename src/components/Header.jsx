import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, LogIn, User , Apple } from 'lucide-react';
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

              {isAuthenticated ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-[#FF4500]"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    <User className="w-6 h-6" />
                  </Button>
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#1E1E1E] rounded-lg shadow-lg py-1 border border-gray-800">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#FF4500] hover:text-white">
                        Profile
                      </Link>
                      <Link to="/orders" className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#FF4500] hover:text-white">
                        Orders
                      </Link>
                      <button
                        onClick={() => dispatch(logoutUser())}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#FF4500] hover:text-white"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
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
                      <User className="w-6 h-6" />
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