import { configureStore } from '@reduxjs/toolkit';
import userSlice from '../features/userSlice';
import productsSlice from '../features/productSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    products: productsSlice
  },
});
