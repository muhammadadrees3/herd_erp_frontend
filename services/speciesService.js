import axiosInstance from '@/utils/axios';

const speciesService = {
  // Fetch all species
  getSpecies: async () => {
    try {
      const response = await axiosInstance.get('/species');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Fetch species stats
  getSpeciesStats: async () => {
    try {
      const response = await axiosInstance.get('/species/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new species
  createSpecies: async (data) => {
    try {
      const response = await axiosInstance.post('/species', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update species
  updateSpecies: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/species/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete species
  deleteSpecies: async (id) => {
    try {
      const response = await axiosInstance.delete(`/species/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default speciesService;
