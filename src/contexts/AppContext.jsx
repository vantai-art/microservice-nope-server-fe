// src/contexts/AppContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const BASE_URL = 'http://localhost:8080'

// ─── Axios instance chung ───────────────────────────────────────
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 10000,
})

// ─── Local-storage helpers ──────────────────────────────────────
const getStoredUser = () => {
    try {
        const raw = localStorage.getItem('user')
        return raw ? JSON.parse(raw) : null
    } catch { return null }
}

// ─── Context ────────────────────────────────────────────────────
const AppCtx = createContext(null)

export function AppProvider({ children }) {
    // ── Auth ──────────────────────────────────────────────────────
    const [user, setUserState] = useState(() => getStoredUser())

    const login = useCallback((userData) => {
        setUserState(userData)
        localStorage.setItem('user', JSON.stringify(userData))
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem('user')
        localStorage.removeItem('cartId')
        setUserState(null)
        setCart([])
        setCartCount(0)
    }, [])

    const isAdmin = user?.role === 'ROLE_ADMIN'
    const isStaff = user?.role === 'ROLE_STAFF'
    const isUser = user?.role === 'ROLE_USER'

    // ── Products ──────────────────────────────────────────────────
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchProducts = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await axiosInstance.get('/products')
            const list = Array.isArray(res.data) ? res.data : []
            const normalised = list.map(p => ({
                ...p,
                name: p.productName ?? p.name ?? '',
                description: p.discription ?? p.description ?? '',
                category: typeof p.category === 'string'
                    ? { name: p.category }
                    : (p.category ?? { name: 'Khác' }),
                imageUrl: p.imageUrl ?? p.image ?? '',
                price: Number(p.price ?? 0),
                stockQuantity: p.availability ?? p.stockQuantity ?? 0,
            }))
            setProducts(normalised)
        } catch (err) {
            console.error('Lỗi tải sản phẩm:', err)
            setError('Không thể tải danh sách sản phẩm')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchProducts() }, [fetchProducts])

    // ── Tables ────────────────────────────────────────────────────
    const [tables, setTables] = useState([])

    // ── Cart ──────────────────────────────────────────────────────
    const [cart, setCart] = useState([])
    const [cartCount, setCartCount] = useState(0)

    const addToCart = useCallback((product, qty = 1) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id)
            if (existing) {
                return prev.map(i =>
                    i.id === product.id ? { ...i, quantity: i.quantity + qty } : i
                )
            }
            return [...prev, { ...product, quantity: qty }]
        })
    }, [])

    const removeFromCart = useCallback((productId) => {
        setCart(prev => prev.filter(i => i.id !== productId))
    }, [])

    const updateQuantity = useCallback((productId, qty) => {
        if (qty <= 0) {
            setCart(prev => prev.filter(i => i.id !== productId))
        } else {
            setCart(prev => prev.map(i =>
                i.id === productId ? { ...i, quantity: qty } : i
            ))
        }
    }, [])

    const clearCart = useCallback(() => setCart([]), [])

    const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

    useEffect(() => {
        setCartCount(cart.reduce((sum, i) => sum + i.quantity, 0))
    }, [cart])

    // ── Toast ──────────────────────────────────────────────────────
    const [toast, setToast] = useState(null)
    const showToast = useCallback((msg, type = 'success') => {
        setToast({ msg, type, id: Date.now() })
        setTimeout(() => setToast(null), 3000)
    }, [])

    // ── Create order ───────────────────────────────────────────────
    // FIX: Browser chặn set header "Cookie" thủ công (Refused to set unsafe header)
    // Giải pháp: gọi POST /order/{userId}/direct với cart items trong body
    const createOrder = useCallback(async () => {
        if (!user) throw new Error('Chưa đăng nhập')
        if (cart.length === 0) throw new Error('Giỏ hàng trống')

        // Build payload: mỗi item gửi đủ productId, productName, price, quantity
        const cartItems = cart.map(item => ({
            productId: item.id,
            productName: item.name ?? item.productName ?? '',
            price: item.price,
            quantity: item.quantity,
        }))

        // Gọi endpoint mới /direct — không cần Cookie header
        const res = await axiosInstance.post(
            `/order/${user.id}/direct`,
            cartItems
        )

        clearCart()
        showToast('Đặt hàng thành công!', 'success')
        return res.data
    }, [user, cart, clearCart, showToast])

    // ─────────────────────────────────────────────────────────────
    const value = {
        // auth
        user, login, logout, isAdmin, isStaff, isUser,
        // products
        products, loading, error, fetchProducts,
        // tables
        tables, setTables,
        // cart
        cart, cartCount, setCartCount, cartTotal,
        addToCart, removeFromCart, updateQuantity, clearCart,
        createOrder,
        // ui
        showToast,
        // axios
        axiosInstance,
    }

    return (
        <AppCtx.Provider value={value}>
            {children}
            {toast && <Toast toast={toast} />}
        </AppCtx.Provider>
    )
}

// ── Hooks ─────────────────────────────────────────────────────────
export const useApp = () => useContext(AppCtx)
export const useAppContext = () => useContext(AppCtx)

// ── Toast component ───────────────────────────────────────────────
function Toast({ toast }) {
    const colors = {
        success: '#3d8b5e',
        error: '#c0392b',
        info: '#2980b9',
        warning: '#d4a853',
    }
    return (
        <div style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
            background: '#1a1a1a', border: `1px solid ${colors[toast.type] || colors.success}`,
            borderLeft: `4px solid ${colors[toast.type] || colors.success}`,
            borderRadius: 8, padding: '12px 20px', color: '#f0ede6',
            fontFamily: 'DM Sans, sans-serif', fontSize: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            animation: 'slideIn 0.2s ease',
        }}>
            {toast.msg}
            <style>{`@keyframes slideIn { from { transform: translateX(40px); opacity:0 } to { transform: translateX(0); opacity:1 } }`}</style>
        </div>
    )
}