import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, LogIn, CircleUser, Leaf, Sun, Moon, Menu, X } from 'lucide-react';
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
                isActivePath('/') ? 'bg-primary text-white' : 'hover:bg-white/5'
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
                isActivePath('/store') ? 'bg-primary text-white' : 'hover:bg-white/5'
              }`}
            >
              Store
              {isActivePath('/store') && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
              )}
            </Link>
          </li>
          <li className="px-7 relative">
            <Link to="/about" onClick={handleLinkClick} className="bg-cardBg rounded-lg px-4 py-2 block text-text hover:bg-white/5 transition-colors duration-300">About</Link>
          </li>
          <li className="px-7 relative">
            <Link to="/support" onClick={handleLinkClick} className="bg-cardBg rounded-lg px-4 py-2 block text-text hover:bg-white/5 transition-colors duration-300">Support</Link>
          </li>
          <li className="px-7 relative">
            <Link to="/faq" onClick={handleLinkClick} className="bg-cardBg rounded-lg px-4 py-2 block text-text hover:bg-white/5 transition-colors duration-300">FAQ</Link>
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
                <Link 
                  to="/" 
                  className={`relative text-text transition-colors duration-300 ${
                    isActivePath('/') 
                      ? 'dark:bg-gradient-to-r dark:from-primary dark:via-primary/80 dark:to-primary dark:bg-clip-text dark:text-transparent font-semibold bg-gradient-to-r from-primary/90 via-primary to-primary/90 bg-clip-text text-transparent' 
                      : 'hover:text-primary'
                  }`}
                >
                  Home
                  {isActivePath('/') && (
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary/90 via-primary to-primary/90 rounded-full" />
                  )}
                </Link>
                <Link 
                  to="/store" 
                  className={`relative text-text transition-colors duration-300 ${
                    isActivePath('/store') 
                      ? 'dark:bg-gradient-to-r dark:from-primary dark:via-primary/80 dark:to-primary dark:bg-clip-text dark:text-transparent font-semibold bg-gradient-to-r from-primary/90 via-primary to-primary/90 bg-clip-text text-transparent' 
                      : 'hover:text-primary'
                  }`}
                >
                  Store
                  {isActivePath('/store') && (
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary/90 via-primary to-primary/90 rounded-full" />
                  )}
                </Link>
                <Link 
                  to="/about" 
                  className={`relative text-text transition-colors duration-300 ${
                    isActivePath('/about') 
                      ? 'dark:bg-gradient-to-r dark:from-primary dark:via-primary/80 dark:to-primary dark:bg-clip-text dark:text-transparent font-semibold bg-gradient-to-r from-primary/90 via-primary to-primary/90 bg-clip-text text-transparent' 
                      : 'hover:text-primary'
                  }`}
                >
                  About
                  {isActivePath('/about') && (
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary/90 via-primary to-primary/90 rounded-full" />
                  )}
                </Link>
                <Link 
                  to="/support" 
                  className={`relative text-text transition-colors duration-300 ${
                    isActivePath('/support') 
                      ? 'dark:bg-gradient-to-r dark:from-primary dark:via-primary/80 dark:to-primary dark:bg-clip-text dark:text-transparent font-semibold bg-gradient-to-r from-primary/90 via-primary to-primary/90 bg-clip-text text-transparent' 
                      : 'hover:text-primary'
                  }`}
                >
                  Support
                  {isActivePath('/support') && (
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary/90 via-primary to-primary/90 rounded-full" />
                  )}
                </Link>
                <Link 
                  to="/faq" 
                  className={`relative text-text transition-colors duration-300 ${
                    isActivePath('/faq') 
                      ? 'dark:bg-gradient-to-r dark:from-primary dark:via-primary/80 dark:to-primary dark:bg-clip-text dark:text-transparent font-semibold bg-gradient-to-r from-primary/90 via-primary to-primary/90 bg-clip-text text-transparent' 
                      : 'hover:text-primary'
                  }`}
                >
                  FAQ
                  {isActivePath('/faq') && (
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary/90 via-primary to-primary/90 rounded-full" />
                  )}
                </Link>
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