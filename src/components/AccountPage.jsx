import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, Shield, ClipboardList } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';

const AccountPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/login');
    }
  };
  
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
            <Link to="/account/security" className="border border-border p-4 rounded-xl hover:bg-cardBg transition">
              <h2 className="text-2xl font-recoleta uppercase font-bold">Security</h2>
              <span className="text-textSecondary">Change your password .. etc</span>
            </Link>
            <Link to="/account/orders" className="border border-border p-4 rounded-xl hover:bg-cardBg transition">
              <h2 className="text-2xl font-recoleta uppercase font-bold">Order History</h2>
              <span className="text-textSecondary">View your order bundles and details</span>
            </Link>
            {user?.role === 'customer' && (
              <>
                {user.applicationStatus === 'NO_APPLICATION' && (
                  <Link to="/account/apply-seller" className="border border-border p-4 rounded-xl hover:bg-cardBg transition">
                    <h2 className="text-2xl font-recoleta uppercase font-bold">Become a Seller</h2>
                    <span className="text-textSecondary">Sell your products on our platform</span>
                  </Link>
                )}
                {user.applicationStatus === 'PENDING' && (
                  <div className="border border-yellow-500/30 bg-yellow-500/5 p-4 rounded-xl">
                    <h2 className="text-2xl font-recoleta uppercase font-bold text-yellow-500">Application Pending</h2>
                    <span className="text-textSecondary">Your seller application is under review</span>
                  </div>
                )}
                {user.applicationStatus === 'DECLINED' && (
                  <Link to="/account/apply-seller" className="border border-red-500/30 bg-red-500/5 p-4 rounded-xl hover:bg-red-500/10 transition">
                    <h2 className="text-2xl font-recoleta uppercase font-bold text-red-500">Reapply as Seller</h2>
                    <span className="text-textSecondary">You can reapply after 15 days from decline date</span>
                  </Link>
                )}
              </>
            )}
            <Link to="/account/reviews" className="border border-border p-4 rounded-xl hover:bg-cardBg transition">
              <h2 className="text-2xl font-recoleta uppercase font-bold">My Reviews</h2>
              <span className="text-textSecondary">View and manage your product reviews</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage; 