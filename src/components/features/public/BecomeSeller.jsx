import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, DollarSign, Building2, Shield, Wallet, Users, BadgeCheck, Clock, XCircle, CheckCircle2 } from 'lucide-react';
import Button from '../../common/ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplicationStatus } from '../../../store/slices/producer/producerApplicationsSlice';
import { formatDistanceToNow, addDays, parseISO, isAfter, format } from 'date-fns';

const ApplicationStatus = ({ status, submittedAt, processedAt, declineReason }) => {
  const canReapply = processedAt && isAfter(new Date(), addDays(parseISO(processedAt), 15));
  const reapplyDate = processedAt && addDays(parseISO(processedAt), 15);
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-2xl w-full">
        <div className="bg-cardBg backdrop-blur-sm border border-border rounded-2xl p-8 shadow-lg">
          <div className="relative">
            {/* Icon container with animated background */}
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-spin-slow" />
              <div className="absolute inset-2 bg-cardBg rounded-full flex items-center justify-center">
                {status === 'PENDING' && <Clock className="w-12 h-12 text-yellow-500 animate-pulse" />}
                {status === 'DECLINED' && <XCircle className="w-12 h-12 text-red-500 animate-slide-down" />}
                {status === 'APPROVED' && <CheckCircle2 className="w-12 h-12 text-green-500 animate-slide-down" />}
              </div>
            </div>

            <div className="text-center space-y-4">
              {status === 'PENDING' && (
                <>
                  <h2 className="text-3xl font-recoleta text-yellow-500">Application Under Review</h2>
                  <p className="text-textSecondary">
                    Submitted {formatDistanceToNow(parseISO(submittedAt))} ago
                  </p>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 mt-4">
                    <p className="text-textSecondary">
                      Your application is being reviewed by our team. We'll notify you once a decision has been made.
                    </p>
                  </div>
                </>
              )}

              {status === 'DECLINED' && (
                <>
                  <h2 className="text-3xl font-recoleta text-red-500">Application Declined</h2>
                  <p className="text-textSecondary">
                    Processed {formatDistanceToNow(parseISO(processedAt))} ago
                  </p>
                  {declineReason && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mt-4">
                      <h3 className="text-red-500 font-medium mb-2">Reason for Decline:</h3>
                      <p className="text-textSecondary">{declineReason}</p>
                    </div>
                  )}
                  <div className="mt-6 space-y-4">
                    <Button 
                      onClick={() => canReapply && navigate('/account/apply-seller')}
                      disabled={!canReapply}
                      className={`w-full ${
                        canReapply
                          ? 'bg-primary hover:bg-primaryHover text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                      } px-8 py-3 rounded-xl inline-flex items-center justify-center gap-2`}
                    >
                      <ArrowRight className="w-5 h-5" />
                      Reapply Now
                    </Button>
                    {!canReapply && reapplyDate && (
                      <div className="bg-cardBgAdd border border-border rounded-xl p-6">
                        <p className="text-textSecondary mb-2">
                          You can reapply after the waiting period:
                        </p>
                        <p className="text-primary font-medium">
                          {format(reapplyDate, 'MMMM dd, yyyy')} at {format(reapplyDate, 'hh:mm a')}
                        </p>
                        <p className="text-textSecondary mt-2 text-sm">
                          ({formatDistanceToNow(reapplyDate)} remaining)
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {status === 'APPROVED' && (
                <>
                  <h2 className="text-3xl font-recoleta text-green-500">Application Approved</h2>
                  <p className="text-textSecondary">
                    Approved {formatDistanceToNow(parseISO(processedAt))} ago
                  </p>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 mt-4">
                    <p className="text-textSecondary">
                      Congratulations! Your seller account has been activated. You can now access your seller dashboard.
                    </p>
                  </div>
                  <div className="mt-6">
                    <Link to="/producer/products">
                      <Button className="bg-primary hover:bg-primaryHover text-white px-8 py-3 rounded-xl inline-flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Go to Seller Dashboard
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BecomeSeller = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { applicationStatus, loading } = useSelector(state => state.producerApplications);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      dispatch(fetchApplicationStatus());
    }
    if (user?.role === 'producer' || user?.role === 'admin') {
      navigate(-1);
    }
  }, [dispatch, user, navigate]);

  // If user is logged in, check their status
  if (user) {
    // Don't show for producers or admins
    if (user.role === 'producer' || user.role === 'admin') {
      return null;
    }

    // Show application status for customers with pending/approved/declined status
    if (applicationStatus && applicationStatus.status !== 'NO_APPLICATION') {
      return (
        <ApplicationStatus
          status={applicationStatus.status}
          submittedAt={applicationStatus.submittedAt}
          processedAt={applicationStatus.processedAt}
          declineReason={applicationStatus.declineReason}
        />
      );
    }
  }

  // Show the main content for guests and users with NO_APPLICATION status
  return (
    <div className="min-h-screen bg-background text-text pb-16 transition-colors duration-300">
      {/* Hero Section with Diagonal Design */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Diagonal Divider */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent transform -skew-y-6"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {/* New Become a Seller design */}
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-primary" />
                <span className="text-primary font-medium">Become a Seller</span>
              </div>

              <h1 className="text-5xl font-recoleta leading-tight">
                Turn Your Passion Into a 
                <span className="block mt-2 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  Thriving Business
                </span>
              </h1>

              <p className="text-lg text-textSecondary/80">
                Join our marketplace and reach customers who value quality local products. Start your journey today.
              </p>

              <div className="flex items-center gap-4">
                {user ? (
                  <Link to="/account/apply-seller">
                    <Button className="bg-primary hover:bg-primaryHover text-white px-8 py-4 rounded-xl text-lg flex items-center gap-3">
                      Apply Now
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button className="bg-primary hover:bg-primaryHover text-white px-8 py-4 rounded-xl text-lg flex items-center gap-3">
                      Login to Apply
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Right side decorative element */}
            <div className="relative hidden md:block">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <object 
                  data="/select-animate.svg" 
                  type="image/svg+xml"
                  className="w-full max-w-lg mx-auto"
                  aria-label="Seller Illustration"
                >
                </object>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process Section with Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-20">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-cardBg p-8 rounded-2xl border border-cardBorder shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-all duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">1. Create Account</h3>
            <p className="text-textSecondary">Register as a customer and apply to become a seller through your account settings.</p>
          </div>

          {/* Step 2 */}
          <div className="bg-cardBg p-8 rounded-2xl border border-cardBorder shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-all duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <BadgeCheck className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">2. Get Approved</h3>
            <p className="text-textSecondary">Submit your business details and wait for admin approval to start selling.</p>
          </div>

          {/* Step 3 */}
          <div className="bg-cardBg p-8 rounded-2xl border border-cardBorder shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-all duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">3. Start Selling</h3>
            <p className="text-textSecondary">List your products and start reaching local customers immediately after approval.</p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <h2 className="text-4xl font-bold text-center mb-16">
          Benefits of Selling on <span className="text-primary">Local Market</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center space-y-4">
            <DollarSign className="w-12 h-12 text-primary mx-auto" />
            <h3 className="text-2xl font-semibold">Earn More</h3>
            <p className="text-textSecondary">Our selling fees are among the lowest in the industry, maximizing your profits.</p>
          </div>

          <div className="text-center space-y-4">
            <Users className="w-12 h-12 text-primary mx-auto" />
            <h3 className="text-2xl font-semibold">Build Community</h3>
            <p className="text-textSecondary">Join our Discord, participate in product roadmap decisions, and connect with other sellers.</p>
          </div>

          <div className="text-center space-y-4">
            <Wallet className="w-12 h-12 text-primary mx-auto" />
            <h3 className="text-2xl font-semibold">Quick Payments</h3>
            <p className="text-textSecondary">Receive automatic deposits to your bank account within 2 days of delivery.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-cardBg rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-8">
              Ready to Start Your <span className="text-primary">Selling Journey?</span>
            </h2>
            {user ? (
              <Link to="/account/apply-seller">
                <Button className="bg-primary hover:bg-primaryHover text-white px-8 py-4 rounded-xl text-lg inline-flex items-center gap-3">
                  Start Selling Today
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button className="bg-primary hover:bg-primaryHover text-white px-8 py-4 rounded-xl text-lg inline-flex items-center gap-3">
                  Start Selling Today
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeSeller; 