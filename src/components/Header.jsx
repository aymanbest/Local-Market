import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, LogIn, CircleUser, Leaf, Sun, Moon, Menu, X, Building2 } from 'lucide-react';
import Button from './ui/Button';
import { logoutUser } from '../store/slices/authSlice';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  // Mobile Menu Component
  const MobileMenu = () => {
    const handleLinkClick = () => {
      setShowMobileMenu(false);
    };

    return (
      <div className="fixed inset-0 overflow-y-auto bg-background z-50 transition-colors duration-300">
        <div className="flex justify-end pt-7 px-7">
          <button 
            onClick={() => setShowMobileMenu(false)}
            className="rounded-full bg-cardBg flex justify-center gap-2 items-center w-12 h-12 border border-border"
          >
            <X className="w-6 h-6 text-text" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <ul className="py-7 space-y-2">
          <li className="px-7 relative">
            <Link 
              to="/" 
              onClick={handleLinkClick} 
              className={`bg-cardBg rounded-lg px-4 py-2 block text-text transition-colors duration-300 ${
                isActivePath('/') ? 'bg-primary text-white' : 'hover:bg-cardBg'
              }`}
            >
              Home
              {isActivePath('/') && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
              )}
            </Link>
          </li>
          <li className="px-7 relative">
            <Link 
              to="/store" 
              onClick={handleLinkClick} 
              className={`bg-cardBg rounded-lg px-4 py-2 block text-text transition-colors duration-300 ${
                isActivePath('/store') ? 'bg-primary text-white' : 'hover:bg-cardBg'
              }`}
            >
              Store
              {isActivePath('/store') && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
              )}
            </Link>
          </li>
          <li className="px-7 relative">
            <Link to="/about" onClick={handleLinkClick} className="bg-cardBg rounded-lg px-4 py-2 block text-text hover:bg-cardBg transition-colors duration-300">About</Link>
          </li>
          <li className="px-7 relative">
            <Link to="/support" onClick={handleLinkClick} className="bg-cardBg rounded-lg px-4 py-2 block text-text hover:bg-cardBg transition-colors duration-300">Support</Link>
          </li>
          <li className="px-7 relative">
            <Link to="/faq" onClick={handleLinkClick} className="bg-cardBg rounded-lg px-4 py-2 block text-text hover:bg-cardBg transition-colors duration-300">FAQ</Link>
          </li>
        </ul>
        <div className="flex px-7 items-center gap-6 justify-end">
          {!isAuthenticated && (
            <>
              <Link to="/login" onClick={handleLinkClick} className="text-text hover:text-primary transition-colors">Login</Link>
              <Link to="/register" onClick={handleLinkClick} className="bg-primary hover:bg-primaryHover text-white rounded-full px-6 h-12 flex items-center gap-2 transition-colors duration-300">
                <CircleUser className="w-6 h-6" />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    );
  };

  // Mobile Header
  const MobileHeader = () => (
    <div className="md:hidden flex p-3 gap-2 flex-1">
      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} className="rounded-full bg-cardBg flex justify-center gap-2 items-center w-12 h-12 border border-border">
          {isDark ? <Sun className="w-6 h-6 text-text" /> : <Moon className="w-6 h-6 text-text" />}
        </button>
        <Leaf className="w-6 h-6 text-primary" />
      </div>
      <Link to="/cart" className="relative rounded-full bg-cardBg flex justify-center gap-2 items-center h-12 px-4 border border-border">
        <ShoppingCart className="w-6 h-6 text-text" />
        <span className="text-sm text-text">{items.length}</span>
      </Link>
      <button 
        onClick={() => setShowMobileMenu(true)}
        className="rounded-full bg-cardBg flex justify-center gap-2 items-center w-12 h-12 ml-auto border border-border"
      >
        <Menu className="w-6 h-6 text-text" />
        <span className="sr-only">Menu</span>
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Header */}
      <div className="hidden md:block px-4 pt-4">
        <header className="bg-headerBg text-text rounded-xl max-w-7xl mx-auto transition-colors duration-300">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Social Icons */}
              <div className="flex items-center space-x-4">
                <a href="/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primaryHover transition-colors">
                  <Leaf className="w-6 h-6" />
                </a>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-cardBg transition-colors"
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
                <Link 
                  to="/" 
                  className={`relative text-text transition-colors duration-300 ${
                    isActivePath('/') 
                      ? 'text-primary font-semibold' 
                      : 'hover:text-primary'
                  }`}
                >
                  Home
                  {isActivePath('/') && (
                    <>
                      <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(169,196,108,0.7)] animate-pulse" />
                      <div className="absolute -bottom-1 left-0 w-full h-8 bg-gradient-to-t from-primary/20 to-transparent rounded-full blur-sm" />
                    </>
                  )}
                </Link>
                <Link 
                  to="/store" 
                  className={`relative text-text transition-colors duration-300 ${
                    isActivePath('/store') 
                      ? 'text-primary font-semibold' 
                      : 'hover:text-primary'
                  }`}
                >
                  Store
                  {isActivePath('/store') && (
                    <>
                      <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(169,196,108,0.7)] animate-pulse" />
                      <div className="absolute -bottom-1 left-0 w-full h-8 bg-gradient-to-t from-primary/20 to-transparent rounded-full blur-sm" />
                    </>
                  )}
                </Link>
                <Link 
                  to="/about" 
                  className={`relative text-text transition-colors duration-300 ${
                    isActivePath('/about') 
                      ? 'text-primary font-semibold' 
                      : 'hover:text-primary'
                  }`}
                >
                  About
                  {isActivePath('/about') && (
                    <>
                      <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(169,196,108,0.7)] animate-pulse" />
                      <div className="absolute -bottom-1 left-0 w-full h-8 bg-gradient-to-t from-primary/20 to-transparent rounded-full blur-sm" />
                    </>
                  )}
                </Link>
                <Link 
                  to="/support" 
                  className={`relative text-text transition-colors duration-300 ${
                    isActivePath('/support') 
                      ? 'text-primary font-semibold' 
                      : 'hover:text-primary'
                  }`}
                >
                  Support
                  {isActivePath('/support') && (
                    <>
                      <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(169,196,108,0.7)] animate-pulse" />
                      <div className="absolute -bottom-1 left-0 w-full h-8 bg-gradient-to-t from-primary/20 to-transparent rounded-full blur-sm" />
                    </>
                  )}
                </Link>
                <Link 
                  to="/faq" 
                  className={`relative text-text transition-colors duration-300 ${
                    isActivePath('/faq') 
                      ? 'text-primary font-semibold' 
                      : 'hover:text-primary'
                  }`}
                >
                  FAQ
                  {isActivePath('/faq') && (
                    <>
                      <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(169,196,108,0.7)] animate-pulse" />
                      <div className="absolute -bottom-1 left-0 w-full h-8 bg-gradient-to-t from-primary/20 to-transparent rounded-full blur-sm" />
                    </>
                  )}
                </Link>
                {user?.role === 'customer' && user?.applicationStatus === 'NO_APPLICATION' && (
                  <Link 
                    to="/become-seller" 
                    className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-full flex items-center gap-2 transition-colors duration-300"
                  >
                    <Building2 className="w-5 h-5" />
                    <span>Start Selling</span>
                  </Link>
                )}
                {user?.role === 'customer' && user?.applicationStatus === 'PENDING' && (
                  <div className="bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-full flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    <span>Application Pending</span>
                  </div>
                )}
              </nav>

              {/* Right Section */}
              <div className="flex items-center space-x-6">
                <Link to="/cart" className="relative group flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6 text-text group-hover:text-primary transition-colors" />
                  {items.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-text text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                      {items.length}
                    </span>
                  )}
                </Link>
                <span className="h-6 w-px bg-border transition-colors duration-300"></span>
                {isAuthenticated && user ? (
                  <div className="relative">
                    <Link to="/account" className="h-12 flex items-center gap-3 pr-4 pl-1">
                      <CircleUser className="w-10 h-10 text-textSecondary hover:text-primary transition-colors" />
                      <div>
                        <span className="block text-textSecondary -mb-2">Hello,</span>
                        <span className="block text-text font-semibold">
                          {user.lastName || 'User'}
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

      {/* Mobile Header */}
      <div className="md:hidden px-4 pt-4">
        <header className="bg-headerBg rounded-full">
          <MobileHeader />
        </header>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && <MobileMenu />}
    </>
  );
};

export default Header; 