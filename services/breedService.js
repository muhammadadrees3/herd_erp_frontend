import axiosInstance from '@/utils/axios';

const breedService = {
  // Fetch all breeds
  getBreeds: async () => {
    try {
      const response = await axiosInstance.get('/breeds');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Fetch breed stats
  getBreedStats: async () => {
    try {
      const response = await axiosInstance.get('/breeds/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new breed
  createBreed: async (data) => {
    try {
      const response = await axiosInstance.post('/breeds', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update breed
  updateBreed: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/breeds/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete breed
  deleteBreed: async (id) => {
    try {
      const response = await axiosInstance.delete(`/breeds/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default breedService;
