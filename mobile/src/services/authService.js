import axios from 'axios';
import API_BASE from '../config';

const API_URL = `${API_BASE}/api/auth`;
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

export const googleLogin = async (idToken, onboardingData = null) => {
    try {
        const res = await axios.post(`${API_URL}/google`, { idToken, onboardingData })
        return res.data;
    } catch (error) {
        throw error.response?.data?.message || 'Google sign-in failed'
    }
};