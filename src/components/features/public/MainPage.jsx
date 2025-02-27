import React, { useState, memo, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Heart, PackageOpen, SquareChartGantt, ShieldCheck, 
  ChevronLeft, ChevronRight, Clock, Gem, DollarSign, Headphones, 
  Shield, User, Apple, Beef, Egg, Croissant, Coffee, Wine, UtensilsCrossed, Cookie, Fish
} from 'lucide-react';
import Button from '../../common/ui/Button';
import Preloader from './Preloader';
import { useTheme } from '../../../context/ThemeContext';
// Import only what we need from framer-motion to reduce bundle size
import { LazyMotion, domAnimation } from 'framer-motion';

// Optimization: Using LazyMotion to load animations on demand
// and reduce initial bundle size

// Memoized component for navigation buttons
const NavigationButtons = memo(({ currentPage, totalPages, handlePrevPage, handleNextPage }) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className={`p-2 rounded-lg transition-colors duration-300 ${
          currentPage === 0
            ? 'bg-cardBg border-border text-textSecondary cursor-not-allowed'
            : 'bg-cardBg border-border hover:bg-primary hover:border-transparent'
        }`}
        onClick={handlePrevPage}
        disabled={currentPage === 0}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <Button
        variant="outline"
        className={`p-2 rounded-lg transition-colors duration-300 ${
          currentPage === totalPages - 1
            ? 'bg-cardBg border-border text-textSecondary cursor-not-allowed'
            : 'bg-primary border-transparent hover:bg-primaryHover'
        }`}
        onClick={handleNextPage}
        disabled={currentPage === totalPages - 1}
        aria-label="Next page"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>
    </div>
  );
});

// Memoized component for pagination indicators
const PaginationIndicators = memo(({ totalPages, currentPage, setCurrentPage, setDirection }) => {
  // Optimization: Use callback function to avoid unnecessary re-renders
  const handlePageChange = useCallback((index) => {
    setDirection(index > currentPage ? 'right' : 'left');
    setCurrentPage(index);
  }, [currentPage, setCurrentPage, setDirection]);

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            currentPage === index ? 'bg-primary w-6' : 'bg-border hover:bg-primary/50'
          }`}
          onClick={() => handlePageChange(index)}
          aria-label={`Go to page ${index + 1}`}
        />
      ))}
    </div>
  );
});

// Optimization: Using will-change to help browser optimize animations
const CategoriesGrid = memo(({ categories, direction, isDark }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {categories.map((category, index) => {
        const IconComponent = category.icon;
        return (
          <div
            key={category.name}
            className={`opacity-100 scale-100 transition-opacity transition-transform duration-300`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Link
              to={category.name === 'Others' ? '/store' : `/store?category=${encodeURIComponent(category.name.toLowerCase())}`}
              className={`animate-${direction === 'right' ? 'slide-right' : 'slide-left'}`}
            >
              <div className="relative rounded-full aspect-square overflow-hidden group cursor-pointer transition-transform duration-500 hover:scale-[1.02] will-change-transform">
                {/* Optimization: Reduce blur effect complexity */}
                <div className={`absolute -inset-0.5 rounded-full bg-gradient-to-b ${isDark ? category.darkColor : category.color} opacity-30 transition-opacity duration-500 group-hover:opacity-50`} />
                
                {/* Main content container */}
                <div className="relative rounded-full overflow-hidden h-full">
                  {/* Background Gradient - Simplified */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? category.darkColor : category.color} opacity-90 transition-opacity duration-500 group-hover:opacity-100`} />
                  
                  {/* Category Icon - Optimized with will-change */}
                  <div className="absolute inset-0 flex items-center justify-center will-change-transform">
                    <IconComponent className="w-20 h-20 text-white/80 group-hover:text-white transition-all duration-500 transform group-hover:scale-110" />
                  </div>
                  
                  {/* Gradient Overlays - Simplified */}
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70"></div>
                  </div>
                  
                  {/* Content Container - Optimized */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-between items-center text-center">
                    {/* Top Content */}
                    <div className="w-full transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-500 will-change-transform">
                      <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg px-4">
                        {category.name}
                      </h3>
                    </div>
                    
                    {/* Bottom Content */}
                    <div className="w-full transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 mb-4 will-change-transform will-change-opacity">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-white/90 text-sm font-medium">
                          {category.name === 'Others' ? 'View All Products' : 'Explore Products'}
                        </span>
                        <ArrowRight className="w-4 h-4 text-white/90" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
});

