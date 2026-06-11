//this will be where we handle the api calls to
// 'http://localhost:5000/api/logs'

import axios from 'axios';
import API_BASE from '../config';

const API_URL = `${API_BASE}/api/logs`;

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

export const parseMealAPI = async (text, token) => {

    const res = await axios.post(`${API_BASE}/api/ai/parse-meal`,
        { text }, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return res.data.items;
}

export const getAIQuoteAPI = async (token) => {
    const res = await axios.get(`${API_BASE}/api/ai/quote`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.quote;
};

