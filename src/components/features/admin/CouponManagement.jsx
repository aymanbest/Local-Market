import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCoupons, 
  createCoupon, 
  updateCoupon, 
  deleteCoupon,
  updateCouponStatus,
  setSelectedCoupon,
  clearSelectedCoupon 
} from '../../../store/slices/customer/couponSlice';
import { Plus, Pencil, Trash2, X, Power, Filter, SlidersHorizontal } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import Button from '../../common/ui/Button';

const CouponManagement = () => {
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const { coupons, loading, error, pagination, sorting } = useSelector((state) => state.coupons);
  const [showModal, setShowModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [updatingCoupons, setUpdatingCoupons] = useState(new Set());
  const [tempFilters, setTempFilters] = useState({
    sorting: {
      sortBy: 'createdAt',
      direction: 'desc'
    }
  });
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: 0,
    minimumPurchaseAmount: 0,
    maximumDiscountAmount: 0,
    validFrom: '',
    validUntil: '',
    usageLimit: 0,
    isActive: true
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState(null);

  useEffect(() => {
    dispatch(fetchCoupons({
      page: 0,
      size: 6,
      sortBy: tempFilters.sorting.sortBy,
      direction: tempFilters.sorting.direction
    }));
  }, [dispatch, tempFilters.sorting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const couponData = {
      code: formData.code,
      description: formData.description,
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      minimumPurchaseAmount: formData.minimumPurchaseAmount,
      maximumDiscountAmount: formData.maximumDiscountAmount,
      validFrom: new Date(formData.validFrom).toISOString(),
      validUntil: new Date(formData.validUntil).toISOString(),
      usageLimit: formData.usageLimit,
      isActive: formData.isActive
    };

    try {
      if (formData.couponId) {
        setUpdatingCoupons(prev => new Set(prev).add(formData.couponId));
        await dispatch(updateCoupon({ 
          couponId: formData.couponId, 
          couponData 
        })).unwrap();
      } else {
        await dispatch(createCoupon(couponData)).unwrap();
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save coupon:', error);
    } finally {
      if (formData.couponId) {
        setUpdatingCoupons(prev => {
          const newSet = new Set(prev);
          newSet.delete(formData.couponId);
          return newSet;
        });
      }
    }
  };

  const handleEdit = (coupon) => {
    setFormData({
      ...coupon,
      validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
      validUntil: new Date(coupon.validUntil).toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleDelete = async (couponId) => {
    setSelectedCouponId(couponId);
    setShowDeleteModal(true);
  };

  const handleStatusToggle = async (couponId, currentStatus) => {
    try {
      setUpdatingCoupons(prev => new Set(prev).add(couponId));
      await dispatch(updateCouponStatus({ 
        couponId, 
        isActive: !currentStatus 
      })).unwrap();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdatingCoupons(prev => {
        const newSet = new Set(prev);
        newSet.delete(couponId);
        return newSet;
      });
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'PERCENTAGE',
      discountValue: 0,
      minimumPurchaseAmount: 0,
      maximumDiscountAmount: 0,
      validFrom: '',
      validUntil: '',
      usageLimit: 0,
      isActive: true
    });
  };

  const renderStatusButton = (coupon) => {
    const isUpdating = updatingCoupons.has(coupon.couponId);
    
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleStatusToggle(coupon.couponId, coupon.isActive)}
          disabled={isUpdating}
          className={`
            p-2 rounded-lg transition-colors duration-300
            ${isUpdating 
              ? 'opacity-50 cursor-not-allowed'
              : coupon.isActive 
                ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                : isDark 
                  ? 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                  : 'bg-gray-200/50 text-gray-500 hover:bg-gray-200'
            }
          `}
        >
          <Power className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
        </button>
        <span className={`
          text-sm font-medium
          ${coupon.isActive 
            ? coupon.isExpired
              ? 'text-yellow-500'
              : 'text-green-500'
            : isDark ? 'text-gray-400' : 'text-gray-500'
          }
        `}>
          {isUpdating 
            ? 'Updating...'
            : coupon.isActive 
              ? coupon.isExpired
                ? 'Expired'
                : 'Active'
              : 'Inactive'
          }
        </span>
      </div>
    );
  };

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
      { value: 'validFrom', label: 'Valid From' },
      { value: 'validUntil', label: 'Valid Until' },
      { value: 'discountValue', label: 'Discount Value' },
      { value: 'timesUsed', label: 'Usage Count' }
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
                Sort Coupons
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
          <span className="font-medium">{pagination.totalElements}</span> coupons
        </p>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border hover:bg-cardBg text-text border-border"
            disabled={pagination.isFirst}
            onClick={() => {
              dispatch(fetchCoupons({ 
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
                dispatch(fetchCoupons({ 
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
              dispatch(fetchCoupons({ 
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

  return (
    <div className={`p-6`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text">Coupon Management</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleOpenFilters}
            className="rounded-full border border-border hover:bg-cardBg transition flex gap-2 items-center px-4 py-2"
          >
            <SlidersHorizontal className="text-text w-5 h-5" />
            <span className="text-text">Sort</span>
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryHover transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Coupon
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-4 text-text">Loading...</div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-4 text-textSecondary">No coupons found</div>
        ) : (
          <>
            <div className={`overflow-x-auto rounded-xl border border-border ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-textSecondary">Code</th>
                    <th className="px-4 py-3 text-left text-textSecondary">Description</th>
                    <th className="px-4 py-3 text-left text-textSecondary">Discount</th>
                    <th className="px-4 py-3 text-left text-textSecondary">Valid Until</th>
                    <th className="px-4 py-3 text-left text-textSecondary">Status</th>
                    <th className="px-4 py-3 text-left text-textSecondary">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {coupons.map((coupon) => (
                    <tr key={coupon.couponId} className="hover:bg-primary/5 transition-colors">
                      <td className="px-4 py-3 text-text">{coupon.code}</td>
                      <td className="px-4 py-3 text-text">{coupon.description}</td>
                      <td className="px-4 py-3 text-text">
                        {coupon.discountValue}
                        {coupon.discountType === 'PERCENTAGE' ? '%' : '$'}
                      </td>
                      <td className="px-4 py-3 text-text">
                        {new Date(coupon.validUntil).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {renderStatusButton(coupon)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(coupon)}
                            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4 text-primary" />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.couponId)}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PaginationControls />
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`
            w-full max-w-2xl mx-4 p-6 rounded-xl shadow-xl
            ${isDark ? 'bg-[#1a1a1a] border border-white/10' : 'bg-white border border-black/10'}
          `}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-text">
                {formData.couponId ? 'Edit Coupon' : 'Create New Coupon'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-text" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-textSecondary mb-1 flex items-center gap-1">
                    Code
                    <span 
                      className="text-xs text-primary cursor-help"
                      title="Unique code that customers will enter to apply the discount"
                    >
                      ⓘ
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-inputBg text-text"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-textSecondary mb-1 flex items-center gap-1">
                    Discount Type
                    <span 
                      className="text-xs text-primary cursor-help"
                      title="Either percentage (%) off total or fixed amount ($) off total"
                    >
                      ⓘ
                    </span>
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-inputBg text-text"
                  >
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FIXED_AMOUNT">Fixed Amount</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-textSecondary mb-1 flex items-center gap-1">
                  Description
                  <span 
                    className="text-xs text-primary cursor-help"
                    title="Description of the coupon that will be shown to customers"
                  >
                    ⓘ
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-inputBg text-text"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-textSecondary mb-1 flex items-center gap-1">
                    Discount Value
                    <span 
                      className="text-xs text-primary cursor-help"
                      title="For percentage: enter value (20 = 20%). For fixed amount: enter dollar value ($10.00)"
                    >
                      ⓘ
                    </span>
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-inputBg text-text"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-textSecondary mb-1 flex items-center gap-1">
                    Usage Limit
                    <span 
                      className="text-xs text-primary cursor-help"
                      title="Maximum number of times this coupon can be used in total"
                    >
                      ⓘ
                    </span>
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-inputBg text-text"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-textSecondary mb-1 flex items-center gap-1">
                    Minimum Purchase
                    <span 
                      className="text-xs text-primary cursor-help"
                      title="Minimum order total required to use this coupon"
                    >
                      ⓘ
                    </span>
                  </label>
                  <input
                    type="number"
                    value={formData.minimumPurchaseAmount}
                    onChange={(e) => setFormData({ ...formData, minimumPurchaseAmount: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-inputBg text-text"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-textSecondary mb-1 flex items-center gap-1">
                    Maximum Discount
                    <span 
                      className="text-xs text-primary cursor-help"
                      title="Maximum discount amount allowed (prevents high % discounts on expensive orders)"
                    >
                      ⓘ
                    </span>
                  </label>
                  <input
                    type="number"
                    value={formData.maximumDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, maximumDiscountAmount: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-inputBg text-text"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-textSecondary mb-1 flex items-center gap-1">
                    Valid From
                    <span 
                      className="text-xs text-primary cursor-help"
                      title="Start date when the coupon becomes valid"
                    >
                      ⓘ
                    </span>
                  </label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-inputBg text-text"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-textSecondary mb-1 flex items-center gap-1">
                    Valid Until
                    <span 
                      className="text-xs text-primary cursor-help"
                      title="End date when the coupon expires"
                    >
                      ⓘ
                    </span>
                  </label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-inputBg text-text"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-border bg-inputBg text-primary focus:ring-primary"
                />
                <label className="text-sm text-textSecondary flex items-center gap-1">
                  Active
                  <span 
                    className="text-xs text-primary cursor-help"
                    title="Whether the coupon is currently active and can be used"
                  >
                    ⓘ
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 text-text py-2 border border-border rounded-lg hover:bg-primary/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryHover transition-colors"
                >
                  {formData.couponId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <FilterModal />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className={`relative rounded-lg p-6 w-full max-w-md ${
            isDark ? 'bg-[#1a1a1a] border border-white/10' : 'bg-white border border-black/10'
          }`}>
            <h3 className="text-xl font-semibold text-text mb-4">Confirm Delete</h3>
            <p className="text-textSecondary">Are you sure you want to delete this coupon? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteModal(false)}
                className="border-border hover:bg-cardBg"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  dispatch(deleteCoupon(selectedCouponId));
                  setShowDeleteModal(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement; 