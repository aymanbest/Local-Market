import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Search, Filter, ArrowUpDown, DollarSign, TrendingUp, AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { mockTransactions } from '../../mockData';

const TransactionMonitoring = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter transactions
  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch =
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.producer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toString().includes(searchTerm);

    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalAmount = mockTransactions.reduce((sum, t) => sum + t.amount, 0);
  const completedTransactions = mockTransactions.filter(t => t.status === 'Completed').length;
  const pendingTransactions = mockTransactions.filter(t => t.status === 'Pending').length;

  // Prepare chart data
  const chartData = mockTransactions
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(t => ({
      date: t.date,
      amount: t.amount
    }));

  const getStatusBadge = (status) => {
    const config = {
      Completed: { icon: CheckCircle2, className: 'bg-green-100 text-green-800' },
      Pending: { icon: Clock, className: 'bg-yellow-100 text-yellow-800' },
      Failed: { icon: XCircle, className: 'bg-red-100 text-red-800' }
    };

    const StatusIcon = config[status]?.icon || AlertCircle;
    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config[status]?.className}`}>
        <StatusIcon className="w-4 h-4" />
        <span className="text-sm font-medium">{status}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Transaction Monitoring</h2>
          <p className="text-gray-500 mt-1">Monitor and track all transactions</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300 bg-inputGrey rounded-xl">
          <CardContent className="p-6 bg-inputGrey rounded-xl">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-2 text-gray-100">${totalAmount.toFixed(2)}</p>
            <p className="text-sm text-gray-400">Total Transaction Volume</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300 bg-inputGrey rounded-xl">
          <CardContent className="p-6 bg-inputGrey rounded-xl">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-2 text-gray-100">{completedTransactions}</p>
            <p className="text-sm text-gray-400">Completed Transactions</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300 bg-inputGrey rounded-xl">
          <CardContent className="p-6 bg-inputGrey rounded-xl ">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-2 text-gray-100">{pendingTransactions}</p>
            <p className="text-sm text-gray-400">Pending Transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-white pl-10 pr-4 py-2 w-full rounded-lg border  focus:ring-2 focus:ring-orange-600 focus:outline-none bg-inputGrey"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-lg text-white focus:border-orange-700 bg-inputGrey"
        >
          <option value="all">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {/* Transactions Table */}
      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead>Date</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Producer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id} className="hover:bg-gray-50/50">
                <TableCell className="font-medium text text-gray-300">{transaction.date}</TableCell>
                <TableCell className="font-medium text text-gray-300">#{transaction.id}</TableCell>
                <TableCell className="font-medium text text-gray-300">{transaction.customer}</TableCell>
                <TableCell className="font-medium text text-gray-300">{transaction.producer}</TableCell>
                <TableCell className="font-medium text text-gray-300">${transaction.amount.toFixed(2)}</TableCell>
                <TableCell className="font-medium text text-gray-300">{getStatusBadge(transaction.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Chart Section */}
      <Card className="p-6 !bg-inputGrey">
        <CardHeader className="bg-inputGrey">
          <CardTitle>
            <h1 className="text text-gray-200">Transaction Volume Over Time</h1>
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-inputGrey">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
              contentStyle={{
                backgroundColor: '#0a0a0a',  
                border: 'none',
                borderRadius: '4px',
                color: 'white'    
              }}/>
              <Legend />
              <Bar dataKey="amount" fill="orange" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
};

export default TransactionMonitoring;

