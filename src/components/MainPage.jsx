import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, Heart, PackageOpen, SquareChartGantt, ShieldCheck, ChevronLeft, ChevronRight, Clock, Gem, DollarSign, Headphones, Shield, User } from 'lucide-react';
import { fetchCategories } from '../store/slices/categorySlice';
import Button from './ui/Button';
import Preloader from './Preloader';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';


const MainPage = () => {
  const dispatch = useDispatch();
  const { categories, status } = useSelector((state) => state.categories);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState('right');
  const categoriesPerPage = 4;
  const totalPages = Math.ceil((categories?.length || 0) / categoriesPerPage);
  const { isDark } = useTheme();

  const colorSchemes = [
    {
      light: 'from-emerald-500/50 to-emerald-700/50',
      dark: 'from-emerald-600/50 to-emerald-800/50',
      border: 'border-emerald-500/20'
    },
    {
      light: 'from-blue-500/50 to-blue-700/50',
      dark: 'from-blue-600/50 to-blue-800/50',
      border: 'border-blue-500/20'
    },
    {
      light: 'from-purple-500/50 to-purple-700/50',
      dark: 'from-purple-600/50 to-purple-800/50',
      border: 'border-purple-500/20'
    },
    {
      light: 'from-amber-500/50 to-amber-700/50',
      dark: 'from-amber-600/50 to-amber-800/50',
      border: 'border-amber-500/20'
    },
    {
      light: 'from-rose-500/50 to-rose-700/50',
      dark: 'from-rose-600/50 to-rose-800/50',
      border: 'border-rose-500/20'
    },
    {
      light: 'from-teal-500/50 to-teal-700/50',
      dark: 'from-teal-600/50 to-teal-800/50',
      border: 'border-teal-500/20'
    }
  ];
  
  // Function to get consistent color for a category
  const getCategoryColor = (categoryId) => {
    // Use modulo to cycle through colors
    const colorIndex = (categoryId - 1) % colorSchemes.length;
    return colorSchemes[colorIndex];
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

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
    if (!categories) return [];
    const start = currentPage * categoriesPerPage;
    return categories.slice(start, start + categoriesPerPage);
  };

  if (status === 'loading') {
    return <Preloader />;
  }

  // Hero Section container
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background text-text pb-16 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative pt-20 pb-20">
            <motion.div 
              className="flex flex-col lg:flex-row items-center gap-16"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {/* Left Content */}
              <motion.div className="flex-1 text-left relative z-10">
                <div className="space-y-8">
                  {/* Badge */}
                  <motion.div 
                    variants={item}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-sm font-medium text-primary">
                      Now serving your local community
                    </span>
                  </motion.div>

                  {/* Main Title */}
                  <motion.h1 
                    variants={item}
                    className="text-6xl font-recoleta leading-tight tracking-tight"
                  >
                    <span className="block text-text">ENJOY FRESH</span>
                    <span className="block mt-1">
                      <span className="text-primary">LOCAL</span> PRODUCTS
                    </span>
                  </motion.h1>
                  
                  <motion.h2 
                    variants={item}
                    className="text-2xl text-textSecondary font-medium"
                  >
                    Your <span className="text-primary font-semibold">#1</span> Local{" "}
                    <span className="text-primary font-semibold">Organic </span>Marketplace
                  </motion.h2>
                  
                  <motion.p 
                    variants={item}
                    className="text-lg text-textSecondary/80 max-w-xl"
                  >
                    We connect you directly with local farmers and artisans.
                    Fresh, organic, and sustainably sourced products delivered
                    right to your doorstep.
                  </motion.p>

                  <motion.div 
                    variants={item}
                    className="flex items-center gap-6"
                  >
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
                            <User className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">50+ Local Producers</p>
                        <p className="text-textSecondary/60">Trusted Partners</p>
                      </div>
                    </div> */}
                  </motion.div>
                </div>
              </motion.div>

              {/* Right Content - SVG Animation */}
              <motion.div 
                className="flex-1 relative"
                variants={item}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative z-10 w-full max-w-lg mx-auto">
                  {/* Decorative Elements */}
                  <div className="absolute -bottom-4 -left-4 w-72 h-72 dark:bg-[#A9C46C]/20 bg-[#5D8736]/20 rounded-full blur-3xl"></div>
                  
                  {/* SVG Container with enhanced styling */}
                  <div className="relative bg-gradient-to-b from-transparent to-background/5 rounded-2xl p-8">
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
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 py-12"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
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
      </motion.div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold">
            EXPLORE OUR <span className="text-primary">CATEGORIES</span>
          </h2>
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
        </div>

        {/* Featured Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {getCurrentCategories().map((category, index) => {
            const colorScheme = getCategoryColor(category.categoryId);
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  key={category.categoryId}
                  to={`/category/${encodeURIComponent(category.name.toLowerCase())}`}
                  className={`animate-${direction === 'right' ? 'slide-right' : 'slide-left'}`}
                >
                  <div className="relative rounded-full aspect-square overflow-hidden group cursor-pointer transition-all duration-500 hover:scale-[1.02]">
                    {/* Outer glow effect */}
                    <div className={`absolute -inset-0.5 rounded-full bg-gradient-to-b ${isDark ? colorScheme.dark : colorScheme.light} opacity-30 blur-sm transition-opacity duration-500 group-hover:opacity-50`} />
                    
                    {/* Main content container */}
                    <div className="relative rounded-full overflow-hidden h-full">
                      {/* Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? colorScheme.dark : colorScheme.light} opacity-90 transition-all duration-500 group-hover:opacity-100`} />
                      
                      {/* Category Image */}
                      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                        <img
                          src={category.imageUrl || '/categories/default.png'}
                          alt={category.name}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-all duration-500"
                        />
                      </div>
                      
                      {/* Gradient Overlays */}
                      <div className="absolute inset-0">
                        {/* Full overlay gradient for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70"></div>
                      </div>
                      
                      {/* Content Container */}
                      <div className="absolute inset-0 p-8 flex flex-col justify-between items-center text-center">
                        {/* Top Content */}
                        <div className="w-full transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-500">
                          <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg px-4">
                            {category.name}
                          </h3>
                        </div>
                        
                        {/* Bottom Content */}
                        <div className="w-full transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 mb-4">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-white/90 text-sm font-medium">
                              {category.productCount || 0} Products
                            </span>
                            <ArrowRight className="w-4 h-4 text-white/90" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Pagination Indicators */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentPage === index ? 'bg-primary w-6' : 'bg-border hover:bg-primary/50'
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
      <motion.div 
        className="max-w-7xl mx-auto px-4 py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold text-center mb-16 text-text">
          WHY SHOULD YOU <span className="text-primary">CHOOSE US?</span>
        </h2>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-6 gap-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Secure Payment */}
          <motion.div 
            variants={item}
            className="col-span-2 rounded-lg border border-cardBorder px-5 pb-5 bg-cardBg"
          >
            <div className="w-min mb-2">
              <div className="relative w-16 h-16 rounded-b-full pt-3 pb-5 px-2 bg-gradient-to-b from-transparent from-[-10%] to-[#A62BDA] to-100%">
                <ShieldCheck className="w-10 h-10 mx-auto text-white" />
              </div>
            </div>
            <h4 className="text-xl font-semibold mb-1 text-text">Secure Payment</h4>
            <p className="text-sm text-textSecondary leading-relaxed">
              We offer secure payment options including credit card and cryptocurrency. All transactions are protected with industry-standard encryption.
            </p>
          </motion.div>

          {/* Superior Quality */}
          <motion.div 
            variants={item}
            className="col-span-2 rounded-lg border border-cardBorder px-5 pb-5 bg-cardBg"
          >
            <div className="w-min mb-2">
              <div className="relative w-16 h-16 rounded-b-full pt-3 pb-5 px-2 bg-gradient-to-b from-transparent from-[-10%] to-[#31B3CC] to-100%">
                <Gem className="w-10 h-10 mx-auto text-white" />
              </div>
            </div>
            <h4 className="text-xl font-semibold mb-1 text-text">Superior Quality</h4>
            <p className="text-sm text-textSecondary leading-relaxed">
              Our marketplace features only the highest quality local products. Each seller is carefully vetted to ensure premium standards.
            </p>
          </motion.div>

          {/* Best Prices */}
          <motion.div 
            variants={item}
            className="col-span-2 rounded-lg border border-cardBorder px-5 pb-5 bg-cardBg"
          >
            <div className="w-min mb-2">
              <div className="relative w-16 h-16 rounded-b-full pt-3 pb-5 px-2 bg-gradient-to-b from-transparent from-[-10%] to-[#FF9900] to-100%">
                <DollarSign className="w-10 h-10 mx-auto text-white" />
              </div>
            </div>
            <h4 className="text-xl font-semibold mb-1 text-text">Best Prices</h4>
            <p className="text-sm text-textSecondary leading-relaxed">
              By connecting you directly with local sellers, we eliminate middlemen to offer the most competitive prices in your area.
            </p>
          </motion.div>

          {/* Empty div for spacing */}
          <div className="hidden md:block"></div>

          {/* 24×7 Support */}
          <motion.div 
            variants={item}
            className="col-span-2 rounded-lg border border-cardBorder px-5 pb-5 bg-cardBg"
          >
            <div className="w-min mb-2">
              <div className="relative w-16 h-16 rounded-b-full pt-3 pb-5 px-2 bg-gradient-to-b from-transparent from-[-10%] to-[#F46036] to-100%">
                <Headphones className="w-10 h-10 mx-auto text-white" />
              </div>
            </div>
            <h4 className="text-xl font-semibold mb-1 text-text">24×7 Support</h4>
            <p className="text-sm text-textSecondary leading-relaxed">
              Our dedicated support team is available around the clock to assist both buyers and sellers with any questions or concerns.
            </p>
          </motion.div>

          {/* Fast Delivery */}
          <motion.div 
            variants={item}
            className="col-span-2 rounded-lg border border-cardBorder px-5 pb-5 bg-cardBg"
          >
            <div className="w-min mb-2">
              <div className="relative w-16 h-16 rounded-b-full pt-3 pb-5 px-2 bg-gradient-to-b from-transparent from-[-10%] to-[#ED45CD] to-100%">
                <Clock className="w-10 h-10 mx-auto text-white" />
              </div>
            </div>
            <h4 className="text-xl font-semibold mb-1 text-text">Fast Delivery</h4>
            <p className="text-sm text-textSecondary leading-relaxed">
              With our network of local sellers, you can arrange quick pickup or delivery of your purchases within your community.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MainPage;

