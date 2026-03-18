import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = Cookies.get('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

// ---------------------------------------------------------
// Weight Records Methods
// ---------------------------------------------------------

const getWeightRecords = async () => {
    try {
        const response = await axios.get(`${API_URL}/weight`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error fetching weight records:", error);
        throw error;
    }
};

const createWeightRecord = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/weight`, data, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error creating weight record:", error);
        throw error;
    }
};

const updateWeightRecord = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}/weight/${id}`, data, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error(`Error updating weight record ${id}:`, error);
        throw error;
    }
};

const deleteWeightRecord = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/weight/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error(`Error deleting weight record ${id}:`, error);
        throw error;
    }
};

export default {
    getWeightRecords,
    createWeightRecord,
    updateWeightRecord,
    deleteWeightRecord
};
