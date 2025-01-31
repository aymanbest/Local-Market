import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, XCircle, Clock, AlertCircle, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../lib/axios';
import useLoading from '../hooks/useLoading';
import Preloader from './Preloader';
import { useSelector } from 'react-redux';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const { user, token } = useSelector((state) => state.auth);
  const isLoading = useLoading();
  const [expandedBundles, setExpandedBundles] = useState({});

  const statusConfig = {
    'PENDING_PAYMENT': { 
      icon: Clock, 
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', 
      text: 'Pending Payment' 
    },
    'PAYMENT_FAILED': { 
      icon: XCircle, 
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', 
      text: 'Payment Failed' 
    },
    'PAYMENT_COMPLETED': { 
      icon: CheckCircle, 
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', 
      text: 'Payment Completed' 
    },
    'PROCESSING': { 
      icon: Package, 
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', 
      text: 'Processing' 
    },
    'SHIPPED': { 
      icon: Truck, 
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', 
      text: 'Shipped' 
    },
    'DELIVERED': { 
      icon: CheckCircle, 
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', 
      text: 'Delivered' 
    },
    'CANCELLED': { 
      icon: XCircle, 
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', 
      text: 'Cancelled' 
    },
    'RETURNED': { 
      icon: AlertCircle, 
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', 
      text: 'Returned' 
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/api/orders', {
          params: { showall: "true" },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Group orders by accessToken
        const groupedOrders = response.data.reduce((acc, order) => {
          const key = order.accessToken;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(order);
          return acc;
        }, {});
        
        setOrders(groupedOrders);
      } catch (error) {
        setError('Failed to fetch orders');
      }
    };

    fetchOrders();
  }, []);

  const toggleBundle = (accessToken) => {
    setExpandedBundles(prev => ({
      ...prev,
      [accessToken]: !prev[accessToken]
    }));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text text-center">
          <p className="text-xl">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-text mb-8">Order History</h2>
        <div className="space-y-6">
          {Object.entries(orders).map(([accessToken, bundleOrders]) => {
            const totalBundlePrice = bundleOrders.reduce((sum, order) => sum + order.totalPrice, 0);
            const orderDate = new Date(bundleOrders[0].orderDate);
            const isExpanded = expandedBundles[accessToken];
            
            return (
              <div key={accessToken} className="bg-cardBg border border-border rounded-xl overflow-hidden">
                <div 
                  className="p-6 border-b border-border cursor-pointer hover:bg-background/50 transition-colors"
                  onClick={() => toggleBundle(accessToken)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-textSecondary" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-textSecondary" />
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-text">
                          Order Bundle ({bundleOrders.length} orders)
                        </h3>
                        <p className="text-sm text-textSecondary mt-1">
                          Placed on {orderDate.toLocaleDateString()} at {orderDate.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="text-sm text-textSecondary">Bundle Total</p>
                        <p className="text-xl font-bold text-text">${totalBundlePrice.toFixed(2)}</p>
                      </div>
                      {bundleOrders.some(order => order.status === 'PENDING_PAYMENT') && (
                        <Link
                          to={`/payment?token=${accessToken}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white hover:bg-primaryHover"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Pay Now
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                  
                  {!isExpanded && (
                    <div className="mt-4 flex items-center gap-2">
                      {bundleOrders.slice(0, 3).map((order) => (
                        <div key={order.orderId} className={`px-2 py-1 rounded-full text-xs ${statusConfig[order.status].color}`}>
                          {statusConfig[order.status].text}
                        </div>
                      ))}
                      {bundleOrders.length > 3 && (
                        <span className="text-xs text-textSecondary">
                          +{bundleOrders.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {isExpanded && (
                  <div className="p-6 border-b border-border">
                    <div className="space-y-4">
                      {bundleOrders.map((order) => {
                        const StatusIcon = statusConfig[order.status].icon;
                        return (
                          <div key={order.orderId} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-textSecondary" />
                              </div>
                              <div>
                                <p className="font-medium text-text">Order #{order.orderId}</p>
                                <p className="text-sm text-textSecondary">
                                  {order.items.length} items - ${order.totalPrice.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${statusConfig[order.status].color}`}>
                                <StatusIcon className="w-4 h-4" />
                                <span>{statusConfig[order.status].text}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="p-6 bg-background/50 flex justify-between items-center">
                  <Link
                    to={`/orders/bundle/${accessToken}`}
                    className="inline-flex items-center gap-2 text-primary hover:text-primaryHover"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Full Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;

