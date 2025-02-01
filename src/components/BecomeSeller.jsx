import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, DollarSign, Building2, Shield, Wallet, Users, BadgeCheck } from 'lucide-react';
import Button from './ui/Button';
import { useSelector } from 'react-redux';

const BecomeSeller = () => {
  const { user } = useSelector(state => state.auth);

  // If user is logged in, check their status
  if (user) {
    // Don't show for producers, admins, or customers with pending/approved status
    if (user.role !== 'customer' || user.applicationStatus === 'PENDING' || user.applicationStatus === 'APPROVED') {
      return null;
    }

    if (user.applicationStatus === 'DECLINED') {
      return (
        <div className="min-h-screen bg-background text-text pb-16 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Application Declined</h2>
              <p className="text-textSecondary mb-4">
                Your previous application was declined. You can reapply after 15 days from the decline date.
              </p>
              <Link to="/register">
                <Button className="bg-primary hover:bg-primaryHover text-white px-8 py-4 rounded-xl">
                  Reapply Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  // Show the main content for guests and eligible customers
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
                <Link to="/register">
                  <Button className="bg-primary hover:bg-primaryHover text-white px-8 py-4 rounded-xl text-lg flex items-center gap-3">
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
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
            <Link to="/register">
              <Button className="bg-primary hover:bg-primaryHover text-white px-8 py-4 rounded-xl text-lg inline-flex items-center gap-3">
                Start Selling Today
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeSeller; 