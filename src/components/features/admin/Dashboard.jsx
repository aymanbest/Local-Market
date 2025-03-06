import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '../../common/ui/Card';
import { Users, DollarSign, ShoppingCart, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Download } from 'lucide-react';
import Chart from 'react-apexcharts';
import { useTheme } from '../../../context/ThemeContext';
import { fetchBusinessMetrics, fetchTransactionData, fetchUserAnalytics, exportAnalytics } from '../../../store/slices/common/analyticsSlice';
import { formatPercentage, formatCurrency } from '../../../utils/formatters';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const [dateRange, setDateRange] = useState('year');
  const [currentPage, setCurrentPage] = useState(1);
  const [exportFormat, setExportFormat] = useState('pdf');
  const itemsPerPage = 5; // Number of transactions per page
  const [jumpToPage, setJumpToPage] = useState('');
  
  const { businessMetrics, transactions, userAnalytics, loading, error } = useSelector(state => state.analytics);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions?.transactions?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.ceil((transactions?.transactions?.length || 0) / itemsPerPage);

  useEffect(() => {
    const now = new Date();
    let startDate, endDate;

    switch (dateRange) {
      case 'day':
        startDate = now.toISOString().split('T')[0];
        endDate = startDate;
        break;
      case 'week':
        endDate = now.toISOString().split('T')[0];
        startDate = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
        break;
      case 'month':
        endDate = now.toISOString().split('T')[0];
        startDate = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0];
        break;
      case 'year':
        endDate = now.toISOString().split('T')[0];
        startDate = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().split('T')[0];
        break;
      default:
        break;
    }

    dispatch(fetchBusinessMetrics({ startDate, endDate }));
    dispatch(fetchTransactionData({ startDate, endDate }));
    dispatch(fetchUserAnalytics({ startDate, endDate }));
  }, [dateRange, dispatch]);

  // Update stats array to use formatted numbers
  const stats = businessMetrics ? [
    {
      title: "Total Revenue",
      value: formatCurrency(businessMetrics.totalRevenue || 0),
      change: formatPercentage(businessMetrics.revenueGrowthRate),
      trend: businessMetrics.revenueGrowthRate >= 0 ? "up" : "down",
      icon: DollarSign
    },
    {
      title: "Active Users",
      value: businessMetrics.activeUsers?.toLocaleString() || "0",
      change: formatPercentage(businessMetrics.activeUsersGrowthRate),
      trend: businessMetrics.activeUsersGrowthRate >= 0 ? "up" : "down",
      icon: Users
    },
    {
      title: "Total Sales",
      value: businessMetrics.totalSales?.toLocaleString() || "0",
      change: formatPercentage(businessMetrics.salesGrowthRate),
      trend: businessMetrics.salesGrowthRate >= 0 ? "up" : "down",
      icon: ShoppingCart
    },
    {
      title: "Growth Rate",
      value: formatPercentage(businessMetrics.overallGrowthRate),
      change: formatPercentage(businessMetrics.overallGrowthRate),
      trend: businessMetrics.overallGrowthRate >= 0 ? "up" : "down",
      icon: TrendingUp
    }
  ] : [];

  // Update transaction stats to use formatted numbers
  const transactionStats = transactions ? [
    {
      title: "Completed Transactions",
      value: (transactions?.transactionsByStatus?.DELIVERED || 0).toLocaleString(),
      change: "+8.2%"
    },
    {
      title: "Pending Transactions",
      value: (transactions?.transactionsByStatus?.PENDING_PAYMENT || 0).toLocaleString(),
      change: "-3.1%"
    }
  ] : [];

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

  // Update chart configurations
  const { months, revenues } = generateMonthlyData(businessMetrics?.revenueByMonth);
  
  const revenueChartOptions = {
    chart: {
      type: 'area',
      background: 'transparent',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: false
      }
    },
    theme: {
      mode: isDark ? 'dark' : 'light'
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: months,
      labels: {
        style: {
          colors: isDark ? '#94a3b8' : '#64748b'
        }
      }
    },
    yaxis: {
      labels: {
        formatter: (value) => formatCurrency(value),
        style: {
          colors: isDark ? '#94a3b8' : '#64748b'
        }
      }
    },
    grid: {
      borderColor: isDark ? '#1f2937' : '#e5e7eb',
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    colors: ['var(--color-primary)']
  };

  const revenueChartSeries = [{
    name: 'Revenue',
    data: revenues || [] 
  }];

  // Pagination improvements
  const MAX_VISIBLE_PAGES = 5;
  const PaginationControls = ({ currentPage, setCurrentPage, totalPages, jumpToPage, setJumpToPage, handleJumpToPage, indexOfFirstItem, indexOfLastItem, totalItems }) => {
    const getVisiblePages = () => {
  
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

  // Memorize Transactions
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

  const handleExport = async () => {
    const now = new Date();
    let startDate, endDate;

    switch (dateRange) {
      case 'day':
        startDate = now.toISOString().split('T')[0];
        endDate = startDate;
        break;
      case 'week':
        endDate = now.toISOString().split('T')[0];
        startDate = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
        break;
      case 'month':
        endDate = now.toISOString().split('T')[0];
        startDate = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0];
        break;
      case 'year':
        endDate = now.toISOString().split('T')[0];
        startDate = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().split('T')[0];
        break;
      default:
        break;
    }

    await dispatch(exportAnalytics({ startDate, endDate, format: exportFormat }));
  };

  return (
    <div className="min-h-screen bg-background p-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-text tracking-tight">Dashboard Overview</h2>
            <p className="text-textSecondary mt-1">Analytics and summary of your business</p>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              className="bg-inputBg text-text rounded-lg px-4 py-2 border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            
            <div className="flex items-center space-x-2">
              <select
                className="bg-inputBg text-text rounded-lg px-4 py-2 border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
              </select>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 bg-primary text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-200"
                disabled={loading}
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className={`bg-cardBg border-border hover:bg-opacity-90 transition-all duration-300 ${
                isDark ? 'dark:bg-[#1E1E1E]' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="bg-inputBg p-3 rounded-lg">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex items-center space-x-1">
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 text-primary" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-primary' : 'text-red-500'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-text tracking-tight">{stat.value}</p>
                  <h3 className="text-sm font-medium text-textSecondary mt-1">{stat.title}</h3>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card 
            className={`bg-cardBg border-border lg:col-span-2 ${
              isDark ? 'dark:bg-[#1E1E1E]' : ''
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-text">Revenue Trend</h3>
              </div>
              <Chart
                options={revenueChartOptions}
                series={revenueChartSeries}
                type="area"
                height={350}
              />
            </div>
          </Card>

          <Card 
            className={`bg-cardBg border-border ${
              isDark ? 'dark:bg-[#1E1E1E]' : ''
            }`}
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-text mb-6">Transaction Summary</h3>
              <div className="space-y-6">
                {transactionStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-textSecondary">{stat.title}</p>
                      <p className="text-lg font-semibold text-text mt-1">{stat.value}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      stat.change.startsWith('+') 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Transactions Table */}
        <RecentTransactions 
          transactions={transactions?.transactions || []} 
        />
      </div>
    </div>
  );
};

export default Dashboard;