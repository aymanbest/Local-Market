import React, { useState, useEffect } from 'react';
import { mockProducerProducts } from '../mockData';
import { Plus, Pencil, Trash2, ArrowUpDown, Search, Filter, X, Upload, Edit2, MoreVertical, Eye } from 'lucide-react';
import Button from './ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/Table';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';

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
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
      <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 w-full max-w-md relative mx-4 shadow-xl border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Filter Products
          </h3>
          <Button 
            variant="ghost" 
            onClick={() => setShowFilters(false)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min Price</label>
              <input
                type="number"
                min="0"
                className="w-full p-2 border rounded"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Price</label>
              <input
                type="number"
                min="0"
                className="w-full p-2 border rounded"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min Inventory</label>
              <input
                type="number"
                min="0"
                className="w-full p-2 border rounded"
                value={filters.minInventory}
                onChange={(e) => setFilters({...filters, minInventory: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Inventory</label>
              <input
                type="number"
                min="0"
                className="w-full p-2 border rounded"
                value={filters.maxInventory}
                onChange={(e) => setFilters({...filters, maxInventory: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full p-2 border rounded"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <Button
              type="button"
              className="flex-1"
              variant="outline"
              onClick={() => {
                setFilters({
                  minPrice: '',
                  maxPrice: '',
                  minInventory: '',
                  maxInventory: '',
                  status: 'all'
                });
              }}
            >
              Reset
            </Button>
            <Button
              type="button"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setShowFilters(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // View Modal Component
  const ViewModal = () => (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
      <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 w-full max-w-md relative mx-4 shadow-xl border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Product Details
          </h3>
          <Button 
            variant="ghost" 
            onClick={() => setShowViewModal(false)}
            className="hover:bg-red-50 hover:text-red-600"
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
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{selectedProduct.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{selectedProduct.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-medium">${selectedProduct.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Inventory</p>
                <p className="font-medium">{selectedProduct.inventory}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium">{selectedProduct.description}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  selectedProduct.active 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
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
  const DeleteModal = () => (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
      <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 w-full max-w-md relative mx-4 shadow-xl border border-gray-100">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Confirm Delete</h3>
          <p className="text-gray-600">
            Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
          </p>
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-500 mt-1">Manage your product inventory and listings</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2 transform hover:scale-105 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
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
          onClick={() => handleSort('name')}
        >
          <ArrowUpDown className="w-5 h-5" />
          <span>Sort</span>
        </Button>
      </div>

      {/* Products Table */}
      <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
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
                    <span className="font-medium text-gray-900">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">
                  {product.category}
                </TableCell>
                <TableCell className="text-gray-600">
                  ${product.price.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">{product.inventory}</span>
                    {product.inventory < 10 && (
                      <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                        Low Stock
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.active 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
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
                      <Eye className="w-4 h-4 text-gray-600" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover:bg-blue-50 p-2 rounded-lg"
                      onClick={() => handleEdit(product.id)}
                    >
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover:bg-red-50 p-2 rounded-lg"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
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
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
          </span> of{' '}
          <span className="font-medium">{filteredProducts.length}</span> products
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

      {/* Modals */}
      {showAddModal && <AddProductModal />}
      {showFilters && <FilterModal />}
      {showViewModal && <ViewModal />}
      {showDeleteModal && <DeleteModal />}
    </div>
  );
};

export default ProductManagement;

