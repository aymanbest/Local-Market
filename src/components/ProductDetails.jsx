import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../store/slices/categorySlice';
import { addToCart } from '../store/slices/cartSlice';
import { 
  CheckCircle, ShoppingCart, ArrowRight, Upload, Info, 
  Plus, Minus, Star, Leaf, Package, Shield, Truck, Heart,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { checkReviewEligibility, submitReview } from '../store/slices/reviewSlice';
import { initializeState, setState } from '../store/slices/authSlice';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedProduct } = useSelector((state) => state.categories);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { eligibility, loading: reviewLoading } = useSelector(state => state.reviews);
  const { isAuthenticated } = useSelector(state => state.auth);
  const { items: cartItems } = useSelector(state => state.cart);
  const [isLoading, setIsLoading] = useState(true);
  const authState = useSelector(state => state.auth);
  const { isDark } = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showZoomedImage, setShowZoomedImage] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isDescriptionOverflowing, setIsDescriptionOverflowing] = useState(false);
  const descriptionRef = useRef(null);

  const product = location.state?.product || selectedProduct;

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(40, value));
    setQuantity(newQuantity);
  };

  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://placehold.co/600x400?text=No+Image';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
    return `http://localhost:8080${imageUrl}`;
  };

  const handleAddToCart = () => {
    if (product) {
      // Check if product is already in cart
      const existingItem = cartItems.find(item => item.id === product.productId);
      
      // Check if adding more would exceed stock limit (if you have stock limits)
      // TODO: Add stock limit check
      const newQuantity = existingItem 
        ? existingItem.quantity + quantity 
        : quantity;

      // Create cart item
      const cartItem = {
        id: product.productId,
        productId: product.productId,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: quantity,
        addedAt: new Date().toISOString()
      };

      // Dispatch add to cart action
      dispatch(addToCart(cartItem));

      // Show success notification
      // toast.success('Added to cart successfully!');
    }
  };

  const handleBuyNow = () => {
    if (product) {
      const cartItem = {
        id: product.productId,
        productId: product.productId,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: quantity,
        addedAt: new Date().toISOString()
      };
      
      dispatch(addToCart(cartItem));
      navigate('/cart');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!location.state?.product && id) {
        setIsLoading(true);
        try {
          await dispatch(fetchProductById(id)).unwrap();
        } catch (error) {
          console.error('Error fetching product:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [dispatch, id, location.state]);

  useEffect(() => {
    if (isAuthenticated && product?.productId) {
      dispatch(checkReviewEligibility(product.productId));
    }
  }, [dispatch, isAuthenticated, product]);

  useEffect(() => {
    const initAuth = async () => {
      // Only try to initialize if status is idle and we haven't tried before
      if (!isAuthenticated && authState.status === 'idle' && !authState.initialized) {
        const resultAction = await dispatch(initializeState());
        if (initializeState.fulfilled.match(resultAction)) {
          dispatch(setState({ ...resultAction.payload, initialized: true }));
        } else {
          // If the initialization fails, still mark as initialized to prevent retries
          dispatch(setState({ isAuthenticated: false, initialized: true }));
        }
      }
    };
    
    initAuth();
  }, [isAuthenticated, authState.status, authState.initialized, dispatch]);

  useEffect(() => {
    if (descriptionRef.current) {
      const isOverflowing = descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight;
      setIsDescriptionOverflowing(isOverflowing);
    }
  }, [product?.description]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const reviewData = {
      productId: product.productId,
      rating,
      comment
    };
    dispatch(submitReview(reviewData));
    setShowReviewForm(false);
  };

  const productImages = [
    getFullImageUrl(product?.imageUrl),
    // Add more images if available in your product data
  ].filter(Boolean);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-primary animate-spin-reverse"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link to="/" className="text-textSecondary hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-textSecondary" />
          <Link to="/store" className="text-textSecondary hover:text-primary transition-colors">
            Store
          </Link>
          <ChevronRight className="w-4 h-4 text-textSecondary" />
          <span className="text-primary">{product.name}</span>
        </nav>

        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product Gallery */}
            <div className="lg:w-1/2 space-y-4">
              <div className="relative group">
                <motion.div
                  className={`
                    relative aspect-square overflow-hidden rounded-2xl border
                    ${isDark ? 'border-white/10' : 'border-black/10'}
                  `}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src={productImages[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onClick={() => setShowZoomedImage(true)}
                  />
                  
                  {/* Navigation Arrows */}
                  {productImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </motion.div>
              </div>

              {/* Thumbnail Navigation */}
              {productImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`
                        relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all
                        ${currentImageIndex === index 
                          ? 'border-primary' 
                          : isDark ? 'border-white/10' : 'border-black/10'
                        }
                      `}
                    >
                      <img 
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2 space-y-6">
              {/* Producer Badge */}
              <div className="flex items-center gap-2">
                <div className={`
                  px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-2
                  ${isDark ? 'bg-white/10' : 'bg-black/5'}
                `}>
                  <Leaf className="w-4 h-4 text-primary" />
                  <span>Local Producer</span>
                </div>
                {product.stock && (
                  <div className={`
                    px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-2
                    ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600'}
                  `}>
                    <Package className="w-4 h-4" />
                    <span>In Stock ({product.quantity} available)</span>
                  </div>
                )}
                {!product.stock && (
                  <div className={`
                    px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-2
                    ${isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600'}
                  `}>
                    <Package className="w-4 h-4" />
                    <span>Out of Stock</span>
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-4xl font-recoleta mb-2">{product.name}</h1>
                <p className="text-textSecondary">{product.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-semibold text-primary">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-textSecondary line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Quantity Selector - Only show if in stock */}
                {product.stock && (
                  <div className="flex items-center gap-4">
                    <span className="text-textSecondary">Quantity:</span>
                    <div className="flex items-stretch">
                      <button 
                        className={`
                          rounded-l-xl w-10 flex items-center justify-center transition-colors
                          ${isDark 
                            ? 'bg-white/10 hover:bg-white/20 border-r border-white/10' 
                            : 'bg-black/5 hover:bg-black/10 border-r border-black/10'
                          }
                        `}
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input 
                        type="number" 
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                        className={`
                          w-16 text-center hide-spinner
                          ${isDark 
                            ? 'bg-white/10 text-text' 
                            : 'bg-black/5 text-text'
                          }
                        `}
                        min="1"
                        max={product.quantity}
                      />
                      <button 
                        className={`
                          rounded-r-xl w-10 flex items-center justify-center transition-colors
                          ${isDark 
                            ? 'bg-white/10 hover:bg-white/20 border-l border-white/10' 
                            : 'bg-black/5 hover:bg-black/10 border-l border-black/10'
                          }
                        `}
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.quantity}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons - Only show if in stock */}
                {product.stock ? (
                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={handleBuyNow}
                      className="flex-1 bg-primary hover:bg-primaryHover text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      Buy Now
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleAddToCart}
                      className={`
                        flex-1 px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2
                        ${isDark 
                          ? 'bg-white/10 hover:bg-white/20' 
                          : 'bg-black/5 hover:bg-black/10'
                        }
                      `}
                    >
                      Add to Cart
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="pt-4">
                    <div className={`
                      p-4 rounded-xl text-center
                      ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'}
                    `}>
                      This product is currently out of stock. Please check back later.
                    </div>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className={`
                  p-4 rounded-xl
                  ${isDark ? 'bg-white/5' : 'bg-black/5'}
                `}>
                  <Shield className="w-5 h-5 text-primary mb-2" />
                  <h3 className="font-medium mb-1">Quality Guaranteed</h3>
                  <p className="text-sm text-textSecondary">Locally sourced fresh products</p>
                </div>
                <div className={`
                  p-4 rounded-xl
                  ${isDark ? 'bg-white/5' : 'bg-black/5'}
                `}>
                  <Truck className="w-5 h-5 text-primary mb-2" />
                  <h3 className="font-medium mb-1">Fast Delivery</h3>
                  <p className="text-sm text-textSecondary">From local producers to you</p>
                </div>
              </div>

              {/* Categories and Producer Info */}
              <div className={`
                p-4 rounded-xl space-y-3
                ${isDark ? 'bg-white/5' : 'bg-black/5'}
              `}>
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-primary" />
                  <span className="text-textSecondary">Categories:</span>
                  <div className="flex gap-2">
                    {product.categories.map((category, index) => (
                      <span 
                        key={category.id}
                        className={`
                          px-2 py-1 rounded-full text-sm
                          ${isDark ? 'bg-white/10' : 'bg-black/10'}
                        `}
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  <span className="text-textSecondary">Producer:</span>
                  <span className="font-medium">{product.producer.firstname} {product.producer.lastname}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description Section - Moved below the main content */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <Info className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-recoleta">About This Product</h2>
              </div>

              <div className="space-y-6">
                <div 
                  ref={descriptionRef}
                  className={`
                    prose prose-lg max-w-none
                    ${!isDescriptionExpanded && 'max-h-[300px] overflow-hidden relative'}
                  `}
                >
                  <div className={`
                    space-y-6 text-textSecondary leading-relaxed
                    ${!isDescriptionExpanded && 'mask-linear-gradient'}
                  `}>
                    {product.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-lg">{paragraph}</p>
                    ))}

                    {product.details && (
                      <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        {Object.entries(product.details).map(([key, value]) => (
                          <div 
                            key={key} 
                            className={`
                              p-4 rounded-xl flex items-start gap-3
                              ${isDark ? 'bg-white/5' : 'bg-black/5'}
                            `}
                          >
                            <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                              <span className="font-medium block mb-1">{key}</span>
                              <span className="text-textSecondary">{value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {isDescriptionOverflowing && !isDescriptionExpanded && (
                  <div className="relative">
                    <div className={`
                      absolute -top-24 inset-x-0 h-24
                      ${isDark 
                        ? 'bg-gradient-to-b from-transparent to-background' 
                        : 'bg-gradient-to-b from-transparent to-background'
                      }
                    `} />
                  </div>
                )}

                {isDescriptionOverflowing && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className={`
                      w-full py-3 px-6 rounded-xl text-base font-medium
                      transition-colors flex items-center justify-center gap-2
                      ${isDark 
                        ? 'bg-white/10 hover:bg-white/20' 
                        : 'bg-black/5 hover:bg-black/10'
                      }
                    `}
                  >
                    {isDescriptionExpanded ? 'Show Less' : 'Read More'}
                    {isDescriptionExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                )}

                {product.createdAt && (
                  <div className="text-sm text-textSecondary pt-4 border-t border-border">
                    Listed on: {new Date(product.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16 space-y-8">
            {product.verifiedReviews && product.verifiedReviews.length > 0 && (
              <div>
                <h2 className="text-2xl font-recoleta mb-6">Verified Reviews</h2>
                <div className="grid gap-4">
                  {product.verifiedReviews.map((review) => (
                    <motion.div
                      key={review.reviewId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`
                        p-6 rounded-xl border transition-all
                        ${isDark 
                          ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                          : 'bg-black/5 border-black/10 hover:bg-black/10'
                        }
                      `}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`
                              w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium
                              ${isDark ? 'bg-white/10' : 'bg-black/10'}
                            `}>
                              {review.customerUsername.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {review.customerUsername.slice(0, Math.floor(review.customerUsername.length / 2))}*****
                                </span>
                                {review.verifiedPurchase && (
                                  <span className={`
                                    text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1
                                    ${isDark 
                                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                      : 'bg-green-50 text-green-600 border border-green-200'
                                    }
                                  `}>
                                    <CheckCircle className="w-3 h-3" />
                                    Verified
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, index) => (
                                    <Star
                                      key={index}
                                      className={`w-4 h-4 ${
                                        index < review.rating 
                                          ? 'text-yellow-400 fill-current' 
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-textSecondary">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-textSecondary">{review.comment}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Write Review Section */}
            {isAuthenticated && eligibility?.eligible && !eligibility?.hasReviewed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                  p-6 rounded-xl border transition-all
                  ${isDark 
                    ? 'bg-white/5 border-white/10' 
                    : 'bg-black/5 border-black/10'
                  }
                `}
              >
                <h3 className="text-xl font-recoleta mb-4">Share Your Experience</h3>
                {!showReviewForm ? (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-primary hover:bg-primaryHover text-white px-6 py-3 rounded-xl font-medium transition-colors"
                  >
                    Write Review
                  </button>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-textSecondary mb-2">
                        Rating
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="text-2xl transition-colors"
                          >
                            <Star 
                              className={`w-8 h-8 ${
                                star <= rating 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-textSecondary mb-2">
                        Your Review
                      </label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        rows={4}
                        className={`
                          w-full px-4 py-3 rounded-xl resize-none transition-colors
                          ${isDark 
                            ? 'bg-white/10 focus:bg-white/20 border-white/10' 
                            : 'bg-black/5 focus:bg-black/10 border-black/10'
                          }
                          border focus:outline-none focus:ring-2 focus:ring-primary
                        `}
                        placeholder="Share your thoughts about this product..."
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={reviewLoading}
                        className="flex-1 bg-primary hover:bg-primaryHover text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
                      >
                        {reviewLoading ? 'Submitting...' : 'Submit Review'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className={`
                          flex-1 px-6 py-3 rounded-xl font-medium transition-colors
                          ${isDark 
                            ? 'bg-white/10 hover:bg-white/20' 
                            : 'bg-black/5 hover:bg-black/10'
                          }
                        `}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {showZoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setShowZoomedImage(false)}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={productImages[currentImageIndex]}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetails; 