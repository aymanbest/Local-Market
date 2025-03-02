import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../../../lib/axios';
import { format } from 'date-fns';
import { 
  Package, 
  ChevronRight, 
  ChevronLeft, 
  Circle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  AlertCircle,
  CreditCard
} from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
    isFirst: true,
    isLast: false
  });
  const [sorting, setSorting] = useState({
    sortBy: 'orderDate',
    direction: 'desc'
  });

  // Status configuration with colors and icons
  const statusConfig = {
    'PENDING_PAYMENT': { icon: CreditCard, color: 'bg-amber-500', textColor: 'text-white', label: 'Pending Payment' },
    'PAYMENT_FAILED': { icon: XCircle, color: 'bg-red-500', textColor: 'text-white', label: 'Payment Failed' },
    'PAYMENT_COMPLETED': { icon: Clock, color: 'bg-green-500', textColor: 'text-white', label: 'Payment Completed' },
    'PROCESSING': { icon: Package, color: 'bg-blue-500', textColor: 'text-white', label: 'Processing' },
    'SHIPPED': { icon: Truck, color: 'bg-purple-500', textColor: 'text-white', label: 'Shipped' },
    'DELIVERED': { icon: CheckCircle, color: 'bg-green-500', textColor: 'text-white', label: 'Delivered' },
    'CANCELLED': { icon: XCircle, color: 'bg-red-500', textColor: 'text-white', label: 'Cancelled' },
    'RETURNED': { icon: AlertCircle, color: 'bg-orange-500', textColor: 'text-white', label: 'Returned' }
  };

  // Order status sequence for the tracker
  const normalStatusSequence = [
    'PENDING_PAYMENT',
    'PAYMENT_COMPLETED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED'
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get(`/api/orders`, {
          params: {
            showall: true,
            page: pagination.currentPage,
            size: pagination.pageSize,
            sortBy: sorting.sortBy,
            direction: sorting.direction
          }
        });
        
        // Store orders as a flat array, not grouped
        setOrders(response.data.content);
        setPagination({
          currentPage: response.data.number,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          pageSize: response.data.size,
          isFirst: response.data.first,
          isLast: response.data.last
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [pagination.currentPage, sorting]);

  // Toggle order expansion
  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const PaginationControls = () => {
    if (!pagination || pagination.totalElements <= pagination.pageSize) {
      return null;
    }
    
    return (
      <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-1 bg-cardBg rounded-lg p-1">
          {Array.from({ length: Math.min(pagination.totalPages, 13) }, (_, i) => (
            <button
              key={i}
              onClick={() => setPagination(prev => ({ ...prev, currentPage: i }))}
              className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                pagination.currentPage === i 
                  ? 'bg-primary text-white' 
                  : 'text-textSecondary hover:bg-inputBg'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Render status badge with appropriate color and icon
  const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || { 
      icon: Circle, 
      color: 'bg-gray-500', 
      textColor: 'text-white',
      label: status.replace(/_/g, ' ')
    };
    
    return (
      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${config.color} ${config.textColor}`}>
        {React.createElement(config.icon, { className: 'w-4 h-4' })}
        <span>{config.label}</span>
      </div>
    );
  };

  // Render status tracker
  const StatusTracker = ({ status }) => {
    // Special cases for cancelled or returned orders
    if (status === 'CANCELLED') {
      return (
        <div className="mt-4 mb-6 bg-cardBg rounded-lg p-5 border border-border/50">
          <div className="flex flex-col items-center">
            <div className="mb-2 text-base font-medium text-text">Order Status</div>
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center">
                <XCircle className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">Order Cancelled</h3>
            <div className="text-xs text-textSecondary text-center max-w-md">
              This order has been cancelled and will not be processed further. If you have any questions, please contact customer support.
            </div>
          </div>
        </div>
      );
    }

    if (status === 'RETURNED') {
      return (
        <div className="mt-4 mb-6 bg-cardBg rounded-lg p-5 border border-border/50">
          <div className="flex flex-col items-center">
            <div className="mb-2 text-base font-medium text-text">Order Status</div>
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">Order Returned</h3>
            <div className="text-xs text-textSecondary text-center max-w-md">
              This order has been returned. Your refund should be processed within 3-5 business days.
            </div>
          </div>
        </div>
      );
    }

    if (status === 'PAYMENT_FAILED') {
      return (
        <div className="mt-4 mb-6 bg-cardBg rounded-lg p-5 border border-border/50">
          <div className="flex flex-col items-center">
            <div className="mb-2 text-base font-medium text-text">Order Status</div>
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center">
                <XCircle className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">Payment Failed</h3>
            <div className="text-xs text-textSecondary text-center max-w-md">
              The payment for this order was unsuccessful. Please try again with a different payment method.
            </div>
          </div>
        </div>
      );
    }

    // Find the current status index in the normal sequence
    const currentStatusIndex = normalStatusSequence.indexOf(status);
    
    return (
      <div className="mt-4 mb-6 bg-cardBg rounded-lg p-5 border border-border/50">
        <div className="mb-4 text-center">
          <h3 className="text-lg font-semibold text-text">Order Status</h3>
        </div>
        
        {/* Status steps - improved design with step numbers */}
        <div className="grid grid-cols-5 gap-1 md:gap-2 max-w-3xl mx-auto">
          {normalStatusSequence.map((stepStatus, index) => {
            const isActive = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            const config = statusConfig[stepStatus];
            
            return (
              <div key={stepStatus} className="flex flex-col items-center">
                {/* Status indicator - replacing numbers with icons */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1
                  ${isActive ? 'bg-primary text-white' : 'bg-inputBg text-textSecondary'}
                `}>
                  {isActive ? (
                    isCurrent ? (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    ) : (
                      <CheckCircle className="w-3.5 h-3.5" />
                    )
                  ) : (
                    <Circle className="w-3.5 h-3.5" />
                  )}
                </div>
                
                {/* Status icon */}
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-1
                    ${isActive ? config.color : 'bg-inputBg'} 
                    ${isActive ? config.textColor : 'text-textSecondary'}
                    ${isCurrent ? 'ring-2 ring-primary/30 shadow-md' : ''}
                    transition-all duration-300
                  `}
                >
                  {React.createElement(config.icon, { className: 'w-5 h-5' })}
                </div>
                
                {/* Status label */}
                <div className="text-center mt-1">
                  <p className={`font-medium text-xs
                    ${isActive ? 'text-text' : 'text-textSecondary'}
                    ${isCurrent ? 'font-bold' : ''}
                  `}>
                    {config.label}
                  </p>
                </div>
                
                {/* Current indicator */}
                {isCurrent && (
                  <div className="mt-1 px-2 py-0.5 bg-primary text-white text-[10px] rounded-full">
                    Current
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Current status description */}
        <div className="mt-5 text-center">
          <div className="inline-block px-4 py-2 bg-inputBg rounded-lg max-w-lg">
            <p className="text-xs md:text-sm text-textSecondary">
              {status === 'PENDING_PAYMENT' && 'Your order is awaiting payment. Please complete the payment to proceed with processing.'}
              {status === 'PAYMENT_COMPLETED' && 'Payment received! Your order will be processed soon by our team.'}
              {status === 'PROCESSING' && 'We\'re preparing your order for shipment. This usually takes 1-2 business days.'}
              {status === 'SHIPPED' && 'Your order is on its way to you! You can track your delivery using the tracking information.'}
              {status === 'DELIVERED' && 'Your order has been delivered successfully. We hope you enjoy your purchase!'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading orders...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-text">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-red-500">Error loading orders: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-text">
            Order History
          </h1>
          <Link 
            to="/account" 
            className="rounded-full bg-cardBg hover:bg-inputBg transition flex gap-2 items-center px-4 py-2"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-cardBg rounded-xl">
            <Package className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text mb-2">No Orders Yet</h3>
            <p className="text-textSecondary">When you place orders, they will appear here.</p>
            <Link to="/store" className="text-primary hover:underline mt-4 inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-cardBg rounded-xl overflow-hidden">
            <div className="grid grid-cols-4 text-sm text-textSecondary p-4 border-b border-border">
              <div className="col-span-1">Order</div>
              <div className="col-span-1">Placed On</div>
              <div className="col-span-1 text-right">Total</div>
              <div className="col-span-1 text-right">Status</div>
            </div>
            
            <div className="divide-y divide-border">
              {orders.map((order) => {
                const isExpanded = expandedOrders[order.orderId] || false;
                const isPendingPayment = order.status === 'PENDING_PAYMENT';
                
                return (
                  <div key={order.orderId} className={`transition-colors ${isExpanded ? 'bg-cardBg/50' : ''}`}>
                    {/* Order row */}
                    <div 
                      className={`grid grid-cols-4 items-center p-4 hover:bg-inputBg transition-colors cursor-pointer relative ${isExpanded ? 'bg-inputBg/50' : ''}`}
                      onClick={() => toggleOrderExpansion(order.orderId)}
                    >
                      {/* Left highlight bar when expanded */}
                      {isExpanded && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                      )}
                      
                      <div className="col-span-1 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isExpanded ? 'bg-primary text-white' : 'bg-inputBg text-primary'}`}>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">Order #{order.orderId}</h3>
                        </div>
                      </div>
                      <div className="col-span-1 text-textSecondary">
                        {format(new Date(order.orderDate), 'MMM dd, yyyy')}
                      </div>
                      <div className="col-span-1 text-right font-medium">
                        ${order.totalPrice.toFixed(2)}
                      </div>
                      <div className="col-span-1 flex items-center justify-end gap-3">
                        {isPendingPayment ? (
                          <Link 
                            to={`/payment?token=${order.accessToken}`}
                            className="bg-primary hover:bg-primaryHover text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <CreditCard className="w-4 h-4" />
                            PAY NOW
                          </Link>
                        ) : (
                          <StatusBadge status={order.status} />
                        )}
                      </div>
                    </div>
                    
                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="bg-background p-4 animate-slide-down">
                        {/* Status Tracker */}
                        <StatusTracker status={order.status} />
                        
                        <div className="mb-3">
                          <Link 
                            to={`/orders/bundle/${order.accessToken}`}
                            className="text-primary hover:text-primaryHover text-sm flex items-center gap-1"
                          >
                            <span>View Full Details</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-cardBg rounded-lg p-3 border border-border/50 shadow-sm">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium">Order #{order.orderId}</h4>
                              <div className="text-sm text-textSecondary">
                                {format(new Date(order.orderDate), 'MMM dd, yyyy')}
                              </div>
                            </div>
                            
                            <div className="space-y-2 mb-3">
                              {order.items.map((item) => (
                                <div key={item.orderItemId} className="flex items-center gap-3 p-2 rounded-md bg-inputBg hover:bg-inputBg/80 transition-colors">
                                  <img
                                    src={item.product.imageUrl}
                                    alt={item.product.name}
                                    className="w-10 h-10 object-cover rounded-md"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h5 className="text-sm font-medium truncate">{item.product.name}</h5>
                                    <p className="text-xs text-textSecondary">
                                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                                    </p>
                                  </div>
                                  <Link 
                                    to={`/store/products/${item.product.productId}`}
                                    className="text-primary hover:text-primaryHover text-xs flex items-center gap-1"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <span>ORDER IT</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </Link>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex justify-between items-center pt-2 border-t border-border">
                              <div>
                                <p className="text-xs text-textSecondary">Total</p>
                                <p className="font-medium">${order.totalPrice.toFixed(2)}</p>
                              </div>
                              {order.status === 'PENDING_PAYMENT' && (
                                <Link 
                                  to={`/payment?token=${order.accessToken}`}
                                  className="bg-primary hover:bg-primaryHover text-white px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <CreditCard className="w-3 h-3" />
                                  PAY NOW
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <PaginationControls />
      </div>
    </div>
  );
};

export default OrderHistory;

