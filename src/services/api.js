import axios from 'axios';

// API Base URL - will be set from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gdc-elibrary-backend-z0cz.onrender.com/api';

// Log API URL for debugging
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL);
  console.log('🌍 Environment:', import.meta.env.MODE);
  console.log('🔧 VITE_API_URL:', import.meta.env.VITE_API_URL || 'Not set (using Render default)');
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
  timeout: 30000, // 30 second timeout
});

// Token management
const getAccessToken = () => {
  return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
};

const getRefreshToken = () => {
  return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
};

const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
  sessionStorage.removeItem('loggedIn');
  sessionStorage.removeItem('role');
  sessionStorage.removeItem('loggedInStudent');
};

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          clearTokens();
          window.location.href = '/login-selector';
          return Promise.reject(error);
        }

        // Try to refresh token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        }, {
          withCredentials: true,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        setTokens(accessToken, newRefreshToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect
        console.error('Token refresh failed:', refreshError);
        clearTokens();
        // Only redirect if we're not already on login page
        if (!window.location.pathname.includes('login')) {
          window.location.href = '/login-selector';
        }
        return Promise.reject(refreshError);
      }
    }

    // Log error for debugging in production
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        message: error.response.data?.message || error.message
      });
    } else if (error.request) {
      console.error('Network Error:', {
        message: 'No response received from server',
        url: error.config?.url,
        baseURL: API_BASE_URL
      });
    } else {
      console.error('Request Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (studentData) => api.post('/auth/register', studentData),
  loginStudent: (email, password) => api.post('/auth/login/student', { email, password }),
  loginAdmin: (username, password) => api.post('/auth/login/admin', { username, password }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
};

// Student API
export const studentAPI = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (data) => api.put('/students/profile', data),
};

// Admin API
export const adminAPI = {
  getAllStudents: (params = {}) => api.get('/admin/students', { params }),
  getPendingStudents: () => api.get('/admin/students/pending'),
  approveStudent: (studentId) => api.put(`/admin/students/${studentId}/approve`),
  rejectStudent: (studentId) => api.delete(`/admin/students/${studentId}/reject`),
  blockStudent: (studentId) => api.put(`/admin/students/${studentId}/block`),
  unblockStudent: (studentId) => api.put(`/admin/students/${studentId}/unblock`),
  deleteBook: (bookId) => api.delete(`/admin/books/${bookId}`),
  deleteNote: (noteId) => api.delete(`/admin/notes/${noteId}`),
  deletePYQ: (pyqId) => api.delete(`/admin/pyqs/${pyqId}`),
  deleteDiscussion: (messageId) => api.delete(`/admin/discussions/${messageId}`),
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
};

// Content API
export const contentAPI = {
  // Books
  getAllBooks: (params = {}) => api.get('/content/books', { params }),
  getBook: (bookId) => api.get(`/content/books/${bookId}`),
  uploadBook: (formData) => {
    const token = getAccessToken();
    return axios.post(`${API_BASE_URL}/content/books`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
      timeout: 60000, // 60 seconds for file uploads
    });
  },

  // Notes
  getAllNotes: (params = {}) => api.get('/content/notes', { params }),
  getNote: (noteId) => api.get(`/content/notes/${noteId}`),
  uploadNote: (formData) => {
    const token = getAccessToken();
    return axios.post(`${API_BASE_URL}/content/notes`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
      timeout: 60000, // 60 seconds for file uploads
    });
  },

  // PYQs
  getAllPYQs: (params = {}) => api.get('/content/pyqs', { params }),
  getPYQ: (pyqId) => api.get(`/content/pyqs/${pyqId}`),
  uploadPYQ: (formData) => {
    const token = getAccessToken();
    return axios.post(`${API_BASE_URL}/content/pyqs`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
      timeout: 60000, // 60 seconds for file uploads
    });
  },
};

// Discussion API
export const discussionAPI = {
  getAllDiscussions: () => api.get('/discussions'),
  createDiscussion: (text) => api.post('/discussions', { text }),
  deleteDiscussion: (messageId) => api.delete(`/discussions/${messageId}`),
};

// Export token management functions
export { setTokens, clearTokens, getAccessToken };

