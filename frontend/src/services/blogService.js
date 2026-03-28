import apiClient from './apiClient';

export const blogService = {
  // Blog CRUD
  createBlog: async (data) => {
    return apiClient.post('/blogs', data);
  },

  getBlogs: async (params) => {
    return apiClient.get('/blogs', { params });
  },

  getBlog: async (id) => {
    return apiClient.get(`/blogs/${id}`);
  },

  updateBlog: async (id, data) => {
    return apiClient.patch(`/blogs/${id}`, data);
  },

  deleteBlog: async (id) => {
    return apiClient.delete(`/blogs/${id}`);
  },

  // Likes and Bookmarks
  toggleLike: async (id) => {
    return apiClient.patch(`/blogs/${id}/like`);
  },

  toggleBookmark: async (id) => {
    return apiClient.patch(`/blogs/${id}/bookmark`);
  },

  // Comments
  addComment: async (id, content) => {
    return apiClient.post(`/blogs/${id}/comments`, { content });
  },

  getComments: async (id, params) => {
    return apiClient.get(`/blogs/${id}/comments`, { params });
  },

  deleteComment: async (blogId, commentId) => {
    return apiClient.delete(`/blogs/${blogId}/comments/${commentId}`);
  },

  // Profile
  getUserProfile: async (userId) => {
    return apiClient.get(`/profiles/${userId}`);
  },

  getUserBlogs: async (userId, params) => {
    return apiClient.get(`/profiles/${userId}/blogs`, { params });
  },
};
