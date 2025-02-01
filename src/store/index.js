import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import categoryReducer from './slices/categorySlice';
import productReducer from './slices/productSlice';
import producerApplicationReducer from './slices/producerApplicationSlice';
import addressReducer from './slices/addressSlice';
import reviewReducer from './slices/reviewSlice';
import analyticsReducer from './slices/analyticsSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    categories: categoryReducer,
    products: productReducer,
    producerApplication: producerApplicationReducer,
    address: addressReducer,
    reviews: reviewReducer,
    analytics: analyticsReducer,
    users: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    })
});

// Clear cart if it's older than 24 hours
store.subscribe(() => {
  const state = store.getState();
  const lastUpdated = state.cart.lastUpdated;
  
  if (lastUpdated) {
    const now = new Date();
    const lastUpdate = new Date(lastUpdated);
    const hoursDiff = (now - lastUpdate) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      store.dispatch(clearCart());
    }
  }
});

export default store;

