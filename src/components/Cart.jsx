import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, DollarSign, Bitcoin } from 'lucide-react';

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
    
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-4xl font-staatliches font-semibold uppercase">
            Checkout
          </h2>
          <a href="/store" className="rounded-full border border-[#fff3] hover:bg-white/10 transition flex gap-2 items-center px-4 py-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="100%" 
              height="100%" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-6 h-6"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            <span>Back to Store</span>
          </a>
        </div>
        <hr className="border-white/20" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form method="post" action="?/checkout" className="flex flex-col md:flex-row gap-4 py-4">
          <div className="h-max flex-col flex gap-4 flex-1">
            {/* Cart Items */}
            <div className="border border-[#fff3] px-4 rounded-xl w-full divide-y divide-white/20">
              <h1 className="text-center w-full font-bold text-2xl font-staatliches py-12">
                Cart is empty
              </h1>
            </div>

            {/* Billing Details */}
            <div className="border border-[#fff3] px-4 pb-4 rounded-xl">
              <h2 className="text-xl py-4">Billing Details</h2>
              <hr className="border-white/20" />
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex-1">
                  <label>
                    <span className="text-xs">Email Address</span>
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="block w-full rounded-lg border border-[#fff3] bg-[#ffffff0d] px-4 py-2 text-sm transition-all focus:border-[#206d8a]" 
                      name="email" 
                      required 
                    />
                  </label>
                  <label className="flex items-center mt-2">
                    <input 
                      type="checkbox" 
                      name="register" 
                      className="appearance-none peer" 
                      checked={makeAccount}
                      onChange={(e) => setMakeAccount(e.target.checked)}
                    />
                    <span className="w-5 h-5 border border-[#fff3] bg-white/5 peer-checked:bg-blue-400 rounded mr-2"></span>
                    <span>Make an account?</span>
                  </label>
                  {makeAccount && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <label>
                        <span className="text-xs">Username</span>
                        <input 
                          type="text" 
                          placeholder="real_dude" 
                          className="block w-full rounded-lg border border-[#fff3] bg-[#ffffff0d] px-4 py-2 text-sm transition-all focus:border-[#206d8a] mt-1" 
                          name="username" 
                          required
                        />
                      </label>
                      <label>
                        <span className="text-xs">Password</span>
                        <input 
                          type="password" 
                          placeholder="••••••••••••" 
                          className="block w-full rounded-lg border border-[#fff3] bg-[#ffffff0d] px-4 py-2 text-sm transition-all focus:border-[#206d8a] mt-1" 
                          name="password" 
                          required
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="border border-[#fff3] px-4 pb-4 rounded-xl">
              <h2 className="text-xl py-4">Payment Method</h2>
              <hr className="border-white/20 mb-4" />
              <div className="grid md:grid-flow-col gap-4">
                {/* Card Payment */}
                <label className="inline-flex p-2 border border-[#fff3] rounded-xl items-center cursor-pointer">
                  <input type="radio" name="payment" className="hidden peer" value="card" />
                  <div className="p-2 border border-blue-400/30 bg-blue-400/20 rounded-lg">
                    <CreditCard className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="ml-2">Card/Google Pay/Apple Pay</span>
                  <span className="w-5 h-5 rounded-full border-4 border-neutral-800 bg-neutral-800 peer-checked:bg-blue-400 ml-auto transition"></span>
                </label>

                {/* Cash App */}
                <label className="inline-flex p-2 border border-[#fff3] rounded-xl items-center cursor-pointer">
                  <input type="radio" name="payment" className="hidden peer" value="cashapp" />
                  <div className="p-2 border border-cashapp/30 bg-cashapp/20 rounded-lg">
                    <DollarSign className="w-6 h-6 text-cashapp" />
                  </div>
                  <span className="ml-2">Cash App</span>
                  <span className="w-5 h-5 rounded-full border-4 border-neutral-800 bg-neutral-800 peer-checked:bg-blue-400 ml-auto transition"></span>
                </label>

                {/* Crypto */}
                <label className="inline-flex p-2 border border-[#fff3] rounded-xl items-center cursor-pointer">
                  <input type="radio" name="payment" className="hidden peer" value="coinbase" />
                  <div className="p-2 border border-bitcoin/30 bg-bitcoin/10 rounded-lg">
                    <Bitcoin className="w-6 h-6 text-bitcoin" />
                  </div>
                  <span className="ml-2">Crypto</span>
                  <span className="w-5 h-5 rounded-full border-4 border-neutral-800 bg-neutral-800 peer-checked:bg-bitcoin ml-auto transition"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <aside className="h-max border border-[#fff3] rounded-xl shrink-0 p-4">
            <h3 className="mb-2">Got a Promo Code?</h3>
            <div className="flex gap-2 items-stretch">
              <input 
                type="text" 
                placeholder="Coupon Code" 
                className="block w-full rounded-lg border border-[#fff3] bg-[#ffffff0d] px-4 py-2 text-sm transition-all focus:border-[#206d8a]" 
                name="coupon"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button 
                type="button" 
                className="whitespace-nowrap rounded-full px-5 py-1.5 text-[#f4f2ff] transition bg-[#e43d00] bg-gradient-[72deg] from-[#e43d00] to-[#fb7443] hover:border-[#76b041] hover:text-white hover:brightness-90"
                onClick={() => {/* handle coupon application */}}
              >
                Apply
              </button>
            </div>

            <hr className="my-4 border-white/20" />
            
            <h3 className="mb-2">Order Summary</h3>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Items</span>
              <span>0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Service Fee</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Total</span>
              <span>$0.00</span>
            </div>

            <label className="flex items-center mt-3">
              <input type="checkbox" name="tos" className="appearance-none peer" required />
              <span className="w-5 h-5 border border-[#fff3] bg-white/5 peer-checked:bg-blue-400 rounded mr-2"></span>
              <span>I agree to the <Link to="/tos" className="text-white underline">Terms of Service</Link></span>
            </label>

            <button type="submit" className="whitespace-nowrap rounded-full px-5 py-1.5 text-[#f4f2ff] transition bg-[#e43d00] bg-gradient-[72deg] from-[#e43d00] to-[#fb7443] hover:border-[#76b041] hover:text-white hover:brightness-90 flex items-center gap-2 w-full justify-center mt-3">
              <span>Checkout</span>
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </button>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default Cart;
