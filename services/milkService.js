import axiosInstance from '../utils/axios';

const milkService = {
  // Usage
  getUsageRecords: async (params) => {
    const response = await axiosInstance.get('/milk/usage', { params });
    return response.data;
  },

  createUsageRecord: async (data) => {
    const response = await axiosInstance.post('/milk/usage', data);
    return response.data;
  },

  updateUsageRecord: async (id, data) => {
    const response = await axiosInstance.patch(`/milk/usage/${id}`, data);
    return response.data;
  },

  deleteUsageRecord: async (id) => {
    const response = await axiosInstance.delete(`/milk/usage/${id}`);
    return response.data;
  },

  // Sales
  getSalesRecords: async (params) => {
    const response = await axiosInstance.get('/milk/sales', { params });
    return response.data;
  },

  getSalesDashboardStats: async () => {
    const response = await axiosInstance.get('/milk/sales/dashboard/stats');
    return response.data;
  },

  createSalesRecord: async (data) => {
    const response = await axiosInstance.post('/milk/sales', data);
    return response.data;
  },

  updateSalesRecord: async (id, data) => {
    const response = await axiosInstance.patch(`/milk/sales/${id}`, data);
    return response.data;
  },

  deleteSalesRecord: async (id) => {
    const response = await axiosInstance.delete(`/milk/sales/${id}`);
    return response.data;
  },

  // Production (Daily Records)
  getDailyProductionRecords: async () => {
    const response = await axiosInstance.get('/milk/production/daily-records');
    return response.data;
  },

  getProductionDashboardStats: async () => {
    const response = await axiosInstance.get('/production/daily-records/dashboard/stats');
    return response.data;
  },

  createDailyProductionRecord: async (data) => {
    const response = await axiosInstance.post('/milk/production/daily-records', data);
    return response.data;
  },

  updateDailyProductionRecord: async (id, data) => {
    const response = await axiosInstance.patch(`/milk/production/daily-records/${id}`, data);
    return response.data;
  },

  deleteDailyProductionRecord: async (id) => {
    const response = await axiosInstance.delete(`/milk/production/daily-records/${id}`);
    return response.data;
  },

  getProductionAnalytics: async (params) => {
    const response = await axiosInstance.get('/milk/production/daily-records/analytics', { params });
    return response.data;
  },

  // OTCs
  getOTCRecords: async (params) => {
    const response = await axiosInstance.get('/milk/otcs', { params });
    return response.data;
  },

  getOTCDashboardStats: async () => {
    const response = await axiosInstance.get('/milk/otcs/dashboard/stats');
    return response.data;
  },

  createOTCRecord: async (data) => {
    const response = await axiosInstance.post('/milk/otcs', data);
    return response.data;
  },

  updateOTCRecord: async (id, data) => {
    const response = await axiosInstance.patch(`/milk/otcs/${id}`, data);
    return response.data;
  },

  deleteOTCRecord: async (id) => {
    const response = await axiosInstance.delete(`/milk/otcs/${id}`);
    return response.data;
  },

  // Sales Overview Analytics
  getSalesOverview: async (params) => {
    const response = await axiosInstance.get('/sales/overview', { params });
    return response.data;
  },

  getSalesOverviewCustomers: async () => {
    const response = await axiosInstance.get('/sales/overview/customers');
    return response.data;
  },

  getSalesOverviewPayments: async () => {
    const response = await axiosInstance.get('/sales/overview/payments');
    return response.data;
  },
};

export default milkService;
