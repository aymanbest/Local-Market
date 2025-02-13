import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Check, X, Eye, Search, Package, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchPendingProducts, approveProduct, declineProduct } from '../../store/slices/pendingProductsSlice';
import Button from '../ui/Button';
import { Card } from '../ui/Card';
// import { // toast } from 'react-hot-// toast';

const DeclineButton = React.memo(({ onClick, children, variant }) => (
  <Button variant={variant} onClick={onClick}>
    {children}
  </Button>
));

const DeclineModal = React.memo(({ isOpen, onClose, onDecline: onDeclineProps }) => {
  const textareaRef = useRef('');
  
  const handleDecline = useCallback(() => {
    const reason = textareaRef.current.value.trim();
    if (!reason) return;
    onDeclineProps(reason);
    textareaRef.current.value = '';
  }, [onDeclineProps]);

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="bg-cardBg rounded-lg p-6 w-full max-w-md relative mx-4 shadow-xl border border-border">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-text">Decline Product</h3>
          <textarea
            ref={textareaRef}
            placeholder="Please provide a reason for declining..."
            className="w-full h-32 p-3 rounded-lg bg-inputBg border border-border text-text resize-none"
          />
          <div className="flex justify-end space-x-3">
            <DeclineButton variant="outline" onClick={onClose}>
              Cancel
            </DeclineButton>
            <DeclineButton variant="destructive" onClick={handleDecline}>
              Decline
            </DeclineButton>
          </div>
        </div>
      </div>
    </div>
  );
});

DeclineModal.displayName = 'DeclineModal';
DeclineButton.displayName = 'DeclineButton';

