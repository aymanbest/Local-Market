import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../store/slices/categorySlice';
import { addToCart } from '../store/slices/cartSlice';
import { CheckCircle, ShoppingCart, ArrowRight, Upload, Info, Plus, Minus, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { checkReviewEligibility, submitReview } from '../store/slices/reviewSlice';
import { initializeState } from '../store/slices/authSlice';
// import { toast } from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedProduct } = useSelector((state) => state.categories);
  const [quantity, setQuantity] = useState(1);
  const [inStock, setInStock] = useState(true); // You should get this from your product data
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { eligibility, loading: reviewLoading } = useSelector(state => state.reviews);
  const { isAuthenticated } = useSelector(state => state.auth);
  const { items: cartItems } = useSelector(state => state.cart);
  const [isLoading, setIsLoading] = useState(true);
  const authState = useSelector(state => state.auth);

  const product = location.state?.product || selectedProduct;

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(40, value));
    setQuantity(newQuantity);
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
    if (!isAuthenticated && authState.status === 'idle') {
      // Create an async function to handle the initialization
      const init = async () => {
        const initialState = await initializeState();
        // Update the auth state using the auth slice reducer
        dispatch({ type: 'auth/setState', payload: initialState });
      };
      
      init();
    }
  }, [isAuthenticated, authState.status, dispatch]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
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
        <div className="container">
          <h2 className="text-4xl font-staatliches font-semibold uppercase">Product Details</h2>
          <hr className="border-border my-6" />
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="bg-cardBg aspect-square overflow-hidden rounded-xl md:max-w-96 h-max border border-border">
              <img 
                src={product.imageUrl || `https://placehold.co/600x400?text=${product.name}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-cardBg rounded-xl p-4 flex-1 h-max overflow-hidden border border-border">
              <h2 className="text-3xl font-staatliches font-semibold uppercase mb-2">{product.name}</h2>
              <p className="text-textSecondary text-sm">{product.description}</p>
              
              <hr className="border-border my-3" />
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-textSecondary text-sm">Quantity:</span>
                <div className="flex items-stretch justify-stretch">
                  <button 
                    className="rounded-l-lg bg-white/5 border border-border border-r-0 w-8 flex items-center justify-center text-text hover:bg-white/10 transition-colors"
                    onClick={() => handleQuantityChange(quantity - 1)}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="card bg-white/5 px-3 py-1.5 hide-spinner max-w-20 text-center text-text border-y border-border"
                    min="1"
                    max="40"
                  />
                  <button 
                    className="rounded-r-lg bg-white/5 border border-border border-l-0 w-8 flex items-center justify-center text-text hover:bg-white/10 transition-colors"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-xl mb-2 text-text">Features</div>
              <ul>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-textSecondary">Categories:</span>
                  <div className="flex gap-2">
                    {product.categories.map((category, index) => (
                      <span key={category.id} className="text-text">
                        {category.name}{index < product.categories.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-textSecondary">Producer:</span>
                  <span className="text-text">{product.producer.firstname} {product.producer.lastname}</span>
                </li>
              </ul>

              <hr className="border-border my-3" />

              <div className="flex justify-between">
                <p className="uppercase text-2xl font-bold text-primary">${product.price} USD</p>
                <div className="rounded-full bg-white/5 flex items-center gap-1 text-sm px-3 py-1.5 text-textSecondary border border-border">
                  <span>Status:</span>
                  <span className={inStock ? "text-blue-400" : "text-red-400"}>
                    {inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              <hr className="border-border my-3" />

              <button 
                onClick={handleBuyNow}
                className="rounded-full bg-primary hover:bg-primaryHover px-4 py-3 mt-4 flex items-center gap-2 w-full justify-center transition-colors duration-300 text-white"
              >
                <span>Buy Now</span>
                <ShoppingCart className="w-5 h-5" />
              </button>

              <button 
                type="button" 
                onClick={handleAddToCart}
                className="rounded-full mt-2 bg-cardBg px-4 py-3 text-center w-full hover:bg-white/5 transition-colors duration-300 border border-border"
              >
                Add to Cart
              </button>
              <img src="https://www.realdudesinc.com/_app/immutable/assets/methods.JhUITgw9.webp" class="mt-4 w-full"></img>
            </div>
          </div>

          <div className="mt-12 space-y-8">
            {/* Verified Reviews Section */}
            {product.verifiedReviews && product.verifiedReviews.length > 0 && (
              <div>
                <h2 className="text-2xl font-staatliches font-semibold uppercase mb-4">Verified Reviews</h2>
                <hr className="border-border mb-6" />
                <div className="grid gap-4">
                  {product.verifiedReviews.map((review) => (
                    <div key={review.reviewId} className="bg-cardBg rounded-xl p-4 border border-border">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex gap-2 items-center">
                            <span className="font-semibold text-text">
                              {review.customerUsername.slice(0, Math.floor(review.customerUsername.length / 2))}*****
                            </span>
                            {review.verifiedPurchase && (
                              <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full border border-green-500/30">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, index) => (
                                <Star
                                  key={index}
                                  className={`w-4 h-4 ${
                                    index < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
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
                      <p className="text-textSecondary mt-2">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Write a Review Section */}
            {isAuthenticated && eligibility?.eligible && !eligibility?.hasReviewed && (
              <div className="bg-cardBg rounded-xl p-6 border border-border">
                <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
                {!showReviewForm ? (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded-lg"
                  >
                    Write Review
                  </button>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-textSecondary mb-1">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                          >
                            <Star className="w-6 h-6" fill={star <= rating ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-textSecondary mb-1">Comment</label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        rows={4}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={reviewLoading}
                        className="bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded-lg"
                      >
                        {reviewLoading ? 'Submitting...' : 'Submit Review'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="bg-cardBg hover:bg-white/5 px-4 py-2 rounded-lg border border-border"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Product Description Section */}
            <div>
              <h2 className="text-2xl font-staatliches font-semibold uppercase mb-4">Product Description</h2>
              <hr className="border-border mb-4" />
              <div className="space-y-4">
                <p className="text-textSecondary">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 