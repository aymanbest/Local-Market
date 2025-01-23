import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Leaf, Package, ClipboardList, BarChart2, LogOut, Search, Bell, BellOff, CheckCheck, Star, ShoppingCart } from 'lucide-react';
import { mockNotifications } from '../../mockData';
import ProductManagement from '../../components/producer/ProductManagement';
import OrderManagement from '../../components/producer/OrderManagement';
import Analytics from '../../components/producer/Analytics';
import Button from '../../components/ui/Button';

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
    <div className="min-h-screen bg-mainBlack">
      <div className="flex min-h-screen pt-10">
        {/* Sidebar */}
        <div className="w-20 bg-white/80 dark:bg-bgGrey backdrop-blur-md border-r border-gray-100 dark:border-gray-700 fixed h-auto rounded-lg">
  <nav className="flex flex-col items-center py-8 space-y-8">
    {/* Producer Link */}
    <Link to="/producer" className="relative group">
      <div
        className={`p-3 rounded-xl transition-all duration-300 ${
          isActivePath('/producer') && location.pathname === '/producer'
            ? 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200'
            : 'group-hover:bg-green-100 text-gray-600 group-hover:text-green-600 dark:group-hover:bg-green-800 dark:text-gray-300 dark:group-hover:text-green-200'
        }`}
      >
        <Package className="w-7 h-7" />
      </div>
      {/* Tooltip */}
      <div
        className={`absolute left-8 top-0 -translate-y-1/2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
          isActivePath('/producer') && location.pathname === '/producer'
            ? 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200'
            : 'bg-gray-900 text-white dark:bg-gray-800 dark:text-gray-300'
        } opacity-0 invisible group-hover:opacity-100 group-hover:visible`}
      >
        Products
        {/* Arrow */}
        <div
          className={`absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-8 border-transparent ${
            isActivePath('/producer') && location.pathname === '/producer'
              ? 'border-r-green-100 dark:border-r-green-800'
              : 'border-r-gray-900 dark:border-r-gray-800'
          }`}
        />
      </div>
      {/* Active Indicator Line */}
      {isActivePath('/producer') && location.pathname === '/producer' && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-600 dark:bg-green-200 rounded-r-full" />
      )}
    </Link>

    {/* Orders Link */}
    <Link to="/producer/orders" className="relative group">
      <div
        className={`p-3 rounded-xl transition-all duration-300 ${
          isActivePath('/producer/orders')
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200'
            : 'group-hover:bg-blue-100 text-gray-600 group-hover:text-blue-600 dark:group-hover:bg-blue-800 dark:text-gray-300 dark:group-hover:text-blue-200'
        }`}
      >
        <ClipboardList className="w-7 h-7" />
      </div>
      {/* Tooltip */}
      <div
        className={`absolute left-8 top-0 -translate-y-1/2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
          isActivePath('/producer/orders')
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200'
            : 'bg-gray-900 text-white dark:bg-gray-800 dark:text-gray-300'
        } opacity-0 invisible group-hover:opacity-100 group-hover:visible`}
      >
        Orders
        {/* Arrow */}
        <div
          className={`absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-8 border-transparent ${
            isActivePath('/producer/orders')
              ? 'border-r-blue-100 dark:border-r-blue-800'
              : 'border-r-gray-900 dark:border-r-gray-800'
          }`}
        />
      </div>
      {/* Active Indicator Line */}
      {isActivePath('/producer/orders') && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 dark:bg-blue-200 rounded-r-full" />
      )}
    </Link>

    {/* Analytics Link */}
    <Link to="/producer/analytics" className="relative group">
      <div
        className={`p-3 rounded-xl transition-all duration-300 ${
          isActivePath('/producer/analytics')
            ? 'bg-purple-100 text-purple-600 dark:bg-purple-800 dark:text-purple-200'
            : 'group-hover:bg-purple-100 text-gray-600 group-hover:text-purple-600 dark:group-hover:bg-purple-800 dark:text-gray-300 dark:group-hover:text-purple-200'
        }`}
      >
        <BarChart2 className="w-7 h-7" />
      </div>
      {/* Tooltip */}
      <div
        className={`absolute left-8 top-0 -translate-y-1/2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
          isActivePath('/producer/analytics')
            ? 'bg-purple-100 text-purple-600 dark:bg-purple-800 dark:text-purple-200'
            : 'bg-gray-900 text-white dark:bg-gray-800 dark:text-gray-300'
        } opacity-0 invisible group-hover:opacity-100 group-hover:visible`}
      >
        Analytics
        {/* Arrow */}
        <div
          className={`absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-8 border-transparent ${
            isActivePath('/producer/analytics')
              ? 'border-r-purple-100 dark:border-r-purple-800'
              : 'border-r-gray-900 dark:border-r-gray-800'
          }`}
        />
      </div>
      {/* Active Indicator Line */}
      {isActivePath('/producer/analytics') && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-600 dark:bg-purple-200 rounded-r-full" />
      )}
    </Link>
  </nav>
</div>


        {/* Main Content */}
        <div className="flex-1 pl-20">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 bg-mainBlack">
            <div className="bg-white/80 dark:bg-bgGrey backdrop-blur-md shadow-sm rounded-xl p-6 animate-fade-in">
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

