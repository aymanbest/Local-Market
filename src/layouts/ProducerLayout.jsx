import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Leaf, Package, ClipboardList, BarChart2, LogOut, Search, Bell, BellOff, CheckCheck, Star, ShoppingCart } from 'lucide-react';
import { mockNotifications } from '../mockData';
import ProductManagement from '../components/ProductManagement';
import OrderManagement from '../components/OrderManagement';
import Analytics from '../components/Analytics';
import Button from '../components/ui/Button';

const ProducerLayout = () => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'lowStock':
        return <Package className="w-5 h-5 text-amber-500" />;
      case 'newOrder':
        return <ShoppingCart className="w-5 h-5 text-green-500" />;
      case 'review':
        return <Star className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const minutes = Math.floor((Date.now() - timestamp) / (1000 * 60));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const NotificationsPanel = () => (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="text-gray-500 hover:text-gray-700"
          >
            <CheckCheck className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <BellOff className="w-5 h-5 mx-auto mb-2" />
            <p>No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                !notification.read ? 'bg-blue-50/50' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatTimeAgo(notification.timestamp)}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Function to check if a path is active
  const isActivePath = (path) => {
    if (path === '/producer' && location.pathname === '/producer') {
      return true;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 group">
              <Leaf className="h-6 w-6 text-green-600 transform group-hover:rotate-12 transition-transform" />
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Producer Portal
              </span>
            </Link>

            <div className="flex items-center space-x-6">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search orders, products..."
                  className="w-64 px-4 py-2 rounded-full border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 group-hover:shadow-md"
                />
                <Search className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 group-hover:text-green-500 transition-colors" />
              </div>

              <div className="relative">
                <Button 
                  variant="ghost" 
                  className="relative group"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </Button>
                {showNotifications && <NotificationsPanel />}
              </div>

              <Button variant="outline" className="flex items-center space-x-2 group hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen pt-16">
        {/* Sidebar */}
        <div className="w-20 bg-white/80 backdrop-blur-md border-r border-gray-100 fixed h-full">
          <nav className="flex flex-col items-center py-8 space-y-8">
            <Link to="/producer" className="relative group">
              <div className={`p-3 rounded-xl transition-all duration-300 ${
                isActivePath('/producer') && location.pathname === '/producer'
                  ? 'bg-green-100 text-green-600'
                  : 'group-hover:bg-green-100 text-gray-600 group-hover:text-green-600'
              }`}>
                <Package className="w-7 h-7" />
              </div>
              {/* Tooltip */}
              <div className={`absolute left-20 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                isActivePath('/producer') && location.pathname === '/producer'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-900 text-white'
              } opacity-0 invisible group-hover:opacity-100 group-hover:visible`}>
                Products
                {/* Arrow */}
                <div className={`absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-8 border-transparent ${
                  isActivePath('/producer') && location.pathname === '/producer'
                    ? 'border-r-green-100'
                    : 'border-r-gray-900'
                }`} />
              </div>
              {/* Active Indicator Line */}
              {isActivePath('/producer') && location.pathname === '/producer' && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-600 rounded-r-full" />
              )}
            </Link>

            <Link to="/producer/orders" className="relative group">
              <div className={`p-3 rounded-xl transition-all duration-300 ${
                isActivePath('/producer/orders')
                  ? 'bg-blue-100 text-blue-600'
                  : 'group-hover:bg-blue-100 text-gray-600 group-hover:text-blue-600'
              }`}>
                <ClipboardList className="w-7 h-7" />
              </div>
              {/* Tooltip */}
              <div className={`absolute left-20 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                isActivePath('/producer/orders')
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-900 text-white'
              } opacity-0 invisible group-hover:opacity-100 group-hover:visible`}>
                Orders
                {/* Arrow */}
                <div className={`absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-8 border-transparent ${
                  isActivePath('/producer/orders')
                    ? 'border-r-blue-100'
                    : 'border-r-gray-900'
                }`} />
              </div>
              {/* Active Indicator Line */}
              {isActivePath('/producer/orders') && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
              )}
            </Link>

            <Link to="/producer/analytics" className="relative group">
              <div className={`p-3 rounded-xl transition-all duration-300 ${
                isActivePath('/producer/analytics')
                  ? 'bg-purple-100 text-purple-600'
                  : 'group-hover:bg-purple-100 text-gray-600 group-hover:text-purple-600'
              }`}>
                <BarChart2 className="w-7 h-7" />
              </div>
              {/* Tooltip */}
              <div className={`absolute left-20 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                isActivePath('/producer/analytics')
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-gray-900 text-white'
              } opacity-0 invisible group-hover:opacity-100 group-hover:visible`}>
                Analytics
                {/* Arrow */}
                <div className={`absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-8 border-transparent ${
                  isActivePath('/producer/analytics')
                    ? 'border-r-purple-100'
                    : 'border-r-gray-900'
                }`} />
              </div>
              {/* Active Indicator Line */}
              {isActivePath('/producer/analytics') && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-600 rounded-r-full" />
              )}
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 pl-20">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white/80 backdrop-blur-md shadow-sm rounded-xl p-6 animate-fade-in">
              <Routes>
                <Route path="/" element={<ProductManagement />} />
                <Route path="/orders" element={<OrderManagement />} />
                <Route path="/analytics" element={<Analytics />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProducerLayout;

