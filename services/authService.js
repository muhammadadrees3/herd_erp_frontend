import axiosInstance from '../utils/axios';

const authService = {
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    // Note: SignUp.jsx used a direct axios call with API_BASE_URL, 
    // but axiosInstance is pre-configured with the same base URL.
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  logout: async (refreshToken) => {
    const response = await axiosInstance.post('/auth/logout', { token: refreshToken });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get('/user/me');
    return response.data;
  },

  updateProfilePhoto: async (formData) => {
    const response = await axiosInstance.post('/user/upload-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default authService;
