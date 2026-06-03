import axios from 'axios';
import API_BASE from '../config';

const API_URL = `${API_BASE}/api/notifications`;

export const saveNotificationAPI = async (notifData, token) => {

    const res = await axios.post(API_URL, notifData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;

};

export const getNotificationsAPI = async (token) => {
    const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
}