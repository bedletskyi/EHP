import { configureStore } from '@reduxjs/toolkit';
import { homeReducer } from './components/home/homeSlice';

export const store = configureStore({
  reducer: {
    home: homeReducer,
  },
});

