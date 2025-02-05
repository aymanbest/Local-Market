import React, { useState, useEffect } from 'react';
import { mockProducerProducts } from '../../mockData';
import { 
  Plus, Pencil, Trash2, ArrowUpDown, Search, Filter, X, Upload, 
  Edit2, MoreVertical, Eye, ChevronLeft, ChevronRight, Package,
  TrendingUp, TrendingDown, Box, DollarSign, BarChart2
} from 'lucide-react';
import Button from '../ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useTheme } from '../../context/ThemeContext';

const ProductManagement = () => {
  const [products, setProducts] = useState(mockProducerProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducerProducts);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortField, setSortField] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 5;

  // New Product State
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    inventory: '',
    image: '',
    active: true
  });

  // Filter States
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minInventory: '',
    maxInventory: '',
    status: 'all'
  });

  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { isDark } = useTheme();
  
  // Calculate quick stats
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.inventory), 0);
  const lowStockProducts = products.filter(p => p.inventory < 10).length;
  const activeProducts = products.filter(p => p.active).length;

  // Handle Search
  useEffect(() => {
    let result = products;
    
    // Search
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filters
    if (filters.minPrice) result = result.filter(p => p.price >= Number(filters.minPrice));
    if (filters.maxPrice) result = result.filter(p => p.price <= Number(filters.maxPrice));
    if (filters.minInventory) result = result.filter(p => p.inventory >= Number(filters.minInventory));
    if (filters.maxInventory) result = result.filter(p => p.inventory <= Number(filters.maxInventory));
    if (filters.status !== 'all') result = result.filter(p => p.active === (filters.status === 'active'));

    // Sort
    result = result.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortField] > b[sortField] ? 1 : -1;
      }
      return a[sortField] < b[sortField] ? 1 : -1;
    });

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [searchTerm, filters, sortOrder, sortField, products]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const productToAdd = {
      ...newProduct,
      id: products.length + 1,
      sales: 0,
      salesTrend: 0,
      price: Number(newProduct.price),
      inventory: Number(newProduct.inventory)
    };
    setProducts([...products, productToAdd]);
    setShowAddModal(false);
    setNewProduct({ name: '', price: '', inventory: '', image: '', active: true });
  };

  const handleView = (productId) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleEdit = (productId) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product);
    setNewProduct(product);
    setShowAddModal(true); // Reusing add modal for edit
  };

  const handleDelete = (productId) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setProducts(products.filter(p => p.id !== selectedProduct.id));
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };

  // Add Product Modal
  const AddProductModal = () => (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
      <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 w-full max-w-md relative mx-4 shadow-xl border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Add New Product
          </h3>
          <Button 
            variant="ghost" 
            onClick={() => setShowAddModal(false)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              className="w-full p-2 border rounded"
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Inventory</label>
            <input
              type="number"
              required
              min="0"
              className="w-full p-2 border rounded"
              value={newProduct.inventory}
              onChange={(e) => setNewProduct({...newProduct, inventory: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={newProduct.image}
                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
              />
              <Button type="button" variant="outline" className="flex items-center">
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={newProduct.active}
              onChange={(e) => setNewProduct({...newProduct, active: e.target.checked})}
            />
            <label className="text-sm font-medium">Active Product</label>
          </div>
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
            Add Product
          </Button>
        </form>
      </div>
    </div>
  );

  // Filter Modal
  const FilterModal = () => (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="bg-gray-800/90 backdrop-blur-md rounded-lg p-6 w-full max-w-md relative mx-4 shadow-xl border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Filter Products
          </h3>
          <button
            onClick={() => setShowFilters(false)}
            className="p-2 text-gray-300 hover:bg-red-600/20 hover:text-red-400 rounded-full"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">Min Price</label>
              <input
                type="number"
                min="0"
                className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-200 rounded focus:ring-2 focus:ring-blue-500"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">Max Price</label>
              <input
                type="number"
                min="0"
                className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-200 rounded focus:ring-2 focus:ring-blue-500"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">Min Inventory</label>
              <input
                type="number"
                min="0"
                className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-200 rounded focus:ring-2 focus:ring-blue-500"
                value={filters.minInventory}
                onChange={(e) => setFilters({ ...filters, minInventory: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">Max Inventory</label>
              <input
                type="number"
                min="0"
                className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-200 rounded focus:ring-2 focus:ring-blue-500"
                value={filters.maxInventory}
                onChange={(e) => setFilters({ ...filters, maxInventory: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">Status</label>
            <select
              className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-200 rounded focus:ring-2 focus:ring-blue-500"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              className="flex-1 px-4 py-2 border border-gray-500 text-gray-300 rounded hover:bg-gray-700 hover:border-gray-400"
              onClick={() =>
                setFilters({
                  minPrice: '',
                  maxPrice: '',
                  minInventory: '',
                  maxInventory: '',
                  status: 'all',
                })
              }
            >
              Reset
            </button>
            <button
              type="button"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => setShowFilters(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  

  // View Modal Component
  const ViewModal = () => (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
  <div className="bg-gray-800/90 backdrop-blur-md rounded-lg p-6 w-full max-w-md relative mx-4 shadow-xl border border-gray-700">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
        Product Details
      </h3>
      <Button 
        variant="ghost" 
        onClick={() => setShowViewModal(false)}
        className="hover:bg-red-600/20 hover:text-red-400 text-gray-300"
      >
        <X className="w-5 h-5" />
      </Button>
    </div>
    {selectedProduct && (
      <div className="space-y-4">
        <div className="aspect-square w-full max-w-[200px] mx-auto">
          <img 
            src={selectedProduct.image} 
            alt={selectedProduct.name}
            className="w-full h-full object-cover rounded-lg border border-gray-700"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Name</p>
            <p className="font-medium text-gray-200">{selectedProduct.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Category</p>
            <p className="font-medium text-gray-200">{selectedProduct.category}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Price</p>
            <p className="font-medium text-gray-200">${selectedProduct.price.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Inventory</p>
            <p className="font-medium text-gray-200">{selectedProduct.inventory}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-400">Description</p>
            <p className="font-medium text-gray-200">{selectedProduct.description}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-400">Status</p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
              selectedProduct.active 
                ? 'bg-green-700/20 text-green-400'
                : 'bg-gray-700/20 text-gray-400'
            }`}>
              {selectedProduct.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    )}
  </div>
</div>

  );

  // Delete Confirmation Modal
  const DeleteModal = ({ selectedProduct, setShowDeleteModal, confirmDelete }) => (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div className="bg-gray-800/90 backdrop-blur-md rounded-lg p-6 w-full max-w-md relative mx-4 shadow-xl border border-gray-700">
        <div className="space-y-4">
          {/* Modal Header */}
          <h3 className="text-xl font-bold text-gray-200">Confirm Delete</h3>
          
          {/* Modal Description */}
          <p className="text-gray-400">
            Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
          </p>
          
          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 border-gray-500 text-gray-300 hover:bg-gray-700 hover:border-gray-400"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
  

  return (
    <div className="space-y-8">
      {/* Hero Section with Stats */}
      <div className="relative overflow-hidden rounded-2xl border border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
        
        <div className="relative p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primaryHover bg-clip-text text-transparent">
                Product Management
              </h1>
              <p className="text-textSecondary">
                Manage and monitor your product inventory
              </p>
            </div>

            <Button 
              onClick={() => setShowAddModal(true)}
              className="group relative overflow-hidden bg-primary hover:bg-primaryHover text-white flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {[
              { 
                label: 'Total Products', 
                value: totalProducts, 
                icon: Package, 
                color: 'blue',
                bgGradient: 'from-blue-500/10 via-blue-500/5 to-transparent'
              },
              { 
                label: 'Inventory Value', 
                value: `$${totalValue.toFixed(2)}`, 
                icon: DollarSign, 
                color: 'green',
                bgGradient: 'from-green-500/10 via-green-500/5 to-transparent'
              },
              { 
                label: 'Low Stock', 
                value: lowStockProducts, 
                icon: Box, 
                color: 'amber',
                bgGradient: 'from-amber-500/10 via-amber-500/5 to-transparent'
              },
              { 
                label: 'Active Products', 
                value: activeProducts, 
                icon: BarChart2, 
                color: 'purple',
                bgGradient: 'from-purple-500/10 via-purple-500/5 to-transparent'
              }
            ].map((stat, index) => (
              <div key={index} className="relative group">
                {/* Decorative background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative p-6 rounded-xl border border-border bg-cardBg/95">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-textSecondary">{stat.label}</p>
                      <p className="text-2xl font-bold text-text mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-500`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-textSecondary" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-cardBg text-text placeholder-textSecondary focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(true)}
            className="flex items-center space-x-2 border-border hover:bg-primary hover:text-white transition-all duration-300"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSort('name')}
            className="flex items-center space-x-2 border-border hover:bg-primary hover:text-white transition-all duration-300"
          >
            <ArrowUpDown className="w-5 h-5" />
            <span>Sort</span>
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-cardBg backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="font-semibold">Product</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Price</TableHead>
              <TableHead className="font-semibold">Stock</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow 
                key={product.id}
                className="group hover:bg-gray-50/50 transition-colors duration-200"
              >
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                    />
                    <span className="font-medium text-gray-300">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-400">
                  {product.category}
                </TableCell>
                <TableCell className="text-gray-400">
                  ${product.price.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">{product.inventory}</span>
                    {product.inventory < 10 && (
                      <span className="text-xs font-medium text-red-100 bg-red-900 px-2 py-0.5 rounded-full">
                        Low Stock
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium  ${
                    product.active 
                      ? 'bg-green-900 text-green-100 border-green-100'
                      : 'bg-gray-900 text-gray-100 border-gray-100'
                  }`}>
                    {product.active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover:bg-gray-100 p-2 rounded-lg"
                      onClick={() => handleView(product.id)}
                    >
                      <Eye className="w-4 h-4 text-gray-600 dark:text-gray-300 hover:dark:text-gray-600" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover:bg-blue-50 hover:dark:bg-blue-900   p-2 rounded-lg"
                      onClick={() => handleEdit(product.id)}
                    >
                      <Edit2 className="w-4 h-4 text-blue-600 hover:text-blue-100" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover:bg-red-50  hover:dark:bg-red-900 p-2 rounded-lg"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600 hover:dark:text-red-100" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center gap-6 mt-8">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
          <span className="font-medium">
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
          </span> of{' '}
          <span className="font-medium">{filteredProducts.length}</span> products
        </p>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className='border hover:bg-gray-200 text-gray-600 border-gray-600
            dark:hover:bg-gray-900 dark:hover:text-gray-100 dark:hover:border-gray-100'
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className='border hover:bg-green-200 text-green-600 border-green-600
            dark:hover:bg-green-900 dark:hover:text-green-100 dark:hover:border-green-100'
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && <AddProductModal />}
      {showFilters && <FilterModal />}
      {showViewModal && <ViewModal />}
      {showDeleteModal && <DeleteModal />}
    </div>
  );
};

export default ProductManagement;

