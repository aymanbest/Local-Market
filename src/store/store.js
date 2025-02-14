import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth/authSlice';
import cartReducer from './slices/product/cartSlice';
import categoryReducer from './slices/product/categorySlice';
import productReducer from './slices/product/productSlice';
import addressReducer from './slices/customer/addressSlice';
import reviewReducer from './slices/customer/reviewSlice';
import analyticsReducer from './slices/common/analyticsSlice';
import userReducer from './slices/admin/userSlice';
import pendingProductsReducer from './slices/product/pendingProductsSlice';
import securityReducer from './slices/common/securitySlice';
import orderReducer from './slices/customer/orderSlice';
import notificationReducer from './slices/common/notificationSlice';
import producerProductsReducer from './slices/producer/producerProductsSlice';
import producerApplicationsReducer from './slices/producer/producerApplicationsSlice';
import couponReducer from './slices/customer/couponSlice';
import { initializeState, setState } from './slices/auth/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    categories: categoryReducer,
    products: productReducer,
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
    coupons: couponReducer
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

