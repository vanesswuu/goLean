import axios from 'axios';
import API_BASE from '../config';

const API_URL = `${API_BASE}/api/photos`;

export const uploadPhotoAPI = async (payload, token) => {
    //this unpacks the payload
    const { imageUri, weight } = payload;

    const formData = new FormData();

    //this extracts the file name and extension from the URI
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match}` : `image`;

    //this appends or puts the image file to the form
    formData.append('image', { uri: imageUri, name: filename, type });

    //this appends the weight
    if (weight) {
        formData.append('weight', weight)
    }

    //send it to the server
    const res = await axios.post(API_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
        }
    });

    return res.data;
};

export const getPhotosAPI = async (token) => {
    const res = await axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data;
};