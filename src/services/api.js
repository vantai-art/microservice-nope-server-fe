// src/services/api.js  ← ĐÃ SỬA
// Lỗi cũ trong authAPI.js: gọi /api/auth/login — endpoint không tồn tại trong BE
// BE thực tế:
//   POST /login          → { userName, userPassword }
//   POST /registration   → User entity với userDetails nested
//   GET  /products       → List<Product> (productName, discription, category string)
//   POST /admin/products → Product entity
//   GET  /users          → List<User>
//   GET  /order          → List<Order>
//   GET  /api/payments   → List<Payment>

import axios from 'axios'

const BASE = 'http://localhost:8080'

export const http = axios.create({
    baseURL: BASE,
    withCredentials: true,
    timeout: 10000,
})

// ─── Auth local helpers ──────────────────────────────────────────
// FIX: Per-role localStorage helpers — dùng AppContext.login/logout thay vì gọi trực tiếp
export const getUser     = (role) => {
    const key = role === 'ROLE_ADMIN' ? 'admin_user' : role === 'ROLE_STAFF' ? 'staff_user' : 'customer_user'
    try { return JSON.parse(localStorage.getItem(key)) } catch { return null }
}
export const setUser     = (u) => {
    const role = u?.role || 'ROLE_USER'
    const key  = role === 'ROLE_ADMIN' ? 'admin_user' : role === 'ROLE_STAFF' ? 'staff_user' : 'customer_user'
    localStorage.setItem(key, JSON.stringify(u))
}
export const removeUser  = (role) => {
    if (role === 'ROLE_ADMIN')  localStorage.removeItem('admin_user')
    else if (role === 'ROLE_STAFF') localStorage.removeItem('staff_user')
    else { localStorage.removeItem('customer_user'); localStorage.removeItem('cartId') }
}
export const getCartId = () => localStorage.getItem('cartId') || ''
export const setCartId = (id) => localStorage.setItem('cartId', String(id))

// ─── USER SERVICE — routed via gateway → port 8811 ───────────────
// POST /login → { userName, userPassword }
// Trả về: { id, userName, role, userDetails, active }
export const login = (userName, userPassword) =>
    http.post('/login', { userName, userPassword })

// POST /registration → User entity (userName, userPassword, userDetails: {...})
export const register = (body) => http.post('/registration', body)

// GET /users
export const getUsers = () => http.get('/users')

// GET /users?name=xxx
export const getUserByName = (name) => http.get('/users', { params: { name } })

// GET /users/{id}
export const getUserById = (id) => http.get(`/users/${id}`)

// PUT /users/{id}
export const updateUser = (id, body) => http.put(`/users/${id}`, body)

// DELETE /users/{id}
export const deleteUser = (id) => http.delete(`/users/${id}`)

// POST /users/admin
export const createAdmin = (body) => http.post('/users/admin', body)

// POST /users/staff
export const createStaff = (body) => http.post('/users/staff', body)

// GET /users/admins
export const getAdmins = () => http.get('/users/admins')

// GET /users/staffs
export const getStaffs = () => http.get('/users/staffs')

// POST /roles
export const createRole = (body) => http.post('/roles', body)

// GET /roles
export const getRoles = () => http.get('/roles')

// ─── PRODUCT SERVICE — port 8810 ─────────────────────────────────
// GET /products  → List<Product> { id, productName, price, discription, category, availability }
export const getProducts = () => http.get('/products')

// GET /products?category=xxx
export const getProductsByCategory = (category) =>
    http.get('/products', { params: { category } })

// GET /products?name=xxx
export const getProductsByName = (name) =>
    http.get('/products', { params: { name } })

// GET /products/{id}
export const getProductById = (id) => http.get(`/products/${id}`)

// POST /admin/products → { productName, price, discription, category, availability }
export const createProduct = (body) => http.post('/admin/products', body)

// PUT /admin/products/{id}
export const updateProduct = (id, body) => http.put(`/admin/products/${id}`, body)

// DELETE /admin/products/{id}
export const deleteProduct = (id) => http.delete(`/admin/products/${id}`)

// ─── CART SERVICE — port 8813, Redis ─────────────────────────────
// GET /cart  Header: Cookie: <cartId>
export const getCart = (cartId) =>
    http.get('/cart', { headers: { Cookie: cartId } })

// POST /cart?productId=&quantity=  Header: Cookie: <cartId>
export const addToCart = (cartId, productId, quantity) =>
    http.post('/cart', null, {
        params: { productId, quantity },
        headers: { Cookie: cartId },
    })

// DELETE /cart?productId=  Header: Cookie: <cartId>
export const removeFromCart = (cartId, productId) =>
    http.delete('/cart', {
        params: { productId },
        headers: { Cookie: cartId },
    })

// ─── ORDER SERVICE — port 8813 ────────────────────────────────────
// GET /order
export const getOrders = () => http.get('/order')

// GET /order/{id}
export const getOrderById = (id) => http.get(`/order/${id}`)

// GET /order/user/{userId}
export const getOrdersByUser = (userId) => http.get(`/order/user/${userId}`)

// POST /order/{userId}  Header: Cookie: <cartId>
export const placeOrder = (userId, cartId) =>
    http.post(`/order/${userId}`, null, { headers: { Cookie: cartId } })

// PUT /order/{id}/status  body: { status }
export const updateOrderStatus = (id, status) =>
    http.put(`/order/${id}/status`, { status })

// DELETE /order/{id}
export const deleteOrder = (id) => http.delete(`/order/${id}`)

// ─── PAYMENT SERVICE — port 8819 ─────────────────────────────────
// GET /api/payments
export const getPayments = () => http.get('/api/payments')

// GET /api/payments/{id}
export const getPaymentById = (id) => http.get(`/api/payments/${id}`)

// GET /api/payments/order/{orderId}
export const getPaymentsByOrder = (orderId) =>
    http.get(`/api/payments/order/${orderId}`)

// GET /api/payments/user/{userId}
export const getPaymentsByUser = (userId) =>
    http.get(`/api/payments/user/${userId}`)

// POST /api/payments  body: { orderId, userId, amount, method }
export const createPayment = (body) => http.post('/api/payments', body)

// POST /api/payments/{id}/process
export const processPayment = (id) => http.post(`/api/payments/${id}/process`)

// POST /api/payments/refund  body: { orderId, reason }
export const refundPayment = (body) => http.post('/api/payments/refund', body)

// PUT /api/payments/{id}/status  body: { status }
export const updatePaymentStatus = (id, body) =>
    http.put(`/api/payments/${id}/status`, body)

export default http