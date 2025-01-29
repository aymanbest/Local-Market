import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LogOut, Shield, ClipboardList } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';

const AccountPage = () => {
  const dispatch = useDispatch();

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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="container p-4">
          <div className="flex flex-wrap justify-center items-center md:justify-between mb-4 gap-4">
            <h2 className="text-4xl font-recoleta font-semibold uppercase">Account</h2>
            <div className="flex items-center gap-2">
              <Link to="/store" className="rounded-full border border-[#fff3] hover:bg-white/10 transition flex gap-2 items-center px-4 py-2">
                <ArrowLeft className="w-6 h-6" />
                <span>Back to Store</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="rounded-full border border-[#fff3] hover:bg-white/10 transition flex gap-2 items-center px-4 py-2"
              >
                <LogOut className="w-6 h-6" />
                <span>Logout</span>
              </button>
            </div>
          </div>
          <hr className="border-white/20" />
        </div>

        <div className="container px-4 pb-24">
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <Link to="/account/security" className="border border-[#fff3] p-4 rounded-xl hover:bg-white/5 transition">
              <h2 className="text-2xl font-recoleta uppercase font-bold">Security</h2>
              <span className="text-gray-400">Change your password .. etc</span>
            </Link>
            <Link to="/account/orders" className="border border-[#fff3] p-4 rounded-xl hover:bg-white/5 transition">
              <h2 className="text-2xl font-recoleta uppercase font-bold">Order History</h2>
              <span className="text-gray-400">View your previous orders</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage; 