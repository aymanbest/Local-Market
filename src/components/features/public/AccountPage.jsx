import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, LogOut, Shield, ClipboardList, Clock, XCircle, CheckCircle2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../../store/slices/auth/authSlice';
import { fetchApplicationStatus } from '../../../store/slices/producer/producerApplicationsSlice';
import { formatDistanceToNow, addDays, parseISO, isAfter } from 'date-fns';
import api from '../../../lib/axios';

const AccountPage = ({ adminOnly = false, producerOnly = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector(state => state.auth);
  const { applicationStatus, loading } = useSelector(state => state.producerApplications);
  const isInAdminSection = location.pathname.startsWith('/admin');
  const isInProducerSection = location.pathname.startsWith('/producer');

  useEffect(() => {
    if (user?.role === 'customer') {
      dispatch(fetchApplicationStatus());
    }
  }, [dispatch, user]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/login');
    }
  };
  
  const renderApplicationStatus = () => {
    if (!applicationStatus) return null;

    const canReapply = applicationStatus.processedAt && 
      isAfter(new Date(), addDays(parseISO(applicationStatus.processedAt), 15));

    const baseCardClasses = "p-6 rounded-xl transition h-full flex flex-col justify-between";

    switch (applicationStatus.status) {
      case 'PENDING':
        return (
          <div className={`border border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10 ${baseCardClasses}`}>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-yellow-500" />
                <h2 className="text-2xl font-recoleta uppercase font-bold text-yellow-500">Application Pending</h2>
              </div>
              <p className="text-textSecondary">
                Submitted {formatDistanceToNow(parseISO(applicationStatus.submittedAt))} ago
              </p>
            </div>
          </div>
        );

      case 'DECLINED':
        return (
          <Link 
            to={canReapply ? "/account/apply-seller" : "#"}
            className={`border border-red-500/30 bg-red-500/5 ${
              canReapply ? 'hover:bg-red-500/10 cursor-pointer' : 'cursor-not-allowed'
            } ${baseCardClasses}`}
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <XCircle className="w-6 h-6 text-red-500" />
                <h2 className="text-2xl font-recoleta uppercase font-bold text-red-500">
                  {canReapply ? 'Reapply as Seller' : 'Application Declined'}
                </h2>
              </div>
              <p className="text-textSecondary">
                {canReapply 
                  ? 'You can now submit a new application'
                  : `You can reapply after ${formatDistanceToNow(addDays(parseISO(applicationStatus.processedAt), 15))}`
                }
              </p>
            </div>
          </Link>
        );

      case 'APPROVED':
        return (
          <Link 
            to="/producer/products" 
            className={`border border-green-500/30 bg-green-500/5 hover:bg-green-500/10 ${baseCardClasses}`}
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <h2 className="text-2xl font-recoleta uppercase font-bold text-green-500">Seller Account Active</h2>
              </div>
              <p className="text-textSecondary">Access your seller dashboard to manage your products and orders</p>
            </div>
          </Link>
        );

      default:
        return null;
    }
  };

  const baseCardClasses = "p-6 rounded-xl transition h-full flex flex-col justify-between";

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="container p-4">
          <div className="flex flex-wrap justify-center items-center md:justify-between mb-4 gap-4">
            <h2 className="text-4xl font-recoleta font-semibold uppercase">Account</h2>
            <div className="flex items-center gap-2">
              <Link to="/store" className="rounded-full border border-border hover:bg-cardBg transition flex gap-2 items-center px-4 py-2">
                <ArrowLeft className="w-6 h-6" />
                <span>Back to Store</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="rounded-full border border-border hover:bg-cardBg transition flex gap-2 items-center px-4 py-2"
              >
                <LogOut className="w-6 h-6" />
                <span>Logout</span>
              </button>
            </div>
          </div>
          <hr className="border-border" />
        </div>

        <div className="container px-4 pb-24">
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <Link 
              to={
                adminOnly 
                  ? "/admin/profile/security" 
                  : producerOnly 
                    ? "/producer/profile/security"
                    : "/account/security"
              } 
              className={`border border-border hover:bg-cardBg ${baseCardClasses}`}
            >
              <div>
                <h2 className="text-2xl font-recoleta uppercase font-bold">Security</h2>
                <span className="text-textSecondary">Change your password .. etc</span>
              </div>
            </Link>
            
            {!adminOnly && !producerOnly && (
              <>
                <Link 
                  to="/account/orders" 
                  className={`border border-border hover:bg-cardBg ${baseCardClasses}`}
                >
                  <div>
                    <h2 className="text-2xl font-recoleta uppercase font-bold">Order History</h2>
                    <span className="text-textSecondary">View your order bundles and details</span>
                  </div>
                </Link>

                <Link 
                  to="/account/reviews" 
                  className={`border border-border hover:bg-cardBg ${baseCardClasses}`}
                >
                  <div>
                    <h2 className="text-2xl font-recoleta uppercase font-bold">My Reviews</h2>
                    <span className="text-textSecondary">View and manage your product reviews</span>
                  </div>
                </Link>
              </>
            )}

            {user?.role === 'admin' && !isInAdminSection && (
              <Link 
                to="/admin/users" 
                className={`border border-primary/30 bg-primary/5 hover:bg-primary/10 ${baseCardClasses}`}
              >
                <div>
                  <h2 className="text-2xl font-recoleta uppercase font-bold text-primary">Admin Dashboard</h2>
                  <span className="text-textSecondary">Manage users, products, and more</span>
                </div>
              </Link>
            )}

            {user?.role === 'producer' && !isInProducerSection && (
              <Link 
                to="/producer/products" 
                className={`border border-primary/30 bg-primary/5 hover:bg-primary/10 ${baseCardClasses}`}
              >
                <div>
                  <h2 className="text-2xl font-recoleta uppercase font-bold text-primary">Producer Dashboard</h2>
                  <span className="text-textSecondary">Manage your products and orders</span>
                </div>
              </Link>
            )}

            {user?.role === 'customer' && (
              <>
                {loading ? (
                  <div className={`border border-border ${baseCardClasses}`}>
                    <div className="animate-pulse space-y-4">
                      <div className="h-8 bg-border rounded w-3/4"></div>
                      <div className="h-4 bg-border rounded w-1/2"></div>
                    </div>
                  </div>
                ) : !applicationStatus || applicationStatus.status === 'NO_APPLICATION' ? (
                  <Link 
                    to="/account/apply-seller" 
                    className={`border border-border hover:bg-cardBg ${baseCardClasses}`}
                  >
                    <div>
                      <h2 className="text-2xl font-recoleta uppercase font-bold">Become a Seller</h2>
                      <span className="text-textSecondary">Sell your products on our platform</span>
                    </div>
                  </Link>
                ) : (
                  renderApplicationStatus()
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage; 