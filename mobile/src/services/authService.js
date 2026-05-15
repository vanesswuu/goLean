import axios from 'axios';


const API_URL = 'http://172.20.10.4:5000/api/auth';

//service to handle all auth api calls

//for signup
export const signup = async (userData) => {

    try {

        const res = await axios.post(`${API_URL}/signup`, userData);
        return res.data;

    } catch (error) {

        throw error.response?.data?.message || 'server connection failed';

    }

}

//for login
export const login = async (credentials) => {
    try {

        const res = await axios.post(`${API_URL}/login`, credentials);
        return res.data;


    } catch (error) {

        throw error.response?.data?.message || 'login failed'

    }
}