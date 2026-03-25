import axiosInstance from '../utils/axios';

const weatherService = {
  getWeatherByCoords: async (lat, lon) => {
    const response = await axiosInstance.get('/weather/current', {
      params: { lat, lon }
    });
    return response.data;
  },

  getDefaultWeather: async () => {
    const response = await axiosInstance.get('/weather/default');
    return response.data;
  },
};

export default weatherService;
