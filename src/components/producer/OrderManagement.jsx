import React, { useState, useEffect } from 'react';
import { mockProducerOrders } from '../../mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Search, Filter, ArrowUpDown, Package, Clock, CheckCircle2, XCircle, AlertCircle, X, ChevronDown, LayoutGrid, LayoutList, Truck } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducerOrders, filterOrders, updateOrderStatus } from '../../store/slices/orderSlice';

const OrderManagement = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders?.items || []);
  const filteredOrders = useSelector((state) => state.orders?.filteredOrders || []);
  const status = useSelector((state) => state.orders?.status || 'idle');
  const stats = useSelector((state) => state.orders?.stats || {
    total: 0,
    pending: 0,
    processing: 0,
    delivered: 0
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
    dispatch(fetchProducerOrders());
  }, [dispatch]);

  useEffect(() => {
    dispatch(filterOrders({ searchTerm, filters }));
  }, [dispatch, searchTerm, filters, orders]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
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
      await dispatch(updateOrderStatus({ 
        orderId, 
        currentStatus,
        newStatus 
      })).unwrap();
      // Refresh the orders list
      dispatch(fetchProducerOrders());
    } catch (error) {
      console.error('Failed to update order status:', error);
      // Add toast notification here if you have one
    }
  };

  const FilterModal = () => {
    const [localFilters, setLocalFilters] = useState(filters);

    useEffect(() => {
      setLocalFilters(filters);
    }, [showFilters]);

    const handleLocalReset = () => {
      const resetFilters = {
        status: 'all',
        dateRange: 'all',
        minAmount: '',
        maxAmount: ''
      };
      setLocalFilters(resetFilters);
    };

    const handleLocalApply = () => {
      setFilters(localFilters);
      setShowFilters(false);
    };

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <div 
          className="fixed inset-0 bg-black/60" 
          onClick={() => setShowFilters(false)} 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-cardBg border border-border rounded-2xl p-8 w-full max-w-md relative mx-4 shadow-2xl z-50"
        >
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-recoleta text-text">Filter Orders</h3>
              <Button 
                variant="ghost" 
                onClick={() => setShowFilters(false)}
                className="hover:bg-red-500/10 hover:text-red-500 -mr-2 -mt-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'PENDING_PAYMENT',
                    'PAYMENT_FAILED', 
                    'PAYMENT_COMPLETED',
                    'PROCESSING',
                    'SHIPPED',
                    'DELIVERED',
                    'CANCELLED',
                    'RETURNED'
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() => setLocalFilters(prev => ({
                        ...prev,
                        status: prev.status === status ? 'all' : status
                      }))}
                      className={`p-3 rounded-xl border ${
                        localFilters.status === status 
                          ? 'border-primary bg-primary/10 text-primary' 
                          : 'border-border text-textSecondary hover:border-primary/50'
                      } transition-all duration-200`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Min Amount</label>
                  <input
                    type="number"
                    className="w-full hide-spinner p-3 rounded-xl border border-border bg-inputBg text-text placeholder:text-textSecondary focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                    value={localFilters.minAmount}
                    onChange={(e) => setLocalFilters(prev => ({...prev, minAmount: e.target.value}))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Max Amount</label>
                  <input
                    type="number"
                    className="w-full hide-spinner p-3 rounded-xl border border-border bg-inputBg text-text placeholder:text-textSecondary focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                    value={localFilters.maxAmount}
                    onChange={(e) => setLocalFilters(prev => ({...prev, maxAmount: e.target.value}))}
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 border-border hover:border-primary hover:text-primary transition-all duration-200"
                onClick={handleLocalReset}
              >
                Reset
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primaryHover text-white transition-all duration-200"
                onClick={handleLocalApply}
              >
                Apply
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
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

  // Calculate order statistics
  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => ['PAYMENT_COMPLETED'].includes(o.status)).length,
    processing: orders.filter(o => ['PROCESSING'].includes(o.status)).length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length
  };

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
              { label: 'Total Orders', value: orderStats.total, icon: Package, color: 'blue' },
              { label: 'Pending', value: orderStats.pending, icon: Clock, color: 'yellow' },
              { label: 'Processing', value: orderStats.processing, icon: AlertCircle, color: 'purple' },
              { label: 'Delivered', value: orderStats.delivered, icon: CheckCircle2, color: 'green' },
            ].map((stat, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={index}
                className="bg-cardBg/90 border border-border rounded-xl p-4 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-textSecondary">{stat.label}</p>
                    <p className="text-2xl font-bold text-text mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-${stat.color}-500/10`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-inputBg text-text placeholder:text-textSecondary focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <Button 
            variant="outline" 
            className="flex-1 md:flex-none items-center gap-2 border-border hover:border-primary hover:text-primary transition-all duration-200"
            onClick={openFilters}
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
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

      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {paginatedOrders.map((order, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={order.orderId}
                className="bg-cardBg border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-text">#{order.orderId}</h3>
                      <div className="space-y-1">
                        <p className="font-medium text-text">
                          {order.customer.firstname} {order.customer.lastname}
                        </p>
                        <p className="text-sm text-textSecondary">
                          {order.customer.email}
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
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-cardBg border border-border rounded-xl overflow-hidden"
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
                {paginatedOrders.map((order) => (
                  <TableRow 
                    key={order.orderId}
                    className="group hover:bg-primary/5 transition-colors duration-200"
                  >
                    <TableCell className="font-medium text-text">#{order.orderId}</TableCell>
                    <TableCell className="text-text">
                      <div className="space-y-1">
                        <p className="font-medium text-text">
                          {order.customer.firstname} {order.customer.lastname}
                        </p>
                        <p className="text-sm text-textSecondary">
                          {order.customer.email}
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between py-4">
        <p className="text-sm text-textSecondary">
          Showing <span className="font-medium text-text">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
          <span className="font-medium text-text">
            {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
          </span>{' '}
          of <span className="font-medium text-text">{filteredOrders.length}</span> results
        </p>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-border hover:border-primary hover:text-primary transition-all duration-200"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            className="border-border hover:border-primary hover:text-primary transition-all duration-200"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && <FilterModal />}
      </AnimatePresence>
    </div>
  );
};

export default OrderManagement;


