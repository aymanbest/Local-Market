import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../lib/axios';

// Create ticket
export const createTicket = createAsyncThunk(
  'supportTickets/create',
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/support/tickets', ticketData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create ticket');
    }
  }
);

// Fetch producer tickets
export const fetchProducerTickets = createAsyncThunk(
  'supportTickets/fetchProducerTickets',
  async ({ status = 'OPEN', page = 0, size = 10, sortBy = 'createdAt', direction = 'desc' } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/support/tickets/producer?status=${status}&page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tickets');
    }
  }
);

// Fetch admin assigned tickets
export const fetchAdminTickets = createAsyncThunk(
  'supportTickets/fetchAdminTickets',
  async ({ status = 'OPEN', page = 0, size = 10, sortBy = 'createdAt', direction = 'desc' } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/support/tickets/admin?status=${status}&page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tickets');
    }
  }
);

// Fetch unassigned tickets
export const fetchUnassignedTickets = createAsyncThunk(
  'supportTickets/fetchUnassigned',
  async ({ page = 0, size = 10, sortBy = 'createdAt', direction = 'desc' } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/support/tickets/unassigned?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tickets');
    }
  }
);

// Assign ticket
export const assignTicket = createAsyncThunk(
  'supportTickets/assign',
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/support/tickets/${ticketId}/assign`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign ticket');
    }
  }
);

// Forward ticket
export const forwardTicket = createAsyncThunk(
  'supportTickets/forward',
  async ({ ticketId, newAdminId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/support/tickets/${ticketId}/forward?newAdminId=${newAdminId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to forward ticket');
    }
  }
);

// Add message
export const addMessage = createAsyncThunk(
  'supportTickets/addMessage',
  async ({ ticketId, messageData }, { dispatch }) => {
    try {
      await api.post(`/api/support/tickets/${ticketId}/messages`, messageData);
      // After successful message send, fetch updated messages
      dispatch(fetchMessages(ticketId));
    } catch (error) {
      throw error.response?.data?.message || 'Failed to add message';
    }
  }
);

// Fetch messages
export const fetchMessages = createAsyncThunk(
  'supportTickets/fetchMessages',
  async (ticketId, { rejectWithValue }) => {
    try {
      console.log('Fetching messages for ticket ID:', ticketId);
      const response = await api.get(`/api/support/tickets/${ticketId}/messages`);
      console.log('Messages response:', response.data);
      return { ticketId, messages: response.data };
    } catch (error) {
      console.error('Error fetching messages:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

// Close ticket
export const closeTicket = createAsyncThunk(
  'supportTickets/close',
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/support/tickets/${ticketId}/close`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to close ticket');
    }
  }
);

const initialState = {
  tickets: [],
  unassignedTickets: [],
  currentTicket: null,
  messages: {},
  loading: false,
  error: null,
  messageLoading: false,
  messageError: null,
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
  }
};

const supportTicketSlice = createSlice({
  name: 'supportTickets',
  initialState,
  reducers: {
    setCurrentTicket: (state, action) => {
      state.currentTicket = action.payload;
    },
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
      state.messages = {};
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
      // Create ticket
      .addCase(createTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets.unshift(action.payload);
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch tickets (producer/admin)
      .addCase(fetchProducerTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducerTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.content;
        state.pagination = {
          currentPage: action.payload.number,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          pageSize: action.payload.size,
          isFirst: action.payload.first,
          isLast: action.payload.last
        };
      })
      .addCase(fetchProducerTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.content;
        state.pagination = {
          currentPage: action.payload.number,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          pageSize: action.payload.size,
          isFirst: action.payload.first,
          isLast: action.payload.last
        };
      })
      .addCase(fetchAdminTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch unassigned tickets
      .addCase(fetchUnassignedTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnassignedTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.unassignedTickets = action.payload.content;
        state.pagination = {
          currentPage: action.payload.number,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          pageSize: action.payload.size,
          isFirst: action.payload.first,
          isLast: action.payload.last
        };
      })
      .addCase(fetchUnassignedTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.messageLoading = true;
        state.messageError = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messageLoading = false;
        console.log('Setting messages in state:', action.payload);
        // Ensure messages is initialized as an empty array if undefined
        if (!state.messages) {
          state.messages = {};
        }
        state.messages[action.payload.ticketId] = action.payload.messages || [];
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.messageLoading = false;
        state.messageError = action.payload;
      })
      // Add message
      .addCase(addMessage.fulfilled, (state) => {
        // We don't need to update the state here since we're fetching messages after sending
      })
      // Update ticket status
      .addCase(closeTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex(t => t.ticketId === action.payload.ticketId);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      });
  }
});

export const { setCurrentTicket, clearCurrentTicket, updateSorting, updatePagination } = supportTicketSlice.actions;
export default supportTicketSlice.reducer; 