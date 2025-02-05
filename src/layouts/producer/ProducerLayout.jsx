import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  Package, ClipboardList, BarChart2, Bell, BellOff, 
  CheckCheck, Star, ShoppingCart
} from 'lucide-react';
import { mockNotifications } from '../../mockData';
import ProductManagement from '../../components/producer/ProductManagement';
import OrderManagement from '../../components/producer/OrderManagement';
import Analytics from '../../components/producer/Analytics';
import Button from '../../components/ui/Button';
import { useTheme } from '../../context/ThemeContext';
import Header from '../../components/Header';

const ProducerLayout = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const { isDark } = useTheme();

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
    <div className="absolute right-0 mt-2 w-80 bg-cardBg backdrop-blur-md rounded-2xl shadow-xl border border-border overflow-hidden z-50">
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-text">Notifications</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="text-primary hover:text-primaryHover"
          >
            <CheckCheck className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-textSecondary">
            <BellOff className="w-5 h-5 mx-auto mb-2" />
            <p>No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-border hover:bg-background/50 transition-all duration-300 cursor-pointer ${
                !notification.read ? 'bg-primary/5' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text">
                    {notification.title}
                  </p>
                  <p className="text-sm text-textSecondary truncate">
                    {notification.message}
                  </p>
                  <p className="text-xs text-textSecondary mt-1">
                    {formatTimeAgo(notification.timestamp)}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">

      {/* Main Content */}
      <div className="pt-16">
        <main className="max-w-7xl mx-auto p-8">
          <div className="bg-cardBg backdrop-blur-md shadow-xl border border-border rounded-2xl p-6 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primaryHover/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
            </div>

            {/* Content */}
            <div className="relative">
              <Routes>
                <Route path="/" element={<ProductManagement />} />
                <Route path="/orders" element={<OrderManagement />} />
                <Route path="/analytics" element={<Analytics />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProducerLayout;

