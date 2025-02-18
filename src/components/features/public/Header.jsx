import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ShoppingCart, CircleUser, Leaf, Sun, Moon, Menu, X,
  Building2, LayoutDashboard, Users, Package, StarIcon, Home, Store, BookOpenText, MailOpen, MessageCircleQuestion, LogIn, UserPlus, LogOut, ChevronRight, ClipboardList, BarChart2, Bell, BadgePercent,
  ChevronDown, Grid, Settings, ChevronUp
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
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const adminMenuRef = useRef(null);

  // Reset active states when location changes
  useEffect(() => {
    setActiveGroup(null);
    setShowAdminMenu(false);
    setShowMobileMenu(false);
    setShowNotifications(false);
  }, [location.pathname]);

  const isActivePath = useCallback((path, items) => {
    if (items) {
      // For admin menu items with children
      return items.some(item => {
        // Special handling for Hub (exact path matching)
        if (path === '/admin' && item.exact) {
          return location.pathname === '/admin';
        }
        
        // For other admin sections, check the section path
        if (location.pathname.startsWith('/admin/')) {
          const currentSection = location.pathname.split('/')[2];
          const itemSection = item.path.split('/')[2];
          return currentSection === itemSection;
        }
        
        return location.pathname === item.path;
      });
    }
    
    // For regular and producer navigation
    if (path === '/') {
      return location.pathname === '/';
    }
    
    // Special handling for producer root path
    if (path === '/producer' && isProducer) {
      return location.pathname === '/producer' || location.pathname === '/producer/products';
    }
    
    // Check if current path matches exactly or is a child path
    if (isAdmin) {
      if (path === '/admin') {
        return location.pathname === '/admin';
      }
      return path.startsWith('/admin') && location.pathname.startsWith(path);
    } else if (isProducer) {
      return path.startsWith('/producer') && location.pathname.startsWith(path);
    } else {
      return !location.pathname.startsWith('/admin') && 
             !location.pathname.startsWith('/producer') && 
             location.pathname.startsWith(path);
    }
  }, [location.pathname, isAdmin, isProducer]);

  // Group admin navigation items
  const adminGroups = useMemo(() => ({
    hub: {
      name: 'Dashboard',
      items: [{ path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true }]
    },
    content: {
      name: 'Content',
      items: [
        { path: '/admin/products', label: 'Products', icon: Package },
        { path: '/admin/categories', label: 'Categories', icon: Grid },
        { path: '/admin/reviews', label: 'Reviews', icon: StarIcon },
        { path: '/admin/coupons', label: 'Coupons', icon: BadgePercent },
      ]
    },
    users: {
      name: 'Users',
      items: [
        { path: '/admin/users', label: 'Users', icon: Users },
        { path: '/admin/applications', label: 'Applications', icon: Building2 },
        { path: '/admin/support', label: 'Support', icon: MailOpen },
      ]
    }
  }), []);

  // Regular navigation items
  const regularNavigationItems = useMemo(() => [
    { path: '/', label: 'Home', icon: Home },
    { path: '/store', label: 'Store', icon: Store },
    { path: '/about', label: 'About', icon: BookOpenText },
    { path: '/support', label: 'Support', icon: MailOpen },
    { path: '/faq', label: 'FAQ', icon: MessageCircleQuestion },
    // Only show "Become a Seller" for customers
    ...((!user || user.role === 'CUSTOMER' || user.role === 'ADMIN' || user.role === 'PRODUCER') ? [
      { path: '/become-seller', label: 'Become a Seller', icon: Building2 }
    ] : [])
  ], [isAdmin, isProducer]);

  // Producer navigation items
  const producerNavigationItems = useMemo(() => [
    { path: '/producer', label: 'Products', icon: Package },
    { path: '/producer/orders', label: 'Orders', icon: ClipboardList },
    { path: '/producer/analytics', label: 'Analytics', icon: BarChart2 },
    { path: '/producer/support', label: 'Support', icon: MailOpen },
  ], []);

  // Handle scroll effect with throttling
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close admin menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
        setShowAdminMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Render admin navigation group
  const AdminNavGroup = ({ group, items, isOpen, onToggle }) => {
    const isGroupActive = useMemo(() => {
      return items.some(item => {
        if (item.exact) {
          return location.pathname === item.path;
        }
        return location.pathname.startsWith(item.path);
      });
    }, [items, location.pathname]);

    // If there's only one item, render it as a button
    if (items.length === 1) {
      const item = items[0];
      return (
        <Link
          to={item.path}
          className={`
            flex items-center gap-3 px-4 py-2 rounded-lg
            transition-all duration-200
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
          <div className={`
            p-2 rounded-xl transition-colors duration-200
            ${isActivePath(item.path)
              ? 'bg-primary text-white'
              : isDark
                ? 'bg-white/10'
                : 'bg-black/5'
            }
          `}>
            <item.icon className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">{item.label}</span>
        </Link>
      );
    }

    // Otherwise, render as a dropdown
    return (
      <div className="relative">
        <button
          onClick={onToggle}
          className={`
            px-4 py-2 rounded-xl flex items-center gap-2
            transition-all duration-300 min-w-[140px]
            ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}
            ${isOpen || isGroupActive 
              ? isDark 
                ? 'bg-white/10' 
                : 'bg-black/5'
              : ''
            }
          `}
        >
          <span className={`
            text-sm font-medium flex-1 text-left
            ${isGroupActive ? 'text-primary' : 'text-text'}
          `}>
            {group}
          </span>
          {isOpen ? (
            <ChevronUp className={`
              w-4 h-4 flex-shrink-0
              ${isGroupActive ? 'text-primary' : 'text-textSecondary'}
            `} />
          ) : (
            <ChevronDown className={`
              w-4 h-4 flex-shrink-0
              ${isGroupActive ? 'text-primary' : 'text-textSecondary'}
            `} />
          )}
        </button>
        {isOpen && (
          <div className={`
            absolute top-full left-0 mt-2 min-w-[200px]
            rounded-xl border backdrop-blur-lg shadow-xl
            transition-all duration-300 ease-out
            animate-in fade-in slide-in-from-top-2
            overflow-hidden
            ${isDark 
              ? 'bg-black/90 border-white/10 shadow-black/20' 
              : 'bg-white/90 border-black/10 shadow-black/5'
            }
            z-50
          `}>
            <div className="py-2 px-1.5 rounded-xl overflow-hidden space-y-1">
              {items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-2
                    transition-all duration-200 rounded-lg
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
                  <div className={`
                    p-2 rounded-xl transition-colors duration-200
                    ${isActivePath(item.path)
                      ? 'bg-primary text-white'
                      : isDark
                        ? 'bg-white/10'
                        : 'bg-black/5'
                    }
                  `}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Desktop Header Component
  const DesktopHeader = () => (
    <header className={`
      hidden md:block fixed top-0 left-0 right-0 z-40
      transition-all duration-500 ease-out
      ${isScrolled ? 'py-2' : 'py-3 md:py-4'}
    `}>
      <div className="max-w-[98%] md:max-w-[95%] xl:max-w-7xl mx-auto px-2 md:px-3 lg:px-4">
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
          p-2 md:p-2.5 lg:p-3
        `}>
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-1 md:gap-1.5 lg:gap-2 group">
              <div className="relative w-6 md:w-7 lg:w-8 h-6 md:h-7 lg:h-8">
                <div className="absolute inset-0 rotate-45 bg-gradient-to-r from-primary/50 to-transparent rounded-xl blur-xl"></div>
                <Leaf className="w-6 md:w-7 lg:w-8 h-6 md:h-7 lg:h-8 text-primary relative z-10" />
              </div>
              <span className="font-recoleta text-base md:text-lg lg:text-xl text-text relative">
                LocalMarket
                <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-primary/0 via-primary to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
              </span>
            </Link>

            {/* Navigation Section */}
            {isAdmin ? (
              // Admin Navigation
              <div ref={adminMenuRef} className="flex-1 mx-4 md:mx-6 lg:mx-8">
                <div className="flex items-center justify-start gap-1.5 md:gap-2">
                  {Object.entries(adminGroups).map(([group, items]) => (
                    <AdminNavGroup
                      key={group}
                      group={items.name}
                      items={items.items}
                      isOpen={activeGroup === group}
                      onToggle={() => setActiveGroup(activeGroup === group ? null : group)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              // Regular/Producer Navigation
              <nav className="flex-1 mx-2 sm:mx-3 md:mx-4 lg:mx-6 xl:mx-8">
                <div className="flex items-center justify-center gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2">
                  {(isProducer ? producerNavigationItems : regularNavigationItems).map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`
                        relative px-1 sm:px-1.5 md:px-2 lg:px-3 xl:px-4 py-1.5 md:py-2 lg:py-2.5 rounded-xl overflow-hidden group
                        transition-all duration-300 whitespace-nowrap
                        ${isActivePath(item.path)
                          ? isDark
                            ? 'text-white bg-white/10'
                            : 'text-gray-900 bg-black/5'
                          : 'text-text hover:text-primary'
                        }
                      `}
                    >
                      <div className={`
                        absolute inset-0 rounded-xl opacity-0
                        bg-gradient-to-r from-primary/10 via-primary/5 to-transparent
                        group-hover:opacity-100 transition-opacity duration-500
                        ${isActivePath(item.path) ? 'opacity-100' : ''}
                      `} />
                      <span className="relative z-10 flex items-center gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2">
                        <item.icon className={`
                          w-3.5 sm:w-4 h-3.5 sm:h-4 transition-all duration-300
                          ${isActivePath(item.path) ? 'text-primary scale-110' : ''}
                          group-hover:scale-110 group-hover:text-primary
                        `} />
                        <span className="font-medium text-[11px] sm:text-xs md:text-sm lg:text-base">{item.label}</span>
                      </span>
                      {isActivePath(item.path) && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0"></div>
                      )}
                    </Link>
                  ))}
                </div>
              </nav>
            )}

            {/* Right Section */}
            <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 xl:gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`
                  p-1.5 md:p-2 lg:p-2.5 rounded-xl transition-all duration-300 
                  hover:scale-110 relative group
                  ${isDark 
                    ? 'bg-white/10 text-yellow-400 hover:bg-white/15' 
                    : 'bg-black/5 text-gray-600 hover:bg-black/10'
                  }
                `}
              >
                <div className="relative">
                  <Sun className={`
                    w-4 md:w-4 lg:w-5 h-4 md:h-4 lg:h-5 absolute transition-all duration-500
                    ${isDark ? 'rotate-0 opacity-100 scale-100' : 'rotate-90 opacity-0 scale-50'}
                  `} />
                  <Moon className={`
                    w-4 md:w-4 lg:w-5 h-4 md:h-4 lg:h-5 transition-all duration-500
                    ${isDark ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}
                  `} />
                </div>
              </button>

              {/* Notifications (for authenticated users) */}
              {isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`
                      p-1.5 md:p-2 lg:p-2.5 rounded-xl transition-all duration-300 
                      hover:scale-110 relative group
                      ${isDark 
                        ? 'bg-white/10 hover:bg-white/15' 
                        : 'bg-black/5 hover:bg-black/10'
                      }
                      ${showNotifications ? 'bg-primary/10' : ''}
                    `}
                  >
                    <Bell className={`
                      w-4 md:w-4 lg:w-5 h-4 md:h-4 lg:h-5 transition-colors duration-300
                      ${showNotifications ? 'text-primary' : 'text-text'}
                      group-hover:text-primary
                    `} />
                    {unreadCount > 0 && (
                      <span className="
                        absolute -top-1 -right-1 w-4 md:w-4 lg:w-5 h-4 md:h-4 lg:h-5
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

                  {/* Notifications Dropdown */}
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

              {/* Cart (for non-producer/admin) */}
              {!isProducer && !isAdmin && (
                <Link to="/cart" className="relative group">
                  <div className={`
                    p-1.5 md:p-2 lg:p-2.5 rounded-xl transition-all duration-300
                    ${isDark 
                      ? 'bg-white/10 hover:bg-white/15' 
                      : 'bg-black/5 hover:bg-black/10'
                    }
                    group-hover:scale-110
                  `}>
                    <ShoppingCart className="w-4 md:w-4 lg:w-5 h-4 md:h-4 lg:h-5 text-text group-hover:text-primary transition-colors duration-300" />
                    {items.length > 0 && (
                      <span className="
                        absolute -top-1 -right-1 w-4 md:w-4 lg:w-5 h-4 md:h-4 lg:h-5
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

              {/* User Menu */}
              {isAuthenticated ? (
                <Link 
                  to={isAdmin ? "/admin/profile" : isProducer ? "/producer/profile" : "/account"} 
                  className={`
                    group flex items-center gap-1.5 md:gap-2 lg:gap-3 p-1.5 md:p-2 lg:p-2.5 rounded-xl 
                    transition-all duration-300 hover:scale-105
                    ${isDark 
                      ? 'bg-white/10 hover:bg-white/15' 
                      : 'bg-black/5 hover:bg-black/10'
                    }
                  `}
                >
                  <CircleUser className="w-4 md:w-4 lg:w-5 h-4 md:h-4 lg:h-5 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  <span className="text-xs md:text-sm lg:text-base font-medium text-text">{user.lastName || 'Admin'}</span>
                </Link>
              ) : (
                <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3">
                  <Link 
                    to="/login"
                    state={{ from: location }}
                    className={`
                      px-2 md:px-3 lg:px-4 py-1.5 md:py-2 rounded-xl font-medium text-xs md:text-sm lg:text-base
                      transition-all duration-300 hover:scale-105
                      ${isDark 
                        ? 'bg-white/10 text-white hover:bg-white/15' 
                        : 'bg-black/5 text-gray-900 hover:bg-black/10'
                      }
                    `}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="
                      px-2 md:px-3 lg:px-4 py-1.5 md:py-2 rounded-xl font-medium text-xs md:text-sm lg:text-base
                      bg-gradient-to-r from-primary to-primaryHover
                      text-white transition-all duration-300
                      hover:scale-105 hover:shadow-lg hover:shadow-primary/25
                    "
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );

  // Mobile Header
  const MobileHeader = () => (
    <header className="md:hidden fixed top-0 left-0 right-0 z-40">
      <div className="px-4 py-2">
        <div className={`
          relative rounded-xl border backdrop-blur-lg
          transition-all duration-500 ease-out
          ${isScrolled 
            ? isDark 
              ? 'border-white/5 bg-black/75 shadow-lg shadow-black/10' 
              : 'border-black/5 bg-white/75 shadow-lg shadow-black/5'
            : isDark
              ? 'border-white/10 bg-black/50' 
              : 'border-black/10 bg-white/50'
          }
          p-2
        `}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative w-7 h-7">
                <div className="absolute inset-0 rotate-45 bg-gradient-to-r from-primary/50 to-transparent rounded-xl blur-xl"></div>
                <Leaf className="w-7 h-7 text-primary relative z-10" />
              </div>
              <span className="font-recoleta text-lg text-text relative">
                LocalMarket
                <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-primary/0 via-primary to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
              </span>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Profile Link (for authenticated users) */}
              {isAuthenticated && (
                <Link 
                  to={isAdmin ? "/admin/profile" : isProducer ? "/producer/profile" : "/account"}
                  className={`
                    p-2 rounded-xl transition-all duration-300
                    ${isDark 
                      ? 'bg-white/10 hover:bg-white/15' 
                      : 'bg-black/5 hover:bg-black/10'
                    }
                    group-hover:scale-110
                  `}
                >
                  <CircleUser className="w-5 h-5 text-primary" />
                </Link>
              )}

              {/* Cart (for non-producer/admin) */}
              {!isProducer && !isAdmin && (
                <Link to="/cart" className="relative group">
                  <div className={`
                    p-2 rounded-xl transition-all duration-300
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

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(true)}
                className={`
                  p-2 rounded-xl transition-all duration-300
                  ${isDark 
                    ? 'bg-white/10 hover:bg-white/15' 
                    : 'bg-black/5 hover:bg-black/10'
                  }
                `}
              >
                <Menu className="w-5 h-5 text-text" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );

  // Mobile Menu Component
  const MobileMenu = () => {
    return (
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
                  {/* Profile Section for authenticated users */}
                  {isAuthenticated && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-textSecondary px-2 mb-3">
                        Profile
                      </h3>
                      <Link
                        to={isAdmin ? "/admin/profile" : isProducer ? "/producer/profile" : "/account"}
                        onClick={() => setShowMobileMenu(false)}
                        className={`
                          group flex items-center justify-between p-3 rounded-xl
                          transition-all duration-300 mb-2
                          ${isDark 
                            ? 'bg-white/10 text-white hover:bg-white/15' 
                            : 'bg-black/5 text-gray-900 hover:bg-black/10'
                          }
                        `}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <CircleUser className="w-10 h-10 text-primary" />
                          </div>
                          <div className="flex-1">
                            <span className="block text-sm text-textSecondary">Welcome back</span>
                            <span className="block text-base font-medium text-text">
                              {user.lastName || 'Admin'}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className={`
                          w-5 h-5 text-gray-400
                          transition-transform duration-300
                          group-hover:translate-x-1
                        `} />
                      </Link>
                      <button
                        onClick={() => {
                          dispatch(logoutUser());
                          setShowMobileMenu(false);
                        }}
                        className={`
                          w-full group flex items-center justify-between p-3 rounded-xl
                          transition-all duration-300
                          ${isDark 
                            ? 'bg-white/5 text-red-400 hover:bg-white/10' 
                            : 'bg-black/5 text-red-500 hover:bg-black/10'
                          }
                        `}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`
                            p-2 rounded-xl
                            ${isDark ? 'bg-white/10' : 'bg-black/5'}
                          `}>
                            <LogOut className="w-5 h-5" />
                          </div>
                          <span className="font-medium">Logout</span>
                        </div>
                        <ChevronRight className={`
                          w-5 h-5 text-gray-400
                          transition-transform duration-300
                          group-hover:translate-x-1
                        `} />
                      </button>
                    </div>
                  )}

                  {isAdmin ? (
                    // Admin Navigation Groups
                    Object.entries(adminGroups).map(([group, items]) => (
                      <div key={group} className="space-y-2">
                        <h3 className="text-sm font-medium text-textSecondary px-2">
                          {items.name}
                        </h3>
                        {items.items.map((item) => (
                          <Link
                            key={item.path}
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
                    ))
                  ) : isProducer ? (
                    // Producer Navigation
                    producerNavigationItems.map((item) => (
                      <Link
                        key={item.path}
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
                    ))
                  ) : (
                    // Regular Navigation
                    regularNavigationItems.map((item) => (
                      <Link
                        key={item.path}
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
                    ))
                  )}
                </div>

                {/* Support Section - Only show for regular users and producers */}
                {!isAdmin && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-textSecondary px-2 mb-3">
                      Support
                    </h3>
                    {[
                      { icon: BookOpenText, label: 'Help Center', path: '/help' },
                      { icon: MailOpen, label: 'Contact Us', path: '/contact' },
                      { icon: MessageCircleQuestion, label: 'FAQ', path: '/faq' }
                    ].map((item) => (
                      <Link
                        key={item.path}
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
              ) : null}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`
                  flex items-center justify-between w-full p-3 rounded-xl
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
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <DesktopHeader />
      <MobileHeader />
      <MobileMenu />
    </>
  );
};

export default Header; 