// Memoized component for Hero section
const HeroSection = memo(({ isDark }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative pt-20 pb-20">
          <div 
            className="flex flex-col lg:flex-row items-center gap-16"
          >
            {/* Left Content */}
            <div className="flex-1 text-left relative z-10">
              <div className="space-y-8">
                {/* Badge */}
                <div 
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-sm font-medium text-primary">
                    Now serving your local community
                  </span>
                </div>

                {/* Main Title */}
                <h1 
                  className="text-6xl font-recoleta leading-tight tracking-tight"
                >
                  <span className="block text-text">ENJOY FRESH</span>
                  <span className="block mt-1">
                    <span className="text-primary">LOCAL</span> PRODUCTS
                  </span>
                </h1>
                
                <h2 
                  className="text-2xl text-textSecondary font-medium"
                >
                  Your <span className="text-primary font-semibold">#1</span> Local{" "}
                  <span className="text-primary font-semibold">Organic </span>Marketplace
                </h2>
                
                <p 
                  className="text-lg text-textSecondary/80 max-w-xl"
                >
                  We connect you directly with local farmers and artisans.
                  Fresh, organic, and sustainably sourced products delivered
                  right to your doorstep.
                </p>

                <div 
                  className="flex items-center gap-6"
                >
                  <Link to="/store">
                    <Button className="bg-primary hover:bg-primaryHover text-white px-8 py-4 rounded-full text-lg flex items-center gap-3 group shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300">
                      Visit Store
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Content - SVG Animation - Optimized */}
            <div 
              className="flex-1 relative hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="relative z-10 w-full max-w-lg mx-auto">
                {/* Decorative Elements - Simplified */}
                <div className="absolute -bottom-4 -left-4 w-72 h-72 dark:bg-[#A9C46C]/20 bg-[#5D8736]/20 rounded-full blur-xl"></div>
                
                {/* SVG Container with enhanced styling */}
                <div className="relative bg-gradient-to-b from-transparent to-background/5 rounded-2xl p-8">
                  <object
                    type="image/svg+xml"
                    data="/product-hunt-animate.svg"
                    className="w-full h-full transform hover:scale-105 transition-transform duration-500 will-change-transform"
                    id="freepik_stories-product-hunt"
                    loading="lazy" // Optimization: Lazy loading
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
  );
});

// Memoized component for Stats section
const StatsSection = memo(({ isDark }) => {
  return (
    <div 
      className="max-w-7xl mx-auto px-4 py-12 opacity-100 translate-y-0 transition-opacity transition-transform duration-500"
    >
      <div className="bg-cardBg backdrop-blur-sm rounded-xl p-8 border-cardBorder transition-colors duration-300">
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
  );
});

// Optimization: Extracted feature card to reduce repetition and improve performance
const FeatureCard = memo(({ icon: IconComponent, title, description, color }) => {
  // Map color values to specific Tailwind classes
  const colorClasses = {
    '[#A62BDA]': 'to-purple-500',
    '[#31B3CC]': 'to-cyan-500',
    '[#FF9900]': 'to-amber-500',
    '[#F46036]': 'to-orange-500',
    '[#ED45CD]': 'to-pink-500'
  };

  const gradientClass = colorClasses[color] || 'to-primary';

  return (
    <div className="col-span-2 rounded-lg border-cardBorder px-5 pb-5 bg-cardBg">
      <div className="w-min mb-2">
        <div className={`relative w-16 h-16 rounded-b-full pt-3 pb-5 px-2 bg-gradient-to-b from-transparent from-[-10%] ${gradientClass} to-100%`}>
          <IconComponent className="w-10 h-10 mx-auto text-white" />
        </div>
      </div>
      <h4 className="text-xl font-semibold mb-1 text-text">{title}</h4>
      <p className="text-sm text-textSecondary leading-relaxed">
        {description}
      </p>
    </div>
  );
});

