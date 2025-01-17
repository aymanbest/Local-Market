import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Package, List, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './ui/Button';

const categories = [
  { id: 1, name: 'Vegetables', image: '/categories/vegetables.png', gradient: 'from-green-900/50 to-transparent' },
  { id: 2, name: 'Fruits', image: '/categories/fruits.png', gradient: 'from-orange-900/50 to-transparent' },
  { id: 3, name: 'Dairy', image: '/categories/dairy.png', gradient: 'from-yellow-900/50 to-transparent' },
  { id: 4, name: 'Meat', image: '/categories/meat.png', gradient: 'from-red-900/50 to-transparent' }
];

const productLinks = [
  ['Fresh Vegetables', 'Seasonal Fruits', 'Organic Eggs'],
  ['Local Honey', 'Fresh Milk', 'Artisan Cheese'],
  ['Organic Meat', 'Fresh Fish', 'Free Range Chicken'],
  ['Organic Herbs', 'Fresh Bread', 'Jams & Preserves'],
  ['Local Wine', 'Craft Beer', 'Organic Tea']
];

const MainPage = () => {
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
              <Package className="w-8 h-8 text-[#FF4500] mx-auto" />
              <div className="text-4xl font-bold">50+</div>
              <div className="text-gray-400">Local Farmers</div>
            </div>
            <div className="space-y-2">
              <List className="w-8 h-8 text-[#FF4500] mx-auto" />
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
            <Button variant="outline" className="p-2 rounded-lg bg-[#1E1E1E] border-gray-800 hover:bg-[#FF4500] hover:border-transparent">
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button variant="outline" className="p-2 rounded-lg bg-[#FF4500] border-transparent hover:bg-[#FF6D33]">
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => (
            <Link key={category.id} to={`/category/${category.name.toLowerCase()}`}>
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

        {/* Game Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {productLinks.map((row, rowIndex) => (
            <div key={rowIndex} className="space-y-4">
              {row.map((pr, prIndex) => (
                <Link
                  key={prIndex}
                  to={`/prod/${pr.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block text-center py-3 px-6 rounded-full border border-gray-800 bg-[#1E1E1E]/50 hover:bg-[#FF4500]/10 hover:border-[#FF4500] transition-colors"
                >
                  {pr}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;

