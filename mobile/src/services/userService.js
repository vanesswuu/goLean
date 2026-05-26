import axios from 'axios';
import API_BASE from '../config';

const API_URL = `${API_BASE}/api/auth/profile`;

export const updateProfileAPI = async (profileData, token) => {

    const res = await axios.put(API_URL, profileData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;

}