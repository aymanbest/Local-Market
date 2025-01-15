import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Users, BarChart2, CreditCard, Search, Bell, Shield, LogOut, Settings, BellOff, CheckCheck } from 'lucide-react';
import { mockNotificationsadmin } from '../mockData';
import UserManagement from '../components/UserManagement';
import TransactionMonitoring from '../components/TransactionMonitoring';
import ReportingAnalytics from '../components/ReportingAnalytics';
import Button from '../components/ui/Button';

const AdminLayout = () => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotificationsadmin);

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
      case 'newUser':
        return <Users className="w-5 h-5 text-indigo-500" />;
      case 'security':
        return <Shield className="w-5 h-5 text-red-500" />;
      case 'system':
        return <Settings className="w-5 h-5 text-gray-500" />;
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
                !notification.read ? 'bg-indigo-50/50' : ''
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
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 fixed w-full z-10">
        <div className="px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 group">
              <Shield className="h-6 w-6 text-indigo-600 transform group-hover:rotate-12 transition-transform" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Admin Portal
              </h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="w-64 px-4 py-2 rounded-full border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:shadow-md"
                />
                <Search className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 group-hover:text-indigo-500 transition-colors" />
              </div>
              
              <div className="relative">
                <Button 
                  variant="ghost" 
                  className="relative group"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-6 h-6 text-gray-600 group-hover:text-indigo-600 transition-colors" />
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

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-4rem)] bg-white/80 backdrop-blur-md border-r border-gray-100 p-6 fixed">
          <nav className="space-y-2">
            <Link
              to="/admin"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActivePath('/admin')
                  ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600'
                  : 'hover:bg-gray-50 text-gray-600 hover:text-indigo-600'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">User Management</span>
            </Link>
            <Link
              to="/admin/transactions"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActivePath('/admin/transactions')
                  ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600'
                  : 'hover:bg-gray-50 text-gray-600 hover:text-indigo-600'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Transactions</span>
            </Link>
            <Link
              to="/admin/reports"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActivePath('/admin/reports')
                  ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600'
                  : 'hover:bg-gray-50 text-gray-600 hover:text-indigo-600'
              }`}
            >
              <BarChart2 className="w-5 h-5" />
              <span className="font-medium">Analytics</span>
            </Link>
            <Link
              to="/admin/settings"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActivePath('/admin/settings')
                  ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600'
                  : 'hover:bg-gray-50 text-gray-600 hover:text-indigo-600'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </Link>
          </nav>

          {/* Admin Info */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<UserManagement />} />
              <Route path="/transactions" element={<TransactionMonitoring />} />
              <Route path="/reports" element={<ReportingAnalytics />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

