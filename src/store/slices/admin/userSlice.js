import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../lib/axios';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ page = 0, size = 10, sortBy = 'createdAt', direction = 'desc', role = false } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/users?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}${role ? `&role=${role}` : ''}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }, { rejectWithValue, getState }) => {
    try {
      const response = await api.put(`/api/users/${id}`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue, getState }) => {
    try {
      await api.delete(`/api/users/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
    selectedUser: null,
    pagination: {
      currentPage: 0,
      totalPages: 0,
      totalElements: 0,
      pageSize: 10,
      isFirst: true,
      isLast: false
    },
    sorting: {
      sortBy: 'createdAt',
      direction: 'desc'
    },
    totalCounts: {
      total: 0,
      producers: 0,
      admins: 0
    }
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    updateSorting: (state, action) => {
      state.sorting = action.payload;
    },
    updatePagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users.content;
        state.pagination = {
          currentPage: action.payload.users.number,
          totalPages: action.payload.users.totalPages,
          totalElements: action.payload.users.totalElements,
          pageSize: action.payload.users.size,
          isFirst: action.payload.users.first,
          isLast: action.payload.users.last
        };
        state.totalCounts = {
          total: action.payload.totalActiveAccounts,
          producers: action.payload.totalProducerAccounts,
          admins: action.payload.totalAdminAccounts
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.userId === action.payload.userId);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.userId !== action.payload);
      });
  }
});

export const { setSelectedUser, clearSelectedUser, updateSorting, updatePagination } = userSlice.actions;
export default userSlice.reducer; 