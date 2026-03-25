import axiosInstance from '../utils/axios';

const animalService = {
  // Animals
  getAnimals: async () => {
    const response = await axiosInstance.get('/animals');
    return response.data;
  },

  createAnimal: async (animalData) => {
    const response = await axiosInstance.post('/animals', animalData);
    return response.data;
  },

  updateAnimal: async (id, animalData) => {
    const response = await axiosInstance.patch(`/animals/${id}`, animalData);
    return response.data;
  },

  deleteAnimal: async (id) => {
    const response = await axiosInstance.delete(`/animals/${id}`);
    return response.data;
  },

  // Sheds
  getSheds: async () => {
    const response = await axiosInstance.get('/sheds');
    return response.data;
  },

  createShed: async (shedData) => {
    const response = await axiosInstance.post('/sheds', shedData);
    return response.data;
  },

  updateShed: async (id, shedData) => {
    const response = await axiosInstance.patch(`/sheds/${id}`, shedData);
    return response.data;
  },

  deleteShed: async (id) => {
    const response = await axiosInstance.delete(`/sheds/${id}`);
    return response.data;
  },

  // Species
  getSpecies: async () => {
    const response = await axiosInstance.get('/species');
    return response.data;
  },

  getSpeciesStats: async () => {
    const response = await axiosInstance.get('/species/stats');
    return response.data;
  },

  createSpecies: async (speciesData) => {
    const response = await axiosInstance.post('/species', speciesData);
    return response.data;
  },

  updateSpecies: async (id, speciesData) => {
    const response = await axiosInstance.put(`/species/${id}`, speciesData);
    return response.data;
  },

  deleteSpecies: async (id) => {
    const response = await axiosInstance.delete(`/species/${id}`);
    return response.data;
  },

};

export default animalService;
