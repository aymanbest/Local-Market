
import { useState } from 'react';
import { mockUsers } from '../../mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Search, Filter, ArrowUpDown, UserPlus, Edit2, Trash2, MoreVertical, Shield, User, UserCheck, X, FileText } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import DonutChart from './DonutChart';

const UserManagement = () => {
  // States
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterRole, setFilterRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const itemsPerPage = 8;

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    role: 'customer',
    password: ''
  });

  // Utility function for role badges
  const getRoleBadgeColor = (role) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-indigo-100 text-indigo-700';
      case 'producer':
        return 'bg-blue-100 text-blue-700';
      case 'customer':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Utility function for role icons
  const getRoleIcon = (role) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'producer':
        return <UserCheck className="w-4 h-4" />;
      case 'customer':
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'all' || user.role === filterRole;

    return matchesSearch && matchesRole;
  });
  // users types
  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      total: 1000,  // Example total value (can be dynamic)
      color: '#4CAF50',  // Green for Total Users
    },
    {
      title: 'Active Producers',
      value: users.filter((u) => u.role === 'producer').length,
      total: users.length,
      color: '#3B82F6',  // Blue for Active Producers
    },
    {
      title: 'New Users (This Month)',
      value: 5,  // Adjust dynamically based on your logic
      total: 100,  // Adjust this based on your data
      color: '#9C27B0',  // Purple for New Users
    },
  ];

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Handle nested name property
    if (sortConfig.key === 'name') {
      aValue = a.name.toLowerCase();
      bValue = b.name.toLowerCase();
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));

    // Reset to first page when sorting
    setCurrentPage(1);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const newId = Math.max(...users.map(u => u.id)) + 1;
    setUsers(prev => [...prev, { ...newUser, id: newId }]);
    setShowAddModal(false);
    setNewUser({ name: '', username: '', role: 'customer', password: '' });
  };

  const handleEditUser = (e) => {
    e.preventDefault();
    setUsers(prev => prev.map(user =>
      user.id === selectedUser.id ? { ...selectedUser } : user
    ));
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = () => {
    setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  // Modal Components
  const AddUserModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New User</h3>
          <Button variant="ghost" onClick={() => setShowAddModal(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={newUser.name}
              onChange={e => setNewUser(prev => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-lg border p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={newUser.username}
              onChange={e => setNewUser(prev => ({ ...prev, username: e.target.value }))}
              className="w-full rounded-lg border p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={newUser.role}
              onChange={e => setNewUser(prev => ({ ...prev, role: e.target.value }))}
              className="w-full rounded-lg border p-2"
            >
              <option value="customer">Customer</option>
              <option value="producer">Producer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={newUser.password}
              onChange={e => setNewUser(prev => ({ ...prev, password: e.target.value }))}
              className="w-full rounded-lg border p-2"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit">Add User</Button>
          </div>
        </form>
      </div>
    </div>
  );

  const EditUserModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit User</h3>
          <Button variant="ghost" onClick={() => setShowEditModal(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <form onSubmit={handleEditUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={selectedUser?.name || ''}
              onChange={e => setSelectedUser(prev => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-lg border p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={selectedUser?.username || ''}
              onChange={e => setSelectedUser(prev => ({ ...prev, username: e.target.value }))}
              className="w-full rounded-lg border p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={selectedUser?.role || ''}
              onChange={e => setSelectedUser(prev => ({ ...prev, role: e.target.value }))}
              className="w-full rounded-lg border p-2"
            >
              <option value="customer">Customer</option>
              <option value="producer">Producer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );

  const DeleteUserModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Delete User</h3>
        <p>Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.</p>
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDeleteUser}>Delete</Button>
        </div>
      </div>
    </div>
  );

  // Action Menu Component
  const ActionMenu = ({ user }) => (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
      <div className="py-1">
        <button
          onClick={() => {
            setSelectedUser(user);
            setShowEditModal(true);
            setShowActionMenu(null);
          }}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          Edit User
        </button>
        <button
          onClick={() => {
            setSelectedUser(user);
            setShowDeleteModal(true);
            setShowActionMenu(null);
          }}
          className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
        >
          Delete User
        </button>
      </div>
    </div>
  );

  const downloadPdf = () => {
    console.log('downloaded!!');

  }
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-200">User Management</h2>
          <p className="text-gray-500 mt-1">Manage and monitor user accounts</p>
        </div>

      </div>

      {/* Stats Overview */}
      <div className="flex justify-center items-center mx-auto">
        <div className="w-full max-w-md">  {/* Adjust the max-width to control the size of the chart */}
          <DonutChart stats={stats} />
        </div>
      </div>



      {/* Filters and Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative ">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5   text-gray-400 " />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-white pl-10 pr-4 py-2 w-full rounded-lg border  focus:ring-2 focus:ring-orange-600 focus:outline-none bg-inputGrey"
          />

        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 rounded-lg text-white focus:border-orange-700 bg-inputGrey"
        >
          <option value="all">All Roles</option>
          <option value="customer">Customers</option>
          <option value="producer">Producers</option>
          <option value="admin">Admins</option>
        </select>
        <Button
          variant="outline"
          className="flex items-center space-x-2 border border-gray-600 hover:bg-mainBlack"
          onClick={() => handleSort('name')}
        >
          <ArrowUpDown className="w-5 h-5" />
          <span>Sort by Name</span>
        </Button>
        <div className='flex gap-2'>

          <Button
            className="bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2"
            onClick={() => downloadPdf()}
          >
            <FileText />
          </Button>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-2"
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus className="w-5 h-5" />
          </Button>

        </div>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden border border-inputGrey shadow-sm hover:shadow-md transition-shadow duration-300 ">
  <Table>
    <TableHeader>
      <TableRow className="bgGrey/50">
        <TableHead
          className="font-semibold cursor-pointer"
          onClick={() => handleSort('name')}
        >
          <div className="flex items-center space-x-2">
            <span>User</span>
            {sortConfig.key === 'name' && (
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
            )}
          </div>
        </TableHead>
        <TableHead
          className="font-semibold cursor-pointer "
          onClick={() => handleSort('role')}
        >
          <div className="flex items-center space-x-2">
            <span>Role</span>
            {sortConfig.key === 'role' && (
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
            )}
          </div>
        </TableHead>
        <TableHead className="font-semibold">Status</TableHead>
        <TableHead className="font-semibold">Last Active</TableHead>
        <TableHead className="font-semibold text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {paginatedUsers.map((user) => (
        <TableRow key={user.id} className="group hover:bg-grey/50">
          <TableCell>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-300">{user.name}</p>
                <p className="text-sm text-gray-500">{user.username}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div
              className={`inline-flex items-center space-x-2 px-2.5 py-1.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}
            >
              {getRoleIcon(user.role)}
              <span className="capitalize">{user.role}</span>
            </div>
          </TableCell>
          <TableCell>
            <Badge variant="success">Active</Badge>
          </TableCell>
          <TableCell>
            <span className="text-gray-600">2 hours ago</span>
          </TableCell>
          <TableCell className="text-right">
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-blue-50 p-2"
                onClick={() => {
                  setSelectedUser(user);
                  setShowEditModal(true);
                }}
              >
                <Edit2 className="w-4 h-4 text-blue-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-red-50 p-2"
                onClick={() => {
                  setSelectedUser(user);
                  setShowDeleteModal(true);
                }}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-gray-100 p-2"
                  onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
                >
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </Button>
                {showActionMenu === user.id && <ActionMenu user={user} />}
              </div>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</Card>


      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
        </p>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className='border border-gray-600  hover:bg-mainBlack'
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            className='text-orange-500 border border-orange-500 hover:border-orange-600  hover:bg-mainBlack'
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Add Modals */}
      {showAddModal && <AddUserModal />}
      {showEditModal && <EditUserModal />}
      {showDeleteModal && <DeleteUserModal />}
    </div>
  );
};

export default UserManagement;

