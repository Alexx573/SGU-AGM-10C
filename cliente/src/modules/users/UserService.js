import axios from 'axios';

const API_URL = '/api/users'; 


export const getAllUsers = () => {
    return axios.get(API_URL);
};


export const createUser = (user) => {
    return axios.post(API_URL, user);
};


export const updateUser = (id, user) => {
    return axios.put(`${API_URL}/${id}`, user);
};


export const deleteUser = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};