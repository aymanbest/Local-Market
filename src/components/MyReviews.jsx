import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserReviews } from '../store/slices/reviewSlice';
import { Star, ArrowLeft, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

const MyReviews = () => {
  const dispatch = useDispatch();
  const { userReviews, loading, error } = useSelector(state => state.reviews);

  useEffect(() => {
    dispatch(fetchUserReviews());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'APPROVED':
        return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'REJECTED':
        return 'text-red-500 bg-red-500/10 border-red-500/30';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading reviews...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-text">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-red-500">Error loading reviews: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-staatliches font-semibold uppercase">My Reviews</h1>
          <Link 
            to="/account" 
            className="rounded-full border border-border hover:bg-cardBg transition flex gap-2 items-center px-4 py-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Account</span>
          </Link>
        </div>

        <hr className="border-border mb-6" />

        {userReviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-textSecondary">You haven't written any reviews yet.</p>
            <Link to="/store" className="text-primary hover:underline mt-2 inline-block">
              Browse products to review
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {userReviews.map((review) => (
              <div 
                key={review.reviewId} 
                className="bg-cardBg rounded-xl p-6 border border-border"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Link 
                      to={`/store/products/${review.productId}`}
                      className="text-xl font-semibold hover:text-primary transition-colors flex items-center gap-2"
                    >
                      {review.productName}
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={`w-5 h-5 ${
                              index < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-textSecondary">
                        {format(new Date(review.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(review.status)}`}>
                    {review.status}
                  </div>
                </div>

                <p className="text-textSecondary">{review.comment}</p>

                {review.verifiedPurchase && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-green-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span>Verified Purchase</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReviews; 