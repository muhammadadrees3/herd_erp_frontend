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
// Birth / Calving Records Methods
// ---------------------------------------------------------

const getBirthRecords = async () => {
    try {
        const response = await axios.get(`${API_URL}/birth-records`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error fetching birth records:", error);
        throw error;
    }
};

const createBirthRecord = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/birth-records`, data, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error creating birth record:", error);
        throw error;
    }
};

const updateBirthRecord = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}/birth-records/${id}`, data, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error(`Error updating birth record ${id}:`, error);
        throw error;
    }
};

const deleteBirthRecord = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/birth-records/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error(`Error deleting birth record ${id}:`, error);
        throw error;
    }
};

export default {
    getBirthRecords,
    createBirthRecord,
    updateBirthRecord,
    deleteBirthRecord
};
