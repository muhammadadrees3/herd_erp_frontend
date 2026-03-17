import axiosInstance from '../utils/axios';

const reproductionService = {
  // Breeding
  getBreedings: async () => {
    const response = await axiosInstance.get('/breeding');
    return response.data;
  },

  createBreeding: async (data) => {
    const response = await axiosInstance.post('/breeding', data);
    return response.data;
  },

  updateBreeding: async (id, data) => {
    const response = await axiosInstance.patch(`/breeding/${id}`, data);
    return response.data;
  },

  deleteBreeding: async (id) => {
    const response = await axiosInstance.delete(`/breeding/${id}`);
    return response.data;
  },

  // Pregnancy
  getPregnancies: async () => {
    const response = await axiosInstance.get('/pregnancy');
    return response.data;
  },

  createPregnancy: async (data) => {
    const response = await axiosInstance.post('/pregnancy', data);
    return response.data;
  },

  updatePregnancy: async (id, data) => {
    const response = await axiosInstance.patch(`/pregnancy/${id}`, data);
    return response.data;
  },

  deletePregnancy: async (id) => {
    const response = await axiosInstance.delete(`/pregnancy/${id}`);
    return response.data;
  },

  updatePregnancyMilestones: async (id, milestones) => {
    const response = await axiosInstance.patch(`/pregnancy/${id}/milestones`, milestones);
    return response.data;
  },

  // Dry-Off
  getDryOffs: async () => {
    const response = await axiosInstance.get('/dryoff');
    return response.data;
  },

  createDryOff: async (data) => {
    const response = await axiosInstance.post('/dryoff', data);
    return response.data;
  },

  updateDryOff: async (id, data) => {
    const response = await axiosInstance.patch(`/dryoff/${id}`, data);
    return response.data;
  },

  deleteDryOff: async (id) => {
    const response = await axiosInstance.delete(`/dryoff/${id}`);
    return response.data;
  },

  // Overview
  getReproductionStats: async () => {
    const response = await axiosInstance.get('/reproduction-overview/stats');
    return response.data;
  },
};

export default reproductionService;
