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
import pendingProductsReducer from './slices/pendingProductsSlice';
import producerApplicationsReducer from './slices/producerApplicationsSlice';
import securityReducer from './slices/securitySlice';
import orderReducer from './slices/orderSlice';
import notificationReducer from './slices/notificationSlice';
import producerProductsReducer from './slices/producerProductsSlice';
import { initializeState, setState } from './slices/authSlice';

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
    users: userReducer,
    pendingProducts: pendingProductsReducer,
    producerApplications: producerApplicationsReducer,
    security: securityReducer,
    orders: orderReducer,
    notifications: notificationReducer,
    producerProducts: producerProductsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    })
});

// Initialize auth state immediately after store creation
store.dispatch(initializeState()).then((resultAction) => {
  if (initializeState.fulfilled.match(resultAction)) {
    store.dispatch(setState(resultAction.payload));
  }
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

