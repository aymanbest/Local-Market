import React, { useState, useEffect } from 'react';
import { mockProducerOrders } from '../mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/Table';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Search, Filter, ArrowUpDown, Package, Clock, CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';
import Button from './ui/Button';
import Badge from './ui/Badge';

const OrderManagement = () => {
  const [orders, setOrders] = useState(mockProducerOrders);
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 5;

  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    minAmount: '',
    maxAmount: ''
  });

  // Status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { icon: Clock, className: 'bg-yellow-100 text-yellow-700', text: 'Pending' },
      'Processing': { icon: Package, className: 'bg-blue-100 text-blue-700', text: 'Processing' },
      'Delivered': { icon: CheckCircle2, className: 'bg-green-100 text-green-700', text: 'Delivered' },
      'Cancelled': { icon: XCircle, className: 'bg-red-100 text-red-700', text: 'Cancelled' }
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

  // Filter orders based on search and filters
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

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter Modal
  const FilterModal = () => (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
      <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 w-full max-w-md relative mx-4 shadow-xl border border-gray-100">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Filter Orders
            </h3>
            <Button 
              variant="ghost" 
              onClick={() => setShowFilters(false)}
              className="hover:bg-red-50 hover:text-red-600 -mr-2 -mt-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full p-2 border rounded-lg"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min Amount</label>
              <input
                type="number"
                className="w-full p-2 border rounded-lg"
                value={filters.minAmount}
                onChange={(e) => setFilters({...filters, minAmount: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Amount</label>
              <input
                type="number"
                className="w-full p-2 border rounded-lg"
                value={filters.maxAmount}
                onChange={(e) => setFilters({...filters, maxAmount: e.target.value})}
              />
            </div>
          </div>
          <div className="flex space-x-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
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
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setShowFilters(false)}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
        <p className="text-gray-500 mt-1">Track and manage your customer orders</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: orders.length, icon: Package, color: 'blue' },
          { label: 'Pending', value: orders.filter(o => o.status === 'Pending').length, icon: Clock, color: 'yellow' },
          { label: 'Processing', value: orders.filter(o => o.status === 'Processing').length, icon: AlertCircle, color: 'purple' },
          { label: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, icon: CheckCircle2, color: 'green' },
        ].map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders by ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
          />
        </div>
        <Button 
          variant="outline" 
          className="flex items-center space-x-2 hover:border-green-500 hover:text-green-600"
          onClick={() => setShowFilters(true)}
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center space-x-2 hover:border-green-500 hover:text-green-600"
        >
          <ArrowUpDown className="w-5 h-5" />
          <span>Sort</span>
        </Button>
      </div>

      {/* Orders Table */}
      <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="font-semibold">Order ID</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Products</TableHead>
              <TableHead className="font-semibold">Total</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow 
                key={order.id}
                className="group hover:bg-gray-50/50 transition-colors duration-200"
              >
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{order.products[0]}</span>
                    {order.products.length > 1 && (
                      <span className="text-sm text-gray-500">
                        +{order.products.length - 1} more items
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell className="text-gray-500">
                  {new Date(order.date).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
          <span className="font-medium">
            {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
          </span> of{' '}
          <span className="font-medium">{filteredOrders.length}</span> orders
        </p>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilters && <FilterModal />}
    </div>
  );
};

export default OrderManagement;

