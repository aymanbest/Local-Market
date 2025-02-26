import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, DollarSign, Bitcoin, Minus, Plus, Trash2 } from 'lucide-react';
import { updateQuantity, removeFromCart, clearCart } from '../../../store/slices/product/cartSlice';
import api from '../../../lib/axios';
import PaymentForm from '../order/PaymentForm';

const Cart = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [couponCode, setCouponCode] = useState('');
  const [couponValidation, setCouponValidation] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [email, setEmail] = useState('');
  const [makeAccount, setMakeAccount] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const navigate = useNavigate();

  const total = items.length > 0 ? items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;

  const handleCouponValidation = async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setValidatingCoupon(true);
    setError('');
    
    try {
      const response = await api.get(`/api/coupons/validate/${couponCode}`, {
        params: { cartTotal: total }
      });
      
      setCouponValidation(response.data);
      
      if (!response.data.valid) {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to validate coupon');
      setCouponValidation(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!agreeToTerms) {
      setError('Please agree to the Terms of Service');
      return;
    }

    setLoading(true);
    setError('');

    const orderData = {
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      shippingAddress,
      phoneNumber,
      paymentMethod,
      ...(couponValidation?.valid && { couponCode }),
      ...(user ? {} : { 
        guestEmail: email,
        ...(makeAccount && {
          accountCreation: {
            createAccount: true,
            username,
            password,
            firstname,
            lastname
          }
        })
      })
    };

    try {
    
      const response = await api.post('/api/orders/checkout', orderData, { withCredentials: user ? true : false });
      const orderResponse = Array.isArray(response.data) ? response.data[0] : response.data;
      
      if (orderResponse.orderId) {
        dispatch(clearCart());
        navigate(`/payment?token=${orderResponse.accessToken}`);
      } else {
        throw new Error('Invalid order response');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during checkout');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };

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
        {showPaymentForm && currentOrderId ? (
          <PaymentForm
            orderId={currentOrderId}
            paymentMethod={paymentMethod}
            onSuccess={(data) => {
              navigate(`/orders/${data.orderId}`);
            }}
            onError={(error) => {
              setError(error);
            }}
          />
        ) : (
          <form onSubmit={handleCheckout} className="flex flex-col md:flex-row gap-4 py-4">
            <div className="h-max flex-col flex gap-4 flex-1">
              {/* Cart Items */}
              <div className="border border-border bg-cardBg px-4 rounded-xl w-full divide-y divide-border transition-colors duration-300">
                {items.length === 0 ? (
                  <h1 className="text-center w-full font-bold text-2xl font-recoleta py-12 text-text">
                    Cart is empty
                  </h1>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-3 py-4">
                      <img 
                        src={item.imageUrl || `https://placehold.co/600x400?text=${item.name}`} 
                        alt={item.name} 
                        className="aspect-square w-24 h-24 shrink-0 z-10 object-cover rounded-lg border"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between w-full">
                          <h2 className="uppercase font-bold">{item.name}</h2>
                          <h2 className="text-xl text-text font-semibold">${(item.quantity * item.price).toFixed(2)}</h2>
                        </div>
                        
                        <div className="flex gap-2 items-center text-xs">
                          <span className="text-text text-neutral-300">${item.price.toFixed(2)}</span>
                          <span className="w-px h-3 bg-white"></span>
                          <span className="text-blue-400">In Stock</span>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                          <div className="inline-flex items-center border bg-white/5 p-1 rounded-lg">
                            <button 
                              type="button" 
                              className="p-1 bg-white/10 rounded"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <input 
                              type="number"
                              min="1"
                              max="150"
                              value={item.quantity}
                              onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="hide-spinner bg-transparent px-2 max-w-12 text-center text-sm"
                            />
                            <button 
                              type="button" 
                              className="p-1 bg-white/10 rounded"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div>
                            <button 
                              type="button"
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="flex items-center gap-1.5 group text-neutral-300"
                            >
                              <Trash2 className="w-5 group-hover:text-red-400 text-text transition" />
                              <span className=" text-text group-hover:text-red-400 transition">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Billing Details */}
              <div className="border border-border bg-cardBg px-4 pb-4 rounded-xl transition-colors duration-300">
                <h2 className="text-xl py-4 text-text">Billing Details</h2>
                <hr className="border-border" />
                <div className="flex flex-col gap-6 mt-4">
                  {!user && (
                    <div className="flex-1">
                      <label className="block mb-1.5">
                        <span className="text-xs text-textSecondary mb-1 block">Email Address</span>
                        <input 
                          type="email" 
                          placeholder="Enter your email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full rounded-lg border border-border bg-inputBg px-4 py-2 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary text-text"
                          required 
                        />
                      </label>
                      {email && (
                        <label className="flex items-center mt-3 transition-all duration-300 ease-in-out opacity-100">
                          <input 
                            type="checkbox" 
                            className="appearance-none peer" 
                            checked={makeAccount}
                            onChange={(e) => setMakeAccount(e.target.checked)}
                          />
                          <span className="w-5 h-5 border border-border bg-inputBg peer-checked:bg-primary rounded mr-2 transition-colors duration-300"></span>
                          <span className="text-text">Make an account?</span>
                        </label>
                      )}
                    </div>
                  )}

                  {email && makeAccount && (
                    <div className="grid grid-cols-2 gap-4 transition-all duration-300 ease-in-out">
                      <label className="block">
                        <span className="text-xs text-textSecondary mb-1 block">First Name</span>
                        <input 
                          type="text" 
                          placeholder="John" 
                          value={firstname}
                          onChange={(e) => setFirstname(e.target.value)}
                          className="block w-full rounded-lg border border-border bg-inputBg px-4 py-2 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary text-text"
                          required
                        />
                      </label>
                      {firstname && (
                        <label className="block transition-all duration-300 ease-in-out">
                          <span className="text-xs text-textSecondary mb-1 block">Last Name</span>
                          <input 
                            type="text" 
                            placeholder="Doe" 
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            className="block w-full rounded-lg border border-border bg-inputBg px-4 py-2 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary text-text"
                            required
                          />
                        </label>
                      )}
                      {lastname && (
                        <label className="block transition-all duration-300 ease-in-out">
                          <span className="text-xs text-textSecondary mb-1 block">Username</span>
                          <input 
                            type="text" 
                            placeholder="johndoe" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="block w-full rounded-lg border border-border bg-inputBg px-4 py-2 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary text-text"
                            required
                          />
                        </label>
                      )}
                      {username && (
                        <label className="block transition-all duration-300 ease-in-out">
                          <span className="text-xs text-textSecondary mb-1 block">Password</span>
                          <input 
                            type="password" 
                            placeholder="••••••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full rounded-lg border border-border bg-inputBg px-4 py-2 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary text-text"
                            required
                          />
                        </label>
                      )}
                    </div>
                  )}

                  {(email || user) && (
                    <div className="space-y-4 transition-all duration-300 ease-in-out">
                      <label className="block">
                        <span className="text-xs text-textSecondary mb-1 block">Shipping Address</span>
                        <input 
                          type="text"
                          placeholder="Enter your shipping address"
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          className="block w-full rounded-lg border border-border bg-inputBg px-4 py-2 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary text-text"
                          required
                        />
                      </label>
                      {shippingAddress && (
                        <label className="block transition-all duration-300 ease-in-out">
                          <span className="text-xs text-textSecondary mb-1 block">Phone Number</span>
                          <input 
                            type="tel"
                            placeholder="Enter your phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="block w-full rounded-lg border border-border bg-inputBg px-4 py-2 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary text-text"
                            required
                          />
                        </label>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="border border-border bg-cardBg px-4 pb-4 rounded-xl transition-colors duration-300">
                <h2 className="text-xl py-4 text-text">Payment Method</h2>
                <hr className="border-border mb-4" />
                <div className="grid md:grid-flow-col gap-4">
                  {/* Card Payment */}
                  <label className="inline-flex p-2 border border-border rounded-xl items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="payment" 
                      className="hidden peer" 
                      value="CARD"
                      checked={paymentMethod === 'CARD'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="p-2 border border-primary/30 bg-primary/10 rounded-lg">
                      <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                    <span className="ml-2 text-text">Card/Google Pay/Apple Pay</span>
                    <span className="w-5 h-5 rounded-full border-4 border-border bg-inputBg peer-checked:bg-primary ml-auto transition-colors duration-300"></span>
                  </label>

                  {/* Cash App */}
                  {/* <label className="inline-flex p-2 border border-border rounded-xl items-center cursor-pointer">
                    <input type="radio" name="payment" className="hidden peer" value="CASHAPP" />
                    <div className="p-2 border border-cashapp/30 bg-cashapp/20 rounded-lg">
                      <DollarSign className="w-6 h-6 text-cashapp" />
                    </div>
                    <span className="ml-2 text-text">Cash App</span>
                    <span className="w-5 h-5 rounded-full border-4 border-border bg-inputBg peer-checked:bg-cashapp ml-auto transition-colors duration-300"></span>
                  </label> */}

                  {/* Crypto */}
                  <label className="inline-flex p-2 border border-border rounded-xl items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="payment" 
                      className="hidden peer" 
                      value="BITCOIN"
                      checked={paymentMethod === 'BITCOIN'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="p-2 border border-bitcoin/30 bg-bitcoin/10 rounded-lg">
                      <Bitcoin className="w-6 h-6 text-bitcoin" />
                    </div>
                    <span className="ml-2 text-text">BITCOIN</span>
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
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setCouponValidation(null);
                  }}
                />
                <button 
                  type="button" 
                  className="whitespace-nowrap rounded-full px-5 py-1.5 text-white transition-colors duration-300 bg-primary hover:bg-primaryHover disabled:opacity-50"
                  onClick={handleCouponValidation}
                  disabled={validatingCoupon}
                >
                  {validatingCoupon ? 'Validating...' : 'Apply'}
                </button>
              </div>

              {couponValidation?.valid && (
                <div className="mt-2 text-sm text-green-500">
                  {couponValidation.discountDescription}
                </div>
              )}

              <hr className="my-4 border-border" />
              
              <h3 className="mb-2 text-text">Order Summary</h3>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Items</span>
                <span>${total.toFixed(2)}</span>
              </div>
              {couponValidation?.valid && (
                <div className="flex justify-between items-center text-green-500">
                  <span>Discount</span>
                  <span>-${couponValidation.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Service Fee</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between items-center font-bold">
                <span className="text-neutral-400">Total</span>
                <span>${(couponValidation?.valid ? couponValidation.finalPrice : total).toFixed(2)}</span>
              </div>

              <label className="flex items-center mt-3">
                <input 
                  type="checkbox" 
                  name="tos" 
                  className="appearance-none peer" 
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  required 
                />
                <span className="w-5 h-5 border border-border bg-inputBg peer-checked:bg-primary rounded mr-2 transition-colors duration-300"></span>
                <span>I agree to the <Link to="/tos" className="text-primary underline">Terms of Service</Link></span>
              </label>

              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}

              <button 
                type="submit" 
                disabled={!agreeToTerms || loading}
                className="whitespace-nowrap rounded-full px-5 py-1.5 text-white transition-colors duration-300 bg-primary hover:bg-primaryHover disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full justify-center mt-3"
              >
                <span>{loading ? 'Processing...' : 'Checkout'}</span>
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </button>
            </aside>
          </form>
        )}
      </div>
    </div>
  );
};

export default Cart;
