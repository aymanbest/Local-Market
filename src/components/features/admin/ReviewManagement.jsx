import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Star, CheckCircle, XCircle, MessageSquare, Search, Check, X, ChevronLeft, ChevronRight, SlidersHorizontal, Eye } from 'lucide-react';
import { fetchPendingReviews, approveReview, declineReview } from '../../../store/slices/customer/reviewSlice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../common/ui/Table';
import { Card } from '../../common/ui/Card';
import Button from '../../common/ui/Button';
//import { // toast } from 'react-hot-// toast';

const ReviewManagement = () => {
  const dispatch = useDispatch();
  const { pendingReviews, loading, error, pagination } = useSelector((state) => state.reviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedReviews, setExpandedReviews] = useState({});
  const [viewingComment, setViewingComment] = useState(null);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    sorting: {
      sortBy: 'createdAt',
      direction: 'desc'
    }
  });
  const [truncatedComments, setTruncatedComments] = useState({});
  
  // Add a ref to check if comments are truncated
  const commentRefs = useRef({});
  
  // Function to check if a comment is truncated
  const checkTruncation = useCallback(() => {
    const newTruncatedState = {};
    
    Object.keys(commentRefs.current).forEach(id => {
      const element = commentRefs.current[id];
      if (element) {
        newTruncatedState[id] = element.scrollWidth > element.clientWidth;
      }
    });
    
    setTruncatedComments(newTruncatedState);
  }, []);
  
  // Check for truncation on window resize and initial render
  useEffect(() => {
    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    
    return () => {
      window.removeEventListener('resize', checkTruncation);
    };
  }, [checkTruncation, pendingReviews]);

  useEffect(() => {
    dispatch(fetchPendingReviews({
      page: pagination?.currentPage || 0,
      size: pagination?.pageSize || 10,
      sortBy: tempFilters.sorting.sortBy,
      direction: tempFilters.sorting.direction
    }));
  }, [dispatch, pagination?.currentPage, tempFilters.sorting]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.3);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleApprove = async (reviewId) => {
    try {
      await dispatch(approveReview(reviewId)).unwrap();
      // toast.success('Review approved successfully');
      dispatch(fetchPendingReviews({
        page: pagination.currentPage,
        size: pagination.pageSize,
        sortBy: tempFilters.sorting.sortBy,
        direction: tempFilters.sorting.direction
      }));
    } catch (error) {
      // toast.error(error.message || 'Failed to approve review');
    }
  };

  const handleDecline = async (reviewId) => {
    try {
      await dispatch(declineReview(reviewId)).unwrap();
      // toast.success('Review declined successfully');
      dispatch(fetchPendingReviews({
        page: pagination.currentPage,
        size: pagination.pageSize,
        sortBy: tempFilters.sorting.sortBy,
        direction: tempFilters.sorting.direction
      }));
    } catch (error) {
      // toast.error(error.message || 'Failed to decline review');
    }
  };

  const toggleComment = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const openCommentModal = (review) => {
    setViewingComment(review);
  };

  const closeCommentModal = () => {
    setViewingComment(null);
  };

  const filteredReviews = pendingReviews.filter(review =>
    review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.customerUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const FilterModal = () => {
    const [localFilters, setLocalFilters] = useState(tempFilters);

    const sortingOptions = [
      { value: 'createdAt', label: 'Creation Date' },
      { value: 'rating', label: 'Rating' },
      { value: 'productName', label: 'Product Name' },
      { value: 'customerUsername', label: 'Customer Name' }
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
                <SlidersHorizontal className="w-5 h-5" />
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
          <button 
            className="px-4 py-2 border border-border rounded-xl text-text hover:bg-cardBg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={pagination.isFirst}
            onClick={() => {
              dispatch(fetchPendingReviews({
                page: pagination.currentPage - 1,
                size: pagination.pageSize,
                sortBy: tempFilters.sorting.sortBy,
                direction: tempFilters.sorting.direction
              }));
            }}
          >
            Previous
          </button>
          {Array.from({ length: pagination.totalPages }).map((_, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-xl transition-colors ${
                index === pagination.currentPage 
                  ? 'bg-primary text-white' 
                  : 'border border-border text-text hover:bg-cardBg'
              }`}
              onClick={() => {
                dispatch(fetchPendingReviews({
                  page: index,
                  size: pagination.pageSize,
                  sortBy: tempFilters.sorting.sortBy,
                  direction: tempFilters.sorting.direction
                }));
              }}
            >
              {index + 1}
            </button>
          ))}
          <button 
            className="px-4 py-2 border border-border rounded-xl text-text hover:bg-cardBg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={pagination.isLast}
            onClick={() => {
              dispatch(fetchPendingReviews({
                page: pagination.currentPage + 1,
                size: pagination.pageSize,
                sortBy: tempFilters.sorting.sortBy,
                direction: tempFilters.sorting.direction
              }));
            }}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const CommentModal = () => {
    if (!viewingComment) return null;

    return (
      <div className="fixed inset-0 z-[100] overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="fixed inset-0 bg-black/60 transition-opacity" onClick={closeCommentModal} />
          
          <div className="relative transform overflow-hidden rounded-2xl bg-cardBg border border-border text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl z-[101]">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-cardBg">
              <h3 className="text-xl font-semibold text-text flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Review Comment
              </h3>
              <button 
                onClick={closeCommentModal} 
                className="text-textSecondary hover:text-text transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-6 py-6 bg-cardBg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text">{viewingComment.productName}</h4>
                    <p className="text-sm text-textSecondary">By {viewingComment.customerUsername}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-text">{viewingComment.rating}</span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-background rounded-lg border border-border">
                  <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    <p className="text-text whitespace-pre-wrap break-words">{viewingComment.comment}</p>
                  </div>
                </div>
                <p className="text-sm text-textSecondary text-right">
                  {new Date(viewingComment.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-cardBg">
              <button
                onClick={() => {
                  handleDecline(viewingComment.reviewId);
                  closeCommentModal();
                }}
                className="px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500/10 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={() => {
                  handleApprove(viewingComment.reviewId);
                  closeCommentModal();
                }}
                className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        <Star className="w-6 h-6 mr-2" />
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
            <h2 className="text-3xl font-bold text-text">Review Management</h2>
            <p className="text-textSecondary mt-1">Manage and moderate customer reviews</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowFiltersModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-text hover:border-primary hover:text-primary transition-all duration-200"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Sort</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      {pendingReviews.length === 0 ? (
        <div className="bg-cardBg border border-border rounded-2xl p-12 text-center">
          <Star className="w-16 h-16 text-textSecondary mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-text mb-2">No Pending Reviews</h3>
          <p className="text-textSecondary">All reviews have been moderated.</p>
        </div>
      ) : (
        <>
          <Card className="bg-white dark:bg-[#1a1f1c] p-0 overflow-hidden">
            <div className="w-full h-full bg-white dark:bg-[#1a1f1c]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingReviews.map((review) => (
                    <TableRow key={review.reviewId}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-text">{review.productName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-text">{review.customerUsername}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-text">{review.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md flex items-center gap-2">
                          <p 
                            ref={el => commentRefs.current[review.reviewId] = el}
                            className="text-text truncate"
                          >
                            {review.comment}
                          </p>
                          {truncatedComments[review.reviewId] && (
                            <button
                              onClick={() => openCommentModal(review)}
                              className="p-1 hover:bg-primary/10 rounded-lg transition-colors"
                              title="View full comment"
                            >
                              <Eye className="w-4 h-4 text-primary" />
                            </button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-text">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(review.reviewId)}
                            className="p-2 hover:bg-green-500/10 rounded-lg transition-colors"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </button>
                          <button
                            onClick={() => handleDecline(review.reviewId)}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <XCircle className="w-4 h-4 text-red-500" />
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
      <CommentModal />
    </div>
  );
};

export default ReviewManagement; 