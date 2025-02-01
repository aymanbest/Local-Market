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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-cardBg backdrop-blur-md rounded-lg p-6 w-full max-w-md relative mx-4 shadow-xl border border-border">
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
  const pendingProducts = useSelector((state) => {
    // console.log('Current Redux State:', state); // Debug log
    return state.pendingProducts;
  });
  const producers = pendingProducts?.items || [];
  // console.log('Producers:', producers); // Debug log
  
  const status = pendingProducts?.status || 'idle';
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [direction, setDirection] = useState('right');

  useEffect(() => {
    // console.log('Dispatching fetchPendingProducts'); // Debug log
    dispatch(fetchPendingProducts());
  }, [dispatch]);

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

  // Modify the search filtering logic
  const filteredProducers = producers.filter(producer => {
    const producerName = `${producer.firstname} ${producer.lastname}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    // Check producer name
    if (producerName.includes(searchLower)) {
      return true;
    }
    
    // Check each product's name
    return producer.products.some(product => 
      product.name.toLowerCase().includes(searchLower)
    );
  });

  // Calculate total pending products
  const totalPendingProducts = producers.reduce((total, producer) => 
    total + producer.products.length, 0
  );

  // console.log('Filtered Producers:', filteredProducers); // Debug log
  // console.log('Total Pending Products:', totalPendingProducts); // Debug log

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // View Modal Component
  const ViewModal = () => (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowViewModal(false)} />
      <div className="bg-cardBg backdrop-blur-md rounded-lg p-6 w-full max-w-2xl relative mx-4 shadow-xl border border-border">
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
      {/* Header Section with Stats */}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-cardBg border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-text">{totalPendingProducts}</h3>
                <p className="text-textSecondary text-sm">Pending Products</p>
              </div>
            </div>
          </div>
          
          {/* Add more stat cards as needed */}
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
          {currentItems.map(producer => (
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
          ))}
        </div>

        {/* MainPage style Pagination */}
        {filteredProducers.length > itemsPerPage && (
          <div className="flex flex-col items-center gap-6 mt-8">
            {/* Page Navigation Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  currentPage === 1
                    ? 'bg-cardBg border-border text-textSecondary cursor-not-allowed'
                    : 'bg-cardBg border-border hover:bg-primary hover:border-transparent'
                }`}
                onClick={() => {
                  setDirection('left');
                  setCurrentPage(prev => prev - 1);
                }}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  currentPage === totalPages
                    ? 'bg-cardBg border-border text-textSecondary cursor-not-allowed'
                    : 'bg-primary border-transparent hover:bg-primaryHover'
                }`}
                onClick={() => {
                  setDirection('right');
                  setCurrentPage(prev => prev + 1);
                }}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

            {/* Dot Indicators */}
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentPage === index + 1 
                      ? 'bg-primary w-6' 
                      : 'bg-border hover:bg-primary/50'
                  }`}
                  onClick={() => {
                    setDirection(index + 1 > currentPage ? 'right' : 'left');
                    setCurrentPage(index + 1);
                  }}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>

            {/* Results Counter */}
            <div className="text-sm text-textSecondary">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducers.length)} of {filteredProducers.length} results
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