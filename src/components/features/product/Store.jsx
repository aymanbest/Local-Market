import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, Search, ArrowRight, Star, X, SlidersHorizontal, Filter, Check, Plus } from 'lucide-react';
import Button from '../../common/ui/Button';
import { fetchCategories, fetchProductsByCategory } from '../../../store/slices/product/categorySlice';
import { fetchProducts } from '../../../store/slices/product/productSlice';
import { addToCart } from '../../../store/slices/product/cartSlice';
import Preloader from '../public/Preloader';

const Store = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.categories);
    const { currentCategoryProducts } = useSelector((state) => state.categories);
    const { items: { products }, pagination, status } = useSelector((state) => state.products);
    const isLoading = status === 'loading';
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
    const [selectedRating, setSelectedRating] = useState(0);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [currentPriceRange, setCurrentPriceRange] = useState({ min: 0, max: 1000 });
    const [showFiltersModal, setShowFiltersModal] = useState(false);
    const [tempFilters, setTempFilters] = useState({
        priceRange: { min: 0, max: 1000 },
        rating: 0,
        sorting: {
            sortBy: 'createdAt',
            direction: 'desc'
        }
    });
    const [categorySearch, setCategorySearch] = useState('');

    // Update price range when products change
    useEffect(() => {
        if (products && products.length > 0) {
            const prices = products.map(product => product.price);
            const maxPrice = Math.max(...prices);
            setPriceRange({ min: 0, max: maxPrice });
            // Only set currentPriceRange if it hasn't been modified by user
            if (currentPriceRange.max === 1000) {
                setCurrentPriceRange({ min: 0, max: maxPrice });
            }
        }
    }, [products]);

    // Fetch categories and products on component mount
    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchProducts({
            page: 0,
            size: 4,
            sortBy: 'createdAt',
            direction: 'desc'
        }));
    }, [dispatch]);

    // Handle category change
    useEffect(() => {
        if (selectedCategory === 'all') {
            dispatch(fetchProducts({
                page: 0,
                size: 4,
                sortBy: tempFilters.sorting.sortBy,
                direction: tempFilters.sorting.direction
            }));
        } else {
            dispatch(fetchProductsByCategory({
                categoryId: selectedCategory,
                page: 0,
                size: 4,
                sortBy: tempFilters.sorting.sortBy,
                direction: tempFilters.sorting.direction
            }));
        }
    }, [selectedCategory, tempFilters.sorting, dispatch]);

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

    const getFullImageUrl = (imageUrl) => {
        if (!imageUrl) return 'https://placehold.co/600x400?text=No+Image';
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
        return `http://localhost:8080${imageUrl}`;
    };

    // Update pagination controls
    const PaginationControls = () => {
        const paginationData = selectedCategory === 'all' ? pagination : useSelector(state => state.categories.pagination);

        if (!paginationData || paginationData.totalElements <= paginationData.pageSize) {
            return null;
        }

        // Generate array of page numbers
        const pageNumbers = [];
        for (let i = 0; i < paginationData.totalPages; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="max-w-6xl mx-auto px-4 flex items-center justify-between py-4">
                <p className="text-sm text-textSecondary">
                    Showing <span className="font-medium">{(paginationData.currentPage || 0) * (paginationData.pageSize || 4) + 1}</span> to{' '}
                    <span className="font-medium">
                        {Math.min(((paginationData.currentPage || 0) + 1) * (paginationData.pageSize || 4), paginationData.totalElements || 0)}
                    </span> of{' '}
                    <span className="font-medium">{paginationData.totalElements || 0}</span> products
                </p>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="border hover:bg-cardBg text-text border-border"
                        disabled={paginationData.isFirst}
                        onClick={() => {
                            if (selectedCategory === 'all') {
                                dispatch(fetchProducts({
                                    page: (paginationData.currentPage || 0) - 1,
                                    size: paginationData.pageSize || 4,
                                    sortBy: tempFilters.sorting.sortBy,
                                    direction: tempFilters.sorting.direction
                                }));
                            } else {
                                dispatch(fetchProductsByCategory({
                                    categoryId: selectedCategory,
                                    page: (paginationData.currentPage || 0) - 1,
                                    size: paginationData.pageSize || 4,
                                    sortBy: tempFilters.sorting.sortBy,
                                    direction: tempFilters.sorting.direction
                                }));
                            }
                        }}
                    >
                        Previous
                    </Button>
                    {pageNumbers.map(pageNumber => (
                        <Button
                            key={pageNumber}
                            variant={pageNumber === paginationData.currentPage ? "default" : "outline"}
                            size="sm"
                            className={`${pageNumber === paginationData.currentPage
                                    ? 'bg-primary text-white'
                                    : 'border hover:bg-cardBg text-text border-border'
                                }`}
                            onClick={() => {
                                if (selectedCategory === 'all') {
                                    dispatch(fetchProducts({
                                        page: pageNumber,
                                        size: paginationData.pageSize || 4,
                                        sortBy: tempFilters.sorting.sortBy,
                                        direction: tempFilters.sorting.direction
                                    }));
                                } else {
                                    dispatch(fetchProductsByCategory({
                                        categoryId: selectedCategory,
                                        page: pageNumber,
                                        size: paginationData.pageSize || 4,
                                        sortBy: tempFilters.sorting.sortBy,
                                        direction: tempFilters.sorting.direction
                                    }));
                                }
                            }}
                        >
                            {pageNumber + 1}
                        </Button>
                    ))}
                    <Button
                        variant="outline"
                        size="sm"
                        className="border hover:bg-primary/10 text-primary border-primary"
                        disabled={paginationData.isLast}
                        onClick={() => {
                            if (selectedCategory === 'all') {
                                dispatch(fetchProducts({
                                    page: (paginationData.currentPage || 0) + 1,
                                    size: paginationData.pageSize || 4,
                                    sortBy: tempFilters.sorting.sortBy,
                                    direction: tempFilters.sorting.direction
                                }));
                            } else {
                                dispatch(fetchProductsByCategory({
                                    categoryId: selectedCategory,
                                    page: (paginationData.currentPage || 0) + 1,
                                    size: paginationData.pageSize || 4,
                                    sortBy: tempFilters.sorting.sortBy,
                                    direction: tempFilters.sorting.direction
                                }));
                            }
                        }}
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
        setSearchTerm(''); // Clear search term when changing categories

        // If there's no search term, use the appropriate fetch based on category
        if (categoryId === 'all') {
            dispatch(fetchProducts({
                page: 0,
                size: 4,
                sortBy: tempFilters.sorting.sortBy,
                direction: tempFilters.sorting.direction
            }));
        } else {
            dispatch(fetchProductsByCategory({
                categoryId: categoryId,
                page: 0,
                size: 4,
                sortBy: tempFilters.sorting.sortBy,
                direction: tempFilters.sorting.direction
            }));
        }

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
            rating: selectedRating,
            sorting: {
                sortBy: tempFilters.sorting.sortBy,
                direction: tempFilters.sorting.direction
            }
        });
        setShowFiltersModal(true);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Always use fetchProducts when searching, the slice will handle the data transformation
        dispatch(fetchProducts({
            page: 0,
            size: 4,
            sortBy: tempFilters.sorting.sortBy,
            direction: tempFilters.sorting.direction,
            search: searchTerm
        }));
        // Set selected category to 'all' when searching
        setSelectedCategory('all');
    };

    const FilterModal = () => {
        const [localFilters, setLocalFilters] = useState(tempFilters);

        const sortingOptions = [
            { value: 'createdAt', label: 'Creation Date' },
            { value: 'price', label: 'Price' },
            { value: 'name', label: 'Name' },
            { value: 'quantity', label: 'Quantity' },
            { value: 'updatedAt', label: 'Last Update' }
        ];

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
                rating: 0,
                sorting: {
                    sortBy: 'createdAt',
                    direction: 'desc'
                }
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
                            {/* Sorting Options */}
                            <div className="space-y-4 mb-8">
                                <h4 className="text-sm font-medium text-textSecondary">Sort By</h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <select
                                        value={localFilters.sorting.sortBy}
                                        onChange={(e) => setLocalFilters(prev => ({
                                            ...prev,
                                            sorting: { ...prev.sorting, sortBy: e.target.value }
                                        }))}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text"
                                    >
                                        {sortingOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setLocalFilters(prev => ({
                                                ...prev,
                                                sorting: { ...prev.sorting, direction: 'asc' }
                                            }))}
                                            className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${localFilters.sorting.direction === 'asc'
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'border-border text-text hover:bg-white/5'
                                                }`}
                                        >
                                            Ascending
                                        </button>
                                        <button
                                            onClick={() => setLocalFilters(prev => ({
                                                ...prev,
                                                sorting: { ...prev.sorting, direction: 'desc' }
                                            }))}
                                            className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${localFilters.sorting.direction === 'desc'
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'border-border text-text hover:bg-white/5'
                                                }`}
                                        >
                                            Descending
                                        </button>
                                    </div>
                                </div>
                            </div>

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
                                                        className={`w-4 h-4 ${localFilters.rating === rating
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
                            className={`rounded-xl px-4 py-3 block transition-all duration-300 ${selectedCategory === 'all'
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
                                    className={`rounded-xl px-4 py-3 block transition-all duration-300 ${selectedCategory === category.categoryId
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
            <div className="min-h-screen bg-background transition-colors duration-300 relative">
                {/* Mobile Layout */}
                <div className="md:hidden bg-background">
                    <div className="px-4 pt-4">
                        <h1 className="text-4xl font-bold text-center text-text mb-6">STORE</h1>

                        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full bg-cardBg text-text rounded-full px-6 h-12 border border-border"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <Search className="w-5 h-5 text-text" />
                                </button>
                            </div>
                        </form>

                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className="bg-cardBg border border-border rounded-full w-12 h-12 flex items-center justify-center"
                        >
                            <SlidersHorizontal className="w-5 h-5 text-text" />
                        </button>

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
                                        {/* Price Range */}
                                        <div className="space-y-4 mb-8">
                                            <h4 className="text-sm font-medium text-textSecondary flex items-center justify-between">
                                                Price Range
                                                <span className="text-xs text-primary">
                                                    ${currentPriceRange.min} - ${currentPriceRange.max}
                                                </span>
                                            </h4>
                                            <div className="space-y-6">
                                                <div className="flex gap-4">
                                                    <div className="flex-1">
                                                        <input
                                                            type="number"
                                                            value={currentPriceRange.min}
                                                            onChange={(e) => setCurrentPriceRange(prev => ({
                                                                ...prev,
                                                                min: Number(e.target.value)
                                                            }))}
                                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text"
                                                            min={priceRange.min}
                                                            max={currentPriceRange.max}
                                                        />
                                                        <span className="text-xs text-textSecondary mt-1">Min</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <input
                                                            type="number"
                                                            value={currentPriceRange.max}
                                                            onChange={(e) => setCurrentPriceRange(prev => ({
                                                                ...prev,
                                                                max: Number(e.target.value)
                                                            }))}
                                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text"
                                                            min={currentPriceRange.min}
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
                                                        value={currentPriceRange.max}
                                                        onChange={(e) => setCurrentPriceRange(prev => ({
                                                            ...prev,
                                                            max: Number(e.target.value)
                                                        }))}
                                                        className="w-full accent-primary"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rating Filter */}
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-medium text-textSecondary">Minimum Rating</h4>
                                            <div className="grid grid-cols-1 gap-2">
                                                {[5, 4, 3, 2, 1].map((rating) => (
                                                    <button
                                                        key={rating}
                                                        onClick={() => setSelectedRating(rating === selectedRating ? 0 : rating)}
                                                        className={`
                                                            flex items-center gap-3 p-3 rounded-xl transition-colors
                                                            ${selectedRating === rating
                                                                ? 'bg-primary text-white'
                                                                : 'hover:bg-white/5 text-text border border-border'
                                                            }
                                                        `}
                                                    >
                                                        <div className="flex gap-0.5">
                                                            {[...Array(rating)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-4 h-4 ${selectedRating === rating
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
                                                        {selectedRating === rating && (
                                                            <Check className="w-4 h-4 ml-auto" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 border-t border-border">
                                        <button
                                            onClick={() => {
                                                clearFilters();
                                                setShowMobileFilters(false);
                                            }}
                                            className="w-full bg-primary hover:bg-primaryHover text-white rounded-xl py-3 font-medium"
                                        >
                                            Apply Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Products Grid */}
                        <div className="grid grid-cols-1 gap-4">
                            {(selectedCategory === 'all' ? products : currentCategoryProducts)?.map(product => (
                                <div
                                    key={product.productId}
                                    className="bg-cardBg rounded-lg overflow-hidden border border-border transition-colors duration-300 flex flex-col"
                                >
                                    <div className="relative aspect-[2/1] overflow-hidden">
                                        <img
                                            src={getFullImageUrl(product.imageUrl)}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="text-lg font-semibold text-text mb-2">{product.name}</h3>
                                        <div className="mt-auto flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <span className="text-textSecondary text-sm">From</span>
                                                <span className="text-primary font-bold">${product.price}</span>
                                            </div>
                                            <button
                                                onClick={(e) => handleAddToCart(product)}
                                                className="w-8 h-8 rounded-full bg-primary hover:bg-primaryHover text-white flex items-center justify-center transition-colors"
                                                aria-label="Add to cart"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <PaginationControls />
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:block bg-background">
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
                                <form onSubmit={handleSearch} className="flex flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="bg-transparent flex-1 text-text placeholder-textSecondary outline-none focus:outline-none focus:ring-0 border-none"
                                    />
                                    <button type="submit" className="bg-primary hover:bg-primaryHover rounded-full p-1 transition-colors">
                                        <Search className="w-6 h-6 text-white" />
                                    </button>
                                </form>
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
                                {products && products.length > 0 ? (
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 h-max">
                                        {(selectedCategory === 'all' ? products : currentCategoryProducts)?.map(product => (
                                            <a
                                                key={product.productId}
                                                href={`/store/products/${product.productId}`}
                                                className="rounded-lg bg-cardBg relative hover:bg-cardBg/80 transition-colors duration-300 border border-border flex flex-col h-full"
                                            >
                                                <div style={{ aspectRatio: '5 / 4' }} className="rounded-t-lg overflow-hidden w-full">
                                                    <img
                                                        src={getFullImageUrl(product.imageUrl)}
                                                        alt={product.name}
                                                        className="h-full w-full shrink-0 z-10 object-cover"
                                                    />
                                                </div>
                                                <div className="p-4 flex flex-col flex-grow">
                                                    <h2 className="font-semibold text-text mb-2">{product.name}</h2>
                                                    <div className="mt-auto flex items-center justify-between">
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-textSecondary text-sm">From</span>
                                                            <span className="text-primary font-bold">${product.price}</span>
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleAddToCart(product);
                                                            }}
                                                            className="w-8 h-8 rounded-full bg-primary hover:bg-primaryHover text-white flex items-center justify-center transition-colors"
                                                            aria-label="Add to cart"
                                                        >
                                                            <Plus className="w-5 h-5" />
                                                        </button>
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