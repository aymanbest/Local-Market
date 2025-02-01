import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ShoppingCart, LogIn, CircleUser, Leaf, Sun, Moon, Menu, X, Building2,
  LayoutDashboard, Users, Package, StarIcon, BarChart2
} from 'lucide-react';
import Button from './ui/Button';
import { logoutUser } from '../store/slices/authSlice';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const isAdmin = location.pathname.startsWith('/admin');

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const adminNavigationItems = [
    { path: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/reviews', label: 'Reviews', icon: StarIcon },
  ];

  const regularNavigationItems = [
    { path: '/', label: 'Home' },
    { path: '/store', label: 'Store' },
    { path: '/about', label: 'About' },
    { path: '/support', label: 'Support' },
    { path: '/faq', label: 'FAQ' },
  ];

  const navigationItems = isAdmin ? adminNavigationItems : regularNavigationItems;

  // Mobile Menu Component
  const MobileMenu = () => {
    const handleLinkClick = () => {
      setShowMobileMenu(false);
    };

    return (
      <div className={`fixed inset-0 overflow-y-auto z-50 transition-colors duration-300 ${
        isDark ? 'bg-mainBlack' : 'bg-white'
      }`}>
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
          {navigationItems.map((item) => (
            <li key={item.path} className="px-7 relative">
              <Link 
                to={item.path} 
                onClick={handleLinkClick} 
                className={`rounded-lg px-4 py-2 block transition-colors duration-300 ${
                  isActivePath(item.path) 
                    ? isDark 
                      ? 'bg-bioGreen text-white' 
                      : 'bg-primary text-white'
                    : isDark
                      ? 'text-gray-400 hover:bg-gray-800' 
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                {item.label}
                {isActivePath(item.path) && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                )}
              </Link>
            </li>
          ))}
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
        <header className={`
          ${isAdmin 
            ? isDark 
              ? 'bg-bgGrey border-borderGrey' 
              : 'bg-white border-gray-200'
            : isDark 
              ? 'bg-headerBg' 
              : 'bg-white'
          } 
          text-text rounded-xl max-w-7xl mx-auto transition-colors duration-300 border`}
        >
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Logo and Theme Toggle */}
              <div className="flex items-center space-x-4">
                {isAdmin ? (
                  <h1 className="text-2xl font-bold text-bioGreen">Admin Portal</h1>
                ) : (
                  <a href="/" className="text-primary hover:text-primaryHover transition-colors">
                    <Leaf className="w-6 h-6" />
                  </a>
                )}
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
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative transition-colors duration-300 flex items-center gap-2 ${
                      isActivePath(item.path)
                        ? isDark 
                          ? 'text-bioGreen font-semibold' 
                          : 'text-primary font-semibold'
                        : isDark
                          ? 'text-gray-400 hover:text-bioGreen'
                          : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    {item.label}
                    {isActivePath(item.path) && (
                      <>
                        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(169,196,108,0.7)] animate-pulse" />
                        <div className="absolute -bottom-1 left-0 w-full h-8 bg-gradient-to-t from-primary/20 to-transparent rounded-full blur-sm" />
                      </>
                    )}
                  </Link>
                ))}
              </nav>

              {/* Right Section */}
              <div className="flex items-center space-x-6">
                {!isAdmin && (
                  <Link to="/cart" className="relative group flex items-center gap-2">
                    <ShoppingCart className="w-6 h-6 text-text group-hover:text-primary transition-colors" />
                    {items.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-text text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                        {items.length}
                      </span>
                    )}
                  </Link>
                )}
                <span className="h-6 w-px bg-border transition-colors duration-300"></span>
                {isAuthenticated && user && (
                  <div className="relative">
                    <Link to={isAdmin ? "/admin/profile" : "/account"} className="h-12 flex items-center gap-3 pr-4 pl-1">
                      <CircleUser className="w-10 h-10 text-textSecondary hover:text-primary transition-colors" />
                      <div>
                        <span className="block text-textSecondary -mb-2">Hello,</span>
                        <span className="block text-text font-semibold">
                          {user.lastName || 'Admin'}
                        </span>
                      </div>
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