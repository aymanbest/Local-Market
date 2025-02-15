import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Plus, Pencil, Trash2, ArrowUpDown, Search, Filter, X, Upload, 
  Edit2, MoreVertical, Eye, ChevronLeft, ChevronRight, Package,
  TrendingUp, TrendingDown, Box, DollarSign, BarChart2, AlertTriangle, Check, Text,
  SlidersHorizontal
} from 'lucide-react';
import Button from '../../common/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../common/ui/Table';
import { Card, CardHeader, CardTitle, CardContent } from '../../common/ui/Card';
import { useTheme } from '../../../context/ThemeContext';
import { 
  fetchMyProducts, createProduct, updateProduct, resetCreateStatus, 
  resetUpdateStatus, deleteProduct, updateSorting, updatePagination 
} from '../../../store/slices/producer/producerProductsSlice';
import { fetchCategories } from '../../../store/slices/product/categorySlice';
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
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
  return `http://localhost:8080${imageUrl}`;
};

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error, createProductStatus, updateProductStatus, pagination, sorting } = useSelector(state => state.producerProducts);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    sorting: {
      sortBy: 'createdAt',
      direction: 'desc'
    }
  });

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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
      let aValue = a[tempFilters.sorting.sortBy];
      let bValue = b[tempFilters.sorting.sortBy];

      // Handle numeric fields
      if (tempFilters.sorting.sortBy === 'price' || tempFilters.sorting.sortBy === 'quantity') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (tempFilters.sorting.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(result);
  }, [searchTerm, filters, tempFilters.sorting.sortBy, tempFilters.sorting.direction, products]);

  useEffect(() => {
    dispatch(fetchMyProducts({
      page: pagination.currentPage,
      size: pagination.pageSize,
      sortBy: sorting.sortBy,
      direction: sorting.direction
    }));
  }, [dispatch, pagination.currentPage, sorting]);

  // Add debug logging
  useEffect(() => {
    console.log('Products from API:', products);
    console.log('Filtered Products:', filteredProducts);
    console.log('Loading State:', loading);
    console.log('Error State:', error);
  }, [products, filteredProducts, loading, error]);

  const handleSort = (field) => {
    if (tempFilters.sorting.sortBy === field) {
      // If clicking the same field, toggle the order
      setTempFilters(prev => ({
        ...prev,
        sorting: { ...prev.sorting, direction: prev.sorting.direction === 'asc' ? 'desc' : 'asc' }
      }));
    } else {
      // If clicking a new field, set it and default to ascending order
      setTempFilters(prev => ({
        ...prev,
        sorting: { ...prev.sorting, sortBy: field, direction: 'asc' }
      }));
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

  // Add PaginationControls component
  const PaginationControls = () => {
    if (!pagination || pagination.totalElements <= pagination.pageSize) {
      return null;
    }
    
    return (
      <div className="flex items-center justify-between py-4">
        <p className="text-sm text-textSecondary">
          Showing <span className="font-medium">{(pagination.currentPage) * (pagination.pageSize) + 1}</span> to{' '}
          <span className="font-medium">
            {Math.min((pagination.currentPage + 1) * (pagination.pageSize), pagination.totalElements)}
          </span> of{' '}
          <span className="font-medium">{pagination.totalElements}</span> products
        </p>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline"
            className="border-border hover:bg-cardBg"
            disabled={pagination.isFirst}
            onClick={() => {
              dispatch(fetchMyProducts({
                page: pagination.currentPage - 1,
                size: pagination.pageSize,
                sortBy: sorting.sortBy,
                direction: sorting.direction
              }));
            }}
          >
            Previous
          </Button>
          {Array.from({ length: pagination.totalPages }).map((_, index) => (
            <Button
              key={index}
              variant={index === pagination.currentPage ? "default" : "outline"}
              className={`${
                index === pagination.currentPage 
                  ? 'bg-primary text-white' 
                  : 'border hover:bg-cardBg text-text border-border'
              }`}
              onClick={() => {
                dispatch(fetchMyProducts({
                  page: index,
                  size: pagination.pageSize,
                  sortBy: sorting.sortBy,
                  direction: sorting.direction
                }));
              }}
            >
              {index + 1}
            </Button>
          ))}
          <Button 
            variant="outline"
            className="border-border hover:bg-cardBg"
            disabled={pagination.isLast}
            onClick={() => {
              dispatch(fetchMyProducts({
                page: pagination.currentPage + 1,
                size: pagination.pageSize,
                sortBy: sorting.sortBy,
                direction: sorting.direction
              }));
            }}
          >
            Next
          </Button>
        </div>
      </div>
    );
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
                          className="w-full hide-spinner pl-12 pr-4 py-3 rounded-xl border border-gray-200/50 dark:border-white/[0.05]
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
  const FilterModal = () => {
    const [localFilters, setLocalFilters] = useState(tempFilters);

    const sortingOptions = [
      { value: 'createdAt', label: 'Creation Date' },
      { value: 'updatedAt', label: 'Last Updated' },
      { value: 'name', label: 'Product Name' },
      { value: 'price', label: 'Price' },
      { value: 'quantity', label: 'Stock Quantity' }
    ];

    useEffect(() => {
      setLocalFilters(tempFilters);
    }, [showFiltersModal]);

    const handleApplyFilters = () => {
      dispatch(updateSorting(localFilters.sorting));
      setTempFilters(localFilters);
      setShowFiltersModal(false);
    };

    const handleResetFilters = () => {
      const resetFilters = {
        sorting: {
          sortBy: 'createdAt',
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
                Sort Products
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
                  <span className=" text-text font-semibold">${selectedProduct.price.toFixed(2)}</span>
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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-cardBg border border-border rounded-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-text">Product Management</h2>
            <p className="text-textSecondary mt-1">Manage and track your product inventory</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl bg-inputBg border border-border text-text placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
              />
            </div>
            <button 
              onClick={() => setShowFiltersModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-text hover:border-primary hover:text-primary transition-all duration-200"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Sort</span>
            </button>
            <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Product
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[
          { 
            label: 'Total Products', 
            value: totalProducts, 
            icon: Package,
            gradient: 'from-blue-500/30 via-blue-500/20 to-transparent'
          },
          { 
            label: 'Inventory Value', 
            value: `$${totalValue.toFixed(2)}`, 
            icon: DollarSign,
            gradient: 'from-green-500/30 via-green-500/20 to-transparent'
          },
          { 
            label: 'Low Stock', 
            value: lowStockProducts, 
            icon: Box,
            gradient: 'from-amber-500/30 via-amber-500/20 to-transparent'
          },
          { 
            label: 'Pending Review', 
            value: pendingProducts, 
            icon: AlertTriangle,
            gradient: 'from-yellow-500/30 via-yellow-500/20 to-transparent'
          }
        ].map((stat, index) => (
          <div key={index} className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-90 dark:opacity-60 group-hover:opacity-100 transition-opacity duration-300 rounded-xl`} />
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

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-8">
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-cardBg border border-border rounded-2xl p-12 text-center">
          <Package className="w-16 h-16 text-textSecondary mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-text mb-2">No Products Yet</h3>
          <p className="text-textSecondary mb-6">Start adding your products to your inventory.</p>
          <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 mx-auto">
            <Plus className="w-5 h-5" />
            Add Your First Product
          </Button>
        </div>
      ) : (
        <>
          <Card className="bg-white dark:bg-[#1a1f1c] p-0 overflow-hidden">
            <div className="w-full h-full bg-white dark:bg-[#1a1f1c]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.productId} className="hover:bg-cardHoverBg transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-border">
                            <img
                              src={getFullImageUrl(product.imageUrl)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-text">{product.name}</h4>
                            <p className="text-text font-semibold text-text">${product.price.toFixed(2)}</p>
                            <p className="text-xs text-textSecondary">Stock: {product.quantity}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.categories.map((category) => (
                            <span
                              key={category.categoryId}
                              className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                            >
                              {category.name}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-textSecondary" />
                          <span className="font-medium text-text">{product.price.toFixed(2)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            product.quantity === 0 
                              ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300' 
                              : product.quantity < 10 
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300'
                                : 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300'
                          }`}>
                            {product.quantity}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={product.status} declineReason={product.declineReason} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(product.productId)}
                            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4 text-textSecondary hover:text-primary" />
                          </button>
                          <button
                            onClick={() => handleEdit(product.productId)}
                            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4 text-textSecondary hover:text-primary" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.productId)}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-textSecondary hover:text-red-500" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
          <PaginationControls />
        </>
      )}

      <FilterModal />
      {showAddModal && <AddProductModal />}
      {showViewModal && <ViewModal />}
      {showDeleteModal && <DeleteModal />}
    </div>
  );
};

export default ProductManagement;

