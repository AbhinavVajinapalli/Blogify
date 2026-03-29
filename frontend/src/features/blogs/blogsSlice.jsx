import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  feed: [],
  selectedBlog: null,
  pagination: {
    currentPage: 1,
    limit: 10,
    total: 0,
  },
  filters: {
    search: '',
    tags: [],
  },
  loading: false,
  error: null,
  operationStatus: null, // 'creating', 'updating', 'deleting'
};

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setFeed(state, action) {
      state.feed = action.payload?.blogs || [];
      state.pagination = action.payload.pagination || state.pagination;
    },
    setSelectedBlog(state, action) {
      state.selectedBlog = action.payload;
    },
    addBlog(state, action) {
      state.feed.unshift(action.payload);
    },
    updateBlog(state, action) {
      const index = state.feed.findIndex((b) => b._id === action.payload._id);
      if (index !== -1) {
        state.feed[index] = action.payload;
      }
      if (state.selectedBlog?._id === action.payload._id) {
        state.selectedBlog = action.payload;
      }
    },
    deleteBlog(state, action) {
      state.feed = state.feed.filter((b) => b._id !== action.payload);
      if (state.selectedBlog?._id === action.payload) {
        state.selectedBlog = null;
      }
    },
    toggleLike(state, action) {
      const blog = state.feed.find((b) => b._id === action.payload.blogId);
      if (blog) {
        blog.likes = action.payload.likes;
      }
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination(state, action) {
      state.pagination = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setOperationStatus(state, action) {
      state.operationStatus = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  setFeed,
  setSelectedBlog,
  addBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
  setFilters,
  setPagination,
  setLoading,
  setError,
  setOperationStatus,
  clearError,
} = blogsSlice.actions;

export default blogsSlice.reducer;
