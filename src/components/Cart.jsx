import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [couponCode, setCouponCode] = useState('');
  const [email, setEmail] = useState('');
  const [makeAccount, setMakeAccount] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold tracking-wide">CHECKOUT</h1>
          <Link 
            to="/store" 
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-800 bg-[#1E1E1E] hover:bg-[#2A2A2A] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Store
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="bg-transparent border border-gray-800 rounded-2xl p-8">
              <div className="text-center py-4">
                <h2 className="text-2xl font-bold">CART IS EMPTY</h2>
              </div>
            </div>

            {/* Billing Details */}
            <div className="bg-transparent border border-gray-800 rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-6">Billing Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-[#1E1E1E] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4500]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="makeAccount"
                    checked={makeAccount}
                    onChange={(e) => setMakeAccount(e.target.checked)}
                    className="rounded border-gray-800 bg-[#1E1E1E] text-[#FF4500] focus:ring-0"
                  />
                  <label htmlFor="makeAccount" className="text-gray-400">Make an account?</label>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-transparent border border-gray-800 rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-6">Payment Method</h2>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center gap-3 p-4 rounded-xl border ${
                    paymentMethod === 'card' 
                      ? 'border-[#FF4500] bg-[#1E1E1E]' 
                      : 'border-gray-800 bg-[#1E1E1E]'
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-[#1a1a1a] rounded-lg text-[#00A8E8]">
                    💳
                  </div>
                  <span>Card/Google Pay/Apple Pay</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('cashapp')}
                  className={`flex items-center gap-3 p-4 rounded-xl border ${
                    paymentMethod === 'cashapp' 
                      ? 'border-[#FF4500] bg-[#1E1E1E]' 
                      : 'border-gray-800 bg-[#1E1E1E]'
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-[#1a1a1a] rounded-lg text-[#00D632]">
                    $
                  </div>
                  <span>Cash App</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('crypto')}
                  className={`flex items-center gap-3 p-4 rounded-xl border ${
                    paymentMethod === 'crypto' 
                      ? 'border-[#FF4500] bg-[#1E1E1E]' 
                      : 'border-gray-800 bg-[#1E1E1E]'
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-[#1a1a1a] rounded-lg text-[#F7931A]">
                    ₿
                  </div>
                  <span>Crypto</span>
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-transparent border border-gray-800 rounded-2xl p-8 h-fit">
            <div className="space-y-6">
              {/* Promo Code */}
              <div>
                <h3 className="text-lg font-medium mb-4">Got a Promo Code?</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon Code"
                    className="flex-1 bg-[#1E1E1E] border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4500]"
                  />
                  <button className="px-6 py-2 bg-[#FF4500] hover:bg-[#FF6D33] text-white rounded-lg transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-400">
                    <span>Items</span>
                    <span>0</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Service Fee</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between font-medium pt-3 border-t border-gray-800">
                    <span>Total</span>
                    <span>$0.00</span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="rounded border-gray-800 bg-[#1E1E1E] text-[#FF4500] focus:ring-0"
                />
                <label htmlFor="terms" className="text-gray-400">
                  I agree to the <Link to="/terms" className="text-white hover:text-[#FF4500]">Terms of Service</Link>
                </label>
              </div>

              {/* Checkout Button */}
              <button 
                className="w-full bg-[#FF4500] hover:bg-[#FF6D33] text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!agreeToTerms || items.length === 0}
              >
                Checkout
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

