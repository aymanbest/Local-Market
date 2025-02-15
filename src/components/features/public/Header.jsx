import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ShoppingCart, CircleUser, Leaf, Sun, Moon, Menu, X,
  Building2, LayoutDashboard, Users, Package, StarIcon, Home, Store, BookOpenText, MailOpen, MessageCircleQuestion, LogIn, UserPlus, LogOut, ChevronRight, ClipboardList, BarChart2, Bell, BadgePercent
} from 'lucide-react';
import { logoutUser } from '../../../store/slices/auth/authSlice';
import { useTheme } from '../../../context/ThemeContext';
import { markAsRead, markAllAsRead } from '../../../store/slices/common/notificationSlice';


const NotificationItem = ({ notification, onRead }) => {
  const { isDark } = useTheme();

  const getIcon = (type) => {
    switch (type) {
      case 'NEW_ORDER':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'LOW_STOCK_ALERT':
      case 'CRITICAL_STOCK_ALERT':
        return <BarChart2 className="w-5 h-5 text-red-500" />;
      case 'PRODUCT_APPROVED':
        return <StarIcon className="w-5 h-5 text-green-500" />;
      case 'ORDER_STATUS_UPDATE':
        return <ClipboardList className="w-5 h-5 text-purple-500" />;
      case 'DELIVERY_UPDATE':
        return <Package className="w-5 h-5 text-indigo-500" />;
      case 'REVIEW_STATUS_UPDATE':
        return <MailOpen className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div 
      className={`
        p-4 border-b last:border-b-0 cursor-pointer
        ${notification.read 
          ? isDark 
            ? 'bg-transparent' 
            : 'bg-transparent' 
          : isDark
            ? 'bg-white/5'
            : 'bg-black/5'
        }
        transition-all duration-300 hover:bg-primary/5
      `}
      onClick={() => onRead(notification.id)}
    >
      <div className="flex items-start gap-3">
        <div className={`
          p-2 rounded-xl
          ${isDark ? 'bg-white/10' : 'bg-black/5'}
        `}>
          {getIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`
            text-sm font-medium mb-1 truncate
            ${notification.read 
              ? 'text-textSecondary' 
              : 'text-text'
            }
          `}>
            {notification.message}
          </p>
          <p className="text-xs text-textSecondary">
            {new Date(notification.timestamp).toLocaleString()}
          </p>
        </div>
        {!notification.read && (
          <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
        )}
      </div>
    </div>
  );
};

const Header = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { notifications, unreadCount } = useSelector(state => state.notifications);
  const navigate = useNavigate();

  const isAdmin = location.pathname.startsWith('/admin');
  const isProducer = location.pathname.startsWith('/producer');

  // State declarations
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navRef = useRef(null);
  const [visibleItems, setVisibleItems] = useState([]);
  const [overflowItems, setOverflowItems] = useState([]);

  const isActivePath = useCallback((path) => {
    return location.pathname === path;
  }, [location.pathname]);

  // Memoize navigation items to prevent unnecessary recalculations
  const navigationItems = useMemo(() => {
    const regularNavigationItems = [
      { path: '/', label: 'Home', icon: Home },
      { path: '/store', label: 'Store', icon: Store },
      { path: '/about', label: 'About', icon: BookOpenText },
      { path: '/support', label: 'Support', icon: MailOpen },
      { path: '/faq', label: 'FAQ', icon: MessageCircleQuestion },
    ];

    if (isAdmin) {
      return [
    { path: '/admin', label: 'Hub', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/reviews', label: 'Reviews', icon: StarIcon },
    { path: '/admin/applications', label: 'Applications', icon: Building2 },
    { path: '/admin/coupons', label: 'Coupons', icon: BadgePercent },
      ];
    }

    if (isProducer) {
      return [
    { path: '/producer', label: 'Products', icon: Package },
    { path: '/producer/orders', label: 'Orders', icon: ClipboardList },
    { path: '/producer/analytics', label: 'Analytics', icon: BarChart2 },
  ];
    }

    // Show Become Seller link based on conditions
    if (!isAuthenticated || (user?.role === 'customer' && user?.applicationStatus !== 'PENDING' && user?.applicationStatus !== 'APPROVED')) {
      regularNavigationItems.push({ 
        path: '/become-seller', 
        label: 'Sell Now',
        icon: Building2 
      });
    }
    
    // Show pending status for customers with PENDING application
    if (isAuthenticated && user?.role === 'customer' && user?.applicationStatus === 'PENDING') {
      regularNavigationItems.push({ 
        path: '#', 
        label: 'Application Pending',
        icon: Building2,
        disabled: true,
        className: 'text-yellow-500 cursor-not-allowed'
      });
    }
    
    return regularNavigationItems;
  }, [isAdmin, isProducer, isAuthenticated, user]);

  // Calculate visible and overflow items
  useEffect(() => {
    const calculateVisibleItems = () => {
      const nav = navRef.current;
      if (!nav) return;

      const navWidth = nav.offsetWidth;
      const itemWidth = 120; // Approximate width of each item
      const maxItems = Math.floor(navWidth / itemWidth);
      
      // Ensure at least 3 items are visible if available
      const minVisibleItems = Math.min(3, navigationItems.length);
      const actualVisibleItems = Math.max(minVisibleItems, Math.min(maxItems, navigationItems.length));

      setVisibleItems(navigationItems.slice(0, actualVisibleItems));
      setOverflowItems(navigationItems.slice(actualVisibleItems));
    };

    calculateVisibleItems();
    window.addEventListener('resize', calculateVisibleItems);
    return () => window.removeEventListener('resize', calculateVisibleItems);
  }, [navigationItems]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showMobileMenu]);

  const handleLinkClick = () => {
    setShowMobileMenu(false);
  };

  // Mobile Menu Component
  const MobileMenu = () => {
    return (
      <div className={`
        fixed inset-0 transition-all duration-500
        ${showMobileMenu 
          ? 'bg-black/60 z-50' 
          : 'opacity-0 pointer-events-none'
        }
      `}>
        {/* Mobile Menu Panel */}
        <div className={`
          fixed inset-y-0 right-0 w-[85%] max-w-md
          transform transition-all duration-500 ease-out
          ${showMobileMenu ? 'translate-x-0' : 'translate-x-full'}
          ${isDark 
            ? 'bg-[#0a0a0a]/95' 
            : 'bg-white/95'
          }
        `}>
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`
              absolute -top-1/4 right-0 w-1/2 aspect-square rounded-full
              bg-gradient-to-b from-primary/10 to-transparent blur-2xl
            `} />
            <div className={`
              absolute -bottom-1/4 left-0 w-1/2 aspect-square rounded-full
              bg-gradient-to-t from-primary/10 to-transparent blur-2xl
            `} />
          </div>

          {/* Content Container */}
          <div className="relative h-full flex flex-col">
            {/* Header Section */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className="relative"
                >
                  <div className="leaf-gradient absolute inset-0 rotate-45 bg-gradient-to-r from-primary/50 to-transparent rounded-xl blur-xl"></div>
                  <Leaf className="w-8 h-8 text-primary relative z-10" />
                </button>
                <Link 
                  to="/"
                  onClick={() => setShowMobileMenu(false)}
                  className="group flex items-center gap-2"
                >
                  <div className="relative w-7 h-7">
                    <div className="absolute inset-0 rotate-45 bg-gradient-to-r from-primary/50 to-transparent rounded-xl blur-xl"></div>
                    <Leaf className="w-7 h-7 text-primary relative z-10" />
                  </div>
                  <span className="font-recoleta text-lg text-text relative">
                    LocalMarket
                    <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-primary/0 via-primary to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
                  </span>
                </Link>
              </div>
              <button
                onClick={() => setShowMobileMenu(false)}
                className={`
                  relative p-2.5 rounded-xl group
                  ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}
                  transition-all duration-300
                `}
              >
                <X className={`
                  w-6 h-6 text-text
                  transform transition-transform duration-300
                  group-hover:rotate-90
                `} />
              </button>
            </div>

            {/* Main Navigation */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-4 space-y-6">
                {/* Primary Navigation */}
                <div className="space-y-2">
                  {navigationItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        onClick={() => setShowMobileMenu(false)}
                        className={`
                          group flex items-center justify-between p-3 rounded-xl
                          transition-all duration-300
                          ${isActivePath(item.path)
                            ? isDark 
                              ? 'bg-white/10 text-white' 
                              : 'bg-black/5 text-gray-900'
                            : isDark
                              ? 'text-gray-300 hover:bg-white/5' 
                              : 'text-gray-600 hover:bg-black/5'
                          }
                        `}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`
                            p-2 rounded-xl
                            ${isActivePath(item.path)
                              ? 'bg-primary text-white'
                              : isDark
                                ? 'bg-white/10' 
                                : 'bg-black/5'
                            }
                            transition-colors duration-300
                          `}>
                            <item.icon className="w-5 h-5" />
                          </div>
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <ChevronRight className={`
                          w-5 h-5 text-gray-400
                          transition-transform duration-300
                          group-hover:translate-x-1
                        `} />
                      </Link>
                  ))}
                </div>

                {/* Support Section - Only show for regular users */}
                {!isAdmin && !isProducer && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-textSecondary px-2 mb-3">
                      Support
                    </h3>
                    {[
                      { icon: BookOpenText, label: 'Help Center', path: '/help' },
                      { icon: MailOpen, label: 'Contact Us', path: '/contact' },
                      { icon: MessageCircleQuestion, label: 'FAQ', path: '/faq' }
                    ].map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        onClick={() => setShowMobileMenu(false)}
                        className={`
                          group flex items-center justify-between p-3 rounded-xl
                          transition-all duration-300
                          ${isDark 
                            ? 'text-gray-300 hover:bg-white/5' 
                            : 'text-gray-600 hover:bg-black/5'
                          }
                        `}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`
                            p-2 rounded-xl
                            ${isDark ? 'bg-white/10' : 'bg-black/5'}
                          `}>
                            <item.icon className="w-5 h-5" />
                          </div>
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <ChevronRight className={`
                          w-5 h-5 text-gray-400
                          transition-transform duration-300
                          group-hover:translate-x-1
                        `} />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 space-y-4">
              {!isAuthenticated ? (
                <div className="space-y-3">
                  <Link 
                    to="/login"
                    state={{ from: location }}
                  >
                    <button className={`
                      flex items-center justify-center gap-2 w-full py-3 px-6 
                      rounded-xl font-medium transition-all duration-300
                      ${isDark 
                        ? 'bg-white/10 text-white hover:bg-white/20' 
                        : 'bg-black/5 text-gray-900 hover:bg-black/10'
                      }
                    `}
                  >
                    <LogIn className="w-5 h-5" />
                    Login
                  </button>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setShowMobileMenu(false)}
                    className="
                      flex items-center justify-center gap-2 w-full py-3 px-6 
                      rounded-xl font-medium
                      bg-gradient-to-r from-primary to-primaryHover
                      text-white transform transition-all duration-300
                      hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25
                    "
                  >
                    <UserPlus className="w-5 h-5" />
                    Register
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className={`
                    p-3 rounded-xl
                    ${isDark ? 'bg-white/5' : 'bg-black/5'}
                  `}>
                    <div className="flex items-center gap-3">
                      <CircleUser className="w-10 h-10 text-primary" />
                      <div className="flex-1">
                        <span className="block text-sm text-textSecondary">Welcome back</span>
                        <span className="block text-base font-medium text-text">
                          {user.lastName || 'Admin'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          dispatch(logoutUser());
                          setShowMobileMenu(false);
                        }}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-500/10"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={toggleTheme}
                    className={`
                      flex items-center justify-between w-full p-3 rounded-xl
                      ${isDark 
                        ? 'bg-white/10 text-yellow-400' 
                        : 'bg-black/5 text-gray-600'
                      }
                    `}
                  >
                    <span className="font-medium">
                      {isDark ? 'Light Mode' : 'Dark Mode'}
                    </span>
                    {isDark ? (
                      <Sun className="w-5 h-5" />
                    ) : (
                      <Moon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Header - Hidden on Mobile */}
      <header 
        className={`
          hidden md:block fixed top-0 left-0 right-0 z-40 
          transition-all duration-500 ease-out
          ${isScrolled ? 'py-2' : 'py-4'}
        `}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className={`
            relative rounded-2xl border backdrop-blur-lg
            transition-all duration-500 ease-out
            ${isScrolled 
              ? isDark 
                ? 'border-white/5 bg-black/75 shadow-lg shadow-black/10' 
                : 'border-black/5 bg-white/75 shadow-lg shadow-black/5'
              : isDark
                ? 'border-white/10 bg-black/50' 
                : 'border-black/10 bg-white/50'
            }
            p-3
          `}>
            <div className="flex items-center justify-between">
              {/* Logo Section with Confetti Animation */}
              <div className="flex items-center gap-2">
                <Link 
                  to="/" 
                  className="group flex items-center gap-2"
                >
                  <div className="relative w-8 h-8">
                    <div className="absolute inset-0 rotate-45 bg-gradient-to-r from-primary/50 to-transparent rounded-xl blur-xl"></div>
                    <Leaf className="w-8 h-8 text-primary relative z-10" />
                  </div>
                  <span className="font-recoleta text-xl text-text relative">
                    LocalMarket
                    <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-primary/0 via-primary to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
                  </span>
                </Link>
              </div>

              {/* Navigation with Improved Layout */}
              <nav className="hidden md:flex items-center justify-center flex-1 mx-4 lg:mx-8 min-w-0">
                <div className="flex items-center gap-1 lg:gap-2 justify-center overflow-x-auto max-w-full no-scrollbar">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.disabled ? '#' : item.path}
                      className={`
                        relative px-3 lg:px-4 py-2.5 rounded-xl overflow-hidden group
                        transition-all duration-300 ease-out whitespace-nowrap flex-shrink-0
                      ${item.disabled ? item.className : 
                        isActivePath(item.path)
                          ? isDark 
                              ? 'text-white bg-white/10' 
                              : 'text-gray-900 bg-black/5'
                          : 'text-text hover:text-primary'
                      }
                    `}
                  >
                      {/* Background Gradient */}
                      {!item.disabled && (
                        <div className={`
                          absolute inset-0 rounded-xl opacity-0
                          bg-gradient-to-r from-primary/10 via-primary/5 to-transparent
                          group-hover:opacity-100 transition-opacity duration-500
                          ${isActivePath(item.path) ? 'opacity-100' : ''}
                        `} />
                      )}

                      {/* Content */}
                    <span className="relative z-10 flex items-center gap-2">
                        {item.icon && (
                          <item.icon className={`
                            w-4 h-4 transition-all duration-300
                            ${isActivePath(item.path) ? 'text-primary scale-110' : ''}
                            group-hover:scale-110 group-hover:text-primary
                          `} />
                        )}
                        <span className="font-medium text-sm lg:text-base">{item.label}</span>
                    </span>

                      {/* Active Indicator */}
                    {!item.disabled && isActivePath(item.path) && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-xl blur-sm"></div>
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0"></div>
                        </>
                    )}
                  </Link>
                ))}
                </div>
              </nav>

              {/* Right Section with Enhanced Buttons */}
              <div className="flex items-center gap-4">
                {/* Theme Toggle with Animation */}
                <button
                  onClick={toggleTheme}
                  className={`
                    p-2.5 rounded-xl transition-all duration-300 
                    hover:scale-110 relative group
                    ${isDark 
                      ? 'bg-white/10 text-yellow-400 hover:bg-white/15' 
                      : 'bg-black/5 text-gray-600 hover:bg-black/10'
                    }
                  `}
                >
                  <div className="relative">
                    <Sun className={`
                      w-5 h-5 absolute transition-all duration-500
                      ${isDark ? 'rotate-0 opacity-100 scale-100' : 'rotate-90 opacity-0 scale-50'}
                    `} />
                    <Moon className={`
                      w-5 h-5 transition-all duration-500
                      ${isDark ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}
                    `} />
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                {/* Notifications for both producers and non-producers */}
                <div className="flex items-center gap-3">
                  {!isProducer && !isAdmin && (
                    <Link to="/cart" className="relative group">
                      <div className={`
                        p-2.5 rounded-xl transition-all duration-300
                        ${isDark 
                          ? 'bg-white/10 hover:bg-white/15' 
                          : 'bg-black/5 hover:bg-black/10'
                        }
                        group-hover:scale-110
                      `}>
                        <ShoppingCart className="w-5 h-5 text-text group-hover:text-primary transition-colors duration-300" />
                        {items.length > 0 && (
                          <span className="
                            absolute -top-1 -right-1 w-5 h-5
                            bg-primary text-white text-xs font-medium
                            rounded-full flex items-center justify-center
                            transform transition-transform duration-300
                            group-hover:scale-110 group-hover:rotate-12
                          ">
                            {items.length}
                          </span>
                        )}
                      </div>
                    </Link>
                  )}

                  {/* Notifications with Enhanced Animation */}
                  {isAuthenticated && (isProducer || !isProducer) && (
                    <div className="relative">
                      <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`
                          p-2.5 rounded-xl transition-all duration-300 
                          hover:scale-110 relative group
                          ${isDark 
                            ? 'bg-white/10 hover:bg-white/15' 
                            : 'bg-black/5 hover:bg-black/10'
                          }
                          ${showNotifications ? 'bg-primary/10' : ''}
                        `}
                      >
                        <Bell className={`
                          w-5 h-5 transition-colors duration-300
                          ${showNotifications ? 'text-primary' : 'text-text'}
                          group-hover:text-primary
                        `} />
                        {unreadCount > 0 && (
                          <span className="
                            absolute -top-1 -right-1 w-5 h-5 
                            bg-primary text-white text-xs font-medium 
                            rounded-full flex items-center justify-center
                            transform transition-transform duration-300
                            group-hover:scale-110 group-hover:rotate-12
                            animate-pulse
                          ">
                            {unreadCount}
                          </span>
                        )}
                      </button>

                      {/* Notifications Dropdown with Enhanced Design */}
                      {showNotifications && (
                        <div className={`
                          absolute right-0 mt-3 w-96 rounded-xl
                          backdrop-blur-lg shadow-xl transform
                          transition-all duration-500 ease-out
                          animate-in fade-in slide-in-from-top-5
                          ${isDark 
                            ? 'bg-black/90 border border-white/10 shadow-black/20' 
                            : 'bg-white/90 border border-black/10 shadow-black/5'
                          }
                          overflow-hidden z-50
                        `}>
                          <div className="p-4 border-b border-border flex items-center justify-between">
                            <h3 className="font-medium text-text">Notifications</h3>
                            {unreadCount > 0 && (
                              <button
                                onClick={() => dispatch(markAllAsRead())}
                                className="
                                  text-sm text-primary hover:text-primaryHover
                                  transition-colors duration-300
                                "
                              >
                                Mark all as read
                              </button>
                            )}
                          </div>
                          <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length > 0 ? (
                              notifications.map((notification) => (
                                <NotificationItem
                                  key={notification.id}
                                  notification={notification}
                                  onRead={(id) => dispatch(markAsRead(id))}
                                />
                              ))
                            ) : (
                              <div className="p-4 text-center text-textSecondary">
                                No notifications
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Auth Buttons with Enhanced Design */}
                {!isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <Link 
                      to="/login"
                      state={{ from: location }}
                    >
                      <button className={`
                        relative px-5 py-2.5 rounded-xl overflow-hidden group
                        transition-all duration-300 hover:scale-105
                        ${isDark ? 'text-white/90' : 'text-gray-700'}
                      `}>
                        <span className="relative z-10 font-medium">Login</span>
                        <div className={`
                          absolute inset-0 scale-x-0 group-hover:scale-x-100
                          transition-transform duration-500 origin-left
                          ${isDark ? 'bg-white/10' : 'bg-black/5'}
                        `} />
                      </button>
                    </Link>
                    <Link to="/register">
                      <button className="
                        relative px-6 py-2.5 rounded-xl overflow-hidden group
                        transition-all duration-300 hover:scale-105
                      ">
                        {/* Gradient border */}
                        <div className={`
                          absolute inset-0 rounded-xl
                          bg-gradient-to-r from-primary via-primaryHover to-primary
                          transition-all duration-500
                          group-hover:blur-sm
                        `} />
                        
                        {/* Inner background */}
                        <div className={`
                          absolute inset-[1px] rounded-xl
                          ${isDark ? 'bg-black/60' : 'bg-white'}
                          transition-all duration-300 group-hover:inset-[1.5px]
                        `} />
                        
                        {/* Content */}
                        <div className="relative flex items-center gap-2">
                          <CircleUser className={`
                            w-4 h-4 text-primary
                            transition-all duration-300 group-hover:scale-110
                          `} />
                          <span className={`
                            bg-gradient-to-r from-primary to-primaryHover
                            bg-clip-text text-transparent font-medium
                          `}>
                            Register
                          </span>
                        </div>
                        
                        {/* Shine effect */}
                        <div className="
                          absolute inset-0 opacity-0 group-hover:opacity-100
                          transition-opacity duration-500
                          bg-gradient-to-r from-transparent via-white/20 to-transparent
                          -skew-x-12 translate-x-full group-hover:translate-x-[-180%]
                        " />
                      </button>
                    </Link>
                  </div>
                ) : (
                  <Link 
                    to={isAdmin ? "/admin/profile" : "/account"} 
                    className={`
                      group flex items-center gap-3 p-2.5 rounded-xl 
                      transition-all duration-300 hover:scale-105
                      ${isDark 
                        ? 'bg-white/10 hover:bg-white/15' 
                        : 'bg-black/5 hover:bg-black/10'
                      }
                    `}
                  >
                    <CircleUser className="w-5 h-5 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                    <span className="text-sm font-medium text-text">{user.lastName || 'Admin'}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header - Visible only on Mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40">
        <div className="px-4 py-3">
          <div className={`
            rounded-xl border backdrop-blur-lg
            transition-all duration-500 ease-out
            ${isDark 
              ? 'border-white/10 bg-black/75 shadow-lg shadow-black/10' 
              : 'border-black/10 bg-white/75 shadow-lg shadow-black/5'
            }
          `}>
            <div className="flex items-center justify-between p-2">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <Link 
                  to="/" 
                  onClick={() => setShowMobileMenu(false)}
                  className="group flex items-center gap-2"
                >
                  <div className="relative w-7 h-7">
                    <div className="absolute inset-0 rotate-45 bg-gradient-to-r from-primary/50 to-transparent rounded-xl blur-xl"></div>
                    <Leaf className="w-7 h-7 text-primary relative z-10" />
                  </div>
                  <span className="font-recoleta text-lg text-text relative">
                    LocalMarket
                    <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-primary/0 via-primary to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
                  </span>
                </Link>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {!isProducer && !isAdmin && (
                  <Link to="/cart" className="relative group">
                    <div className={`
                      p-2.5 rounded-xl transition-all duration-300
                      ${isDark 
                        ? 'bg-white/10 hover:bg-white/15' 
                        : 'bg-black/5 hover:bg-black/10'
                      }
                      group-hover:scale-110
                    `}>
                      <ShoppingCart className="w-5 h-5 text-text group-hover:text-primary transition-colors duration-300" />
                      {items.length > 0 && (
                        <span className="
                          absolute -top-1 -right-1 w-5 h-5
                          bg-primary text-white text-xs font-medium
                          rounded-full flex items-center justify-center
                          transform transition-transform duration-300
                          group-hover:scale-110 group-hover:rotate-12
                        ">
                          {items.length}
                        </span>
                      )}
                    </div>
                  </Link>
                )}

                {/* Notifications for Mobile */}
                {isAuthenticated && (isProducer || !isProducer) && (
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className={`
                        p-2.5 rounded-xl transition-all duration-300 
                        hover:scale-110 relative group
                        ${isDark 
                          ? 'bg-white/10 hover:bg-white/15' 
                          : 'bg-black/5 hover:bg-black/10'
                        }
                        ${showNotifications ? 'bg-primary/10' : ''}
                      `}
                    >
                      <Bell className={`
                        w-5 h-5 transition-colors duration-300
                        ${showNotifications ? 'text-primary' : 'text-text'}
                        group-hover:text-primary
                      `} />
                      {unreadCount > 0 && (
                        <span className="
                          absolute -top-1 -right-1 w-5 h-5 
                          bg-primary text-white text-xs font-medium 
                          rounded-full flex items-center justify-center
                          transform transition-transform duration-300
                          group-hover:scale-110 group-hover:rotate-12
                          animate-pulse
                        ">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Notifications Dropdown for Mobile */}
                    {showNotifications && (
                      <div className={`
                        absolute right-0 mt-3 w-[calc(100vw-2rem)] max-w-[24rem] rounded-xl
                        backdrop-blur-lg shadow-xl transform
                        transition-all duration-500 ease-out
                        animate-in fade-in slide-in-from-top-5
                        ${isDark 
                          ? 'bg-black/90 border border-white/10 shadow-black/20' 
                          : 'bg-white/90 border border-black/10 shadow-black/5'
                        }
                        overflow-hidden z-50
                      `}>
                        <div className="p-4 border-b border-border flex items-center justify-between">
                          <h3 className="font-medium text-text">Notifications</h3>
                          {unreadCount > 0 && (
                            <button
                              onClick={() => dispatch(markAllAsRead())}
                              className="
                                text-sm text-primary hover:text-primaryHover
                                transition-colors duration-300
                              "
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map((notification) => (
                              <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onRead={(id) => dispatch(markAsRead(id))}
                              />
                            ))
                          ) : (
                            <div className="p-4 text-center text-textSecondary">
                              No notifications
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={toggleTheme}
                  className={`
                    p-2.5 rounded-xl transition-all duration-300 
                    hover:scale-110 relative group
                    ${isDark 
                      ? 'bg-white/10 text-yellow-400 hover:bg-white/15' 
                      : 'bg-black/5 text-gray-600 hover:bg-black/10'
                    }
                  `}
                >
                  <div className="relative">
                    <Sun className={`
                      w-5 h-5 absolute transition-all duration-500
                      ${isDark ? 'rotate-0 opacity-100 scale-100' : 'rotate-90 opacity-0 scale-50'}
                    `} />
                    <Moon className={`
                      w-5 h-5 transition-all duration-500
                      ${isDark ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}
                    `} />
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                <button
                  onClick={() => setShowMobileMenu(true)}
                  className={`
                    p-2.5 rounded-xl transition-all duration-300 
                    hover:scale-110 relative group
                    ${isDark 
                      ? 'bg-white/10 hover:bg-white/15' 
                      : 'bg-black/5 hover:bg-black/10'
                    }
                  `}
                >
                  <Menu className="w-5 h-5 text-text group-hover:text-primary transition-colors duration-300" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`
          fixed inset-0 transition-all duration-500 backdrop-blur-sm
          ${showMobileMenu 
            ? 'bg-black/60 z-50' 
            : 'opacity-0 pointer-events-none'
          }
        `}>
          {/* Mobile Menu Panel */}
          <div className={`
            fixed inset-y-0 right-0 w-[85%] max-w-md
            transform transition-all duration-500 ease-out
            ${showMobileMenu ? 'translate-x-0' : 'translate-x-full'}
            ${isDark 
              ? 'bg-[#0a0a0a]/95' 
              : 'bg-white/95'
            }
            backdrop-blur-lg
          `}>
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className={`
                absolute -top-1/4 right-0 w-1/2 aspect-square rounded-full
                bg-gradient-to-b from-primary/10 to-transparent blur-2xl
              `} />
              <div className={`
                absolute -bottom-1/4 left-0 w-1/2 aspect-square rounded-full
                bg-gradient-to-t from-primary/10 to-transparent blur-2xl
              `} />
            </div>

            {/* Content Container */}
            <div className="relative h-full flex flex-col">
              {/* Header Section */}
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    className="relative"
                  >
                    <div className="leaf-gradient absolute inset-0 rotate-45 bg-gradient-to-r from-primary/50 to-transparent rounded-xl blur-xl"></div>
                    <Leaf className="w-8 h-8 text-primary relative z-10" />
                  </button>
                  <Link 
                    to="/"
                    onClick={() => setShowMobileMenu(false)}
                    className="group flex items-center gap-2"
                  >
                    <div className="relative w-7 h-7">
                      <div className="absolute inset-0 rotate-45 bg-gradient-to-r from-primary/50 to-transparent rounded-xl blur-xl"></div>
                      <Leaf className="w-7 h-7 text-primary relative z-10" />
                    </div>
                    <span className="font-recoleta text-lg text-text relative">
                      LocalMarket
                      <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-primary/0 via-primary to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
                    </span>
                  </Link>
                </div>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className={`
                    relative p-2.5 rounded-xl group
                    ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}
                    transition-all duration-300
                  `}
                >
                  <X className={`
                    w-6 h-6 text-text group-hover:text-primary
                    transform transition-all duration-500
                    group-hover:rotate-90
                  `} />
                </button>
              </div>

              {/* Main Navigation */}
              <div className="flex-1 overflow-y-auto">
                <div className="px-6 py-4 space-y-6">
                  {/* Primary Navigation */}
                  <div className="space-y-2">
                    {navigationItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        onClick={() => setShowMobileMenu(false)}
                        className={`
                          group flex items-center justify-between p-3 rounded-xl
                          transition-all duration-300
                          ${isActivePath(item.path)
                            ? isDark 
                              ? 'bg-white/10 text-white' 
                              : 'bg-black/5 text-gray-900'
                            : isDark
                              ? 'text-gray-300 hover:bg-white/5' 
                              : 'text-gray-600 hover:bg-black/5'
                          }
                        `}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`
                            p-2 rounded-xl
                            ${isActivePath(item.path)
                              ? 'bg-primary text-white'
                              : isDark
                                ? 'bg-white/10' 
                                : 'bg-black/5'
                            }
                            transition-colors duration-300
                          `}>
                            <item.icon className="w-5 h-5" />
                          </div>
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {item.badge && (
                            <span className="
                              px-2 py-1 text-xs font-medium rounded-full
                              bg-primary text-white
                              transform transition-transform duration-300
                              group-hover:scale-110 group-hover:rotate-12
                            ">
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight className={`
                            w-5 h-5 text-gray-400
                            transition-all duration-300
                            group-hover:translate-x-1 group-hover:text-primary
                          `} />
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Support Section - Only show for regular users */}
                  {!isAdmin && !isProducer && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-textSecondary px-2 mb-3">
                        Support
                      </h3>
                      {[
                        { icon: BookOpenText, label: 'Help Center', path: '/help' },
                        { icon: MailOpen, label: 'Contact Us', path: '/contact' },
                        { icon: MessageCircleQuestion, label: 'FAQ', path: '/faq' }
                      ].map((item, index) => (
                        <Link
                          key={index}
                          to={item.path}
                          onClick={() => setShowMobileMenu(false)}
                          className={`
                            group flex items-center justify-between p-3 rounded-xl
                            transition-all duration-300
                            ${isDark 
                              ? 'text-gray-300 hover:bg-white/5' 
                              : 'text-gray-600 hover:bg-black/5'
                            }
                          `}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`
                              p-2 rounded-xl
                              ${isDark ? 'bg-white/10' : 'bg-black/5'}
                              transition-colors duration-300
                              group-hover:bg-primary group-hover:text-white
                            `}>
                              <item.icon className="w-5 h-5" />
                            </div>
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <ChevronRight className={`
                            w-5 h-5 text-gray-400
                            transition-all duration-300
                            group-hover:translate-x-1 group-hover:text-primary
                          `} />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 space-y-4">
                {!isAuthenticated ? (
                  <div className="space-y-3">
                    <Link 
                      to="/login"
                      state={{ from: location }}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <button className={`
                        flex items-center justify-center gap-2 w-full py-3 px-6 
                        rounded-xl font-medium transition-all duration-300
                        ${isDark 
                          ? 'bg-white/10 text-white hover:bg-white/15' 
                          : 'bg-black/5 text-gray-900 hover:bg-black/10'
                        }
                        hover:scale-[1.02]
                      `}>
                        <LogIn className="w-5 h-5" />
                        Login
                      </button>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setShowMobileMenu(false)}
                      className="
                        flex items-center justify-center gap-2 w-full py-3 px-6 
                        rounded-xl font-medium
                        bg-gradient-to-r from-primary to-primaryHover
                        text-white transform transition-all duration-300
                        hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25
                      "
                    >
                      <UserPlus className="w-5 h-5" />
                      Register
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className={`
                      p-3 rounded-xl
                      ${isDark ? 'bg-white/5' : 'bg-black/5'}
                    `}>
                      <div className="flex items-center gap-3">
                        <CircleUser className="w-10 h-10 text-primary" />
                        <div className="flex-1">
                          <span className="block text-sm text-textSecondary">Welcome back</span>
                          <span className="block text-base font-medium text-text">
                            {user.lastName || 'Admin'}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            dispatch(logoutUser());
                            setShowMobileMenu(false);
                          }}
                          className="
                            p-2 rounded-xl text-red-500 
                            hover:bg-red-500/10 transition-colors duration-300
                          "
                        >
                          <LogOut className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={toggleTheme}
                      className={`
                        flex items-center justify-between w-full p-3 rounded-xl
                        transition-all duration-300
                        ${isDark 
                          ? 'bg-white/10 text-yellow-400 hover:bg-white/15' 
                          : 'bg-black/5 text-gray-600 hover:bg-black/10'
                        }
                      `}
                    >
                      <span className="font-medium">
                        {isDark ? 'Light Mode' : 'Dark Mode'}
                      </span>
                      <div className="relative">
                        <Sun className={`
                          w-5 h-5 absolute transition-all duration-500
                          ${isDark ? 'rotate-0 opacity-100 scale-100' : 'rotate-90 opacity-0 scale-50'}
                        `} />
                        <Moon className={`
                          w-5 h-5 transition-all duration-500
                          ${isDark ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}
                        `} />
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header; 