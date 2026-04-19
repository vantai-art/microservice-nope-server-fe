// src/contexts/AppContext.jsx
// FIX: Tách localStorage key theo role để admin/staff/user không conflict nhau
//   - admin  → localStorage['admin_user']
//   - staff  → localStorage['staff_user']
//   - user   → localStorage['customer_user']

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const BASE_URL = 'http://localhost:8080'

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 10000,
})

// ─── Per-role storage keys ───────────────────────────────────────
const KEY_ADMIN    = 'admin_user'
const KEY_STAFF    = 'staff_user'
const KEY_CUSTOMER = 'customer_user'

const getStoredUser = (key) => {
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : null }
    catch { return null }
}

const AppCtx = createContext(null)

export function AppProvider({ children }) {
    const [adminUser,    setAdminUser]    = useState(() => getStoredUser(KEY_ADMIN))
    const [staffUser,    setStaffUser]    = useState(() => getStoredUser(KEY_STAFF))
    const [customerUser, setCustomerUser] = useState(() => getStoredUser(KEY_CUSTOMER))

    // backward compat: user = customerUser
    const user = customerUser

    // ── login: lưu đúng key theo role ─────────────────────────────
    const login = useCallback((userData) => {
        const role = userData?.role || 'ROLE_USER'
        if (role === 'ROLE_ADMIN') {
            localStorage.setItem(KEY_ADMIN, JSON.stringify(userData))
            setAdminUser(userData)
        } else if (role === 'ROLE_STAFF') {
            localStorage.setItem(KEY_STAFF, JSON.stringify(userData))
            setStaffUser(userData)
        } else {
            localStorage.setItem(KEY_CUSTOMER, JSON.stringify(userData))
            setCustomerUser(userData)
        }
    }, [])

    // ── logout: xoá đúng key theo role ────────────────────────────
    const logout = useCallback((role) => {
        if (role === 'ROLE_ADMIN') {
            localStorage.removeItem(KEY_ADMIN)
            setAdminUser(null)
        } else if (role === 'ROLE_STAFF') {
            localStorage.removeItem(KEY_STAFF)
            setStaffUser(null)
        } else {
            localStorage.removeItem(KEY_CUSTOMER)
            localStorage.removeItem('cartId')
            setCustomerUser(null)
            setCart([])
            setCartCount(0)
        }
    }, [])

    const logoutAll = useCallback(() => {
        localStorage.removeItem(KEY_ADMIN)
        localStorage.removeItem(KEY_STAFF)
        localStorage.removeItem(KEY_CUSTOMER)
        localStorage.removeItem('cartId')
        setAdminUser(null); setStaffUser(null); setCustomerUser(null)
        setCart([]); setCartCount(0)
    }, [])

    const isAdmin = adminUser?.role === 'ROLE_ADMIN'
    const isStaff = staffUser?.role === 'ROLE_STAFF'
    const isUser  = customerUser?.role === 'ROLE_USER'

    // ── Products ──────────────────────────────────────────────────
    const [products, setProducts] = useState([])
    const [loading, setLoading]   = useState(false)
    const [error, setError]       = useState(null)

    const fetchProducts = useCallback(async () => {
        setLoading(true); setError(null)
        try {
            const res = await axiosInstance.get('/products')
            const list = Array.isArray(res.data) ? res.data : []
            setProducts(list.map(p => ({
                ...p,
                name: p.productName ?? p.name ?? '',
                description: p.discription ?? p.description ?? '',
                category: typeof p.category === 'string' ? { name: p.category } : (p.category ?? { name: 'Khác' }),
                imageUrl: p.imageUrl ?? p.image ?? '',
                price: Number(p.price ?? 0),
                stockQuantity: p.availability ?? p.stockQuantity ?? 0,
            })))
        } catch (err) {
            console.error('Lỗi tải sản phẩm:', err)
            setError('Không thể tải danh sách sản phẩm')
        } finally { setLoading(false) }
    }, [])

    useEffect(() => { fetchProducts() }, [fetchProducts])

    // ── Tables ────────────────────────────────────────────────────
    const [tables, setTables] = useState([])

    // ── Cart ──────────────────────────────────────────────────────
    const [cart, setCart]           = useState([])
    const [cartCount, setCartCount] = useState(0)

    const addToCart = useCallback((product, qty = 1) => {
        setCart(prev => {
            const ex = prev.find(i => i.id === product.id)
            if (ex) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + qty } : i)
            return [...prev, { ...product, quantity: qty }]
        })
    }, [])

    const removeFromCart  = useCallback((id)       => setCart(prev => prev.filter(i => i.id !== id)), [])
    const updateQuantity  = useCallback((id, qty)  => {
        if (qty <= 0) setCart(prev => prev.filter(i => i.id !== id))
        else setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
    }, [])
    const clearCart = useCallback(() => setCart([]), [])
    const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)

    useEffect(() => { setCartCount(cart.reduce((s, i) => s + i.quantity, 0)) }, [cart])

    // ── Toast ──────────────────────────────────────────────────────
    const [toast, setToast] = useState(null)
    const showToast = useCallback((msg, type = 'success') => {
        setToast({ msg, type, id: Date.now() })
        setTimeout(() => setToast(null), 3000)
    }, [])

    // ── Create order ───────────────────────────────────────────────
    const createOrder = useCallback(async () => {
        if (!customerUser) throw new Error('Chưa đăng nhập')
        if (cart.length === 0) throw new Error('Giỏ hàng trống')
        const cartItems = cart.map(item => ({
            productId: item.id, productName: item.name ?? '', price: item.price, quantity: item.quantity,
        }))
        const res = await axiosInstance.post(`/order/${customerUser.id}/direct`, cartItems)
        clearCart(); showToast('Đặt hàng thành công!', 'success')
        return res.data
    }, [customerUser, cart, clearCart, showToast])

    const value = {
        user, adminUser, staffUser, customerUser,
        login, logout, logoutAll,
        isAdmin, isStaff, isUser,
        products, loading, error, fetchProducts,
        tables, setTables,
        cart, cartCount, setCartCount, cartTotal,
        addToCart, removeFromCart, updateQuantity, clearCart, createOrder,
        showToast,
        axiosInstance,
    }

    return (
        <AppCtx.Provider value={value}>
            {children}
            {toast && <Toast toast={toast} />}
        </AppCtx.Provider>
    )
}

export const useApp        = () => useContext(AppCtx)
export const useAppContext  = () => useContext(AppCtx)

function Toast({ toast }) {
    const colors = { success: '#3d8b5e', error: '#c0392b', info: '#2980b9', warning: '#d4a853' }
    return (
        <div style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
            background: '#1a1a1a', border: `1px solid ${colors[toast.type] || colors.success}`,
            borderLeft: `4px solid ${colors[toast.type] || colors.success}`,
            borderRadius: 8, padding: '12px 20px', color: '#f0ede6',
            fontFamily: 'DM Sans, sans-serif', fontSize: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)', animation: 'slideIn 0.2s ease',
        }}>
            {toast.msg}
            <style>{`@keyframes slideIn{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
        </div>
    )
}
