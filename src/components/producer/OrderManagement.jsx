import React, { useState, useEffect } from 'react';
import { mockProducerOrders } from '../../mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Search, Filter, ArrowUpDown, Package, Clock, CheckCircle2, XCircle, AlertCircle, X, ChevronDown, LayoutGrid, LayoutList } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

const OrderManagement = () => {
  const [orders, setOrders] = useState(mockProducerOrders);
  const [filteredOrders, setFilteredOrders] = useState(orders);
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
      'Pending': { icon: Clock, className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100', text: 'Pending' },
      'Processing': { icon: Package, className: 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100', text: 'Processing' },
      'Delivered': { icon: CheckCircle2, className: 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100', text: 'Delivered' },
      'Cancelled': { icon: XCircle, className: 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100', text: 'Cancelled' }
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
    let result = orders;

    if (searchTerm) {
      result = result.filter(order => 
        order.id.toString().includes(searchTerm) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.status !== 'all') {
      result = result.filter(order => order.status === filters.status);
    }

    if (filters.minAmount) {
      result = result.filter(order => order.total >= Number(filters.minAmount));
    }

    if (filters.maxAmount) {
      result = result.filter(order => order.total <= Number(filters.maxAmount));
    }

    setFilteredOrders(result);
    setCurrentPage(1);
  }, [searchTerm, filters, orders]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const FilterModal = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-[9999]"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-cardBg border border-border rounded-2xl p-8 w-full max-w-md relative mx-4 shadow-2xl"
      >
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-recoleta text-text">
              Filter Orders
            </h3>
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
                {['Pending', 'Processing', 'Delivered', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilters({...filters, status: status})}
                    className={`p-3 rounded-xl border ${
                      filters.status === status 
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
                  className="w-full p-3 rounded-xl border border-border bg-inputBg text-text placeholder:text-textSecondary focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                  value={filters.minAmount}
                  onChange={(e) => setFilters({...filters, minAmount: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textSecondary mb-2">Max Amount</label>
                <input
                  type="number"
                  className="w-full p-3 rounded-xl border border-border bg-inputBg text-text placeholder:text-textSecondary focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                  value={filters.maxAmount}
                  onChange={(e) => setFilters({...filters, maxAmount: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 border-border hover:border-primary hover:text-primary transition-all duration-200"
              onClick={() => {
                setFilters({
                  status: 'all',
                  dateRange: 'all',
                  minAmount: '',
                  maxAmount: ''
                });
              }}
            >
              Reset
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primaryHover text-white transition-all duration-200"
              onClick={() => setShowFilters(false)}
            >
              Apply
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

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
              { label: 'Total Orders', value: orders.length, icon: Package, color: 'blue' },
              { label: 'Pending', value: orders.filter(o => o.status === 'Pending').length, icon: Clock, color: 'yellow' },
              { label: 'Processing', value: orders.filter(o => o.status === 'Processing').length, icon: AlertCircle, color: 'purple' },
              { label: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, icon: CheckCircle2, color: 'green' },
            ].map((stat, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={index}
                className="bg-cardBg/50 backdrop-blur-sm border border-border rounded-xl p-4 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
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
            onClick={() => setShowFilters(true)}
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
                key={order.id}
                className="bg-cardBg border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-text">#{order.id}</h3>
                      <p className="text-sm text-textSecondary">{order.customer}</p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-textSecondary">Products:</span>
                      <span className="text-text font-medium">{order.products.length} items</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-textSecondary">Total:</span>
                      <span className="text-text font-medium">${order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-textSecondary">Date:</span>
                      <span className="text-text font-medium">
                        {new Date(order.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
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
                    key={order.id}
                    className="group hover:bg-primary/5 transition-colors duration-200"
                  >
                    <TableCell className="font-medium text-text">#{order.id}</TableCell>
                    <TableCell className="text-text">{order.customer}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-text">{order.products[0]}</span>
                        {order.products.length > 1 && (
                          <span className="text-sm text-textSecondary">
                            +{order.products.length - 1} more items
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-text">${order.total.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-textSecondary">
                      {new Date(order.date).toLocaleDateString()}
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


