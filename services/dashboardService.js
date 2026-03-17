import axiosInstance from '../utils/axios';

const dashboardService = {
  getStats: async () => {
    const response = await axiosInstance.get('/dashboard/stats');
    return response.data;
  },

  getMilkProduction: async () => {
    const response = await axiosInstance.get('/dashboard/milk-production');
    return response.data;
  },

  getFinanceStats: async () => {
    const response = await axiosInstance.get('/dashboard/finance');
    return response.data;
  },

  getPopulationOverview: async () => {
    const response = await axiosInstance.get('/overview/population');
    return response.data;
  },

  getHealthOverview: async () => {
    const response = await axiosInstance.get('/overview/health');
    return response.data;
  },

  getSalesOverview: async () => {
    const response = await axiosInstance.get('/overview/sales');
    return response.data;
  },
};

export default dashboardService;
