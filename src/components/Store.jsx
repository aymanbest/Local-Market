import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Search, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const Store = () => {
    const categories = [
        { id: 'fruits', name: 'Fruits & Vegetables' },
        { id: 'dairy', name: 'Dairy & Eggs' },
        { id: 'meat', name: 'Meat & Poultry' },
        { id: 'bakery', name: 'Bakery' },
        { id: 'pantry', name: 'Pantry Items' },
        { id: 'beverages', name: 'Beverages' },
        { id: 'organic', name: 'Organic Foods' }
    ];

    const mockProducts = [
        {
            id: 1,
            name: 'Farm Fresh Eggs',
            price: 4.99,
            image: '/products/eggs.jpg',
            category: 'dairy'
        },
        {
            id: 2,
            name: 'Organic Apples',
            price: 3.99,
            image: '/products/apples.jpg',
            category: 'fruits'
        },
        {
            id: 3,
            name: 'Organic Apples',
            price: 3.99,
            image: '/products/apples.jpg',
            category: 'fruits'
        },

    ];

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(mockProducts);

    const handleAddToCart = (product) => {
        // Implementation of adding product to cart
    };

    return (
        <div className="min-h-screen bg-background transition-colors duration-300">
            {/* Mobile Layout */}
            <div className="md:hidden">
                <div className="px-4 pt-4">
                    <h1 className="text-4xl font-bold text-center text-text mb-6">STORE</h1>
                    
                    {/* Category Dropdown */}
                    <div className="relative mb-4">
                        <select 
                            className="w-full bg-cardBg text-text rounded-full px-6 h-12 border border-border appearance-none"
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">All</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text pointer-events-none" />
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-cardBg text-text rounded-full px-6 h-12 border border-border"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text pointer-events-none" />
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        {filteredProducts.map(product => (
                            <div 
                                key={product.id} 
                                className="bg-cardBg rounded-lg overflow-hidden border border-border transition-colors duration-300"
                            >
                                <div className="relative aspect-[2/1] overflow-hidden">
                                    <img 
                                        src={`https://placehold.co/600x400?text=${product.name}`}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-text">{product.name}</h3>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-primary font-bold">From ${product.price}</p>
                                        <Button 
                                            onClick={() => handleAddToCart(product)}
                                            className="bg-primary hover:bg-primaryHover text-white rounded-full px-4 h-10"
                                        >
                                            Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block">
                <div className="max-w-6xl mx-auto p-4 mb-12">
                    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                        <h2 className="text-4xl font-staatliches font-semibold uppercase text-center text-text">Store</h2>
                        <label className="md:hidden rounded-full flex relative justify-end bg-cardBg">
                            <select className="flex-1 px-4 py-3 appearance-none bg-transparent absolute inset-0 w-full text-text">
                                <option className="bg-background text-text" value="">All</option>
                                {categories.map(category => (
                                    <option 
                                        key={category.id}
                                        className="bg-background text-text" 
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <span className="bg-primary rounded-full p-1 m-2">
                                <ChevronDown className="w-6 h-6 text-white" />
                            </span>
                        </label>
                        <label className="rounded-full flex items-center pl-4 pr-2 py-2 bg-cardBg">
                            <input 
                                type="text" 
                                placeholder="Search" 
                                className="bg-transparent flex-1 text-text placeholder-textSecondary outline-none focus:outline-none focus:ring-0 border-none"
                            />
                            <button className="bg-primary hover:bg-primaryHover rounded-full p-1 transition-colors">
                                <ArrowRight className="w-6 h-6 text-white" />
                            </button>
                        </label>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-64 shrink-0">
                            <div className="rounded-lg sticky top-4 hidden md:block bg-cardBg border border-border transition-colors duration-300">
                                <h3 className="p-4 text-textSecondary">Categories</h3>
                                <hr className="border-border" />
                                <ul className="py-4 space-y-2">
                                    <li className="px-4 relative">
                                        <a className="rounded-lg px-4 py-2 block bg-primary hover:bg-primaryHover text-white transition-colors" href="/store">
                                            <span className="p-px">All</span>
                                        </a>
                                        <div className="absolute right-0 w-1 inset-y-0 bg-primary rounded-l"></div>
                                    </li>
                                    {categories.map(category => (
                                        <li key={category.id} className="px-4 relative">
                                            <a 
                                                className="rounded-lg px-4 py-2 block bg-cardBg hover:bg-white/5 text-text border border-border transition-colors duration-300" 
                                                href={`/store/${category.slug}`}
                                            >
                                                {category.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="flex-1 grid gap-4 md:grid-cols-2 lg:grid-cols-3 h-max">
                            {mockProducts.map(product => (
                                <a 
                                    key={product.id}
                                    href={`/store/products/${product.id}`} 
                                    className="rounded-lg bg-cardBg relative hover:bg-cardBg/80 transition-colors duration-300 border border-border"
                                >
                                    <div style={{ aspectRatio: '5 / 4' }} className="rounded-t-lg overflow-hidden w-full">
                                        <img 
                                            src={`https://placehold.co/600x400?text=${product.name}`}
                                            alt={product.name} 
                                            className="h-full w-full shrink-0 z-10 object-cover" 
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h2 className="font-semibold text-text">{product.name}</h2>
                                        <div className="text-textSecondary text-sm flex gap-1 items-center">
                                            <span>From</span>
                                            <span className="text-xl text-primary font-bold">
                                                ${product.price}
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Store; 