import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '../../common/ui/Card';
import { Users, DollarSign, ShoppingCart, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Package, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import Chart from 'react-apexcharts';
import { useTheme } from '../../../context/ThemeContext';
import { fetchProducerOverview, fetchOrderStats } from '../../../store/slices/common/analyticsSlice';
import { formatPercentage, formatCurrency } from '../../../utils/formatters';



// TO BE PRODUCER
const Analytics = () => {
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const [dateRange, setDateRange] = useState('year');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of transactions per page
  const [jumpToPage, setJumpToPage] = useState('');
  
  const { overview, orderStats, loading, error } = useSelector(state => state.analytics);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = overview?.transactions?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.ceil((overview?.transactions?.length || 0) / itemsPerPage);

  useEffect(() => {
    dispatch(fetchProducerOverview());
    dispatch(fetchOrderStats());
  }, [dispatch]);

  const stats = overview ? [
    {
      title: "Total Revenue",
      value: formatCurrency(overview.totalRevenue || 0),
      change: formatPercentage(overview.revenuePercentageChange),
      trend: overview.revenuePercentageChange >= 0 ? "up" : "down",
      icon: DollarSign
    },
    {
      title: "Total Orders",
      value: overview.totalOrders?.toLocaleString() || "0",
      change: formatPercentage(overview.ordersPercentageChange),
      trend: overview.ordersPercentageChange >= 0 ? "up" : "down",
      icon: Package
    },
    {
      title: "Products Sold",
      value: overview.totalProductsSold?.toLocaleString() || "0",
      change: formatPercentage(overview.productsSoldPercentageChange),
      trend: overview.productsSoldPercentageChange >= 0 ? "up" : "down",
      icon: ShoppingCart
    },
    {
      title: "Growth Rate",
      value: formatPercentage(overview.growthRate),
      change: formatPercentage(overview.growthRate),
      trend: overview.growthRate >= 0 ? "up" : "down",
      icon: TrendingUp
    }
  ] : [];

  const orderStatusStats = [
    {
      title: "Total Orders",
      value: orderStats?.total || 0,
      icon: Package,
      color: "blue",
      bgColor: "bg-blue-500/10",
      iconBg: "bg-blue-100/10"
    },
    {
      title: "Processing Orders",
      value: orderStats?.processing || 0,
      icon: AlertCircle,
      color: "yellow",
      bgColor: "bg-yellow-500/10",
      iconBg: "bg-yellow-100/10"
    },
    {
      title: "Pending Orders",
      value: orderStats?.pending || 0,
      icon: Clock,
      color: "orange",
      bgColor: "bg-orange-500/10",
      iconBg: "bg-orange-100/10"
    },
    {
      title: "Delivered Orders",
      value: orderStats?.delivered || 0,
      icon: CheckCircle2,
      color: "green",
      bgColor: "bg-green-500/10",
      iconBg: "bg-green-100/10"
    }
  ];

  // Helper function to generate monthly data points
  const generateMonthlyData = (revenueData) => {
    if (!revenueData || revenueData.length === 0) {
      // Return default data structure with empty arrays
      return { months: Array(12).fill(''), revenues: Array(12).fill(0) };
    }
    
    const months = [];
    const revenues = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Create a map of existing data
    const dataMap = new Map(
      revenueData.map(item => {
        const [year, month] = item.month.split('-');
        return [`${year}-${month}`, item.revenue];
      })
    );
    
    // Generate last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.push(date.toLocaleString('default', { month: 'short' }));
      revenues.push(dataMap.get(monthKey) || 0);
    }
    
    return { months, revenues };
  };

  // Update chart configurations with proper dark mode colors
  const chartOptions = {
    chart: {
      type: 'area',
      background: isDark ? '#1a1a1a' : '#ffffff',
      foreColor: isDark ? '#e5e7eb' : '#374151',
      toolbar: {
        show: false
      },
      parentHeightOffset: 0
    },
    theme: {
      mode: isDark ? 'dark' : 'light',
      palette: 'palette1'
    },
    stroke: {
      curve: 'smooth',
      width: 3,
      colors: ['#5D8736']
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
        shade: 'dark',
        type: 'vertical'
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: overview?.monthlyOrders?.map(item => item.month) || [],
      labels: {
        style: {
          colors: isDark ? '#e5e7eb' : '#374151'
        }
      },
      axisBorder: {
        color: isDark ? '#374151' : '#e5e7eb'
      },
      axisTicks: {
        color: isDark ? '#374151' : '#e5e7eb'
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: isDark ? '#e5e7eb' : '#374151'
        },
        formatter: (value) => formatCurrency(value)
      }
    },
    grid: {
      show: true,
      borderColor: isDark ? '#374151' : '#e5e7eb',
      strokeDashArray: 4,
      position: 'back',
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      style: {
        fontSize: '12px',
        fontFamily: undefined
      }
    },
    colors: ['#5D8736']
  };

  // Add this handler for the jump to page functionality
  const handleJumpToPage = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(jumpToPage);
    if (pageNumber && pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setJumpToPage('');
    }
  };

  // Pagination improvements
  const MAX_VISIBLE_PAGES = 5;
  const PaginationControls = ({ currentPage, setCurrentPage, totalPages, jumpToPage, setJumpToPage, handleJumpToPage, indexOfFirstItem, indexOfLastItem, totalItems }) => {
    const getVisiblePages = () => {
      const totalPageNumbers = Math.min(MAX_VISIBLE_PAGES, totalPages);
      
      if (totalPages <= MAX_VISIBLE_PAGES) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      // Calculate center of the visible range
      const leftOffset = Math.floor(MAX_VISIBLE_PAGES / 2);
      const rightOffset = MAX_VISIBLE_PAGES - leftOffset - 1;

      // Handle cases near the start
      if (currentPage <= leftOffset) {
        return [
          ...Array.from({ length: MAX_VISIBLE_PAGES - 1 }, (_, i) => i + 1),
          '...',
          totalPages
        ];
      }

      // Handle cases near the end
      if (currentPage > totalPages - rightOffset) {
        return [
          1,
          '...',
          ...Array.from(
            { length: MAX_VISIBLE_PAGES - 1 },
            (_, i) => totalPages - (MAX_VISIBLE_PAGES - 2) + i
          )
        ];
      }

      // Handle middle cases
      return [
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages
      ];
    };

    const visiblePages = getVisiblePages();

    return (
      <div className="flex items-center justify-between border-t border-border px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-border bg-cardBg px-4 py-2 text-sm font-medium text-text hover:bg-opacity-90 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-border bg-cardBg px-4 py-2 text-sm font-medium text-text hover:bg-opacity-90 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-textSecondary">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(indexOfLastItem, totalItems)}
              </span>{' '}
              of{' '}
              <span className="font-medium">{totalItems}</span> results
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Jump to page form */}
            <form onSubmit={handleJumpToPage} className="flex items-center space-x-2">
              <label htmlFor="jump-to-page" className="text-sm text-textSecondary">
                Go to page:
              </label>
              <div className="relative">
                <input
                  id="jump-to-page"
                  type="number"
                  min="1"
                  max={totalPages}
                  value={jumpToPage}
                  onChange={(e) => setJumpToPage(e.target.value)}
                  className="w-16 hide-spinner rounded-md border border-border bg-cardBg pl-2 pr-6 py-1 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                  placeholder={currentPage}
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col -space-y-px">
                  <button
                    type="button"
                    onClick={() => setJumpToPage(prev => Math.min((parseInt(prev) || 0) + 1, totalPages).toString())}
                    className="flex items-center justify-center h-3 w-3 rounded-sm hover:bg-primary/10 transition-colors duration-150"
                    disabled={parseInt(jumpToPage) >= totalPages}
                  >
                    <ChevronUp className="h-2.5 w-2.5 text-textSecondary hover:text-primary transition-colors duration-150" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setJumpToPage(prev => Math.max((parseInt(prev) || 2) - 1, 1).toString())}
                    className="flex items-center justify-center h-3 w-3 rounded-sm hover:bg-primary/10 transition-colors duration-150"
                    disabled={parseInt(jumpToPage) <= 1}
                  >
                    <ChevronDown className="h-2.5 w-2.5 text-textSecondary hover:text-primary transition-colors duration-150" />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="rounded-md border border-border bg-cardBg px-2 py-1 text-sm text-text hover:bg-opacity-90 transition-colors duration-150"
              >
                Go
              </button>
            </form>

            {/* Existing pagination controls */}
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md border border-border bg-cardBg px-2 py-2 text-sm font-medium text-text hover:bg-opacity-90 disabled:opacity-50"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              {visiblePages.map((page, index) => (
                page === '...' ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center border border-border bg-cardBg px-4 py-2 text-sm font-medium text-text"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center border border-border px-4 py-2 text-sm font-medium ${
                      currentPage === page
                        ? 'bg-primary text-white'
                        : 'bg-cardBg text-text hover:bg-opacity-90'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}
              <button
                onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md border border-border bg-cardBg px-2 py-2 text-sm font-medium text-text hover:bg-opacity-90 disabled:opacity-50"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  // Create a new memoized component for Recent Transactions
  const RecentTransactions = React.memo(({ transactions }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [jumpToPage, setJumpToPage] = useState('');
    const itemsPerPage = 5;

    const {
      currentTransactions,
      totalPages,
      indexOfFirstItem,
      indexOfLastItem
    } = useMemo(() => {
      const indexOfLast = currentPage * itemsPerPage;
      const indexOfFirst = indexOfLast - itemsPerPage;
      const current = transactions?.slice(indexOfFirst, indexOfLast) || [];
      const total = Math.ceil((transactions?.length || 0) / itemsPerPage);

      return {
        currentTransactions: current,
        totalPages: total,
        indexOfFirstItem: indexOfFirst,
        indexOfLastItem: indexOfLast
      };
    }, [currentPage, transactions]);

    const handleJumpToPage = useCallback((e) => {
      e.preventDefault();
      const pageNumber = parseInt(jumpToPage);
      if (pageNumber && pageNumber > 0 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
        setJumpToPage('');
      }
    }, [jumpToPage, totalPages]);

    return (
      <Card className={`bg-cardBg border-border ${isDark ? 'dark:bg-[#1E1E1E]' : ''}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-text">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-border">
                  <th className="pb-3 text-textSecondary font-medium">Transaction ID</th>
                  <th className="pb-3 text-textSecondary font-medium">Customer</th>
                  <th className="pb-3 text-textSecondary font-medium">Producer</th>
                  <th className="pb-3 text-textSecondary font-medium">Amount</th>
                  <th className="pb-3 text-textSecondary font-medium">Status</th>
                  <th className="pb-3 text-textSecondary font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((transaction, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="py-4 text-text">#{transaction.transactionId}</td>
                    <td className="py-4 text-text">{transaction.customerName}</td>
                    <td className="py-4 text-text">{transaction.producerName}</td>
                    <td className="py-4 text-text">{formatCurrency(transaction.amount)}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'Completed' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-4 text-textSecondary">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationControls
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            jumpToPage={jumpToPage}
            setJumpToPage={setJumpToPage}
            handleJumpToPage={handleJumpToPage}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            totalItems={transactions?.length || 0}
          />
        </div>
      </Card>
    );
  });

  RecentTransactions.displayName = 'RecentTransactions';

  return (
    <div className="min-h-screen bg-background p-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-text tracking-tight">Producer Analytics</h2>
            <p className="text-textSecondary mt-1">Track your business performance and growth</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {orderStatusStats.map((stat, index) => (
            <div 
              key={index}
              className="bg-cardBg rounded-lg border border-border hover:bg-opacity-90 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`${stat.iconBg} p-3 rounded-lg`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-text tracking-tight">
                    {stat.value.toLocaleString()}
                  </p>
                  <h3 className="text-sm font-medium text-textSecondary mt-1">
                    {stat.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className={`bg-cardBg border-border ${isDark ? 'dark:bg-[#1E1E1E]' : ''}`}>
            <div className="p-6">
              <h3 className="text-xl font-bold text-text mb-6">Revenue Trend</h3>
              <div className={`${isDark ? 'dark:bg-[#1E1E1E]' : ''}`}>
                <Chart
                  options={chartOptions}
                  series={[{
                    name: 'Revenue',
                    data: overview?.revenueTrend?.map(item => item.value) || []
                  }]}
                  type="area"
                  height={350}
                />
              </div>
            </div>
          </Card>

          <Card className={`bg-cardBg border-border ${isDark ? 'dark:bg-[#1E1E1E]' : ''}`}>
            <div className="p-6">
              <h3 className="text-xl font-bold text-text mb-6">Monthly Orders</h3>
              <div className={`${isDark ? 'dark:bg-[#1E1E1E]' : ''}`}>
                <Chart
                  options={chartOptions}
                  series={[{
                    name: 'Orders',
                    data: overview?.monthlyOrders?.map(item => item.value) || []
                  }]}
                  type="area"
                  height={350}
                />
              </div>
            </div>
          </Card>
        </div>

        
      </div>
    </div>
  );
};

export default Analytics; 