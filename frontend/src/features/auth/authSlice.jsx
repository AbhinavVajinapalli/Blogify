import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: localStorage.getItem('authToken') || null,
  isAuthenticated: Boolean(localStorage.getItem('authToken')),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('authToken', action.payload.token);
    },
    setCurrentUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = Boolean(state.token);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authToken');
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { setLoading, setError, setUser, setCurrentUser, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
