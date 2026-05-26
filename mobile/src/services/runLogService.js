import axios from 'axios';
import API_BASE from '../config';

const API_URL = `${API_BASE}/api/runs`;

export const saveRunAPI = async (logData, token) => {

    const res = await axios.post(API_URL, logData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data;

}

export const getRuns = async (token) => {

    const res = await axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data;

}