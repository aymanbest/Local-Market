import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Star, CheckCircle, XCircle, MessageSquare, Search } from 'lucide-react';
import { fetchPendingReviews, approveReview, declineReview } from '../../store/slices/reviewSlice';
import Button from '../ui/Button';

const ReviewManagement = () => {
  const dispatch = useDispatch();
  const { pendingReviews, loading } = useSelector(state => state.reviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedReviews, setExpandedReviews] = useState({});

  useEffect(() => {
    dispatch(fetchPendingReviews());
  }, [dispatch]);

  const handleApprove = async (reviewId) => {
    try {
      await dispatch(approveReview(reviewId)).unwrap();
      // toast.success('Review approved successfully');
    } catch (error) {
      // toast.error('Failed to approve review');
    }
  };

  const handleDecline = async (reviewId) => {
    try {
      await dispatch(declineReview(reviewId)).unwrap();
      // toast.success('Review declined successfully');
    } catch (error) {
      // toast.error('Failed to decline review');
    }
  };

  const toggleComment = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const filteredReviews = pendingReviews.filter(review =>
    review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.customerUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Modern Stats Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl border border-border p-8">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
          <div className="relative flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-text">Review Management</h2>
              <p className="text-textSecondary">Monitor and manage product reviews</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {pendingReviews.length}
                </div>
                <div className="text-sm text-textSecondary mt-1">Pending Reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-cardBg border border-border rounded-xl p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-inputBg border border-border rounded-lg text-text placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-cardBg border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-[minmax(0,2fr),minmax(0,1fr),100px,100px] gap-4 p-3 bg-primary/5 border-b border-border text-sm font-medium text-textSecondary">
            <div>Review</div>
            <div>Customer</div>
            <div>Rating</div>
            <div className="text-right">Actions</div>
          </div>
          
          <div className="divide-y divide-border">
            {filteredReviews.map((review) => (
              <div key={review.reviewId} className="grid grid-cols-[minmax(0,2fr),minmax(0,1fr),100px,100px] gap-4 p-3 items-center hover:bg-primary/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-text">{review.productName}</h3>
                    {review.verifiedPurchase && (
                      <span className="text-base bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded-full border border-green-500/30">✓</span>
                    )}
                  </div>
                  <div className="relative">
                    <p className="text-base text-textSecondary">
                      {expandedReviews[review.reviewId] 
                        ? review.comment 
                        : review.comment.slice(0, 60) + (review.comment.length > 60 ? '...' : '')}
                    </p>
                    {review.comment.length > 60 && (
                      <button
                        onClick={() => toggleComment(review.reviewId)}
                        className="text-primary hover:text-primary/80 text-base inline-flex items-center gap-1 mt-0.5"
                      >
                        <MessageSquare className="w-3 h-3" />
                        {expandedReviews[review.reviewId] ? 'Less' : 'More'}
                      </button>
                    )}
                  </div>
                  <p className="text-base text-textSecondary">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-sm text-textSecondary">
                  {review.customerUsername}
                </div>

                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-3 h-3 ${
                        index < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex gap-1 justify-end">
                  <Button
                    onClick={() => handleApprove(review.reviewId)}
                    className="bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white p-1.5 rounded-lg transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDecline(review.reviewId)}
                    className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-1.5 rounded-lg transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewManagement; 