const HowItWorks = () => {
  const { isDark } = useTheme();
  
  return (
    <div className="py-24">
      <h2 className="text-4xl font-bold text-center mb-16 text-text">
        HOW IT <span className="text-primary">WORKS</span>
      </h2>
      
      <div className="grid md:grid-cols-2 gap-x-6 gap-y-20 max-w-3xl mx-auto px-4">
        {/* Card 1 */}
        <div className={`border border-border rounded-lg bg-cardBg relative`}>
          <span className={`absolute -bottom-8 right-4 text-[180px] font-staatliches leading-none text-primary opacity-10`}>01</span>
          <div className="overflow-hidden rounded-t-lg">
            <img 
              src="/01.svg" 
              alt="Browse Products" 
              className="w-full h-full bg-background object-cover"
              loading="lazy"
              width="636"
              height="293"
            />
          </div>
          <div className="p-4 pb-12">
            <h3 className="font-staatliches uppercase text-3xl text-text">BROWSE LOCAL PRODUCTS</h3>
            <p className={`${isDark ? 'text-neutral-400' : 'text-textSecondary'}`}>
              Explore our marketplace filled with fresh, local products. 
              Filter by category, producer, or search for specific items. 
              All products come directly from verified local sellers.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className={`border border-border rounded-lg bg-cardBg relative`}>
          <span className={`absolute -bottom-8 right-4 text-[180px] font-staatliches leading-none text-primary opacity-10`}>02</span>
          <div className="overflow-hidden rounded-t-lg">
            <img 
              src="/02.svg" 
              alt="Add to Cart" 
              className="w-full h-full bg-background object-cover"
              loading="lazy"
              width="634"
              height="292"
            />
          </div>
          <div className="p-4 pb-12">
            <h3 className="font-staatliches uppercase text-3xl text-text">SELECT & ADD TO CART</h3>
            <p className={`${isDark ? 'text-neutral-400' : 'text-textSecondary'}`}>
              Choose your desired products and quantities. Add items to your 
              cart with one click. Review your selections before proceeding 
              to checkout.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className={`border border-border rounded-lg bg-cardBg relative`}>
          <span className={`absolute -bottom-8 right-4 text-[180px] font-staatliches leading-none text-primary opacity-10`}>03</span>
          <div className="overflow-hidden rounded-t-lg">
            <img 
              src="/03.svg" 
              alt="Secure Checkout" 
              className="w-full h-full bg-background object-cover"
              loading="lazy"
              width="636"
              height="360"
            />
          </div>
          <div className="p-4 pb-12">
            <h3 className="font-staatliches uppercase text-3xl text-text">SECURE CHECKOUT</h3>
            <p className={`${isDark ? 'text-neutral-400' : 'text-textSecondary'}`}>
              Complete your purchase through our secure payment system. 
              Choose your preferred payment method and delivery options. 
              All transactions are encrypted and protected.
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className={`border border-border rounded-lg bg-cardBg relative`}>
          <span className={`absolute -bottom-8 right-4 text-[180px] font-staatliches leading-none text-primary opacity-10`}>04</span>
          <div className="overflow-hidden rounded-t-lg">
            <img 
              src="/04.svg" 
              alt="Fast Delivery" 
              className="w-full h-full bg-background object-cover"
              loading="lazy"
              width="636"
              height="360"
            />
          </div>
          <div className="p-4 pb-12">
            <h3 className="font-staatliches uppercase text-3xl text-text">FAST LOCAL DELIVERY</h3>
            <p className={`${isDark ? 'text-neutral-400' : 'text-textSecondary'}`}>
              Receive your fresh products directly to your doorstep. 
              Track your order in real-time and rate your experience 
              after delivery is completed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MainPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState('right');
  const categoriesPerPage = 4;
  const { isDark } = useTheme();

  // Main categories with their corresponding icons
  // Using useMemo to avoid recreating this array on each render
  const mainCategories = useMemo(() => [
    { name: 'Fresh Produce', icon: Apple, color: 'from-green-500/50 to-green-700/50', darkColor: 'from-green-600/50 to-green-800/50', border: 'border-green-500/20' },
    { name: 'Meat & Poultry', icon: Beef, color: 'from-red-500/50 to-red-700/50', darkColor: 'from-red-600/50 to-red-800/50', border: 'border-red-500/20' },
    { name: 'Seafood', icon: Fish, color: 'from-blue-400/50 to-blue-600/50', darkColor: 'from-blue-500/50 to-blue-700/50', border: 'border-blue-400/20' },
    { name: 'Dairy and Eggs', icon: Egg, color: 'from-yellow-500/50 to-yellow-700/50', darkColor: 'from-yellow-600/50 to-yellow-800/50', border: 'border-yellow-500/20' },
    { name: 'Baked Goods', icon: Croissant, color: 'from-amber-500/50 to-amber-700/50', darkColor: 'from-amber-600/50 to-amber-800/50', border: 'border-amber-500/20' },
    { name: 'Specialty Foods', icon: UtensilsCrossed, color: 'from-purple-500/50 to-purple-700/50', darkColor: 'from-purple-600/50 to-purple-800/50', border: 'border-purple-500/20' },
    { name: 'Beverages', icon: Coffee, color: 'from-teal-500/50 to-teal-700/50', darkColor: 'from-teal-600/50 to-teal-800/50', border: 'border-teal-500/20' },
    { name: 'Prepared Foods', icon: Wine, color: 'from-indigo-500/50 to-indigo-700/50', darkColor: 'from-indigo-600/50 to-indigo-800/50', border: 'border-indigo-500/20' },
    { name: 'Snacks', icon: Cookie, color: 'from-orange-500/50 to-orange-700/50', darkColor: 'from-orange-600/50 to-orange-800/50', border: 'border-orange-500/20' },
    { name: 'Others', icon: PackageOpen, color: 'from-gray-500/50 to-gray-700/50', darkColor: 'from-gray-600/50 to-gray-800/50', border: 'border-gray-500/20' }
  ], []);

  const totalPages = useMemo(() => Math.ceil(mainCategories.length / categoriesPerPage), [mainCategories, categoriesPerPage]);

  // Using useCallback to avoid recreating these functions on each render
  const handlePrevPage = useCallback(() => {
    if (currentPage > 0) {
      setDirection('left');
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setDirection('right');
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  // Using useMemo to calculate current categories only when currentPage changes
  const currentCategories = useMemo(() => {
    const start = currentPage * categoriesPerPage;
    return mainCategories.slice(start, start + categoriesPerPage);
  }, [currentPage, categoriesPerPage, mainCategories]);

  // Features data - memoized to prevent recreation
  const features = useMemo(() => [
    {
      icon: ShieldCheck,
      title: "Secure Payment",
      description: "We offer secure payment options including credit card and cryptocurrency. All transactions are protected with industry-standard encryption.",
      color: "[#A62BDA]"
    },
    {
      icon: Gem,
      title: "Superior Quality",
      description: "Our marketplace features only the highest quality local products. Each seller is carefully vetted to ensure premium standards.",
      color: "[#31B3CC]"
    },
    {
      icon: DollarSign,
      title: "Best Prices",
      description: "By connecting you directly with local sellers, we eliminate middlemen to offer the most competitive prices in your area.",
      color: "[#FF9900]"
    },
    {
      icon: Headphones,
      title: "24×7 Support",
      description: "Our dedicated support team is available around the clock to assist both buyers and sellers with any questions or concerns.",
      color: "[#F46036]"
    },
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "With our network of local sellers, you can arrange quick pickup or delivery of your purchases within your community.",
      color: "[#ED45CD]"
    }
  ], []);

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-background text-text pb-16 transition-colors duration-300">
        {/* Hero Section - Memoized */}
        <HeroSection isDark={isDark} />

        {/* Stats Section - Memoized */}
        <StatsSection isDark={isDark} />

        {/* Categories Section */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold">
              EXPLORE OUR <span className="text-primary">CATEGORIES</span>
            </h2>
            {/* Using memoized component for navigation buttons */}
            <NavigationButtons 
              currentPage={currentPage}
              totalPages={totalPages}
              handlePrevPage={handlePrevPage}
              handleNextPage={handleNextPage}
            />
          </div>

          {/* Featured Categories Grid - Now with memoized props */}
          <CategoriesGrid 
            categories={currentCategories} 
            direction={direction} 
            isDark={isDark} 
          />

          {/* Pagination Indicators */}
          <PaginationIndicators 
            totalPages={totalPages} 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
            setDirection={setDirection} 
          />
        </div>

        {/* Why Choose Us Section - Optimized with viewport.once to avoid repeated animations */}
        <div 
          className="max-w-7xl mx-auto px-4 py-16 opacity-100 transition-opacity duration-500"
        >
          <h2 className="text-4xl font-bold text-center mb-16 text-text">
            WHY SHOULD YOU <span className="text-primary">CHOOSE US?</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {/* Using memoized FeatureCard component for better performance */}
            <FeatureCard {...features[0]} />
            <FeatureCard {...features[1]} />
            <FeatureCard {...features[2]} />
            
            {/* Empty div for spacing */}
            <div className="hidden md:block"></div>
            
            <FeatureCard {...features[3]} />
            <FeatureCard {...features[4]} />
          </div>
        </div>

        {/* How It Works Section */}
        <HowItWorks />
      </div>
    </LazyMotion>
  );
};

export default MainPage;
