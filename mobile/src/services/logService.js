//this will be where we handle the api calls to
// 'http://localhost:5000/api/logs'

import axios from 'axios';

const API_URL = 'http://192.168.254.122:5000/api/logs';

export const saveLogAPI = async (logData, token) => {

    const res = await axios.post(API_URL, logData, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return res.data;

}

export const getLogsAPI = async (token) => {
    const res = await axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}