const ProductManagement = () => {
  const dispatch = useDispatch();
  const pendingProducts = useSelector((state) => state.pendingProducts);
  const producers = pendingProducts?.items || [];
  const { pagination, sorting } = pendingProducts;
  
  const status = pendingProducts?.status || 'idle';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [direction, setDirection] = useState('right');

  useEffect(() => {
    dispatch(fetchPendingProducts({
      page: pagination?.currentPage || 0,
      size: pagination?.pageSize || 10,
      sortBy: sorting?.sortBy || 'createdAt',
      direction: sorting?.direction || 'desc'
    }));
  }, [dispatch, pagination?.currentPage, sorting]);

  const handleApprove = async (productId) => {
    try {
      await dispatch(approveProduct(productId)).unwrap();
      console.log('Product approved successfully');
      // toast.success('Product approved successfully');
    } catch (error) {
      // toast.error('Failed to approve product');
    }
  };

  const handleDecline = useCallback(async (reason) => {
    try {
      await dispatch(declineProduct({
        productId: selectedProduct.productId,
        reason: reason
      })).unwrap();
      setShowDeclineModal(false);
      // toast.success('Product declined successfully');
    } catch (error) {
      // toast.error(error || 'Failed to decline product');
    }
  }, [selectedProduct]);

  // Modify the search filtering logic with null checks
  const filteredProducers = producers?.filter(producer => {
    if (!producer) return false;
    
    const producerName = `${producer.firstname || ''} ${producer.lastname || ''}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    // Check producer name
    if (producerName.includes(searchLower)) {
      return true;
    }
    
    // Check each product's name with null check
    return producer.products?.some(product => 
      product?.name?.toLowerCase().includes(searchLower)
    ) || false;
  }) || [];

  // Calculate total pending products with null check
  const totalPendingProducts = pagination?.totalElements || 0;

  // console.log('Filtered Producers:', filteredProducers); // Debug log
  // console.log('Total Pending Products:', totalPendingProducts); // Debug log

  // View Modal Component
  const ViewModal = () => (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="absolute inset-0 bg-black/70" onClick={() => setShowViewModal(false)} />
      <div className="bg-cardBg rounded-lg p-6 w-full max-w-2xl relative mx-4 shadow-xl border border-border">
        {selectedProduct && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-text">Product Details</h3>
              <Button onClick={() => setShowViewModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="aspect-square w-full">
                <img 
                  src={selectedProduct.imageUrl} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-text">{selectedProduct.name}</h4>
                  <p className="text-textSecondary">{selectedProduct.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-textSecondary">Price</p>
                    <p className="font-medium text-text">${selectedProduct.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-textSecondary">Quantity</p>
                    <p className="font-medium text-text">{selectedProduct.quantity}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-textSecondary">Producer</p>
                  <p className="font-medium text-text">
                    {selectedProduct.producer.firstname} {selectedProduct.producer.lastname}
                  </p>
                  <p className="text-sm text-textSecondary">{selectedProduct.producer.email}</p>
                </div>

                <div>
                  <p className="text-sm text-textSecondary">Categories</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedProduct.categories.map(category => (
                      <span key={category.categoryId} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Modern Stats Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl border border-border p-8">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
          <div className="relative flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-text">Product Management</h2>
              <p className="text-textSecondary">Monitor and manage products</p>
            </div>
            <div className="flex items-center gap-6">

              <div className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {totalPendingProducts}
                </div>
                <div className="text-sm text-textSecondary mt-1">Pending Products</div>
              </div>
            </div>
          </div>
        </div>

        {/* Redesigned Search Section - Store style */}
        <div className="flex justify-end mb-6">
          <label className="rounded-full flex items-center pl-4 pr-2 py-2 bg-cardBg border border-border w-72">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent flex-1 text-text placeholder-textSecondary outline-none focus:outline-none focus:ring-0 border-none text-sm"
            />
            <span className="bg-primary hover:bg-primaryHover rounded-full p-1 transition-colors cursor-pointer">
              <Search className="w-5 h-5 text-white" />
            </span>
          </label>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6">
          {status === 'loading' ? (
            <div className="text-center py-12">Loading...</div>
          ) : status === 'failed' ? (
            <div className="text-center py-12 text-red-500">{pendingProducts.error}</div>
          ) : producers.length === 0 ? (
            <div className="text-center py-12">No pending products found</div>
          ) : (
            producers.map(producer => (
              <div key={producer.producerId} className="bg-cardBg border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text">
                        {producer.firstname} {producer.lastname}
                      </h3>
                      <p className="text-textSecondary text-sm">{producer.email}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-6">
                  {producer.products.map(product => (
                    <div 
                      key={product.productId}
                      className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={product.imageUrl || 'https://placehold.co/600x400'}
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-text">{product.name}</h4>
                          <p className="text-primary font-semibold">${product.price.toFixed(2)}</p>
                          <p className="text-xs text-textSecondary">Stock: {product.quantity}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowViewModal(true);
                          }}
                          variant="ghost"
                          className="hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                        >
                          <Eye className="w-5 h-5" />
                        </Button>
                        <Button
                          onClick={() => handleApprove(product.productId)}
                          className="bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors duration-200"
                        >
                          <Check className="w-5 h-5" />
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowDeclineModal(true);
                          }}
                          variant="ghost"
                          className="hover:bg-red-500/10 hover:text-red-500 transition-colors duration-200"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {pagination && pagination.totalElements > 0 && pagination.totalPages > 1 && (
          <div className="flex flex-col items-center gap-6 mt-8">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  pagination.isFirst
                    ? 'bg-cardBg border-border text-textSecondary cursor-not-allowed'
                    : 'bg-cardBg border-border hover:bg-primary hover:border-transparent'
                }`}
                onClick={() => {
                  setDirection('left');
                  dispatch(fetchPendingProducts({
                    page: pagination.currentPage - 1,
                    size: pagination.pageSize,
                    sortBy: sorting.sortBy,
                    direction: sorting.direction
                  }));
                }}
                disabled={pagination.isFirst}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-6 h-6" />
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
                    setDirection(index > pagination.currentPage ? 'right' : 'left');
                    dispatch(fetchPendingProducts({
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
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  pagination.isLast
                    ? 'bg-cardBg border-border text-textSecondary cursor-not-allowed'
                    : 'bg-primary border-transparent hover:bg-primaryHover'
                }`}
                onClick={() => {
                  setDirection('right');
                  dispatch(fetchPendingProducts({
                    page: pagination.currentPage + 1,
                    size: pagination.pageSize,
                    sortBy: sorting.sortBy,
                    direction: sorting.direction
                  }));
                }}
                disabled={pagination.isLast}
                aria-label="Next page"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

            {/* Results Counter */}
            <div className="text-sm text-textSecondary">
              Showing {pagination.currentPage * pagination.pageSize + 1}-
              {Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalElements)} of {pagination.totalElements} results
            </div>
          </div>
        )}
      </div>

      {/* Keep existing modals */}
      {showViewModal && <ViewModal />}
      <DeclineModal
        isOpen={showDeclineModal}
        onClose={() => setShowDeclineModal(false)}
        onDecline={handleDecline}
      />
    </div>
  );
};

export default ProductManagement; 