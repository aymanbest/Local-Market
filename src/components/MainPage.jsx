import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, PackageOpen, SquareChartGantt, ShieldCheck, ChevronLeft, ChevronRight, Clock, Gem, DollarSign, Headphones , Shield } from 'lucide-react';
import Button from './ui/Button';

const categories = [
  { id: 1, name: 'Vegetables', image: '/categories/vegetables.png', gradient: 'from-green-900/50 to-transparent' },
  { id: 2, name: 'Fruits', image: '/categories/fruits.png', gradient: 'from-orange-900/50 to-transparent' },
  { id: 3, name: 'Dairy', image: '/categories/dairy.png', gradient: 'from-yellow-900/50 to-transparent' },
  { id: 4, name: 'Meat', image: '/categories/meat.png', gradient: 'from-red-900/50 to-transparent' },
  { id: 5, name: 'Fish', image: '/categories/fish.png', gradient: 'from-blue-900/50 to-transparent' },
  { id: 6, name: 'Bakery', image: '/categories/bakery.png', gradient: 'from-gray-900/50 to-transparent' },
  { id: 7, name: 'Wine', image: '/categories/wine.png', gradient: 'from-purple-900/50 to-transparent' },
  { id: 8, name: 'Beer', image: '/categories/beer.png', gradient: 'from-indigo-900/50 to-transparent' },
  { id: 9, name: 'Tea', image: '/categories/tea.png', gradient: 'from-teal-900/50 to-transparent' },
  { id: 10, name: 'Coffee', image: '/categories/coffee.png', gradient: 'from-brown-900/50 to-transparent' }
];

const MainPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState('right');
  const categoriesPerPage = 4;
  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setDirection('left');
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setDirection('right');
      setCurrentPage(prev => prev + 1);
    }
  };

  const getCurrentCategories = () => {
    const start = currentPage * categoriesPerPage;
    return categories.slice(start, start + categoriesPerPage);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-16">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-16">
        <div className="text-center mb-12">
          {/* Logo */}
          <div className="mb-6">
            <svg
              className="w-16 h-16 mx-auto text-[#FF4500]"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                fill="currentColor"
              />
              <path
                d="M12 7c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1s1-.45 1-1V8c0-.55-.45-1-1-1z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Main Title */}
          <h1 className="text-6xl font-bold leading-tight mb-4">
            ENJOY FRESH LOCAL PRODUCTS
          </h1>

          {/* Subtitle */}
          <h2 className="text-2xl mb-8">
            Your <span className="text-[#FF4500]">#1</span> Local{" "}
            <span className="text-[#FF4500]">Organic </span>Marketplace
          </h2>

          {/* Description */}
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            We connect you directly with local farmers and artisans.
            Fresh, organic, and sustainably sourced products delivered
            right to your doorstep. Support your local community while
            enjoying the best nature has to offer.
          </p>

          {/* CTA Button */}
          <Link to="/store">
            <Button className="bg-[#FF4500] hover:bg-[#FF6D33] text-white px-8 py-3 rounded-full text-lg flex items-center gap-2 group mx-auto">
              Visit Store
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-[#1E1E1E]/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <Heart className="w-8 h-8 text-[#FF4500] mx-auto" />
              <div className="text-4xl font-bold">100%</div>
              <div className="text-gray-400">Organic Products</div>
            </div>
            <div className="space-y-2">
              <PackageOpen className="w-8 h-8 text-[#FF4500] mx-auto" />
              <div className="text-4xl font-bold">50+</div>
              <div className="text-gray-400">Local Farmers</div>
            </div>
            <div className="space-y-2">
              <SquareChartGantt className="w-8 h-8 text-[#FF4500] mx-auto" />
              <div className="text-4xl font-bold">1000+</div>
              <div className="text-gray-400">Fresh Products</div>
            </div>
            <div className="space-y-2">
              <Shield className="w-8 h-8 text-[#FF4500] mx-auto" />
              <div className="text-4xl font-bold">10+</div>
              <div className="text-gray-400">Years of Service</div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold">
            EXPLORE OUR <span className="text-[#FF4500]">CATEGORIES</span>
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className={`p-2 rounded-lg transition-colors duration-300 ${currentPage === 0
                  ? 'bg-[#1E1E1E] border-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-[#1E1E1E] border-gray-800 hover:bg-[#FF4500] hover:border-transparent'
                }`}
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="outline"
              className={`p-2 rounded-lg transition-colors duration-300 ${currentPage === totalPages - 1
                  ? 'bg-[#1E1E1E] border-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-[#FF4500] border-transparent hover:bg-[#FF6D33]'
                }`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              aria-label="Next page"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 relative overflow-hidden">
          {getCurrentCategories().map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.name.toLowerCase()}`}
              className={`animate-${direction === 'right' ? 'slide-right' : 'slide-left'}`}
            >
              <div className="relative rounded-full aspect-square overflow-hidden group cursor-pointer">
                <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient}`} />
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white text-center">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination Indicators */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${currentPage === index ? 'bg-[#FF4500] w-4' : 'bg-gray-600'
                }`}
              onClick={() => {
                setDirection(index > currentPage ? 'right' : 'left');
                setCurrentPage(index);
              }}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-16">
          WHY SHOULD YOU <span className="text-[#FF4500]">CHOOSE US?</span>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {/* Secure Payment */}
          <div className="col-span-2 rounded-lg border border-[#ffffff33] px-5 pb-5">
            <div className="w-min mb-2">
              <div className="relative w-16 h-16 rounded-b-full pt-3 pb-5 px-2 bg-gradient-to-b from-transparent from-[-10%] to-[#A62BDA] to-100%">
                <ShieldCheck className="w-10 h-10 mx-auto text-white" />
              </div>
            </div>
            <h4 className="text-xl font-semibold mb-1">Secure Payment</h4>
            <p className="text-sm text-[#d4d4d4] leading-relaxed">
              We offer secure payment options including credit card and cryptocurrency. All transactions are protected with industry-standard encryption.
            </p>
          </div>

          {/* Superior Quality */}
          <div className="col-span-2 rounded-lg border border-[#ffffff33] px-5 pb-5">
            <div className="w-min mb-2">
              <div className="relative w-16 h-16 rounded-b-full pt-3 pb-2 px-2 bg-gradient-to-b from-transparent from-[-10%] to-[#31B3CC] to-100%">
                <Gem className="w-10 h-10 mx-auto text-white" />
              </div>
            </div>
            <h4 className="text-xl font-semibold mb-1">Superior Quality</h4>
            <p className="text-sm text-[#d4d4d4] leading-relaxed">
              Our marketplace features only the highest quality local products. Each seller is carefully vetted to ensure premium standards.
            </p>
          </div>

          {/* Best Prices */}
          <div className="col-span-2 rounded-lg border border-[#ffffff33] px-5 pb-5">
            <div className="w-min mb-2">
              <div className="relative w-16 h-16 rounded-b-full pt-3 pb-2 px-2 bg-gradient-to-b from-transparent from-[-10%] to-[#FF9900] to-100%">
                <DollarSign className="w-10 h-10 mx-auto text-white" />
              </div>
            </div>
            <h4 className="text-xl font-semibold mb-1">Best Prices</h4>
            <p className="text-sm text-[#d4d4d4] leading-relaxed">
              By connecting you directly with local sellers, we eliminate middlemen to offer the most competitive prices in your area.
            </p>
          </div>

          {/* Empty div for spacing */}
          <div className="hidden md:block"></div>

          {/* 24×7 Support */}
          <div className="col-span-2 rounded-lg border border-[#ffffff33] px-5 pb-5">
            <div className="w-min mb-2">
              <div className="relative w-16 h-16 rounded-b-full pt-3 pb-2 px-2 bg-gradient-to-b from-transparent from-[-10%] to-[#F46036] to-100%">
                <Headphones className="w-10 h-10 mx-auto text-white" />
              </div>
            </div>
            <h4 className="text-xl font-semibold mb-1">24×7 Support</h4>
            <p className="text-sm text-[#d4d4d4] leading-relaxed">
              Our dedicated support team is available around the clock to assist both buyers and sellers with any questions or concerns.
            </p>
          </div>

          {/* Fast Delivery */}
          <div className="col-span-2 rounded-lg border border-[#ffffff33] px-5 pb-5">
            <div className="w-min mb-2">
              <div className="relative w-16 h-16 rounded-b-full pt-3 pb-2 px-2 bg-gradient-to-b from-transparent from-[-10%] to-[#ED45CD] to-100%">
                <Clock className="w-10 h-10 mx-auto text-white" />
              </div>
            </div>
            <h4 className="text-xl font-semibold mb-1">Fast Delivery</h4>
            <p className="text-sm text-[#d4d4d4] leading-relaxed">
              With our network of local sellers, you can arrange quick pickup or delivery of your purchases within your community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;

