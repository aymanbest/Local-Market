import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Plus, Pencil, Trash2, Package, Search, X, 
  AlertCircle, Check, FolderOpen, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { 
  fetchCategories, createCategory, updateCategory, 
  deleteCategory, fetchProductsByCategory, resetStatus 
} from '../../../store/slices/product/categorySlice';
import Button from '../../common/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../common/ui/Table';
import { useTheme } from '../../../context/ThemeContext';

const CategoriesManagement = () => {
  const dispatch = useDispatch();
  const { categories, status, error, currentCategoryProducts, pagination } = useSelector((state) => state.categories);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [showPurgeOption, setShowPurgeOption] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const { isDark } = useTheme();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCategory) {
      await dispatch(updateCategory({
        categoryId: selectedCategory.categoryId,
        categoryData: { name: categoryName }
      }));
    } else {
      await dispatch(createCategory({ name: categoryName }));
    }
    setShowAddModal(false);
    setCategoryName('');
    setSelectedCategory(null);
    dispatch(resetStatus());
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setShowAddModal(true);
  };

  const handleDelete = async (categoryId) => {
    setCategoryToDelete(categoryId);
    setShowDeleteModal(true);
    setDeleteError(null);
    setShowPurgeOption(false);
  };

  const confirmDelete = async (purge = false) => {
    const result = await dispatch(deleteCategory({ categoryId: categoryToDelete, purge }));
    if (deleteCategory.fulfilled.match(result)) {
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      setDeleteError(null);
      setShowPurgeOption(false);
      dispatch(resetStatus());
    } else if (result.payload?.code === 'RESOURCE_IN_USE') {
      setDeleteError(result.payload.message);
      setShowPurgeOption(true);
    }
  };

  const handleViewProducts = async (category, page = 0) => {
    setSelectedCategory(category);
    setCurrentPage(page);
    await dispatch(fetchProductsByCategory({
      categoryId: category.categoryId,
      page: page,
      size: 8,
      sortBy: 'name',
      direction: 'asc'
    }));
    setShowProductsModal(true);
  };

  const handlePageChange = (newPage) => {
    handleViewProducts(selectedCategory, newPage);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen p-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-3xl font-bold ${
              isDark ? 'text-text' : 'text-gray-900'
            }`}>Categories Management</h1>
            <p className={`mt-2 ${
              isDark ? 'text-textSecondary' : 'text-gray-600'
            }`}>Manage product categories</p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-primaryHover text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
            isDark ? 'text-textSecondary' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              isDark 
                ? 'border-border bg-background text-text' 
                : 'border-gray-200 bg-white text-gray-900'
            } focus:ring-2 focus:ring-primary focus:border-transparent`}
          />
        </div>

        {/* Categories Table */}
        <div className={`rounded-xl border overflow-hidden ${
          isDark 
            ? 'bg-cardBg border-border' 
            : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead>Products Count (Approved)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.categoryId}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.productCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewProducts(category)}
                        className="text-primary hover:text-primary/80"
                      >
                        <Package className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(category)}
                        className="text-amber-500 hover:text-amber-600"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.categoryId)}
                        className="text-red-500 hover:text-red-600"
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

        {/* Add/Edit Category Modal */}
        {showAddModal && (
          <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-[9999]">
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-80"></div>
            <div className={`relative p-6 rounded-xl w-full max-w-md ${
              isDark ? 'bg-neutral-900' : 'bg-white'
            } shadow-xl`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-semibold ${
                  isDark ? 'text-text' : 'text-gray-900'
                }`}>
                  {selectedCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedCategory(null);
                    setCategoryName('');
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Category name"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'border-border bg-background text-text' 
                      : 'border-gray-200 bg-white text-gray-900'
                  } focus:ring-2 focus:ring-primary focus:border-transparent mb-4`}
                  required
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedCategory(null);
                      setCategoryName('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primaryHover text-white">
                    {selectedCategory ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Products Modal */}
        {showProductsModal && selectedCategory && (
          <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-[9999]">
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-80"></div>
            <div className={`relative p-6 rounded-xl w-full max-w-4xl max-h-[90vh] ${
              isDark ? 'bg-neutral-900' : 'bg-white'
            } shadow-xl border ${isDark ? 'border-neutral-800' : 'border-gray-200'}`}>
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-xl font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Products in {selectedCategory.name}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowProductsModal(false);
                      setSelectedCategory(null);
                    }}
                    className={isDark ? 'hover:bg-neutral-800' : ''}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="flex-1 overflow-y-auto min-h-0 mb-4 custom-scrollbar">
                  {currentCategoryProducts && currentCategoryProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentCategoryProducts.map((product) => (
                        <div
                          key={product.productId}
                          className={`flex items-center gap-4 p-4 rounded-lg border ${
                            isDark 
                              ? 'border-neutral-800 bg-neutral-800 hover:bg-neutral-700' 
                              : 'border-gray-200 hover:bg-gray-50'
                          } transition-colors duration-200`}
                        >
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-lg shadow-md"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-medium truncate ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}>{product.name}</h3>
                            <p className={`${
                              isDark ? 'text-neutral-400' : 'text-gray-600'
                            }`}>
                              Producer: {product.producerName}
                            </p>
                            <p className="text-primary font-medium">
                              ${product.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`text-center py-8 ${
                      isDark ? 'text-neutral-400' : 'text-gray-500'
                    }`}>
                      <FolderOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No products found in this category</p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {currentCategoryProducts && currentCategoryProducts.length > 0 && (
                  <div className={`flex justify-center items-center gap-2 pt-4 border-t ${
                    isDark ? 'border-neutral-800' : 'border-gray-200'
                  }`}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                      className={isDark ? 'border-neutral-800 hover:bg-neutral-800' : ''}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className={`${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      Page {currentPage + 1} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages - 1}
                      className={isDark ? 'border-neutral-800 hover:bg-neutral-800' : ''}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-[9999]">
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-80"></div>
            <div className={`relative p-6 rounded-xl w-full max-w-md ${
              isDark ? 'bg-neutral-900' : 'bg-white'
            } shadow-xl`}>
              <div className="flex flex-col items-center gap-4">
                <AlertCircle className="w-16 h-16 text-red-500" />
                <h2 className={`text-xl font-semibold text-center ${
                  isDark ? 'text-text' : 'text-gray-900'
                }`}>
                  Delete Category
                </h2>
                
                {deleteError ? (
                  <>
                    <p className={`text-center ${
                      isDark ? 'text-red-400' : 'text-red-600'
                    }`}>
                      {deleteError}
                    </p>
                    {showPurgeOption && (
                      <p className={`text-center ${
                        isDark ? 'text-textSecondary' : 'text-gray-600'
                      }`}>
                        Would you like to purge this category? This will:
                        <ul className="list-disc list-inside mt-2 text-left">
                          <li>Remove all associated products</li>
                          <li>Remove this category from products with multiple categories</li>
                        </ul>
                      </p>
                    )}
                  </>
                ) : (
                  <p className={`text-center ${
                    isDark ? 'text-textSecondary' : 'text-gray-600'
                  }`}>
                    Are you sure you want to delete this category? This action cannot be undone.
                  </p>
                )}

                <div className="flex gap-3 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setCategoryToDelete(null);
                      setDeleteError(null);
                      setShowPurgeOption(false);
                    }}
                    className={`px-4 py-2 ${
                      isDark ? 'bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]' : 'bg-[#E5E5E5] text-black hover:bg-[#D5D5D5]'
                    }`}
                  >
                    Cancel
                  </Button>
                  {showPurgeOption ? (
                    <Button
                      onClick={() => confirmDelete(true)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white"
                    >
                      Purge
                    </Button>
                  ) : (
                    <Button
                      onClick={() => confirmDelete(false)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesManagement;