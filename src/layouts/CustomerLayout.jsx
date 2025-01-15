import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Clock, CreditCard, Settings, User } from 'lucide-react';
import OrderHistory from '../components/OrderHistory';
import CustomerSettings from '../components/CustomerSettings';
import PaymentMethods from '../components/PaymentMethods';
import CustomerProfile from '../components/CustomerProfile';

const CustomerLayout = () => {
  const location = useLocation();
  
  const isActivePath = (path) => {
    return location.pathname === `/customer${path}`;
  };

  const navigationItems = [
    { path: '/orders', icon: ShoppingBag, label: 'My Orders', color: 'blue' },
    { path: '/payments', icon: CreditCard, label: 'Payment Methods', color: 'green' },
    { path: '/profile', icon: User, label: 'Profile', color: 'purple' },
    { path: '/settings', icon: Settings, label: 'Settings', color: 'gray' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Side Navigation */}
      <div className="fixed left-0 top-0 bottom-0 w-20 bg-white border-r border-gray-100 flex flex-col items-center py-8">
        <nav className="flex-1 space-y-8">
          {navigationItems.map(({ path, icon: Icon, label, color }) => (
            <Link 
              key={path}
              to={`/customer${path}`} 
              className="relative group"
            >
              <div className={`p-3 rounded-xl transition-all duration-300 ${
                isActivePath(path)
                  ? `bg-${color}-100 text-${color}-600`
                  : `group-hover:bg-${color}-100 text-gray-600 group-hover:text-${color}-600`
              }`}>
                <Icon className="w-7 h-7" />
              </div>
              {/* Tooltip */}
              <div className={`absolute left-20 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                isActivePath(path)
                  ? `bg-${color}-100 text-${color}-600`
                  : 'bg-gray-900 text-white'
              } opacity-0 invisible group-hover:opacity-100 group-hover:visible`}>
                {label}
                {/* Arrow */}
                <div className={`absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-8 border-transparent ${
                  isActivePath(path)
                    ? `border-r-${color}-100`
                    : 'border-r-gray-900'
                }`} />
              </div>
              {/* Active Indicator Line */}
              {isActivePath(path) && (
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-${color}-600 rounded-r-full`} />
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 pl-20">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/80 backdrop-blur-md shadow-sm rounded-xl p-6 animate-fade-in">
            <Routes>
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/payments" element={<PaymentMethods />} />
              <Route path="/profile" element={<CustomerProfile />} />
              <Route path="/settings" element={<CustomerSettings />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;

