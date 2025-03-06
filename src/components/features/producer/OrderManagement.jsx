import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../common/ui/Table';
import { Search, Filter,Package, Clock, CheckCircle2, XCircle, AlertCircle, X, LayoutGrid, LayoutList, Truck, SlidersHorizontal } from 'lucide-react';
import Button from '../../common/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducerOrders, filterOrders, updateOrderStatus, fetchOrdersByStatus } from '../../../store/slices/customer/orderSlice';
import { fetchOrderStatistics } from '../../../store/slices/common/analyticsSlice';

const OrderManagement = () => {
  const dispatch = useDispatch();
  const { orders, loading, error, pagination, sorting } = useSelector((state) => state.orders);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [tempFilters, setTempFilters] = useState({
    sorting: {
      sortBy: 'orderDate',
      direction: 'desc'
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const itemsPerPage = 6;

  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    minAmount: '',
    maxAmount: ''
  });

  const [activeStatus, setActiveStatus] = useState('all');

  const { orderStatistics } = useSelector((state) => state.analytics);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING_PAYMENT': { icon: Clock, className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100', text: 'Pending Payment' },
      'PAYMENT_FAILED': { icon: XCircle, className: 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100', text: 'Payment Failed' },
      'PAYMENT_COMPLETED': { icon: CheckCircle2, className: 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100', text: 'Payment Completed' },
      'PROCESSING': { icon: Package, className: 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100', text: 'Processing' },
      'SHIPPED': { icon: Truck, className: 'bg-purple-100 text-purple-700 dark:bg-purple-700 dark:text-purple-100', text: 'Shipped' },
      'DELIVERED': { icon: CheckCircle2, className: 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100', text: 'Delivered' },
      'CANCELLED': { icon: XCircle, className: 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100', text: 'Cancelled' },
      'RETURNED': { icon: AlertCircle, className: 'bg-orange-100 text-orange-700 dark:bg-orange-700 dark:text-orange-100', text: 'Returned' }
    };

    const config = statusConfig[status] || statusConfig['Pending'];
    const Icon = config.icon;

    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.className}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{config.text}</span>
      </div>
    );
  };

  useEffect(() => {
    
    dispatch(fetchProducerOrders({
      page: 0,
      size: 6,
      sortBy: tempFilters.sorting.sortBy,
      direction: tempFilters.sorting.direction,
      customerEmail: searchTerm
    }));
  }, [dispatch, tempFilters.sorting]);

  useEffect(() => {
    dispatch(fetchOrderStatistics());
  }, [dispatch]);

  
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = (status) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status === status ? 'all' : status
    }));
  };

  const handleStatusUpdate = async (orderId, currentStatus, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await dispatch(updateOrderStatus({ 
        orderId, 
        currentStatus,
        newStatus 
      })).unwrap();
      
      // Update just the single order in the redux store
      const updatedOrder = {
        ...orders.find(o => o.orderId === orderId),
        status: newStatus
      };
      
      dispatch({
        type: 'orders/updateSingleOrder',
        payload: updatedOrder
      });
      
      // Clear the updating state after a short delay
      setTimeout(() => {
        setUpdatingOrderId(null);
      }, 500);
    } catch (error) {
      console.error('Failed to update order status:', error);
      setUpdatingOrderId(null);
    }
  };

  const handleOpenFilters = () => {
    setTempFilters({
      sorting: {
        sortBy: sorting.sortBy,
        direction: sorting.direction
      }
    });
    setShowFiltersModal(true);
  };

  const FilterModal = () => {
    const [localFilters, setLocalFilters] = useState(tempFilters);

    const sortingOptions = [
      { value: 'orderDate', label: 'Order Date' },
      { value: 'status', label: 'Order Status' },
      { value: 'totalPrice', label: 'Total Price' },
      { value: 'customer.username', label: 'Customer Name' }
    ];

    useEffect(() => {
      setLocalFilters(tempFilters);
    }, [showFiltersModal]);

    const handleApplyFilters = () => {
      setTempFilters(localFilters);
      setShowFiltersModal(false);
    };

    const handleResetFilters = () => {
      const resetFilters = {
        sorting: {
          sortBy: 'orderDate',
          direction: 'desc'
        }
      };
      setLocalFilters(resetFilters);
    };

    if (!showFiltersModal) return null;

    return (
      <div className="fixed inset-0 z-[100] overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="fixed inset-0 bg-black/60 transition-opacity" onClick={() => setShowFiltersModal(false)} />
          
          <div className="relative transform overflow-hidden rounded-2xl bg-cardBg border border-border text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl z-[101]">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-cardBg">
              <h3 className="text-xl font-semibold text-text flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Sort Orders
              </h3>
              <button 
                onClick={() => setShowFiltersModal(false)} 
                className="text-textSecondary hover:text-text transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-6 py-4 bg-cardBg">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-textSecondary">Sort By</h4>
                <div className="grid grid-cols-1 gap-4">
                  <select
                    value={localFilters.sorting.sortBy}
                    onChange={(e) => setLocalFilters(prev => ({
                      ...prev,
                      sorting: { ...prev.sorting, sortBy: e.target.value }
                    }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text"
                  >
                    {sortingOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLocalFilters(prev => ({
                        ...prev,
                        sorting: { ...prev.sorting, direction: 'asc' }
                      }))}
                      className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                        localFilters.sorting.direction === 'asc'
                          ? 'bg-primary text-white border-primary'
                          : 'border-border text-text hover:bg-white/5'
                      }`}
                    >
                      Ascending
                    </button>
                    <button
                      onClick={() => setLocalFilters(prev => ({
                        ...prev,
                        sorting: { ...prev.sorting, direction: 'desc' }
                      }))}
                      className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                        localFilters.sorting.direction === 'desc'
                          ? 'bg-primary text-white border-primary'
                          : 'border-border text-text hover:bg-white/5'
                      }`}
                    >
                      Descending
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-cardBg">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-lg border border-border text-text hover:bg-white/5 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primaryHover text-white transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const openFilters = () => {
    setShowFilters(true);
  };

  const renderOrderItems = (order) => {
    return order.items.map(item => (
      <div key={item.orderItemId} className="text-sm text-textSecondary">
        {item.product.name} x {item.quantity}
      </div>
    ));
  };

  const filterByPrice = (order) => {
    const price = order.totalPrice || 0;
    const min = parseFloat(filters.minAmount) || 0;
    const max = parseFloat(filters.maxAmount) || Infinity;
    return price >= min && price <= max;
  };

  const StatusActions = ({ order }) => {
    const availableTransitions = {
      'PENDING_PAYMENT': [], // No manual transitions allowed
      'PAYMENT_FAILED': [], // No manual transitions allowed
      'PAYMENT_COMPLETED': ['PROCESSING'],
      'PROCESSING': ['SHIPPED', 'CANCELLED'],
      'SHIPPED': ['DELIVERED'],
      'DELIVERED': ['RETURNED'],
      'CANCELLED': [], // No further transitions
      'RETURNED': [] // No further transitions
    };

    const transitions = availableTransitions[order.status] || [];

    if (transitions.length === 0) return null;

    return (
      <div className="mt-4 flex gap-2">
        {transitions.map(newStatus => (
          <Button
            key={newStatus}
            variant="outline"
            size="sm"
            onClick={() => handleStatusUpdate(order.orderId, order.status, newStatus)}
            className={`text-sm ${
              newStatus === 'CANCELLED' 
                ? 'border-red-500 text-red-500 hover:bg-red-500/10' 
                : 'border-primary text-primary hover:bg-primary/10'
            }`}
          >
            {newStatus.charAt(0) + newStatus.slice(1).toLowerCase()}
          </Button>
        ))}
      </div>
    );
  };

  const handleStatusFilter = (status) => {
    setActiveStatus(status);
    if (status === 'all') {
      dispatch(fetchProducerOrders({
        page: 0,
        size: pagination.pageSize,
        sortBy: tempFilters.sorting.sortBy,
        direction: tempFilters.sorting.direction,
        customerEmail: searchTerm
      }));
    } else {
      dispatch(fetchOrdersByStatus({
        status,
        page: 0,
        size: pagination.pageSize,
        sortBy: tempFilters.sorting.sortBy,
        direction: tempFilters.sorting.direction,
        customerEmail: searchTerm
      }));
    }
  };

  // Add this component for status filters
  const StatusFilters = () => {
    const statusOptions = [
      { value: 'all', label: 'All Orders', icon: Package, color: 'primary' },
      { value: 'PAYMENT_COMPLETED', label: 'Payment Completed', icon: CheckCircle2, color: 'green' },
      { value: 'PROCESSING', label: 'Processing', icon: Package, color: 'blue' },
      { value: 'SHIPPED', label: 'Shipped', icon: Truck, color: 'purple' },
      { value: 'DELIVERED', label: 'Delivered', icon: CheckCircle2, color: 'green' },
      { value: 'CANCELLED', label: 'Cancelled', icon: XCircle, color: 'red' },
      { value: 'RETURNED', label: 'Returned', icon: AlertCircle, color: 'orange' }
    ];

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {statusOptions.map((status) => {
          const Icon = status.icon;
          const isActive = activeStatus === status.value;
          return (
            <Button
              key={status.value}
              variant={isActive ? "default" : "outline"}
              onClick={() => handleStatusFilter(status.value)}
              className={`flex items-center gap-2 border ${
                isActive 
                  ? 'bg-primary text-white border-primary'
                  : 'border-border hover:border-primary hover:text-primary'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{status.label}</span>
              {isActive && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-white/20 rounded-full">
                  {pagination.totalElements}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    );
  };

  // Update the PaginationControls component to use the correct fetch function
  const PaginationControls = () => {
    if (!pagination || pagination.totalElements <= pagination.pageSize) {
      return null;
    }

    const handlePageChange = (newPage) => {
      const fetchFunction = activeStatus === 'all' ? fetchProducerOrders : fetchOrdersByStatus;
      const params = {
        page: newPage,
        size: pagination.pageSize,
        sortBy: tempFilters.sorting.sortBy,
        direction: tempFilters.sorting.direction,
        customerEmail: searchTerm
      };

      if (activeStatus !== 'all') {
        params.status = activeStatus;
      }

      dispatch(fetchFunction(params));
    };

    // Function to generate page numbers with ellipses for large page counts
    const getPageNumbers = () => {
      const currentPage = pagination.currentPage;
      const totalPages = pagination.totalPages;
      
      // Always show first page, last page, current page, and pages around current
      const pageNumbers = [];
      const rangeSize = 1; // Number of pages to show before and after current page
      
      // Add first page
      pageNumbers.push(0);
      
      // Add ellipsis after first page if needed
      if (currentPage - rangeSize > 1) {
        pageNumbers.push('ellipsis1');
      }
      
      // Add pages around current page
      for (let i = Math.max(1, currentPage - rangeSize); i <= Math.min(totalPages - 2, currentPage + rangeSize); i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (currentPage + rangeSize < totalPages - 2) {
        pageNumbers.push('ellipsis2');
      }
      
      // Add last page if there is more than one page
      if (totalPages > 1) {
        pageNumbers.push(totalPages - 1);
      }
      
      return pageNumbers;
    };

    return (
      <div className="flex flex-col items-center justify-center gap-4 py-4">
        <div className="text-sm text-textSecondary">
          Showing {pagination.currentPage * pagination.pageSize + 1} to {Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalElements)} of {pagination.totalElements} orders
        </div>
        <div className="flex items-center gap-1 bg-cardBg rounded-lg p-1">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.isFirst}
            className="px-3 py-1 text-sm text-text hover:bg-background rounded transition-colors disabled:opacity-50"
          >
            Previous
          </button>

          {getPageNumbers().map((pageNum, index) => {
            if (pageNum === 'ellipsis1' || pageNum === 'ellipsis2') {
              return (
                <span key={pageNum} className="px-2 py-1 text-sm text-textSecondary">
                  ...
                </span>
              );
            }
            
            return (
              <button
                key={index}
                onClick={() => handlePageChange(pageNum)}
                className={`min-w-[32px] px-2 py-1 text-sm rounded ${
                  pageNum === pagination.currentPage
                    ? 'bg-primary text-white'
                    : 'text-text hover:bg-background'
                }`}
              >
                {pageNum + 1}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.isLast}
            className="px-3 py-1 text-sm text-text hover:bg-background rounded transition-colors disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    const fetchFunction = activeStatus === 'all' ? fetchProducerOrders : fetchOrdersByStatus;
    const params = {
      page: 0,
      size: pagination.pageSize,
      sortBy: tempFilters.sorting.sortBy,
      direction: tempFilters.sorting.direction,
      customerEmail: value
    };

    if (activeStatus !== 'all') {
      params.status = activeStatus;
    }

    // Add debounce to avoid too many API calls
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      dispatch(fetchFunction(params));
    }, 300);
  };

  // Add this at the top with other useRefs or state
  const searchTimeout = React.useRef(null);

  // Update the useEffect that was handling search before
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  return (
    <div className="space-y-8 p-4 md:p-8 bg-background min-h-screen transition-colors duration-300">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl border border-border p-8">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-recoleta text-text">Order Management</h2>
              <p className="text-textSecondary">Track and manage your customer orders</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { 
                label: 'Total Orders', 
                value: orderStatistics.totalOrders, 
                icon: Package, 
                gradientFrom: 'from-blue-500/30', 
                gradientTo: 'to-blue-600/30', 
                iconColor: 'text-blue-500' 
              },
              { 
                label: 'Pending', 
                value: orderStatistics.pendingOrders, 
                icon: Clock, 
                gradientFrom: 'from-yellow-500/30', 
                gradientTo: 'to-yellow-600/30', 
                iconColor: 'text-yellow-500' 
              },
              { 
                label: 'Processing', 
                value: orderStatistics.processingOrders, 
                icon: AlertCircle, 
                gradientFrom: 'from-purple-500/30', 
                gradientTo: 'to-purple-600/30', 
                iconColor: 'text-purple-500' 
              },
              { 
                label: 'Delivered', 
                value: orderStatistics.deliveredOrders, 
                icon: CheckCircle2, 
                gradientFrom: 'from-green-500/30', 
                gradientTo: 'to-green-600/30', 
                iconColor: 'text-green-500' 
              }
            ].map((stat, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={index}
                className="bg-cardBg/95 border border-border rounded-xl p-4 hover:shadow-lg hover:border-primary/20 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-100 dark:opacity-40 transition-opacity duration-200" />
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradientFrom} ${stat.gradientTo} opacity-25 dark:opacity-40 transition-opacity duration-200`} />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-textSecondary">{stat.label}</p>
                    <p className="text-2xl font-bold text-text mt-1">{stat.value}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/20 dark:bg-black/20 backdrop-blur-sm">
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <StatusFilters />
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
            <input
              type="text"
              placeholder="Search by customer email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-inputBg text-text placeholder:text-textSecondary focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
            />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <Button 
              variant="outline" 
              className="flex-1 md:flex-none items-center gap-2 border-border hover:border-primary hover:text-primary transition-all duration-200"
              onClick={handleOpenFilters}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
            
            <div className="flex gap-2 border border-border rounded-xl p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-textSecondary hover:text-primary'}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-textSecondary hover:text-primary'}`}
              >
                <LayoutList className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            key={`grid-${currentPage}`}
          >
            {loading ? (
              <div className="text-center py-4">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 bg-cardBg/50 border border-dashed border-border rounded-xl">
                <Package className="w-16 h-16 text-textSecondary/30 mb-4" />
                <h3 className="text-xl font-semibold text-text mb-2">No Orders Found</h3>
                <p className="text-textSecondary text-center max-w-md mb-6">
                  There are no orders matching your current filters. Try adjusting your search criteria or check back later.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFilters({
                      status: 'all',
                      dateRange: 'all',
                      minAmount: '',
                      maxAmount: ''
                    });
                    setSearchTerm('');
                    setActiveStatus('all');
                    
                    // Fetch orders with reset filters
                    dispatch(fetchProducerOrders({
                      page: 0,
                      size: itemsPerPage,
                      sortBy: tempFilters.sorting.sortBy,
                      direction: tempFilters.sorting.direction
                    }));
                    
                    // Reset to first page
                    setCurrentPage(1);
                  }}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Reset Filters
                </Button>
              </div>
            ) : (
              paginatedOrders.map((order, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: updatingOrderId === order.orderId ? [1, 1.02, 1] : 1
                  }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                  key={order.orderId}
                  className={`bg-cardBg border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 ${
                    updatingOrderId === order.orderId ? 'ring-2 ring-primary ring-opacity-50' : ''
                  }`}
                >
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-text">#{order.orderId}</h3>
                        <div className="space-y-1">
                          <p className="font-medium text-text">
                            {order.customer?.firstname} {order.customer?.lastname}
                          </p>
                          <p className="text-sm text-textSecondary">
                            {order.customer?.email}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-textSecondary">Products:</span>
                        <span className="text-text font-medium">{renderOrderItems(order).length} items</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-textSecondary">Total:</span>
                        <div className="text-sm font-medium text-text">
                          ${order.totalPrice?.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-textSecondary">Date:</span>
                        <span className="text-text font-medium">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <StatusActions order={order} />
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-cardBg border border-border rounded-xl overflow-hidden"
            key={`list-${currentPage}`}
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-background/50">
                  <TableHead className="font-semibold text-textSecondary">Order ID</TableHead>
                  <TableHead className="font-semibold text-textSecondary">Customer</TableHead>
                  <TableHead className="font-semibold text-textSecondary">Products</TableHead>
                  <TableHead className="font-semibold text-textSecondary">Total</TableHead>
                  <TableHead className="font-semibold text-textSecondary">Status</TableHead>
                  <TableHead className="font-semibold text-textSecondary">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Loading orders...</TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="flex flex-col items-center justify-center py-12 px-4">
                        <Package className="w-16 h-16 text-textSecondary/30 mb-4" />
                        <h3 className="text-xl font-semibold text-text mb-2">No Orders Found</h3>
                        <p className="text-textSecondary text-center max-w-md mb-6">
                          There are no orders matching your current filters. Try adjusting your search criteria or check back later.
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setFilters({
                              status: 'all',
                              dateRange: 'all',
                              minAmount: '',
                              maxAmount: ''
                            });
                            setSearchTerm('');
                            setActiveStatus('all');
                            
                            // Fetch orders with reset filters
                            dispatch(fetchProducerOrders({
                              page: 0,
                              size: itemsPerPage,
                              sortBy: tempFilters.sorting.sortBy,
                              direction: tempFilters.sorting.direction
                            }));
                            
                            // Reset to first page
                            setCurrentPage(1);
                          }}
                          className="flex items-center gap-2"
                        >
                          <Filter className="w-4 h-4" />
                          Reset Filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedOrders.map((order, index) => (
                    <motion.tr
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: index * 0.05,
                        duration: 0.3,
                        ease: "easeOut"
                      }}
                      key={order.orderId}
                      className={`group hover:bg-primary/5 transition-colors duration-200 ${
                        updatingOrderId === order.orderId ? 'bg-primary/10' : ''
                      }`}
                    >
                      <TableCell className="font-medium text-text">#{order.orderId}</TableCell>
                      <TableCell className="text-text">
                        <div className="space-y-1">
                          <p className="font-medium text-text">
                            {order.customer?.firstname} {order.customer?.lastname}
                          </p>
                          <p className="text-sm text-textSecondary">
                            {order.customer?.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {renderOrderItems(order)}
                        </div>
                      </TableCell>
                      <TableCell className="text-text">${order.totalPrice?.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {getStatusBadge(order.status)}
                          <StatusActions order={order} />
                        </div>
                      </TableCell>
                      <TableCell className="text-textSecondary">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </AnimatePresence>

      <FilterModal />

      {/* Move pagination outside of the grid/table containers */}
      <div className="mt-6 flex justify-center w-full">
        <PaginationControls />
      </div>
    </div>
  );
};

export default OrderManagement;


