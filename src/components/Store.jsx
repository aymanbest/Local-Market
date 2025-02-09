import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, Search, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import { fetchCategories, fetchProductsByCategory } from '../store/slices/categorySlice';
import { fetchProducts } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import useLoading from '../hooks/useLoading';
import Preloader from './Preloader';

const Store = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.categories);
    const { currentCategoryProducts } = useSelector((state) => state.categories);
    const { items: products } = useSelector((state) => state.products);
    const isLoading = useLoading();
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // 3x3 grid for desktop

    // Calculate pagination
    const totalPages = Math.ceil(searchResults.length / itemsPerPage);
    const paginatedProducts = searchResults.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getFullImageUrl = (imageUrl) => {
        if (!imageUrl) return 'https://placehold.co/600x400?text=No+Image';
        return imageUrl.startsWith('http') ? imageUrl : `http://localhost:8080${imageUrl}`;
      };

    // Fetch categories and products on component mount
    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchProducts());
    }, [dispatch]);

    // Add this useEffect to handle URL parameters
    useEffect(() => {
        const categoryName = location.pathname.split('/category/')[1];
        if (categoryName) {
            const category = categories.find(
                cat => cat.name.toLowerCase() === decodeURIComponent(categoryName.toLowerCase())
            );
            if (category) {
                setSelectedCategory(category.categoryId);
            }
        }
    }, [location, categories]);

    // Handle category change
    useEffect(() => {
        if (selectedCategory === 'all') {
            dispatch(fetchProducts())
                .then((action) => {
                    if (action.payload) {
                        const allProducts = action.payload.flatMap(producer => {
                            if (user && producer.producerId === user.id) {
                                return [];
                            }
                            return producer.products.map(product => ({
                                ...product,
                                producer: producer.username,
                                producerName: `${producer.firstname} ${producer.lastname}`
                            }));
                        });
                        setFilteredProducts(allProducts);
                        setSearchResults(allProducts);
                    }
                });
        } else {
            dispatch(fetchProductsByCategory(selectedCategory))
                .then((action) => {
                    if (action.payload) {
                        const allProducts = action.payload.flatMap(producer => {
                            if (user && producer.producerId === user.id) {
                                return [];
                            }
                            return producer.products || [];
                        });
                        setFilteredProducts(allProducts);
                        setSearchResults(allProducts);
                    }
                });
        }
    }, [selectedCategory, dispatch, user]);

    // Handle search
    useEffect(() => {
        if (searchTerm === '') {
            setSearchResults(filteredProducts);
            return;
        }
        
        const filtered = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filtered);
    }, [searchTerm, filteredProducts]);

    const handleAddToCart = (product) => {
        const cartItem = {
            id: product.productId,
            productId: product.productId,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: 1
        };
        dispatch(addToCart(cartItem));
    };

    // Modify the PaginationControls component to include a visibility check
    const PaginationControls = () => {
        if (searchResults.length <= itemsPerPage) {
            return null;
        }
        
        return (
            <div className="max-w-6xl mx-auto px-4 flex items-center justify-between py-4">
                <p className="text-sm text-textSecondary">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, searchResults.length)}
                    </span> of{' '}
                    <span className="font-medium">{searchResults.length}</span> products
                </p>
                <div className="flex items-center space-x-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="border hover:bg-cardBg text-text border-border"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        Previous
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm"
                        className="border hover:bg-primary/10 text-primary border-primary"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        );
    };

    // Modify the category selection handler
    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1);
        
        // Find the category name for the URL
        const selectedCat = categories.find(cat => cat.categoryId === categoryId);
        if (selectedCat) {
            navigate(`/category/${encodeURIComponent(selectedCat.name.toLowerCase())}`);
        } else if (categoryId === 'all') {
            navigate('/store');
        }
    };

    if (isLoading) {
        return <Preloader />;
    }

    return (
        <>
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
                                value={selectedCategory}
                            >
                                <option value="all">All</option>
                                {categories.map(category => (
                                    <option key={category.categoryId} value={category.categoryId}>
                                        {category.name}
                                    </option>
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
                            {paginatedProducts.map(product => (
                                <div
                                    key={product.productId}
                                    className="bg-cardBg rounded-lg overflow-hidden border border-border transition-colors duration-300"
                                >
                                    <div className="relative aspect-[2/1] overflow-hidden">
                                        <img
                                            src={getFullImageUrl(product.imageUrl)}
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
                        <PaginationControls />
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:block">
                    <div className="max-w-6xl mx-auto p-4 mb-12">
                        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                            <h2 className="text-4xl font-recoleta font-semibold uppercase text-center text-text">Store</h2>
                            <label className="md:hidden rounded-full flex relative justify-end bg-cardBg">
                                <select className="flex-1 px-4 py-3 appearance-none bg-transparent absolute inset-0 w-full text-text">
                                    <option className="bg-background text-text" value="">All</option>
                                    {categories.map(category => (
                                        <option
                                            key={category.categoryId}
                                            className="bg-background text-text"
                                            value={category.categoryId}
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
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-transparent flex-1 text-text placeholder-textSecondary outline-none focus:outline-none focus:ring-0 border-none"
                                />
                                <button className="bg-primary hover:bg-primaryHover rounded-full p-1 transition-colors">
                                    <Search className="w-6 h-6 text-white" />
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
                                            <Link
                                                to="/category/all"
                                                className={`rounded-lg px-4 py-2 block ${
                                                    selectedCategory === 'all'
                                                        ? 'bg-primary hover:bg-primaryHover text-white'
                                                        : 'bg-cardBg hover:bg-white/5 text-text border border-border'
                                                } transition-colors`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleCategorySelect('all');
                                                }}
                                            >
                                                <span className="p-px">All</span>
                                            </Link>
                                            {selectedCategory === 'all' && (
                                                <div className="absolute right-0 w-1 inset-y-0 bg-primary rounded-l"></div>
                                            )}
                                        </li>
                                        {categories.map(category => (
                                            <li key={category.categoryId} className="px-4 relative">
                                                <Link
                                                    to={`/category/${encodeURIComponent(category.name.toLowerCase())}`}
                                                    className={`rounded-lg px-4 py-2 block ${
                                                        selectedCategory === category.categoryId
                                                            ? 'bg-primary hover:bg-primaryHover text-white'
                                                        : 'bg-cardBg hover:bg-white/5 text-text border border-border'
                                                    } transition-colors duration-300`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleCategorySelect(category.categoryId);
                                                    }}
                                                >
                                                    {category.name}
                                                </Link>
                                                {selectedCategory === category.categoryId && (
                                                    <div className="absolute right-0 w-1 inset-y-0 bg-primary rounded-l"></div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 h-max">
                                    {paginatedProducts.map(product => (
                                        <a
                                            key={product.productId}
                                            href={`/store/products/${product.productId}`}
                                            className="rounded-lg bg-cardBg relative hover:bg-cardBg/80 transition-colors duration-300 border border-border"
                                        >
                                            <div style={{ aspectRatio: '5 / 4' }} className="rounded-t-lg overflow-hidden w-full">
                                                <img
                                                    src={getFullImageUrl(product.imageUrl)}
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
                                <PaginationControls />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Store; 