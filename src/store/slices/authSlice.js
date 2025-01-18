import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockUsers } from '../../mockData';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    // Simulation 
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = mockUsers.find(u => u.username === username && u.password === password);
    if (user) {
      return { user: { id: user.id, username: user.username, role: user.role, name: user.name }, token: 'mock_jwt_token' };
    } else {
      return rejectWithValue('Invalid credentials');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, username, password }, { rejectWithValue }) => {
    // Simulation 
    await new Promise(resolve => setTimeout(resolve, 500));

    const userExists = mockUsers.find(u => u.username === username || u.email === email);
    if (userExists) {
      return rejectWithValue('User already exists');
    }

    const newUser = {
      id: mockUsers.length + 1,
      username,
      email,
      password,
      role: 'customer',
    };
    mockUsers.push(newUser);
    
    return { 
      user: { 
        id: newUser.id, 
        username: newUser.username, 
        role: newUser.role 
      }, 
      token: 'mock_jwt_token' 
    };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    status: 'idle',
    error: null,
    isAuthenticated: false
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout: logoutUser } = authSlice.actions;

export default authSlice.reducer;

