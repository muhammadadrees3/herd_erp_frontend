import axiosInstance from '../utils/axios';

const healthService = {
  // Health Records
  getHealthRecords: async () => {
    const response = await axiosInstance.get('/health/records');
    return response.data;
  },

  createHealthRecord: async (data) => {
    const response = await axiosInstance.post('/health/records', data);
    return response.data;
  },

  updateHealthRecord: async (id, data) => {
    const response = await axiosInstance.patch(`/health/records/${id}`, data);
    return response.data;
  },

  deleteHealthRecord: async (id) => {
    const response = await axiosInstance.delete(`/health/records/${id}`);
    return response.data;
  },

  // Veterinarians
  getVeterinarians: async () => {
    const response = await axiosInstance.get('/health/veterinarians');
    return response.data;
  },

  createVeterinarian: async (data) => {
    const response = await axiosInstance.post('/health/veterinarians', data);
    return response.data;
  },

  updateVeterinarian: async (id, data) => {
    const response = await axiosInstance.patch(`/health/veterinarians/${id}`, data);
    return response.data;
  },

  deleteVeterinarian: async (id) => {
    const response = await axiosInstance.delete(`/health/veterinarians/${id}`);
    return response.data;
  },

  // Vaccinations
  getVaccinations: async () => {
    const response = await axiosInstance.get('/health/vaccinations');
    return response.data;
  },

  createVaccination: async (data) => {
    const response = await axiosInstance.post('/health/vaccinations', data);
    return response.data;
  },

  updateVaccination: async (id, data) => {
    const response = await axiosInstance.patch(`/health/vaccinations/${id}`, data);
    return response.data;
  },

  deleteVaccination: async (id) => {
    const response = await axiosInstance.delete(`/health/vaccinations/${id}`);
    return response.data;
  },

  // Vaccines Inventory
  getVaccines: async () => {
    const response = await axiosInstance.get('/health/vaccines');
    return response.data;
  },

  createVaccine: async (data) => {
    const response = await axiosInstance.post('/health/vaccines', data);
    return response.data;
  },

  updateVaccine: async (id, data) => {
    const response = await axiosInstance.patch(`/health/vaccines/${id}`, data);
    return response.data;
  },

  deleteVaccine: async (id) => {
    const response = await axiosInstance.delete(`/health/vaccines/${id}`);
    return response.data;
  },
};

export default healthService;
