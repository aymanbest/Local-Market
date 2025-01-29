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
    <div className="min-h-screen bg-background text-text pb-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-4xl font-recoleta font-semibold uppercase text-text">
            Checkout
          </h2>
          <Link to="/store" className="rounded-full border border-border hover:bg-text/5 transition-colors duration-300 flex gap-2 items-center px-4 py-2">
            <ArrowLeft className="w-6 h-6" />
            <span>Back to Store</span>
          </Link>
        </div>
        <hr className="border-border" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form method="post" action="?/checkout" className="flex flex-col md:flex-row gap-4 py-4">
          <div className="h-max flex-col flex gap-4 flex-1">
            {/* Cart Items */}
            <div className="border border-border bg-cardBg px-4 rounded-xl w-full divide-y divide-border transition-colors duration-300">
              <h1 className="text-center w-full font-bold text-2xl font-recoleta py-12 text-text">
                Cart is empty
              </h1>
            </div>

            {/* Billing Details */}
            <div className="border border-border bg-cardBg px-4 pb-4 rounded-xl transition-colors duration-300">
              <h2 className="text-xl py-4 text-text">Billing Details</h2>
              <hr className="border-border" />
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex-1">
                  <label>
                    <span className="text-xs text-textSecondary">Email Address</span>
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="block w-full rounded-lg border border-border bg-inputBg px-4 py-2 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary text-text"
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
                    <span className="w-5 h-5 border border-border bg-inputBg peer-checked:bg-primary rounded mr-2 transition-colors duration-300"></span>
                    <span className="text-text">Make an account?</span>
                  </label>
                  {makeAccount && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <label>
                        <span className="text-xs text-textSecondary">Username</span>
                        <input 
                          type="text" 
                          placeholder="real_dude" 
                          className="block w-full rounded-lg border border-border bg-inputBg px-4 py-2 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary text-text"
                          name="username" 
                          required
                        />
                      </label>
                      <label>
                        <span className="text-xs text-textSecondary">Password</span>
                        <input 
                          type="password" 
                          placeholder="••••••••••••" 
                          className="block w-full rounded-lg border border-border bg-inputBg px-4 py-2 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary text-text"
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
            <div className="border border-border bg-cardBg px-4 pb-4 rounded-xl transition-colors duration-300">
              <h2 className="text-xl py-4 text-text">Payment Method</h2>
              <hr className="border-border mb-4" />
              <div className="grid md:grid-flow-col gap-4">
                {/* Card Payment */}
                <label className="inline-flex p-2 border border-border rounded-xl items-center cursor-pointer">
                  <input type="radio" name="payment" className="hidden peer" value="card" />
                  <div className="p-2 border border-primary/30 bg-primary/10 rounded-lg">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <span className="ml-2 text-text">Card/Google Pay/Apple Pay</span>
                  <span className="w-5 h-5 rounded-full border-4 border-border bg-inputBg peer-checked:bg-primary ml-auto transition-colors duration-300"></span>
                </label>

                {/* Cash App */}
                <label className="inline-flex p-2 border border-border rounded-xl items-center cursor-pointer">
                  <input type="radio" name="payment" className="hidden peer" value="cashapp" />
                  <div className="p-2 border border-cashapp/30 bg-cashapp/20 rounded-lg">
                    <DollarSign className="w-6 h-6 text-cashapp" />
                  </div>
                  <span className="ml-2 text-text">Cash App</span>
                  <span className="w-5 h-5 rounded-full border-4 border-border bg-inputBg peer-checked:bg-cashapp ml-auto transition-colors duration-300"></span>
                </label>

                {/* Crypto */}
                <label className="inline-flex p-2 border border-border rounded-xl items-center cursor-pointer">
                  <input type="radio" name="payment" className="hidden peer" value="coinbase" />
                  <div className="p-2 border border-bitcoin/30 bg-bitcoin/10 rounded-lg">
                    <Bitcoin className="w-6 h-6 text-bitcoin" />
                  </div>
                  <span className="ml-2 text-text">Crypto</span>
                  <span className="w-5 h-5 rounded-full border-4 border-border bg-inputBg peer-checked:bg-bitcoin ml-auto transition-colors duration-300"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <aside className="h-max border border-border bg-cardBg rounded-xl shrink-0 p-4 transition-colors duration-300">
            <h3 className="mb-2 text-text">Got a Promo Code?</h3>
            <div className="flex gap-2 items-stretch">
              <input 
                type="text" 
                placeholder="Coupon Code" 
                className="block w-full rounded-lg border border-border bg-inputBg px-4 py-2 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary text-text"
                name="coupon"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button 
                type="button" 
                className="whitespace-nowrap rounded-full px-5 py-1.5 text-white transition-colors duration-300 bg-primary hover:bg-primaryHover"
                onClick={() => {/* handle coupon application */}}
              >
                Apply
              </button>
            </div>

            <hr className="my-4 border-border" />
            
            <h3 className="mb-2 text-text">Order Summary</h3>
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
              <span className="w-5 h-5 border border-border bg-inputBg peer-checked:bg-primary rounded mr-2 transition-colors duration-300"></span>
              <span>I agree to the <Link to="/tos" className="text-primary underline">Terms of Service</Link></span>
            </label>

            <button type="submit" className="whitespace-nowrap rounded-full px-5 py-1.5 text-white transition-colors duration-300 bg-primary hover:bg-primaryHover flex items-center gap-2 w-full justify-center mt-3">
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
