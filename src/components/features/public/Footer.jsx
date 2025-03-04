import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { Shield, Heart, Leaf } from 'lucide-react';

const Footer = () => {
  const { isDark } = useTheme();
  
  return (
    <footer className={`
      border-t transition-colors duration-300 mt-auto
      ${isDark ? 'border-white/10' : 'border-black/10'}
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="relative w-6 h-6">
                  <div className="absolute inset-0 rotate-45 bg-gradient-to-r from-primary/50 to-transparent rounded-xl blur-xl"></div>
                  <Leaf className="w-6 h-6 text-primary relative z-10" />
                </div>
                <span className="font-recoleta text-lg text-text">LocalMarket</span>
              </Link>
              <p className="text-sm text-textSecondary">
                Your trusted local marketplace for fresh, organic products directly from producers to your table.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-medium text-text">Quick Links</h3>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/about" className="text-sm text-textSecondary hover:text-primary transition-colors">About Us</Link>
                <Link to="/store" className="text-sm text-textSecondary hover:text-primary transition-colors">Store</Link>
                <Link to="/support" className="text-sm text-textSecondary hover:text-primary transition-colors">Support</Link>
                <Link to="/faq" className="text-sm text-textSecondary hover:text-primary transition-colors">FAQ</Link>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="space-y-4">
              <h3 className="font-medium text-text">Trust & Safety</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm text-textSecondary">Secure Payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary" />
                  <span className="text-sm text-textSecondary">Trusted Service</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-textSecondary">
              © {new Date().getFullYear()} LocalMarket Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/tos" className="text-sm text-textSecondary hover:text-primary transition-colors">
                Terms & Conditions
              </Link>
              <span className="text-sm text-primary">Stay Safe</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 