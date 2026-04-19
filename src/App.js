// src/App.js
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './contexts/AppContext'

// ── Components ──────────────────────────────────────────────────
import Header from './components/Header'

// ── Pages ───────────────────────────────────────────────────────
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import ShopPage from './pages/ShopPage'
import UserAuthPage from './pages/UserAuthPage'
import CheckoutPage from './pages/CheckoutPage'
import UserOrdersPage from './pages/UserOrdersPage'

// ── Admin ────────────────────────────────────────────────────────
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayoutWrapper from './pages/admin/AdminLayoutWrapper'

// ── Staff ────────────────────────────────────────────────────────
import StaffLoginPage from './pages/staff/StaffLoginPage'
import StaffPage from './pages/staff/StaffPage'

// ─── Protected Route cho user thường ────────────────────────────
function ProtectedUserRoute({ children }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/auth" replace />
  return children
}

// ─── Protected Route cho admin ──────────────────────────────────
function ProtectedAdminRoute({ children }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/admin/login" replace />
  if (user.role !== 'ROLE_ADMIN') return <Navigate to="/admin/login" replace />
  return children
}

// ─── Protected Route cho staff ──────────────────────────────────
function ProtectedStaffRoute({ children }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/staff/login" replace />
  if (user.role !== 'ROLE_STAFF' && user.role !== 'ROLE_ADMIN') return <Navigate to="/staff/login" replace />
  return children
}

// ─── Guard cho /auth: nếu đã đăng nhập thì redirect đúng nơi ────
function UserAuthGuard({ children }) {
  const { user } = useApp()
  if (!user) return children
  if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin" replace />
  if (user.role === 'ROLE_STAFF') return <Navigate to="/staff" replace />
  return <Navigate to="/" replace />
}

// ─── Guard cho /admin/login: chỉ redirect nếu đã là ADMIN ───────
// (ROLE_USER vẫn được vào trang login admin để đăng nhập bằng acc khác)
function AdminLoginGuard({ children }) {
  const { user } = useApp()
  if (user && user.role === 'ROLE_ADMIN') return <Navigate to="/admin" replace />
  return children
}

// ─── Guard cho /staff/login: chỉ redirect nếu đã là STAFF/ADMIN ─
function StaffLoginGuard({ children }) {
  const { user } = useApp()
  if (user && (user.role === 'ROLE_STAFF' || user.role === 'ROLE_ADMIN')) {
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

        {/* Auth user — nếu đã login thì redirect về đúng trang */}
        <Route path="/auth" element={<UserAuthGuard><UserAuthPage /></UserAuthGuard>} />

        {/* User protected */}
        <Route path="/checkout" element={
          <ProtectedUserRoute><CheckoutPage /></ProtectedUserRoute>
        } />
        <Route path="/my-orders" element={
          <ProtectedUserRoute><UserOrdersPage /></ProtectedUserRoute>
        } />

        {/* Admin login — chỉ redirect nếu đã là ADMIN (ROLE_USER vẫn vào được) */}
        <Route path="/admin/login" element={
          <AdminLoginGuard><AdminLogin /></AdminLoginGuard>
        } />

        {/* Admin panel */}
        <Route path="/admin" element={
          <ProtectedAdminRoute><AdminLayoutWrapper page="dashboard" /></ProtectedAdminRoute>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedAdminRoute><AdminLayoutWrapper page="dashboard" /></ProtectedAdminRoute>
        } />
        <Route path="/admin/products" element={
          <ProtectedAdminRoute><AdminLayoutWrapper page="products" /></ProtectedAdminRoute>
        } />
        <Route path="/admin/categories" element={
          <ProtectedAdminRoute><AdminLayoutWrapper page="categories" /></ProtectedAdminRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedAdminRoute><AdminLayoutWrapper page="orders" /></ProtectedAdminRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedAdminRoute><AdminLayoutWrapper page="users" /></ProtectedAdminRoute>
        } />
        <Route path="/admin/staff" element={
          <ProtectedAdminRoute><AdminLayoutWrapper page="staff" /></ProtectedAdminRoute>
        } />
        <Route path="/admin/promotions" element={
          <ProtectedAdminRoute><AdminLayoutWrapper page="promotions" /></ProtectedAdminRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedAdminRoute><AdminLayoutWrapper page="settings" /></ProtectedAdminRoute>
        } />

        {/* Staff login — chỉ redirect nếu đã là STAFF/ADMIN */}
        <Route path="/staff/login" element={
          <StaffLoginGuard><StaffLoginPage /></StaffLoginGuard>
        } />
        <Route path="/staff" element={
          <ProtectedStaffRoute><StaffPage /></ProtectedStaffRoute>
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