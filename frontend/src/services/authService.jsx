import apiClient from './apiClient';

export const authService = {
  signup: async (name, email, password) => {
    return apiClient.post('/auth/signup', { name, email, password });
  },

  login: async (email, password) => {
    return apiClient.post('/auth/login', { email, password });
  },

  loginWithGoogle: async (credential) => {
    return apiClient.post('/auth/google', { credential });
  },

  getCurrentUser: async () => {
    return apiClient.get('/auth/me');
  },

  updateProfile: async (data) => {
    return apiClient.patch('/auth/me', data);
  },

  deleteAccount: async () => {
    return apiClient.delete('/auth/me');
  },
};
