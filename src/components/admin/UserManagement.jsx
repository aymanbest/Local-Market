import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUser, deleteUser } from '../../store/slices/userSlice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import { Search, Filter, ArrowUpDown, Edit2, Trash2, X, UserCog, Shield, Users, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Activity, Gauge, Lock, UserCheck, Building2, Key } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Create a memoized UsersTable component
const UsersTable = React.memo(({ users, onEdit, onDelete, isDark }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpToPage, setJumpToPage] = useState('');
  const itemsPerPage = 5;

  const {
    paginatedUsers,
    totalPages,
    filteredUsers
  } = useMemo(() => {
    const paginated = users.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    const total = Math.ceil(users.length / itemsPerPage);

    return {
      paginatedUsers: paginated,
      totalPages: total,
      filteredUsers: users
    };
  }, [users, currentPage]);

  const handleJumpToPage = useCallback((e) => {
    e.preventDefault();
    const page = parseInt(jumpToPage);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setJumpToPage('');
    }
  }, [jumpToPage, totalPages]);

  const getRoleBadgeClass = useCallback((role) => {
    const classes = {
      ADMIN: 'bg-red-500/20 text-red-500 dark:bg-red-500/10 dark:text-red-400',
      PRODUCER: 'bg-purple-500/20 text-purple-500 dark:bg-purple-500/10 dark:text-purple-400',
      CUSTOMER: 'bg-blue-500/20 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400'
    };
    return classes[role] || classes.CUSTOMER;
  }, []);

  return (
    <Card className={`bg-cardBg border-border overflow-hidden ${isDark ? 'dark:bg-[#1E1E1E]' : ''}`}>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="pb-3 text-textSecondary font-medium">User</th>
                <th className="pb-3 text-textSecondary font-medium">Email</th>
                <th className="pb-3 text-textSecondary font-medium">Role</th>
                <th className="pb-3 text-textSecondary font-medium">Created At</th>
                <th className="pb-3 text-textSecondary font-medium">Last Login</th>
                <th className="pb-3 text-textSecondary font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.userId} className="border-b border-border">
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium text-text">{`${user.firstname} ${user.lastname}`}</p>
                        <p className="text-sm text-textSecondary">{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-text">{user.email}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 text-textSecondary">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 text-textSecondary">{new Date(user.lastLogin).toLocaleDateString()}</td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(user)}
                        className="p-2 hover:bg-primary/10 rounded-lg transition-colors duration-200"
                      >
                        <Edit2 className="w-4 h-4 text-primary" />
                      </button>
                      <button
                        onClick={() => onDelete(user)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-textSecondary">
            Showing <span className="font-medium text-text">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-medium text-text">
              {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
            </span> of{' '}
            <span className="font-medium text-text">{filteredUsers.length}</span> users
          </p>
          
          <div className="flex items-center space-x-4">
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
                  className="w-16 hide-spinner rounded-md border border-border bg-cardBg pl-2 pr-6 py-1 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary appearance-none transition-colors duration-200"
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
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="border border-border hover:bg-cardBg transition-colors duration-200"
              >
                Go
              </Button>
            </form>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border border-border hover:bg-cardBg transition-colors duration-200"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border border-border hover:bg-cardBg transition-colors duration-200"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
});

UsersTable.displayName = 'UsersTable';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector(state => state.users);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [totalCounts, setTotalCounts] = useState({
    total: 0,
    producers: 0,
    admins: 0,
    customers: 0
  });
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    firstname: '',
    lastname: '',
    role: ''
  });
  const { isDark } = useTheme();
  const [jumpToPage, setJumpToPage] = useState('');
  const [allUsers, setAllUsers] = useState([]);

  const itemsPerPage = 5;

  // Initial fetch of all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      await dispatch(fetchUsers());
    };
    fetchAllUsers();
  }, [dispatch]);

  // Update allUsers and total counts when users array changes
  useEffect(() => {
    if (users.length > 0) {
      setAllUsers(users);
      setTotalCounts({
        total: users.length,
        producers: users.filter(u => u.role === 'PRODUCER').length,
        admins: users.filter(u => u.role === 'ADMIN').length,
        customers: users.filter(u => u.role === 'CUSTOMER').length
      });
    }
  }, [users]);

  const filteredUsers = useMemo(() => {
    return allUsers
      .filter(user => roleFilter ? user.role === roleFilter : true)
      .filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [allUsers, roleFilter, searchTerm]);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role
    });
    setShowEditModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    await dispatch(updateUser({ id: selectedUser.userId, userData: editForm }));
    setShowEditModal(false);
  };

  const handleDeleteConfirm = async () => {
    await dispatch(deleteUser(selectedUser.userId));
    setShowDeleteModal(false);
  };

  const getRoleBadgeClass = (role) => {
    const classes = {
      ADMIN: 'bg-red-500/20 text-red-500 dark:bg-red-500/10 dark:text-red-400',
      PRODUCER: 'bg-purple-500/20 text-purple-500 dark:bg-purple-500/10 dark:text-purple-400',
      CUSTOMER: 'bg-blue-500/20 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400'
    };
    return classes[role] || classes.CUSTOMER;
  };

  // Pagination handler
  const handleJumpToPage = (e) => {
    e.preventDefault();
    const page = parseInt(jumpToPage);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-background p-2 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-text tracking-tight">User Management</h2>
            <p className="text-textSecondary mt-1">Manage and monitor system users</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              label: 'Total Users', 
              value: totalCounts.total, 
              icon: Users, 
              bgColor: 'bg-[#5D8736]/10 dark:bg-[#A9C46C]/10',
              iconColor: 'text-[#5D8736] dark:text-[#A9C46C]',
              description: 'Active accounts in the system',
              descriptionIcon: Activity,
              bottomLabel: 'Total capacity',
              bottomValue: 'Unlimited'
            },
            { 
              label: 'Producers', 
              value: totalCounts.producers, 
              icon: UserCog, 
              bgColor: 'bg-[#5D8736]/10 dark:bg-[#A9C46C]/10',
              iconColor: 'text-[#5D8736] dark:text-[#A9C46C]',
              description: 'Registered producer accounts',
              descriptionIcon: Building2,
              bottomLabel: 'Active producers',
              bottomValue: `${Math.round((totalCounts.producers / totalCounts.total) * 100)}%`
            },
            { 
              label: 'Admins', 
              value: totalCounts.admins, 
              icon: Shield, 
              bgColor: 'bg-[#5D8736]/10 dark:bg-[#A9C46C]/10',
              iconColor: 'text-[#5D8736] dark:text-[#A9C46C]',
              description: 'System administrators',
              descriptionIcon: Key,
              bottomLabel: 'Access level',
              bottomValue: 'Full system'
            },
          ].map((stat, index) => (
            <Card key={index} className={`bg-cardBg border-border hover:bg-opacity-90 transition-all duration-300 ${isDark ? 'dark:bg-[#1E1E1E]' : ''}`}>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-4xl font-bold text-text tracking-tight">{stat.value}</p>
                    <h3 className="text-base font-medium text-textSecondary mt-1">{stat.label}</h3>
                    <div className="flex items-center gap-1.5 mt-2">
                      <stat.descriptionIcon className={`w-4 h-4 ${stat.iconColor}`} />
                      <p className="text-sm text-textSecondary">{stat.description}</p>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-textSecondary">
                        {stat.bottomLabel}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${stat.iconColor}`}>
                      {stat.bottomValue}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Search and Filter Section */}
        <Card className={`bg-cardBg border-border p-6 ${isDark ? 'dark:bg-[#1E1E1E]' : ''}`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border border-border ${
                  isDark ? 'bg-[#2f2f2f]' : 'bg-inputBg'
                } text-text focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200`}
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={`w-full md:w-48 rounded-lg border border-border ${
                isDark ? 'bg-[#2f2f2f]' : 'bg-inputBg'
              } text-text px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200`}
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="PRODUCER">Producer</option>
              <option value="CUSTOMER">Customer</option>
            </select>
          </div>
        </Card>

        {/* Users Table */}
        <UsersTable
          users={filteredUsers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDark={isDark}
        />

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className={`relative rounded-lg p-6 w-full max-w-md ${
              isDark ? 'bg-[#1E1E1E]' : 'bg-cardBg'
            }`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-text">Edit User</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-textSecondary hover:text-red-500 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-textSecondary mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className={`w-full rounded-lg border border-border ${
                      isDark ? 'bg-[#2f2f2f]' : 'bg-inputBg'
                    } text-text px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200`}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-textSecondary mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className={`w-full rounded-lg border border-border ${
                      isDark ? 'bg-[#2f2f2f]' : 'bg-inputBg'
                    } text-text px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200`}
                  />
                </div>

                <div>
                  <label htmlFor="firstname" className="block text-sm font-medium text-textSecondary mb-1">
                    First Name
                  </label>
                  <input
                    id="firstname"
                    type="text"
                    value={editForm.firstname}
                    onChange={(e) => setEditForm({ ...editForm, firstname: e.target.value })}
                    className={`w-full rounded-lg border border-border ${
                      isDark ? 'bg-[#2f2f2f]' : 'bg-inputBg'
                    } text-text px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200`}
                  />
                </div>

                <div>
                  <label htmlFor="lastname" className="block text-sm font-medium text-textSecondary mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastname"
                    type="text"
                    value={editForm.lastname}
                    onChange={(e) => setEditForm({ ...editForm, lastname: e.target.value })}
                    className={`w-full rounded-lg border border-border ${
                      isDark ? 'bg-[#2f2f2f]' : 'bg-inputBg'
                    } text-text px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200`}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-textSecondary mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={editForm.password || ''}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    className={`w-full rounded-lg border border-border ${
                      isDark ? 'bg-[#2f2f2f]' : 'bg-inputBg'
                    } text-text px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200`}
                    placeholder="Leave blank to keep current password"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-textSecondary mb-1">
                    Role
                  </label>
                  <select
                    id="role"
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className={`w-full rounded-lg border border-border ${
                      isDark ? 'bg-[#2f2f2f]' : 'bg-inputBg'
                    } text-text px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200`}
                  >
                    <option value="CUSTOMER">Customer</option>
                    <option value="PRODUCER">Producer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                    className="border-border hover:bg-cardBg"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    Update User
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className={`relative rounded-lg p-6 w-full max-w-md ${
              isDark ? 'bg-[#1E1E1E]' : 'bg-cardBg'
            }`}>
              <h3 className="text-xl font-semibold text-text mb-4">Confirm Delete</h3>
              <p className="text-textSecondary">Are you sure you want to delete this user?</p>
              <div className="flex justify-end space-x-2 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteModal(false)}
                  className="border-border hover:bg-cardBg"
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteConfirm}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement; 