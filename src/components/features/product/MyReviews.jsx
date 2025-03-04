import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserReviews } from '../../../store/slices/customer/reviewSlice';
import { Star, ArrowLeft, ExternalLink, Filter, X, SlidersHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import Button from '../../common/ui/Button';

const MyReviews = () => {
  const dispatch = useDispatch();
  const { userReviews, loading, error, pagination, sorting } = useSelector(state => state.reviews);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    sorting: {
      sortBy: 'createdAt',
      direction: 'desc'
    }
  });

  useEffect(() => {
    dispatch(fetchUserReviews({
      page: 0,
      size: 4,
      sortBy: tempFilters.sorting.sortBy,
      direction: tempFilters.sorting.direction
    }));
  }, [dispatch, tempFilters.sorting]);

  const handleOpenFilters = () => {
    setTempFilters({
      sorting: {
        sortBy: sorting.sortBy,
        direction: sorting.direction
      }
    });
    setShowFiltersModal(true);
  };

  const FilterModal = () => {
    const [localFilters, setLocalFilters] = useState(tempFilters);

    const sortingOptions = [
      { value: 'createdAt', label: 'Review Date' },
      { value: 'productName', label: 'Product Name' },
      { value: 'rating', label: 'Rating' },
      { value: 'status', label: 'Status' },
      { value: 'updatedAt', label: 'Last Update' }
    ];

    useEffect(() => {
      setLocalFilters(tempFilters);
    }, [showFiltersModal]);

    const handleApplyFilters = () => {
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
                Sort Reviews
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

  const PaginationControls = () => {
    if (!pagination || pagination.totalElements <= pagination.pageSize) {
      return null;
    }

    const pageNumbers = [];
    for (let i = 0; i < pagination.totalPages; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="flex items-center justify-between py-4">
        <p className="text-sm text-textSecondary">
          Showing <span className="font-medium">{(pagination.currentPage) * (pagination.pageSize) + 1}</span> to{' '}
          <span className="font-medium">
            {Math.min((pagination.currentPage + 1) * (pagination.pageSize), pagination.totalElements)}
          </span> of{' '}
          <span className="font-medium">{pagination.totalElements}</span> reviews
        </p>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border hover:bg-cardBg text-text border-border"
            disabled={pagination.isFirst}
            onClick={() => {
              dispatch(fetchUserReviews({ 
                page: pagination.currentPage - 1,
                size: pagination.pageSize,
                sortBy: tempFilters.sorting.sortBy,
                direction: tempFilters.sorting.direction
              }));
            }}
          >
            Previous
          </Button>
          {pageNumbers.map(pageNumber => (
            <Button
              key={pageNumber}
              variant={pageNumber === pagination.currentPage ? "default" : "outline"}
              size="sm"
              className={`${
                pageNumber === pagination.currentPage 
                  ? 'bg-primary text-white' 
                  : 'border hover:bg-cardBg text-text border-border'
              }`}
              onClick={() => {
                dispatch(fetchUserReviews({ 
                  page: pageNumber,
                  size: pagination.pageSize,
                  sortBy: tempFilters.sorting.sortBy,
                  direction: tempFilters.sorting.direction
                }));
              }}
            >
              {pageNumber + 1}
            </Button>
          ))}
          <Button 
            variant="outline" 
            size="sm"
            className="border hover:bg-primary/10 text-primary border-primary"
            disabled={pagination.isLast}
            onClick={() => {
              dispatch(fetchUserReviews({ 
                page: pagination.currentPage + 1,
                size: pagination.pageSize,
                sortBy: tempFilters.sorting.sortBy,
                direction: tempFilters.sorting.direction
              }));
            }}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

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
          <div className="flex items-center gap-4">
            <button
              onClick={handleOpenFilters}
              className="rounded-full border border-border hover:bg-cardBg transition flex gap-2 items-center px-4 py-2"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Sort</span>
            </button>
            <Link 
              to="/account" 
              className="rounded-full border border-border hover:bg-cardBg transition flex gap-2 items-center px-4 py-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Account</span>
            </Link>
          </div>
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
          <>
            <div className="grid gap-6">
              {userReviews.map((review) => (
                <div 
                  key={review.reviewId} 
                  className="bg-cardBg rounded-xl p-6 border border-border w-full overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="max-w-[70%]">
                      <Link 
                        to={`/store/products/${review.productId}`}
                        className="text-xl font-semibold hover:text-primary transition-colors flex items-center gap-2"
                      >
                        <span className="truncate">{review.productName}</span>
                        <ExternalLink className="w-4 h-4 flex-shrink-0" />
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
                    <div className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(review.status)} flex-shrink-0`}>
                      {review.status}
                    </div>
                  </div>

                  <div className="w-full overflow-hidden">
                    <p 
                      className="text-textSecondary" 
                      style={{ 
                        wordBreak: 'break-word', 
                        overflowWrap: 'break-word',
                        whiteSpace: 'normal',
                        maxWidth: '100%'
                      }}
                    >
                      {review.comment}
                    </p>
                  </div>

                  {review.verifiedPurchase && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-green-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span>Verified Purchase</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <PaginationControls />
          </>
        )}
      </div>
      <FilterModal />
    </div>
  );
};

export default MyReviews; 