import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Plus, Pencil, Trash2, ArrowUpDown, Search, Filter, X, Upload, 
  Edit2, MoreVertical, Eye, ChevronLeft, ChevronRight, Package,
  TrendingUp, TrendingDown, Box, DollarSign, BarChart2, AlertTriangle, Check, Text
} from 'lucide-react';
import Button from '../ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useTheme } from '../../context/ThemeContext';
import { fetchMyProducts, createProduct, updateProduct, resetCreateStatus, resetUpdateStatus, deleteProduct } from '../../store/slices/producerProductsSlice';
import { fetchCategories } from '../../store/slices/categorySlice';
// import { //toast } from 'react-hot-//toast';

const StatusBadge = ({ status = 'PENDING', declineReason }) => {
  const getStatusStyles = () => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'APPROVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'DECLINED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles()}`}>
        {status ? status.charAt(0) + status.slice(1).toLowerCase() : 'Pending'}
      </span>
      {status === 'DECLINED' && declineReason && (
        <div className="relative group">
          <AlertTriangle className="w-4 h-4 text-red-500 cursor-help" />
          <div className="absolute z-20 bottom-full left-0 mb-2 w-72 p-4 bg-red-50 dark:bg-red-950 
                       rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 
                       group-hover:visible transition-all duration-200 pointer-events-none
                       border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-800 dark:text-red-200 mb-1">
                  Decline Reason
                </p>
                <p className="text-sm text-red-600 dark:text-red-300">
                  {declineReason}
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 left-4 w-2 h-2 bg-red-50 dark:bg-red-950 
                          border-b border-r border-red-200 dark:border-red-800 
                          transform translate-y-1 rotate-45" />
          </div>
        </div>
      )}
    </div>
  );
};

const getFullImageUrl = (imageUrl) => {
  if (!imageUrl) return 'https://placehold.co/600x400?text=No+Image';
  return imageUrl.startsWith('http') ? imageUrl : `http://localhost:8080${imageUrl}`;
};

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error, createProductStatus, updateProductStatus } = useSelector(state => state.producerProducts);
  const [filteredProducts, setFilteredProducts] = useState([]);
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
    description: '',
    price: '',
    quantity: '',
    categoryIds: [],
    image: null,
    imageUrl: ''
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
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const lowStockProducts = products.filter(p => p.quantity < 10).length;
  const pendingProducts = products.filter(p => p.status === 'PENDING').length;


  // Add this state
  const categories = useSelector((state) => state.categories.categories);
  
  // Add this useEffect to fetch categories when component mounts
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Add this state at the top of ProductManagement component
  const [showSortModal, setShowSortModal] = useState(false);

  // Handle Search
  useEffect(() => {
    let result = [...products]; // Create a new array
    
    // Search
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filters
    if (filters.minPrice) result = result.filter(p => p.price >= Number(filters.minPrice));
    if (filters.maxPrice) result = result.filter(p => p.price <= Number(filters.maxPrice));
    if (filters.minInventory) result = result.filter(p => p.quantity >= Number(filters.minInventory));
    if (filters.maxInventory) result = result.filter(p => p.quantity <= Number(filters.maxInventory));
    if (filters.status !== 'all') result = result.filter(p => p.status === filters.status);

    // Sort
    result = [...result].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle numeric fields
      if (sortField === 'price' || sortField === 'quantity') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
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
    if (sortField === field) {
      // If clicking the same field, toggle the order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking a new field, set it and default to ascending order
      setSortField(field);
      setSortOrder('asc');
    }
  };


  const handleView = (productId) => {
    const product = products.find(p => p.productId === productId);
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleEdit = (productId) => {
    const product = products.find(p => p.productId === productId);
    setSelectedProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      categoryIds: product.categories.map(c => c.categoryId),
      imageUrl: product.imageUrl,
      image: null
    });
    setShowAddModal(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateProduct({
      productId: selectedProduct.productId,
      productData: newProduct
    }));
  };

  const handleDelete = (productId) => {
    const product = products.find(p => p.productId === productId);
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  // Add Product Modal
  const AddProductModal = () => {
    // Add local state for the form
    const [localProduct, setLocalProduct] = useState(newProduct);

    // Sync with parent state when modal opens
    useEffect(() => {
      setLocalProduct(newProduct);
    }, [showAddModal]);

    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Validate form data
      if (!localProduct.name || !localProduct.description || !localProduct.price || !localProduct.quantity) {
        return;
      }

      // Create the product data object
      const productData = {
        name: localProduct.name,
        description: localProduct.description,
        price: localProduct.price,
        quantity: localProduct.quantity,
        categoryIds: localProduct.categoryIds,
        image: localProduct.image,
        imageUrl: localProduct.imageUrl
      };

      if (selectedProduct) {
        dispatch(updateProduct({
          productId: selectedProduct.productId,
          productData: productData
        }));
      } else {
        dispatch(createProduct(productData));
      }
      
      setShowAddModal(false);
      setSelectedProduct(null);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        quantity: '',
        categoryIds: [],
        image: null,
        imageUrl: ''
      });
    };

    const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Check file type
        if (!file.type.startsWith('image/')) {
          // You might want to add error handling/display here
          console.error('Please upload an image file');
          return;
        }

        // Check file size (e.g., 5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
          // You might want to add error handling/display here
          console.error('File size should be less than 5MB');
          return;
        }

        // Create a preview URL
        const previewUrl = URL.createObjectURL(file);
        
        setLocalProduct(prev => ({
          ...prev,
          image: file,
          imageUrl: previewUrl
        }));
      }
    };

    // Clean up the preview URL when the component unmounts
    useEffect(() => {
      return () => {
        if (localProduct.imageUrl && localProduct.image) {
          URL.revokeObjectURL(localProduct.imageUrl);
        }
      };
    }, []);

    // Add cleanup when modal closes
    useEffect(() => {
      if (!showAddModal) {
        // Clean up any existing preview URL
        if (localProduct.imageUrl && localProduct.image) {
          URL.revokeObjectURL(localProduct.imageUrl);
        }
        setLocalProduct(newProduct);
      }
    }, [showAddModal]);

    return (
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
        <div className="relative bg-white dark:bg-[#1E1E1E] rounded-3xl w-full max-w-5xl mx-auto
                      shadow-[0_0_40px_rgba(0,0,0,0.2)] border border-gray-200/10 dark:border-white/[0.05]
                      max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200/10 dark:border-white/[0.05] flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Fill in the details for your product
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 sm:p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.05] 
                         text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white 
                         transition-all duration-200"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Product Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      value={localProduct.name}
                      onChange={(e) => setLocalProduct(prev => ({...prev, name: e.target.value}))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200/50 dark:border-white/[0.05]
                               bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-primary focus:border-transparent
                               placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Enter product name"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      required
                      rows="4"
                      value={localProduct.description}
                      onChange={(e) => setLocalProduct(prev => ({...prev, description: e.target.value}))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200/50 dark:border-white/[0.05]
                               bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-primary focus:border-transparent
                               placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                      placeholder="Enter product description"
                    />
                  </div>

                  {/* Price and Quantity */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Price ($)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={localProduct.price}
                          onChange={(e) => setLocalProduct(prev => ({...prev, price: e.target.value}))}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200/50 dark:border-white/[0.05]
                                   bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-white
                                   focus:ring-2 focus:ring-primary focus:border-transparent
                                   placeholder-gray-500 dark:placeholder-gray-400"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Quantity
                      </label>
                      <div className="relative">
                        <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          required
                          min="0"
                          value={localProduct.quantity}
                          onChange={(e) => setLocalProduct(prev => ({...prev, quantity: e.target.value}))}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200/50 dark:border-white/[0.05]
                                   bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-white
                                   focus:ring-2 focus:ring-primary focus:border-transparent
                                   placeholder-gray-500 dark:placeholder-gray-400"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Categories */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Categories
                    </label>
                    <select
                      multiple
                      value={localProduct.categoryIds || []}
                      onChange={(e) => {
                        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                        setLocalProduct(prev => ({...prev, categoryIds: selectedOptions}));
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200/50 dark:border-white/[0.05]
                               bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px]"
                    >
                      {categories.map((category) => (
                        <option key={category.categoryId} value={category.categoryId}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Hold Ctrl (Cmd on Mac) to select multiple categories
                    </p>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Product Image
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={localProduct.imageUrl}
                          onChange={(e) => setLocalProduct(prev => ({...prev, imageUrl: e.target.value}))}
                          className="flex-1 px-4 py-3 rounded-xl border border-gray-200/50 dark:border-white/[0.05]
                                   bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-white
                                   focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter image URL"
                        />
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="inline-flex items-center justify-center p-3 border border-gray-200/50 
                                     dark:border-white/[0.05] rounded-xl cursor-pointer
                                     bg-gray-50 dark:bg-white/[0.03] hover:bg-gray-100 
                                     dark:hover:bg-white/[0.08] transition-colors duration-200"
                          >
                            <Upload className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          </label>
                        </div>
                      </div>

                      {/* Image Preview */}
                      {localProduct.imageUrl && (
                        <div className="relative group rounded-xl overflow-hidden">
                          <img
                            src={localProduct.imageUrl}
                            alt="Product preview"
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/600x400?text=Image+Not+Found';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                                        transition-opacity duration-200 flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => setLocalProduct(prev => ({
                                ...prev,
                                image: null,
                                imageUrl: ''
                              }))}
                              className="p-2 bg-red-600/90 rounded-full hover:bg-red-700 
                                       transition-colors duration-200"
                            >
                              <X className="w-5 h-5 text-white" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-8 py-4 sm:py-6 border-t border-gray-200/10 dark:border-white/[0.05] 
                        bg-gray-50 dark:bg-[#1E1E1E] flex flex-col sm:flex-row gap-3 sm:justify-end flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                setSelectedProduct(null);
                setNewProduct({
                  name: '',
                  description: '',
                  price: '',
                  quantity: '',
                  categoryIds: [],
                  image: null,
                  imageUrl: ''
                });
              }}
              className="w-full sm:w-auto border-gray-300 dark:border-gray-700 hover:bg-gray-100 
                       dark:hover:bg-white/[0.05] text-gray-700 dark:text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="w-full sm:w-auto bg-primary hover:bg-primaryHover text-white"
            >
              {selectedProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Filter Modal Component
  const FilterModal = ({ isOpen, onClose, filters, setFilters }) => {
    const [tempFilters, setTempFilters] = useState(filters);

    const handleApply = () => {
      setFilters(tempFilters);
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
        <div className="relative bg-white dark:bg-[#1E1E1E] rounded-3xl w-full max-w-md mx-auto
                        shadow-[0_0_40px_rgba(0,0,0,0.2)] border border-gray-200/10 dark:border-white/[0.05]
                        max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200/10 dark:border-white/[0.05]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Filter Products
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Narrow down your product list
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 sm:p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.05] text-gray-500 dark:text-gray-400
                           hover:text-gray-700 dark:hover:text-white transition-all duration-200"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
            {/* Price Range */}
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-xs sm:text-sm font-medium text-gray-300">
                Min Price
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="number"
                  placeholder="Min"
                  value={tempFilters.minPrice}
                  onChange={(e) => setTempFilters({ ...tempFilters, minPrice: e.target.value })}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 rounded-xl border border-white/[0.05]
                           bg-white/[0.03] placeholder-gray-500 text-gray-200 text-sm sm:text-base
                           focus:bg-white/[0.08] focus:border-white/[0.08] focus:outline-none
                           transition-all duration-200"
                />
              </div>
            </div>

            {/* Max Price */}
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-xs sm:text-sm font-medium text-gray-300">
                Max Price
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="number"
                  placeholder="Max"
                  value={tempFilters.maxPrice}
                  onChange={(e) => setTempFilters({ ...tempFilters, maxPrice: e.target.value })}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 rounded-xl border border-white/[0.05]
                           bg-white/[0.03] placeholder-gray-500 text-gray-200 text-sm sm:text-base
                           focus:bg-white/[0.08] focus:border-white/[0.08] focus:outline-none
                           transition-all duration-200"
                />
              </div>
            </div>

            {/* Min Stock */}
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-xs sm:text-sm font-medium text-gray-300">
                Min Stock
              </label>
              <div className="relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="number"
                  placeholder="Min"
                  value={tempFilters.minInventory}
                  onChange={(e) => setTempFilters({ ...tempFilters, minInventory: e.target.value })}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 rounded-xl border border-white/[0.05]
                           bg-white/[0.03] placeholder-gray-500 text-gray-200 text-sm sm:text-base
                           focus:bg-white/[0.08] focus:border-white/[0.08] focus:outline-none
                           transition-all duration-200"
                />
              </div>
            </div>

            {/* Max Stock */}
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-xs sm:text-sm font-medium text-gray-300">
                Max Stock
              </label>
              <div className="relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="number"
                  placeholder="Max"
                  value={tempFilters.maxInventory}
                  onChange={(e) => setTempFilters({ ...tempFilters, maxInventory: e.target.value })}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 rounded-xl border border-white/[0.05]
                           bg-white/[0.03] placeholder-gray-500 text-gray-200 text-sm sm:text-base
                           focus:bg-white/[0.08] focus:border-white/[0.08] focus:outline-none
                           transition-all duration-200"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-xs sm:text-sm font-medium text-gray-300">
                Status
              </label>
              <select
                value={tempFilters.status}
                onChange={(e) => setTempFilters({ ...tempFilters, status: e.target.value })}
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-white/[0.05]
                           bg-white/[0.03] text-gray-200 text-sm sm:text-base
                           focus:bg-white/[0.08] focus:border-white/[0.08] focus:outline-none
                           transition-all duration-200"
              >
                <option value="all" className="bg-gray-900 py-2">All Statuses</option>
                <option value="PENDING" className="bg-gray-900 py-2">Pending</option>
                <option value="APPROVED" className="bg-gray-900 py-2">Approved</option>
                <option value="DECLINED" className="bg-gray-900 py-2">Declined</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-8 py-4 sm:py-6 border-t border-gray-200/10 dark:border-white/[0.05] 
                          bg-gray-50 dark:bg-[#1E1E1E] rounded-b-3xl flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setTempFilters({
                  minPrice: '',
                  maxPrice: '',
                  minInventory: '',
                  maxInventory: '',
                  status: 'all'
                });
              }}
              className="w-full sm:w-auto border-gray-200 dark:border-white/[0.05] text-gray-700 dark:text-gray-300 
                       hover:bg-gray-100 dark:hover:bg-white/[0.05] hover:text-gray-900 dark:hover:text-white 
                       transition-all duration-200"
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              className="w-full sm:w-auto bg-primary hover:bg-primaryHover text-white transition-all duration-200"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Sort Modal Component
  const SortModal = ({ isOpen, onClose, currentSort, currentOrder, onSort }) => {
    const sortOptions = [
      { field: 'name', order: 'asc', label: 'Name (A-Z)', icon: Text },
      { field: 'name', order: 'desc', label: 'Name (Z-A)', icon: Text },
      { field: 'price', order: 'asc', label: 'Price (Low to High)', icon: DollarSign },
      { field: 'price', order: 'desc', label: 'Price (High to Low)', icon: DollarSign },
      { field: 'quantity', order: 'asc', label: 'Stock (Low to High)', icon: Package },
      { field: 'quantity', order: 'desc', label: 'Stock (High to Low)', icon: Package }
    ];

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
        <div className="relative bg-white dark:bg-[#1E1E1E] rounded-3xl w-full max-w-md mx-auto
                        shadow-[0_0_40px_rgba(0,0,0,0.2)] border border-gray-200/10 dark:border-white/[0.05]
                        max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200/10 dark:border-white/[0.05]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Sort Products
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Choose how you want to sort your products
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 sm:p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.05] text-gray-500 dark:text-gray-400
                           hover:text-gray-700 dark:hover:text-white transition-all duration-200"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-8 py-4 sm:py-6 space-y-3 sm:space-y-4">
            {sortOptions.map((option) => {
              const Icon = option.icon;
              const isActive = currentSort === option.field && currentOrder === option.order;
              return (
                <button
                  key={`${option.field}-${option.order}`}
                  onClick={() => onSort(option.field, option.order)}
                  className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-200
                             bg-gray-50 dark:bg-white/[0.03] hover:bg-gray-100 dark:hover:bg-white/[0.08] 
                             border border-gray-200/50 dark:border-white/[0.05]
                             group"
                >
                  <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-gray-100 dark:bg-white/[0.05] 
                                group-hover:bg-gray-200 dark:group-hover:bg-white/[0.08]
                                transition-colors duration-200">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white" />
                  </div>
                  <span className="flex-1 text-left text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 
                                group-hover:text-gray-900 dark:group-hover:text-white">
                    {option.label}
                  </span>
                  {isActive && (
                    <div className="p-1 sm:p-1.5 rounded-full bg-primary/10">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-8 py-4 sm:py-6 border-t border-gray-200/10 dark:border-white/[0.05] 
                          bg-gray-50 dark:bg-[#1E1E1E] rounded-b-3xl flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button
              onClick={onClose}
              className="w-full sm:w-auto border border-gray-200 dark:border-white/[0.05] text-gray-700 dark:text-gray-300 
                       hover:bg-gray-100 dark:hover:bg-white/[0.05] hover:text-gray-900 dark:hover:text-white 
                       transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              onClick={onClose}
              className="w-full sm:w-auto bg-primary hover:bg-primaryHover text-white transition-all duration-200"
            >
              Apply Sort
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // View Modal Component
  const ViewModal = () => (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowViewModal(false)} />
      <div className="relative bg-white dark:bg-[#1E1E1E] rounded-3xl w-full max-w-lg mx-auto
                      shadow-[0_0_40px_rgba(0,0,0,0.2)] border border-gray-200/10 dark:border-white/[0.05]
                      max-h-[90vh] overflow-hidden">
        {selectedProduct && (
          <>
            {/* Hero Section with Image */}
            <div className="relative h-64 sm:h-72">
              <div className="absolute inset-0">
                <img 
                  src={getFullImageUrl(selectedProduct.imageUrl)} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => setShowViewModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 
                          backdrop-blur-md text-white/80 hover:text-white transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Product Status */}
              <div className="absolute top-4 left-4">
                <StatusBadge 
                  status={selectedProduct.status || 'PENDING'} 
                  declineReason={selectedProduct.declineReason}
                />
              </div>

              {/* Product Title & Price */}
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {selectedProduct.name}
                </h3>
                <div className="flex items-center gap-2 text-white/90">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-lg font-semibold">${selectedProduct.price.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-white/[0.03] rounded-2xl p-4 border border-gray-200/10 dark:border-white/[0.05]
                              transform hover:scale-105 transition-transform duration-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10">
                      <Package className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Stock Level</p>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {selectedProduct.quantity}
                        </p>
                        <span className={`text-sm px-2 py-0.5 rounded-full ${
                          selectedProduct.quantity === 0 
                            ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300' 
                            : selectedProduct.quantity < 10 
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300'
                              : 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300'
                        }`}>
                          {selectedProduct.quantity === 0 
                            ? 'Out of Stock' 
                            : selectedProduct.quantity < 10 
                              ? 'Low Stock'
                              : 'In Stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-white/[0.03] rounded-2xl p-4 border border-gray-200/10 dark:border-white/[0.05]
                              transform hover:scale-105 transition-transform duration-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/10">
                      <BarChart2 className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        ${(selectedProduct.price * selectedProduct.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.categories.map(c => (
                    <span 
                      key={c.categoryId} 
                      className="px-3 py-1.5 bg-primary/5 dark:bg-primary/10 text-primary rounded-full text-sm font-medium
                                border border-primary/10 hover:bg-primary/10 dark:hover:bg-primary/20 
                                transition-colors duration-200 cursor-default"
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Description</h4>
                <div className="bg-gray-50 dark:bg-white/[0.03] rounded-2xl p-4 border border-gray-200/10 dark:border-white/[0.05]">
                  <p className="text-gray-900 dark:text-gray-100 text-sm leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="pt-4 border-t border-gray-200/10 dark:border-white/[0.05] flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Product ID: #{selectedProduct.productId}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Last Updated: {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowViewModal(false);
                      handleEdit(selectedProduct.productId);
                    }}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 
                             dark:text-gray-400 dark:hover:bg-primary/20 rounded-lg transition-all duration-200"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowViewModal(false);
                      handleDelete(selectedProduct.productId);
                    }}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 
                             dark:text-gray-400 dark:hover:bg-red-500/20 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Delete Confirmation Modal
  const DeleteModal = () => (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
      <div className="relative bg-gray-800/90 backdrop-blur-md rounded-lg w-full max-w-md mx-auto
                      shadow-xl border border-gray-700 max-h-[90vh] overflow-y-auto p-4">
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-200">Confirm Delete</h3>
          
          <p className="text-sm sm:text-base text-gray-400">
            Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <Button
              variant="outline"
              className="w-full sm:flex-1 border-gray-500 text-gray-300 hover:bg-gray-700 hover:border-gray-400"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:flex-1 bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                dispatch(deleteProduct(selectedProduct.productId));
                setShowDeleteModal(false);
                setSelectedProduct(null);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
  

  useEffect(() => {
    dispatch(fetchMyProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-600">
        <AlertTriangle className="w-6 h-6 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/2 to-transparent 
                      dark:from-primary/10 dark:via-primary/5 dark:to-transparent rounded-3xl border border-border">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-white/0 
                        dark:from-black/50 dark:to-black/0" />
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob" />
            <div className="absolute -bottom-1/2 -right-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
          </div>
          
          {/* Content */}
          <div className="relative p-6 sm:p-8 md:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              {/* Left Side */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/0 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                    <div className="relative p-2.5 sm:p-3 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-white/20 group-hover:border-white/40 transition-all duration-300">
                      <Package className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold 
                                bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700
                                dark:from-white dark:via-gray-100 dark:to-gray-200
                                bg-clip-text text-transparent">
                      Product Management
                    </h2>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary/50 to-primary/0" />
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-lg pl-4
                             transform hover:-translate-y-0.5 transition-transform duration-300">
                    Streamline your inventory management with powerful tools for tracking, analyzing, 
                    and optimizing your product portfolio.
                  </p>
                </div>
              </div>

              {/* Right Side */}
              <div className="w-full sm:w-auto">
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="w-full sm:w-auto group relative overflow-hidden px-6 py-3
                           bg-primary hover:bg-primary-dark text-white rounded-xl
                           transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-0.5
                           shadow-lg hover:shadow-xl hover:shadow-primary/25
                           flex items-center justify-center gap-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0
                                translate-x-[-100%] group-hover:translate-x-[100%] 
                                transition-transform duration-1000" />
                  <div className="relative flex items-center gap-2">
                    <span className="relative flex h-8 w-8 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
                      <Plus className="w-5 h-5 relative" />
                    </span>
                    <span className="font-medium">Add Product</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[
            { 
              label: 'Total Products', 
              value: totalProducts, 
              icon: Package,
              gradient: 'from-blue-500/10 via-blue-500/5 to-transparent'
            },
            { 
              label: 'Inventory Value', 
              value: `$${totalValue.toFixed(2)}`, 
              icon: DollarSign,
              gradient: 'from-green-500/10 via-green-500/5 to-transparent'
            },
            { 
              label: 'Low Stock', 
              value: lowStockProducts, 
              icon: Box,
              gradient: 'from-amber-500/10 via-amber-500/5 to-transparent'
            },
            { 
              label: 'Pending Review', 
              value: pendingProducts, 
              icon: AlertTriangle,
              gradient: 'from-yellow-500/10 via-yellow-500/5 to-transparent'
            }
          ].map((stat, index) => (
            <div key={index} className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300 rounded-xl`} />
              <div className="relative p-3 sm:p-6 rounded-xl border border-border bg-cardBg/95">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-textSecondary">{stat.label}</p>
                    <p className="text-lg sm:text-2xl font-bold text-text mt-1">{stat.value}</p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-xl bg-primary/10">
                    <stat.icon className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-textSecondary" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-inputBg text-text placeholder-textSecondary focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            />
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => setShowFilters(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 border-border hover:bg-primary hover:text-white transition-all duration-300"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSortModal(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 border-border hover:bg-primary hover:text-white transition-all duration-300"
            >
              <ArrowUpDown className="w-5 h-5" />
              <span>Sort</span>
            </Button>
          </div>
        </div>

        {/* Products Table - Mobile View */}
        <div className="block sm:hidden">
          {paginatedProducts.map((product) => (
            <div 
              key={product.productId}
              className="mb-4 bg-white dark:bg-cardBg rounded-xl border border-border p-4 space-y-4"
            >
              <div className="flex items-center gap-4">
                <img 
                  src={getFullImageUrl(product.imageUrl)} 
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100 dark:border-border/50"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-text">{product.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-textSecondary">ID: #{product.productId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-textSecondary">Price</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <DollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="font-semibold text-gray-900 dark:text-text">
                      {product.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-textSecondary">Stock</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${
                      product.quantity === 0 
                        ? 'bg-red-500' 
                        : product.quantity < 10 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      product.quantity === 0 
                        ? 'text-red-500 dark:text-red-400' 
                        : product.quantity < 10 
                          ? 'text-yellow-500 dark:text-yellow-400'
                          : 'text-green-500 dark:text-green-400'
                    }`}>
                      {product.quantity} units
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-textSecondary mb-2">Categories</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.categories.map(c => (
                    <span 
                      key={c.categoryId} 
                      className="px-2.5 py-1 bg-primary/10 dark:bg-primary/20 rounded-full text-xs font-medium text-primary border border-primary/20"
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-textSecondary mb-2">Status</p>
                <StatusBadge status={product.status} declineReason={product.declineReason} />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={() => handleView(product.productId)}
                  className="flex-1 p-2 text-gray-500 hover:text-primary hover:bg-primary/10 
                           dark:text-textSecondary dark:hover:bg-primary/20 rounded-lg transition-all duration-200"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleEdit(product.productId)}
                  className="flex-1 p-2 text-gray-500 hover:text-primary hover:bg-primary/10 
                           dark:text-textSecondary dark:hover:bg-primary/20 rounded-lg transition-all duration-200"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(product.productId)}
                  className="flex-1 p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 
                           dark:text-textSecondary dark:hover:bg-red-500/20 rounded-lg transition-all duration-200"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </div>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Products Table - Desktop View */}
        <div className="hidden sm:block relative overflow-hidden rounded-xl border border-border bg-white dark:bg-cardBg shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-gray-50/80 dark:bg-background/50">
                <TableHead className="font-medium text-sm text-gray-600 dark:text-textSecondary py-5 pl-6">
                  <div className="flex items-center gap-2">
                    Product
                    <button 
                      type="button"
                      onClick={() => handleSort('name')} 
                      className="p-1 hover:text-primary transition-colors duration-200 cursor-pointer"
                    >
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </div>
                </TableHead>
                <TableHead className="font-medium text-sm text-gray-600 dark:text-textSecondary">Categories</TableHead>
                <TableHead className="font-medium text-sm text-gray-600 dark:text-textSecondary">
                  <div className="flex items-center gap-2">
                    Price
                    <button 
                      type="button"
                      onClick={() => handleSort('price')} 
                      className="p-1 hover:text-primary transition-colors duration-200 cursor-pointer"
                    >
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </div>
                </TableHead>
                <TableHead className="font-medium text-sm text-gray-600 dark:text-textSecondary">
                  <div className="flex items-center gap-2">
                    Stock
                    <button 
                      type="button"
                      onClick={() => handleSort('quantity')} 
                      className="p-1 hover:text-primary transition-colors duration-200 cursor-pointer"
                    >
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </div>
                </TableHead>
                <TableHead className="font-medium text-sm text-gray-600 dark:text-textSecondary">Status</TableHead>
                <TableHead className="font-medium text-sm text-gray-600 dark:text-textSecondary text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow 
                  key={product.productId}
                  className="group border-border transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-primary/10"
                >
                  <TableCell className="py-4 pl-6">
                    <div className="flex items-center gap-4">
                      <div className="relative group/image">
                        <img 
                          src={getFullImageUrl(product.imageUrl)} 
                          alt={product.name}
                          className="w-14 h-14 rounded-xl object-cover border-2 border-gray-100 dark:border-border/50 group-hover:border-primary/50 transition-colors duration-200 shadow-sm"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-xl opacity-0 group-hover/image:opacity-100 transition-opacity duration-200" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-text group-hover:text-primary transition-colors duration-200">
                          {product.name}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-textSecondary">
                          ID: #{product.productId}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                      {product.categories.map(c => (
                        <span 
                          key={c.categoryId} 
                          className="px-2.5 py-1 bg-primary/10 dark:bg-primary/20 rounded-full text-xs font-medium text-primary border border-primary/20 hover:border-primary/40 transition-colors duration-200"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="font-semibold text-gray-900 dark:text-text">
                        {product.price.toFixed(2)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        product.quantity === 0 
                          ? 'bg-red-500' 
                          : product.quantity < 10 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        product.quantity === 0 
                          ? 'text-red-500 dark:text-red-400' 
                          : product.quantity < 10 
                            ? 'text-yellow-500 dark:text-yellow-400'
                            : 'text-green-500 dark:text-green-400'
                      }`}>
                        {product.quantity} units
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={product.status} declineReason={product.declineReason} />
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => handleView(product.productId)}
                        className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 
                                 dark:text-textSecondary dark:hover:bg-primary/20 rounded-lg transition-all duration-200"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleEdit(product.productId)}
                        className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 
                                 dark:text-textSecondary dark:hover:bg-primary/20 rounded-lg transition-all duration-200"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(product.productId)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 
                                 dark:text-textSecondary dark:hover:bg-red-500/20 rounded-lg transition-all duration-200"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {filteredProducts.length > itemsPerPage && (
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="border-border hover:bg-primary hover:text-white transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <span className="text-sm sm:text-base text-textSecondary">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="border-border hover:bg-primary hover:text-white transition-all duration-300"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && <AddProductModal />}
      {showFilters && <FilterModal isOpen={showFilters} onClose={() => setShowFilters(false)} filters={filters} setFilters={setFilters} />}
      {showViewModal && <ViewModal />}
      {showDeleteModal && <DeleteModal />}
      {showSortModal && (
        <SortModal
          isOpen={showSortModal}
          onClose={() => setShowSortModal(false)}
          currentSort={sortField}
          currentOrder={sortOrder}
          onSort={(field, order) => {
            setSortField(field);
            setSortOrder(order);
          }}
        />
      )}
    </div>
  );
};

export default ProductManagement;

