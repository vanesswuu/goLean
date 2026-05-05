import axios from 'axios';

const API_URL = 'http://172.20.10.4:5000/api/runs';

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