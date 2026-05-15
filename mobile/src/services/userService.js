import axios from 'axios';

const API_URL = 'http://172.20.10.4:5000/api/auth/profile';

export const updateProfileAPI = async (profileData, token) => {

    const res = await axios.put(API_URL, profileData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;

}