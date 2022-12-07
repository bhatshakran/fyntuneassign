import { configureStore } from '@reduxjs/toolkit';
import shopsReducer from '../features/shop/shopSlice';

export const store = configureStore({
  reducer: {
    shops: shopsReducer,
  },
});
