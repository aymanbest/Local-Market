import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
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
import supportTicketReducer from './slices/common/supportTicketSlice';

// Configuration for Redux Persist
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['isAuthenticated', 'user', 'status'] // only persist these fields
};

// Create persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
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
    coupons: couponReducer,
    supportTickets: supportTicketReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER'
        ],
      },
    })
});

export const persistor = persistStore(store);

export default store;

