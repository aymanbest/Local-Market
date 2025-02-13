import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import { format } from 'date-fns';
import { Package, ChevronRight, ChevronLeft } from 'lucide-react';
import Button from './ui/Button';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        
        // Group orders by accessToken
        const groupedOrders = response.data.content.reduce((acc, order) => {
          const key = order.accessToken;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(order);
          return acc;
        }, {});

        setOrders(Object.values(groupedOrders));
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'PAYMENT_FAILED':
        return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'PAYMENT_COMPLETED':
        return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'PROCESSING':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case 'SHIPPED':
        return 'text-purple-500 bg-purple-500/10 border-purple-500/30';
      case 'DELIVERED':
        return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'CANCELLED':
        return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'RETURNED':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const PaginationControls = () => {
    if (!pagination || pagination.totalElements <= pagination.pageSize) {
      return null;
    }

    // Calculate the range of pages to show
    const getPageRange = () => {
      const delta = 2; // Number of pages to show on each side of current page
      const range = [];
      const rangeWithDots = [];

      // Always show first page
      range.push(0);

      for (let i = pagination.currentPage - delta; i <= pagination.currentPage + delta; i++) {
        if (i > 0 && i < pagination.totalPages - 1) {
          range.push(i);
        }
      }

      // Always show last page
      if (pagination.totalPages > 1) {
        range.push(pagination.totalPages - 1);
      }

      // Add the page numbers with dots
      let l = null;
      for (const i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push('...');
          }
        }
        rangeWithDots.push(i);
        l = i;
      }

      return rangeWithDots;
    };

    const pageRange = getPageRange();
    
    return (
      <div className="mt-8 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="border hover:bg-cardBg text-text border-border min-w-[100px] flex items-center justify-center gap-2"
            disabled={pagination.isFirst}
            onClick={() => setPagination(prev => ({
              ...prev,
              currentPage: prev.currentPage - 1
            }))}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {pageRange.map((page, index) => (
              page === '...' ? (
                <span key={`dots-${index}`} className="px-2 text-textSecondary">
                  {page}
                </span>
              ) : (
                <Button
                  key={page}
                  variant={page === pagination.currentPage ? "default" : "outline"}
                  size="sm"
                  className={`min-w-[40px] ${
                    page === pagination.currentPage 
                      ? 'bg-primary text-white' 
                      : 'border hover:bg-cardBg text-text border-border'
                  }`}
                  onClick={() => setPagination(prev => ({
                    ...prev,
                    currentPage: page
                  }))}
                >
                  {page + 1}
                </Button>
              )
            ))}
          </div>

          <Button 
            variant="outline" 
            size="sm"
            className="border hover:bg-cardBg text-text border-border min-w-[100px] flex items-center justify-center gap-2"
            disabled={pagination.isLast}
            onClick={() => setPagination(prev => ({
              ...prev,
              currentPage: prev.currentPage + 1
            }))}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-sm text-textSecondary">
          Showing <span className="font-medium">{(pagination.currentPage) * (pagination.pageSize) + 1}</span> to{' '}
          <span className="font-medium">
            {Math.min((pagination.currentPage + 1) * (pagination.pageSize), pagination.totalElements)}
          </span> of{' '}
          <span className="font-medium">{pagination.totalElements}</span> orders
        </p>
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-staatliches font-semibold uppercase">Order History</h1>
          <Link 
            to="/account" 
            className="rounded-full border border-border hover:bg-cardBg transition flex gap-2 items-center px-4 py-2"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Account</span>
          </Link>
        </div>

        <hr className="border-border mb-6" />

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-textSecondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text mb-2">No Orders Yet</h3>
            <p className="text-textSecondary">When you place orders, they will appear here.</p>
            <Link to="/store" className="text-primary hover:underline mt-4 inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {orders.map((orderGroup, index) => (
                <div 
                  key={index}
                  className="bg-cardBg rounded-xl border border-border overflow-hidden"
                >
                  {orderGroup.map((order, orderIndex) => (
                    <div 
                      key={order.orderId}
                      className={`p-6 ${orderIndex !== orderGroup.length - 1 ? 'border-b border-border' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">Order #{order.orderId}</h3>
                          <p className="text-sm text-textSecondary">
                            Placed on {format(new Date(order.orderDate), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(order.status)}`}>
                          {order.status.replace(/_/g, ' ')}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div key={item.orderItemId} className="flex items-center gap-4">
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{item.product.name}</h4>
                              <p className="text-sm text-textSecondary">
                                Quantity: {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-textSecondary">Total Amount</p>
                            <p className="text-lg font-semibold">${order.totalPrice.toFixed(2)}</p>
                          </div>
                          {order.payment && (
                            <div className="text-right">
                              <p className="text-sm text-textSecondary">Payment Method</p>
                              <p className="font-medium">{order.payment.paymentMethod}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <PaginationControls />
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;

