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
    <div className="min-h-screen bg-background text-text pb-16 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-background">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative pt-20 pb-20">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Left Content */}
              <div className="flex-1 text-left relative z-10">
                <div className="space-y-8">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-sm font-medium text-primary">
                      Now serving your local community
                    </span>
                  </div>

                  {/* Main Title */}
                  <h1 className="text-6xl font-recoleta leading-tight  tracking-tight">
                    <span className="block text-text">ENJOY FRESH</span>
                    <span className="block mt-1">
                      <span className="text-primary">LOCAL</span> PRODUCTS
                    </span>
                  </h1>
                  
                  <h2 className="text-2xl text-textSecondary font-medium">
                    Your <span className="text-primary font-semibold">#1</span> Local{" "}
                    <span className="text-primary font-semibold">Organic </span>Marketplace
                  </h2>
                  
                  <p className="text-lg text-textSecondary/80 max-w-xl">
                    We connect you directly with local farmers and artisans.
                    Fresh, organic, and sustainably sourced products delivered
                    right to your doorstep.
                  </p>

                  <div className="flex items-center gap-6">
                    <Link to="/store">
                      <Button className="bg-primary hover:bg-primaryHover text-white px-8 py-4 rounded-full text-lg flex items-center gap-3 group shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300">
                        Visit Store
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    
                    {/* <div className="flex items-center gap-4 text-textSecondary">
                      <div className="flex -space-x-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-cardBg overflow-hidden">
                            <img 
                              src={`/Producers/Producers${i}.jpg`} 
                              alt="Local Producers"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">50+ Local Producers</p>
                        <p className="text-textSecondary/60">Trusted Partners</p>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>

              {/* Right Content - SVG Animation */}
              <div className="flex-1 relative">
                <div className="relative z-10 w-full max-w-lg mx-auto">
                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary/30 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-[#22C55E]/20 rounded-full blur-3xl"></div>
                  
                  {/* SVG Container with enhanced styling */}
                  <div className="relative bg-gradient-to-b from-transparent to-background/5 rounded-2xl backdrop-blur-sm p-8">
                    <object
                      type="image/svg+xml"
                      data="/product-hunt-animate.svg"
                      className="w-full h-full transform hover:scale-105 transition-transform duration-500"
                      id="freepik_stories-product-hunt"
                    >
                      Product Hunt Animation
                    </object>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-cardBg backdrop-blur-sm rounded-xl p-8 border border-cardBorder transition-colors duration-300">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <Heart className="w-8 h-8 text-primary mx-auto" />
              <div className="text-4xl font-bold text-text">100%</div>
              <div className="text-textSecondary">Organic Products</div>
            </div>
            <div className="space-y-2">
              <PackageOpen className="w-8 h-8 text-primary mx-auto" />
              <div className="text-4xl font-bold text-text">50+</div>
              <div className="text-textSecondary">Local Farmers</div>
            </div>
            <div className="space-y-2">
              <SquareChartGantt className="w-8 h-8 text-primary mx-auto" />
              <div className="text-4xl font-bold text-text">1000+</div>
              <div className="text-textSecondary">Fresh Products</div>
            </div>
            <div className="space-y-2">
              <Shield className="w-8 h-8 text-primary mx-auto" />
              <div className="text-4xl font-bold text-text">10+</div>
              <div className="text-textSecondary">Years of Service</div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold">
            EXPLORE OUR <span className="text-primary">CATEGORIES</span>
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className={`p-2 rounded-lg transition-colors duration-300 ${currentPage === 0
                  ? 'bg-[#1E1E1E] border-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-[#1E1E1E] border-gray-800 hover:bg-primary hover:border-transparent'
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
                  : 'bg-primary border-transparent hover:bg-[#FF6D33]'
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
              className={`w-2 h-2 rounded-full transition-all duration-300 ${currentPage === index ? 'bg-primary w-4' : 'bg-gray-600'
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
        <h2 className="text-4xl font-bold text-center mb-16 text-text">
          WHY SHOULD YOU <span className="text-primary">CHOOSE US?</span>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {/* Secure Payment */}
          <div className="col-span-2 rounded-lg border border-cardBorder px-5 pb-5 bg-cardBg transition-all duration-300">
            <div className="w-min mb-2">
              <div className="relative w-16 h-16 rounded-b-full pt-3 pb-5 px-2 bg-gradient-to-b from-transparent from-[-10%] to-[#A62BDA] to-100%">
                <ShieldCheck className="w-10 h-10 mx-auto text-white" />
              </div>
            </div>
            <h4 className="text-xl font-semibold mb-1 text-text">Secure Payment</h4>
            <p className="text-sm text-textSecondary leading-relaxed">
              We offer secure payment options including credit card and cryptocurrency. All transactions are protected with industry-standard encryption.
            </p>
          </div>

          {/* Superior Quality */}
          <div className="col-span-2 rounded-lg border border-cardBorder px-5 pb-5 bg-cardBg transition-all duration-300">
            <div className="w-min mb-2">
              <div className="relative w-16 h-16 rounded-b-full pt-3 pb-5 px-2 bg-gradient-to-b from-transparent from-[-10%] to-[#31B3CC] to-100%">
                <Gem className="w-10 h-10 mx-auto text-white" />
              </div>
            </div>
            <h4 className="text-xl font-semibold mb-1 text-text">Superior Quality</h4>
            <p className="text-sm text-textSecondary leading-relaxed">
              Our marketplace features only the highest quality local products. Each seller is carefully vetted to ensure premium standards.
            </p>
          </div>

          {/* Best Prices */}
          <div className="col-span-2 rounded-lg border border-cardBorder px-5 pb-5 bg-cardBg transition-all duration-300">
            <div className="w-min mb-2">
              <div className="relative w-16 h-16 rounded-b-full pt-3 pb-5 px-2 bg-gradient-to-b from-transparent from-[-10%] to-[#FF9900] to-100%">
                <DollarSign className="w-10 h-10 mx-auto text-white" />
              </div>
            </div>
            <h4 className="text-xl font-semibold mb-1 text-text">Best Prices</h4>
            <p className="text-sm text-textSecondary leading-relaxed">
              By connecting you directly with local sellers, we eliminate middlemen to offer the most competitive prices in your area.
            </p>
          </div>

          {/* Empty div for spacing */}
          <div className="hidden md:block"></div>

          {/* 24×7 Support */}
          <div className="col-span-2 rounded-lg border border-cardBorder px-5 pb-5 bg-cardBg transition-all duration-300">
            <div className="w-min mb-2">
              <div className="relative w-16 h-16 rounded-b-full pt-3 pb-5 px-2 bg-gradient-to-b from-transparent from-[-10%] to-[#F46036] to-100%">
                <Headphones className="w-10 h-10 mx-auto text-white" />
              </div>
            </div>
            <h4 className="text-xl font-semibold mb-1 text-text">24×7 Support</h4>
            <p className="text-sm text-textSecondary leading-relaxed">
              Our dedicated support team is available around the clock to assist both buyers and sellers with any questions or concerns.
            </p>
          </div>

          {/* Fast Delivery */}
          <div className="col-span-2 rounded-lg border border-cardBorder px-5 pb-5 bg-cardBg transition-all duration-300">
            <div className="w-min mb-2">
              <div className="relative w-16 h-16 rounded-b-full pt-3 pb-5 px-2 bg-gradient-to-b from-transparent from-[-10%] to-[#ED45CD] to-100%">
                <Clock className="w-10 h-10 mx-auto text-white" />
              </div>
            </div>
            <h4 className="text-xl font-semibold mb-1 text-text">Fast Delivery</h4>
            <p className="text-sm text-textSecondary leading-relaxed">
              With our network of local sellers, you can arrange quick pickup or delivery of your purchases within your community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;

