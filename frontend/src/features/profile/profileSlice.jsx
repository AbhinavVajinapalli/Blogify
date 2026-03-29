import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  blogs: [],
  pagination: {
    currentPage: 1,
    limit: 10,
    total: 0,
  },
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action) {
      state.profile = action.payload;
    },
    setProfileBlogs(state, action) {
      state.blogs = action.payload.blogs;
      state.pagination = action.payload.pagination || state.pagination;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { setProfile, setProfileBlogs, setLoading, setError, clearError } =
  profileSlice.actions;

export default profileSlice.reducer;
