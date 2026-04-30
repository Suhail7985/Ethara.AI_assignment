import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const baseURL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? `${window.location.origin}/api` : 'http://localhost:5000/api');

const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for handling 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/change-password', data),
};

// Project Services
export const projectService = {
  getProjects: (params) => API.get('/projects', { params }),
  getProject: (id) => API.get(`/projects/${id}`),
  createProject: (data) => API.post('/projects', data),
  updateProject: (id, data) => API.put(`/projects/${id}`, data),
  deleteProject: (id) => API.delete(`/projects/${id}`),
};

// Task Services
export const taskService = {
  getTasks: (params) => API.get('/tasks', { params }),
  getTask: (id) => API.get(`/tasks/${id}`),
  createTask: (data) => API.post('/tasks', data),
  updateTask: (id, data) => API.put(`/tasks/${id}`, data),
  deleteTask: (id) => API.delete(`/tasks/${id}`),
  addComment: (id, data) => API.post(`/tasks/${id}/comments`, data),
  deleteComment: (id, commentId) => API.delete(`/tasks/${id}/comments/${commentId}`),
};

// User/Team Services
export const userService = {
  getUsers: (params) => API.get('/users', { params }),
  getAnalytics: () => API.get('/users/analytics'),
  getNotifications: () => API.get('/users/notifications'),
  markRead: (id) => API.put(`/users/notifications/${id}/read`),
  inviteUser: (data) => API.post('/users/invite', data),
};

export default API;
