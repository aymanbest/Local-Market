import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, Search, LogIn, ChevronRight, Leaf, Star, TrendingUp, User, LogOut, Settings, ShoppingBag } from 'lucide-react';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { mockProducts } from '../mockData';
import { logoutUser } from '../store/slices/authSlice';

const MainPage = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 group">
              <Leaf className="h-6 w-6 text-green-600 transform group-hover:rotate-12 transition-transform" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Local Market
              </h1>
            </Link>
            
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-64 px-4 py-2 rounded-full border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 group-hover:shadow-md"
                />
                <Search className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 group-hover:text-green-500 transition-colors" />
              </div>
              
              <Link to="/cart" className="relative">
                <Button variant="ghost" className="relative group">
                  <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors" />
                  {items.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                      {items.length}
                    </span>
                  )}
                </Button>
              </Link>
              
              {isAuthenticated ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-gray-700">{user.username}</span>
                  </Button>
                  
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-100">
                      <Link
                        to="/customer/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        My Orders
                      </Link>
                      <Link
                        to="/customer/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        to="/customer/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={() => dispatch(logoutUser())}
                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="outline" className="flex items-center space-x-2">
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white py-32 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:20px_20px]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-8">
              <h2 className="text-5xl font-bold mb-4 animate-fade-in">
                Fresh Local Products
              </h2>
              <p className="text-xl mb-8 text-green-50 max-w-2xl mx-auto">
                Support local producers and get fresh products delivered to your door
              </p>
              <Button 
                size="lg" 
                className="bg-white text-green-600 hover:bg-green-50 transform hover:scale-105 transition-all duration-300 shadow-lg font-semibold tracking-wide"
              >
                <span className="flex items-center space-x-2">
                  <span className="text-lg text-black">Shop Now</span>
                  <ChevronRight className="w-5 h-5 text-black" />
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <Star className="w-8 h-8 text-yellow-400 mr-2" />
            Browse Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Fruits', 'Vegetables', 'Dairy', 'Bakery'].map((category) => (
              <div key={category} 
                className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                  {category}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600 mr-2" />
              Featured Products
            </h2>
            <Button variant="ghost" className="hover:text-green-600">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockProducts.map((product) => (
              <div key={product.id} 
                className="bg-white rounded-xl shadow-sm overflow-hidden transform hover:scale-102 transition-all duration-300 border border-gray-100 hover:shadow-xl group">
                <div className="relative">
                  <img src={product.image} alt={product.name} 
                    className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity" />
                  {product.inventory < 50 && (
                    <Badge variant="warning" className="absolute top-2 right-2">
                      Low Stock
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
                  <Link to={`/product/${product.id}`}>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-gray-400">Supporting local producers and bringing fresh products to your table.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Products</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Producers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Shipping</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Returns</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Track Order</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-l-md w-full"
                />
                <Button className="rounded-l-none">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;

