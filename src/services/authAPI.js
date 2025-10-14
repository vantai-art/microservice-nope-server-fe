// src/services/authAPI.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const authAPI = {
    // Đăng ký
    signup: async (userData) => {
        const response = await axios.post(`${API_URL}/users/signup`, userData);
        return response.data;
    },

    // Đăng nhập
    login: async (credentials) => {
        const response = await axios.post(`${API_URL}/users/login`, credentials);
        if (response.data.token) {
            localStorage.setItem('jwt_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
            localStorage.setItem('isAdminAuth', 'true');
        }
        return response.data;
    },

    // Đăng xuất
    logout: () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAdminAuth');
    },

    // Lấy token
    getToken: () => localStorage.getItem('jwt_token'),

    // Lấy user hiện tại
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Check đã login chưa
    isAuthenticated: () => {
        return !!localStorage.getItem('jwt_token');
    }
};