// src/App.js — FIX routing & auth guards
// Nguyên nhân lỗi cũ:
//   1. Dùng chung 1 localStorage key → admin login → user bị văng
//   2. UserAuthGuard redirect admin → /admin (không cần thiết, gây nhầm lẫn)
//   3. UserAuthPage redirect ROLE_ADMIN sang /admin (không nên ở trang user)
//   4. StaffLoginPage.jsx chứa nhầm code StaffPage → /staff/login lỗi

import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './contexts/AppContext'

import Header from './components/Header'

import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import ShopPage from './pages/ShopPage'
import UserAuthPage from './pages/UserAuthPage'
import CheckoutPage from './pages/CheckoutPage'
import UserOrdersPage from './pages/UserOrdersPage'

import AdminLogin from './pages/admin/AdminLogin'
import AdminLayoutWrapper from './pages/admin/AdminLayoutWrapper'

import StaffLoginPage from './pages/staff/StaffLoginPage'
import StaffPage from './pages/staff/StaffPage'
import UserSettings from './pages/UserSettings'

// ─── Protected Route cho user thường ────────────────────────────
// Dùng customerUser (không bị ảnh hưởng bởi admin/staff login)
function ProtectedUserRoute({ children }) {
    const { customerUser } = useApp()
    if (!customerUser) return <Navigate to="/auth" replace />
    return children
}

// ─── Protected Route cho admin ──────────────────────────────────
// Chỉ check adminUser — không bị ảnh hưởng bởi user/staff
function ProtectedAdminRoute({ children }) {
    const { adminUser } = useApp()
    if (!adminUser) return <Navigate to="/admin/login" replace />
    if (adminUser.role !== 'ROLE_ADMIN') return <Navigate to="/admin/login" replace />
    return children
}

// ─── Protected Route cho staff ──────────────────────────────────
// Chỉ check staffUser
function ProtectedStaffRoute({ children }) {
    const { staffUser } = useApp()
    if (!staffUser) return <Navigate to="/staff/login" replace />
    if (staffUser.role !== 'ROLE_STAFF' && staffUser.role !== 'ROLE_ADMIN') {
        return <Navigate to="/staff/login" replace />
    }
    return children
}

// ─── Guard cho /auth: chỉ redirect nếu customerUser đã login ────
// KHÔNG redirect admin/staff → tránh conflict
function UserAuthGuard({ children }) {
    const { customerUser } = useApp()
    if (customerUser) return <Navigate to="/" replace />
    return children
}

// ─── Guard cho /admin/login: redirect nếu adminUser đã login ────
function AdminLoginGuard({ children }) {
    const { adminUser } = useApp()
    if (adminUser?.role === 'ROLE_ADMIN') return <Navigate to="/admin" replace />
    return children
}

// ─── Guard cho /staff/login: redirect nếu staffUser đã login ────
function StaffLoginGuard({ children }) {
    const { staffUser } = useApp()
    if (staffUser?.role === 'ROLE_STAFF' || staffUser?.role === 'ROLE_ADMIN') {
        return <Navigate to="/staff" replace />
    }
    return children
}

// ─── Routes ─────────────────────────────────────────────────────
function AppRoutes() {
    return (
        <>
            {/* Header chỉ hiển thị trên trang user, ẩn ở admin/staff */}
            <Routes>
                <Route path="/admin/*" element={null} />
                <Route path="/staff/*" element={null} />
                <Route path="*" element={<Header />} />
            </Routes>

            <Routes>
                {/* Public */}
                <Route path="/" element={<HomePage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/shop" element={<ShopPage />} />

                {/* User auth — chỉ redirect nếu customerUser đã login */}
                <Route path="/auth" element={
                    <UserAuthGuard><UserAuthPage /></UserAuthGuard>
                } />

                {/* User protected */}
                <Route path="/checkout" element={
                    <ProtectedUserRoute><CheckoutPage /></ProtectedUserRoute>
                } />
                <Route path="/my-orders" element={
                    <ProtectedUserRoute><UserOrdersPage /></ProtectedUserRoute>
                } />

                {/* Admin login */}
                <Route path="/admin/login" element={
                    <AdminLoginGuard><AdminLogin /></AdminLoginGuard>
                } />

                {/* Admin panel */}
                <Route path="/admin" element={<ProtectedAdminRoute><AdminLayoutWrapper page="dashboard" /></ProtectedAdminRoute>} />
                <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminLayoutWrapper page="dashboard" /></ProtectedAdminRoute>} />
                <Route path="/admin/products" element={<ProtectedAdminRoute><AdminLayoutWrapper page="products" /></ProtectedAdminRoute>} />
                <Route path="/admin/categories" element={<ProtectedAdminRoute><AdminLayoutWrapper page="categories" /></ProtectedAdminRoute>} />
                <Route path="/admin/orders" element={<ProtectedAdminRoute><AdminLayoutWrapper page="orders" /></ProtectedAdminRoute>} />
                <Route path="/admin/users" element={<ProtectedAdminRoute><AdminLayoutWrapper page="users" /></ProtectedAdminRoute>} />
                <Route path="/admin/staff" element={<ProtectedAdminRoute><AdminLayoutWrapper page="staff" /></ProtectedAdminRoute>} />
                <Route path="/admin/promotions" element={<ProtectedAdminRoute><AdminLayoutWrapper page="promotions" /></ProtectedAdminRoute>} />
                <Route path="/admin/settings" element={<ProtectedAdminRoute><AdminLayoutWrapper page="settings" /></ProtectedAdminRoute>} />

                {/* Staff login */}
                <Route path="/staff/login" element={
                    <StaffLoginGuard><StaffLoginPage /></StaffLoginGuard>
                } />
                <Route path="/staff" element={
                    <ProtectedStaffRoute><StaffPage /></ProtectedStaffRoute>
                } />

                <Route path="/settings" element={<ProtectedUserRoute><UserSettings /></ProtectedUserRoute>
                } />


                {/* 404 */}
                <Route path="*" element={
                    <div style={{
                        minHeight: '80vh', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', flexDirection: 'column', gap: 16,
                        background: '#0a0a0a',
                    }}>
                        <div style={{ fontSize: 72, color: '#5a5550' }}>404</div>
                        <p style={{ color: '#8a8580' }}>Trang không tồn tại</p>
                        <a href="/" style={{
                            background: '#d4a853', color: '#0a0a0a',
                            padding: '10px 24px', borderRadius: 8,
                            textDecoration: 'none', fontWeight: 700,
                        }}>Về trang chủ</a>
                    </div>
                } />
            </Routes>
        </>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <AppProvider>
                <AppRoutes />
            </AppProvider>
        </BrowserRouter>
    )
}
