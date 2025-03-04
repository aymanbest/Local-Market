import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, XCircle, Clock, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '../../../lib/axios';
import useLoading from '../../../hooks/useLoading';
import Preloader from '../preloader/Preloader';

const OrderBundle = () => {
  const { bundleId } = useParams();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get('token');
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  const isLoading = useLoading();
  const navigate = useNavigate();

  const statusConfig = {
    'PENDING_PAYMENT': { icon: Clock, color: 'yellow', text: 'Pending Payment' },
    'PAYMENT_FAILED': { icon: XCircle, color: 'red', text: 'Payment Failed' },
    'PAYMENT_COMPLETED': { icon: CheckCircle, color: 'green', text: 'Payment Completed' },
    'PROCESSING': { icon: Package, color: 'blue', text: 'Processing' },
    'SHIPPED': { icon: Truck, color: 'purple', text: 'Shipped' },
    'DELIVERED': { icon: CheckCircle, color: 'green', text: 'Delivered' },
    'CANCELLED': { icon: XCircle, color: 'red', text: 'Cancelled' },
    'RETURNED': { icon: AlertCircle, color: 'orange', text: 'Returned' }
  };

  useEffect(() => {
    const fetchOrderBundle = async () => {
      try {
        const config = {
          params: { accessToken },
        };
        const response = await api.get(`/api/orders/bundle/${bundleId}`, config);
        setOrders(response.data);
      } catch (error) {
        setError('Failed to fetch order details');
      }
    };

    fetchOrderBundle();
  }, [bundleId, accessToken]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text text-center">
          <p className="text-xl">{error}</p>
        </div>
      </div>
    );
  }

  const getTotalBundlePrice = () => {
    return orders?.reduce((total, order) => total + order.totalPrice, 0) || 0;
  };

  return (
    <>
      {isLoading && <Preloader />}
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="rounded-full border border-border hover:bg-cardBg transition flex gap-2 items-center px-4 py-2"
              >
                <ArrowLeft className="w-5 h-5 text-text" />
                <span className="text-text">Back</span>
              </button>
              <h1 className="text-3xl font-bold text-text">Order Details</h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-textSecondary">Bundle Total</p>
              <p className="text-2xl font-bold text-text">${getTotalBundlePrice().toFixed(2)}</p>
            </div>
          </div>

          <div className="space-y-8">
            {orders?.map((order) => (
              <div key={order.orderId} className="bg-cardBg border border-border rounded-xl overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex flex-wrap gap-4 justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-text">Order #{order.orderId}</h2>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm"
                          style={{ 
                            backgroundColor: `var(--${statusConfig[order.status].color})`,
                            color: 'white'
                          }}>
                          {React.createElement(statusConfig[order.status].icon, { className: 'w-4 h-4' })}
                          <span>{statusConfig[order.status].text}</span>
                        </div>
                      </div>
                      <p className="text-sm text-textSecondary mt-1">
                        Placed on {new Date(order.orderDate).toLocaleDateString()} at{' '}
                        {new Date(order.orderDate).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-textSecondary">Order Total</p>
                      <p className="text-xl font-bold text-text">${order.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="divide-y divide-border">
                  {order.items.map((item) => (
                    <div key={item.orderItemId} className="p-6 hover:bg-background/50 transition-colors">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-inputBg rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.product.imageUrl ? (
                            <img 
                              src={item.product.imageUrl} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="w-10 h-10 text-textSecondary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h3 className="text-lg font-medium text-text truncate">
                                {item.product.name}
                              </h3>
                              <p className="text-sm text-textSecondary mt-1">
                                Quantity: {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                              <p className="text-sm text-textSecondary">
                                Seller: {item.product.producer.firstname} {item.product.producer.lastname}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-lg font-medium text-text">
                                ${(item.quantity * item.price).toFixed(2)}
                              </p>
                              <Link 
                                to={`/store/products/${item.product.productId}`}
                                className="inline-flex items-center gap-1 text-primary hover:text-primaryHover mt-2 text-sm"
                              >
                                Order Again
                                <ArrowRight className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="p-6 bg-background/50">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-textSecondary">Shipping Address:</span>
                      <span className="text-text">{order.shippingAddress}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-textSecondary">Phone Number:</span>
                      <span className="text-text">{order.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-textSecondary">Payment Method:</span>
                      <span className="text-text">{order.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderBundle; 