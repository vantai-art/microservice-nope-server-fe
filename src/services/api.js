// src/services/api.js
import axios from 'axios';
import { authAPI } from './authAPI';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: Tự động thêm JWT vào header
api.interceptors.request.use(
    (config) => {
        const token = authAPI.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor: Xử lý lỗi 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            authAPI.logout();
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

// ==================== PRODUCTS ====================
export const productAPI = {
    getAll: () => api.get('/products'),
    getById: (id) => api.get(`/products/${id}`),
    create: (product) => api.post('/products', product),
    update: (id, product) => api.put(`/products/${id}`, product),
    delete: (id) => api.delete(`/products/${id}`),
    getByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
};

// ==================== CATEGORIES ====================
export const categoryAPI = {
    getAll: () => api.get('/categories'),
    getById: (id) => api.get(`/categories/${id}`),
    create: (category) => api.post('/categories', category),
    update: (id, category) => api.put(`/categories/${id}`, category),
    delete: (id) => api.delete(`/categories/${id}`),
};

// ==================== ORDERS ====================
export const orderAPI = {
    getAll: () => api.get('/orders'),
    getById: (id) => api.get(`/orders/${id}`),
    create: (order) => api.post('/orders', order),
    updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
    delete: (id) => api.delete(`/orders/${id}`),
};

// ==================== ORDER ITEMS ====================
export const orderItemAPI = {
    getByOrderId: (orderId) => api.get(`/orders/${orderId}/items`),
    create: (orderItem) => api.post('/order-items', orderItem),
    update: (id, orderItem) => api.put(`/order-items/${id}`, orderItem),
    delete: (id) => api.delete(`/order-items/${id}`),
};

// ==================== TABLES ====================
export const tableAPI = {
    getAll: () => api.get('/tables'),
    getById: (id) => api.get(`/tables/${id}`),
    create: (table) => api.post('/tables', table),
    update: (id, table) => api.put(`/tables/${id}`, table),
    updateStatus: (id, status) => api.put(`/tables/${id}/status`, { status }),
    delete: (id) => api.delete(`/tables/${id}`),
};

// ==================== PROMOTIONS ====================
export const promotionAPI = {
    getAll: () => api.get('/promotions'),
    getActive: () => api.get('/promotions/active'),
    getById: (id) => api.get(`/promotions/${id}`),
    create: (promotion) => api.post('/promotions', promotion),
    update: (id, promotion) => api.put(`/promotions/${id}`, promotion),
    delete: (id) => api.delete(`/promotions/${id}`),
};

// ==================== BILLS ====================
export const billAPI = {
    getAll: () => api.get('/bills'),
    getById: (id) => api.get(`/bills/${id}`),
    create: (bill) => api.post('/bills', bill),
    updateStatus: (id, status) => api.put(`/bills/${id}/status`, { status }),
};

// ==================== USERS ====================
export const userAPI = {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    create: (user) => api.post('/users/create', user),
    update: (id, user) => api.put(`/users/${id}`, user),
    delete: (id) => api.delete(`/users/${id}`),
};

export default api;