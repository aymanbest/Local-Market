import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, Search, ArrowRight, Star, X, SlidersHorizontal, Filter, Check } from 'lucide-react';
import Button from '../components/ui/Button';
import { fetchCategories, fetchProductsByCategory } from '../store/slices/categorySlice';
import { fetchProducts } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import useLoading from '../hooks/useLoading';
import Preloader from './Preloader';
import { useTheme } from '../context/ThemeContext';

const Store = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.categories);
    const { currentCategoryProducts } = useSelector((state) => state.categories);
    const { items: products } = useSelector((state) => state.products);
    const isLoading = useLoading();
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const { isDark } = useTheme();

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // 3x3 grid for desktop
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
    const [selectedRating, setSelectedRating] = useState(0);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [currentPriceRange, setCurrentPriceRange] = useState({ min: 0, max: 1000 });
    const [showFiltersModal, setShowFiltersModal] = useState(false);
    const [tempFilters, setTempFilters] = useState({
        priceRange: { min: 0, max: 1000 },
        rating: 0
    });
    const [categorySearch, setCategorySearch] = useState('');

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

    // Add this after other useEffects
    useEffect(() => {
        if (filteredProducts.length > 0) {
            const prices = filteredProducts.map(product => product.price);
            const maxPrice = Math.max(...prices);
            setPriceRange({ min: 0, max: maxPrice });
            setCurrentPriceRange({ min: 0, max: maxPrice });
        }
    }, [filteredProducts]);

    // Modify the search effect to include price and rating filters
    useEffect(() => {
        let filtered = filteredProducts;
        
        // Apply search term filter
        if (searchTerm !== '') {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Apply price range filter
        filtered = filtered.filter(product => 
            product.price >= currentPriceRange.min && 
            product.price <= currentPriceRange.max
        );
        
        // Apply rating filter
        if (selectedRating > 0) {
            filtered = filtered.filter(product => {
                const avgRating = product.reviews?.reduce((acc, review) => acc + review.rating, 0) / product.reviews?.length || 0;
                return avgRating >= selectedRating;
            });
        }
        
        setSearchResults(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [searchTerm, filteredProducts, currentPriceRange, selectedRating]);

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

    const clearFilters = () => {
        setCurrentPriceRange({ min: priceRange.min, max: priceRange.max });
        setSelectedRating(0);
        setSearchTerm('');
    };

    const handleApplyFilters = () => {
        setTempFilters(tempFilters);
        setCurrentPriceRange(tempFilters.priceRange);
        setSelectedRating(tempFilters.rating);
        setShowFiltersModal(false);
    };

    const handleOpenFilters = () => {
        setTempFilters({
            priceRange: currentPriceRange,
            rating: selectedRating
        });
        setShowFiltersModal(true);
    };

    const FilterModal = () => {
        const [localFilters, setLocalFilters] = useState(tempFilters);

        // Sync with parent state when modal opens
        useEffect(() => {
            setLocalFilters(tempFilters);
        }, [showFiltersModal]);

        const handleApplyFilters = () => {
            setTempFilters(localFilters);
            setCurrentPriceRange(localFilters.priceRange);
            setSelectedRating(localFilters.rating);
            setShowFiltersModal(false);
        };

        const handleResetFilters = () => {
            const resetFilters = {
                priceRange: { min: priceRange.min, max: priceRange.max },
                rating: 0
            };
            setLocalFilters(resetFilters);
        };

        if (!showFiltersModal) return null;

        return (
            <div className="fixed inset-0 z-[100] overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/60 transition-opacity" 
                        onClick={() => setShowFiltersModal(false)} 
                    />
                    
                    {/* Modal Content */}
                    <div className="relative transform overflow-hidden rounded-2xl bg-cardBg border border-border text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl z-[101]">
                        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-cardBg">
                            <h3 className="text-xl font-semibold text-text flex items-center gap-2">
                                <Filter className="w-5 h-5" />
                                Filters
                            </h3>
                            <button 
                                onClick={() => setShowFiltersModal(false)} 
                                className="text-textSecondary hover:text-text transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto bg-cardBg">
                            {/* Price Range Filter */}
                            <div className="space-y-4 mb-8">
                                <h4 className="text-sm font-medium text-textSecondary flex items-center justify-between">
                                    Price Range
                                    <span className="text-xs text-primary">
                                        ${localFilters.priceRange.min} - ${localFilters.priceRange.max}
                                    </span>
                                </h4>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <input
                                                type="number"
                                                value={localFilters.priceRange.min}
                                                onChange={(e) => setLocalFilters(prev => ({
                                                    ...prev,
                                                    priceRange: { ...prev.priceRange, min: Number(e.target.value) }
                                                }))}
                                                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text"
                                                min={priceRange.min}
                                                max={localFilters.priceRange.max}
                                            />
                                            <span className="text-xs text-textSecondary mt-1">Min</span>
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="number"
                                                value={localFilters.priceRange.max}
                                                onChange={(e) => setLocalFilters(prev => ({
                                                    ...prev,
                                                    priceRange: { ...prev.priceRange, max: Number(e.target.value) }
                                                }))}
                                                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text"
                                                min={localFilters.priceRange.min}
                                                max={priceRange.max}
                                            />
                                            <span className="text-xs text-textSecondary mt-1">Max</span>
                                        </div>
                                    </div>
                                    <div className="px-2">
                                        <input
                                            type="range"
                                            min={priceRange.min}
                                            max={priceRange.max}
                                            value={localFilters.priceRange.max}
                                            onChange={(e) => setLocalFilters(prev => ({
                                                ...prev,
                                                priceRange: { ...prev.priceRange, max: Number(e.target.value) }
                                            }))}
                                            className="w-full accent-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-textSecondary">Minimum Rating</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {[5, 4, 3, 2, 1].map((rating) => (
                                        <button
                                            key={rating}
                                            onClick={() => setLocalFilters(prev => ({
                                                ...prev,
                                                rating: rating === localFilters.rating ? 0 : rating
                                            }))}
                                            className={`
                                                flex items-center gap-3 p-3 rounded-xl transition-colors
                                                ${localFilters.rating === rating 
                                                    ? 'bg-primary text-white' 
                                                    : 'hover:bg-white/5 text-text border border-border'
                                                }
                                            `}
                                        >
                                            <div className="flex gap-0.5">
                                                {[...Array(rating)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${
                                                            localFilters.rating === rating 
                                                                ? 'fill-white text-white' 
                                                                : 'fill-yellow-400 text-yellow-400'
                                                        }`}
                                                    />
                                                ))}
                                                {[...Array(5 - rating)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="w-4 h-4 text-gray-300"
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm">{rating} & Up</span>
                                            {localFilters.rating === rating && (
                                                <Check className="w-4 h-4 ml-auto" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-cardBg">
                            <button
                                onClick={handleResetFilters}
                                className="px-4 py-2 rounded-lg border border-border text-text hover:bg-white/5 transition-colors"
                            >
                                Reset
                            </button>
                            <button
                                onClick={handleApplyFilters}
                                className="px-4 py-2 rounded-lg bg-primary hover:bg-primaryHover text-white transition-colors"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Categories Section Component
    const CategoriesSection = () => (
        <div className="rounded-2xl sticky top-4 hidden md:block bg-cardBg border border-border transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl">
            <div className="p-6 bg-gradient-to-r from-primary/10 to-transparent">
                <h3 className="text-lg font-semibold text-text">Categories</h3>
                <p className="text-sm text-textSecondary mt-1">Discover local treasures</p>
                
                {/* Categories Search */}
                <div className="mt-4 relative">
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="w-full px-4 py-2 pr-10 bg-background border border-border rounded-lg text-text placeholder-textSecondary"
                    />
                    <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary" />
                </div>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                <ul className="p-3 space-y-2">
                    <li className="relative">
                        <Link
                            to="/category/all"
                            className={`rounded-xl px-4 py-3 block transition-all duration-300 ${
                                selectedCategory === 'all'
                                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-102 font-medium'
                                    : 'hover:bg-white/5 text-text hover:scale-102'
                            }`}
                            onClick={(e) => {
                                e.preventDefault();
                                handleCategorySelect('all');
                            }}
                        >
                            <span className="flex items-center gap-2">
                                <span>All Products</span>
                                {selectedCategory === 'all' && (
                                    <ArrowRight className="w-4 h-4 ml-auto" />
                                )}
                            </span>
                        </Link>
                    </li>
                    {categories
                        .filter(category => 
                            category.name.toLowerCase().includes(categorySearch.toLowerCase())
                        )
                        .map(category => (
                            <li key={category.categoryId}>
                                <Link
                                    to={`/category/${encodeURIComponent(category.name.toLowerCase())}`}
                                    className={`rounded-xl px-4 py-3 block transition-all duration-300 ${
                                        selectedCategory === category.categoryId
                                            ? 'bg-primary text-white shadow-md shadow-primary/20 scale-102 font-medium'
                                            : 'hover:bg-white/5 text-text hover:scale-102'
                                    }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleCategorySelect(category.categoryId);
                                    }}
                                >
                                    <span className="flex items-center gap-2">
                                        <span>{category.name}</span>
                                        {selectedCategory === category.categoryId && (
                                            <ArrowRight className="w-4 h-4 ml-auto" />
                                        )}
                                    </span>
                                </Link>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );

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

                        <div className="flex gap-2 mb-4">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full bg-cardBg text-text rounded-full px-6 h-12 border border-border"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text pointer-events-none" />
                            </div>
                            <button
                                onClick={() => setShowMobileFilters(true)}
                                className="bg-cardBg border border-border rounded-full w-12 h-12 flex items-center justify-center"
                            >
                                <SlidersHorizontal className="w-5 h-5 text-text" />
                            </button>
                        </div>

                        {/* Mobile Filters Modal */}
                        {showMobileFilters && (
                            <div className="fixed inset-0 z-50 bg-background">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between p-4 border-b border-border">
                                        <h2 className="text-xl font-semibold text-text">Filters</h2>
                                        <button
                                            onClick={() => setShowMobileFilters(false)}
                                            className="p-2"
                                        >
                                            <X className="w-6 h-6 text-text" />
                                        </button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4">
                                        <FilterSection isMobile={true} />
                                    </div>
                                </div>
                            </div>
                        )}

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
                        <div className="flex gap-6">
                            <div className="w-72 shrink-0 space-y-6">
                                {/* Filter Button */}
                                <button
                                    onClick={handleOpenFilters}
                                    className="w-full px-4 py-3 rounded-xl bg-cardBg border border-border hover:bg-white/5 transition-colors flex items-center justify-between"
                                >
                                    <span className="flex items-center gap-2 text-text">
                                        <Filter className="w-5 h-5" />
                                        Filters
                                    </span>
                                    {(currentPriceRange.min > priceRange.min || 
                                      currentPriceRange.max < priceRange.max || 
                                      selectedRating > 0) && (
                                        <span className="bg-primary/10 text-primary text-sm px-2 py-0.5 rounded-full">
                                            Active
                                        </span>
                                    )}
                                </button>

                                <CategoriesSection />
                            </div>

                            <div className="flex-1">
                                {paginatedProducts.length > 0 ? (
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
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-12 bg-cardBg rounded-2xl border border-border text-center">
                                        <div className="w-24 h-24 mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Search className="w-12 h-12 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-text mb-2">No Products Found</h3>
                                        <p className="text-textSecondary max-w-md">
                                            {searchTerm 
                                                ? "We couldn't find any products matching your search. Try different keywords or browse all products."
                                                : "There are no products in this category yet. Check back soon or explore other categories."}
                                        </p>
                                        <Button
                                            onClick={() => {
                                                setSelectedCategory('all');
                                                setSearchTerm('');
                                                navigate('/store');
                                            }}
                                            className="mt-6 bg-primary hover:bg-primaryHover text-white"
                                        >
                                            View All Products
                                        </Button>
                                    </div>
                                )}
                                <PaginationControls />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FilterModal />
        </>
    );
};

export default Store; 