import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, DollarSign, Users, ShoppingCart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { mockAnalytics } from '../../mockData';

const COLORS = ['#818CF8', '#34D399', '#F472B6', '#FBBF24'];

const ReportingAnalytics = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231",
      change: "+20.1%",
      trend: "up",
      icon: DollarSign,
      color: "indigo"
    },
    {
      title: "Active Users",
      value: "2,345",
      change: "+15.3%",
      trend: "up",
      icon: Users,
      color: "green"
    },
    {
      title: "Total Sales",
      value: "12,234",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      color: "pink"
    },
    {
      title: "Growth Rate",
      value: "23.8%",
      change: "-2.4%",
      trend: "down",
      icon: TrendingUp,
      color: "amber"
    }
  ];
  const colorStyles = {
    indigo: {
      bg: "bg-indigo-100",
      text: "text-indigo-600",
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
    },
    pink: {
      bg: "bg-pink-100",
      text: "text-pink-600",
    },
    amber: {
      bg: "bg-amber-100",
      text: "text-amber-600",
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-100">Reporting & Analytics</h2>
        <p className="text-gray-500 mt-1">Monitor platform performance and insights</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300 !bg-inputGrey rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${colorStyles[stat.color].bg}`}>
                  <stat.icon className={`w-6 h-6 ${colorStyles[stat.color].text}`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                  <span>{stat.change}</span>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-100 mt-1">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category */}
        <Card className="hover:shadow-lg transition-shadow duration-300 !bg-inputGrey rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold"><h1 className='text text-gray-100'>Sales by Category</h1></CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockAnalytics.salesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {mockAnalytics.salesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card className="hover:shadow-lg transition-shadow duration-300 !bg-inputGrey rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold"><h1 className='text text-gray-100'>Revenue Trend</h1></CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockAnalytics.revenueByMonth}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818CF8" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#818CF8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#818CF8"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Producers Performance */}
        <Card className="hover:shadow-lg transition-shadow  duration-300 lg:col-span-2 bg-inputGrey">
          <CardHeader className="bg-inputGrey">
            <CardTitle className="text-xl font-semibold"><h1 className='text text-gray-100'>Top Producers Performance</h1></CardTitle>
          </CardHeader>
          <CardContent className="bg-inputGrey">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockAnalytics.topProducers}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={{
                  backgroundColor: '#0a0a0a',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white'
                }} />
                <Bar dataKey="sales" fill="#818CF8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportingAnalytics;

