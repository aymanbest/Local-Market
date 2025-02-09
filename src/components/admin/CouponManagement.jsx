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
} from '../../store/slices/couponSlice';
import { Plus, Pencil, Trash2, X, Power } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const CouponManagement = () => {
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const { coupons, loading, error } = useSelector((state) => state.coupons);
  const [showModal, setShowModal] = useState(false);
  const [updatingCoupons, setUpdatingCoupons] = useState(new Set());
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

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

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
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      await dispatch(deleteCoupon(couponId));
    }
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

  return (
    <div className={`p-6 ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text">Coupon Management</h1>
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
                  className="px-4 py-2 border border-border rounded-lg hover:bg-primary/10 transition-colors"
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
    </div>
  );
};

export default CouponManagement; 