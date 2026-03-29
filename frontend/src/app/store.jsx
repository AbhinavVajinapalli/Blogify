import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import blogsReducer from '../features/blogs/blogsSlice';
import profileReducer from '../features/profile/profileSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogsReducer,
    profile: profileReducer,
  },
});

export default store;
