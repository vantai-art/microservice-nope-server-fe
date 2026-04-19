// src/pages/admin/AdminLayout.jsx
// ✅ Đã sửa:
//   - renderContent() đủ tất cả các trang: dashboard, products, categories, orders, users, staff, ...
//   - Import đúng các component thực tế

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    LogOut, Menu, X, LayoutDashboard, Package,
    ShoppingBag, FolderOpen, Users, Shield,
    Settings, Coffee, Tag, ChevronRight
} from 'lucide-react'
import { useAppContext } from '../../contexts/AppContext'

// ── Import tất cả admin pages ──────────────────────────────────
import AdminDashboard from './AdminDashboard'
import AdminProducts from './AdminProducts'
import AdminCategories from './AdminCategories'
import AdminOrders from './AdminOrders'
import AdminUsers from './AdminUsers'
import AdminStaff from './AdminStaff'
import AdminPromotions from './AdminPromotions'
import AdminSettings from './AdminSettings'

const MENU = [
    { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard, color: '#f59e0b' },
    { id: 'products', label: 'Sản Phẩm', icon: Package, color: '#3b82f6' },
    { id: 'categories', label: 'Danh Mục', icon: FolderOpen, color: '#f59e0b' },
    { id: 'orders', label: 'Đơn Hàng', icon: ShoppingBag, color: '#22c55e' },
    { id: 'users', label: 'Khách Hàng', icon: Users, color: '#8b5cf6' },
    { id: 'staff', label: 'Nhân Viên', icon: Shield, color: '#06b6d4' },
    { id: 'promotions', label: 'Khuyến Mãi', icon: Tag, color: '#ec4899' },
    { id: 'settings', label: 'Cài Đặt', icon: Settings, color: '#6b7280' },
]

function AdminLayout({ currentPage, setCurrentPage, onLogout }) {
    const navigate = useNavigate()
    const { adminUser, logout } = useAppContext?.() || {}
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const handleLogout = () => {
        if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
            // FIX: dùng logout('ROLE_ADMIN') thay vì xoá thủ công
            
            logout('ROLE_ADMIN')
            onLogout?.()
            navigate('/admin/login')
        }
    }

    const renderContent = () => {
        switch (currentPage) {
            case 'dashboard': return <AdminDashboard />
            case 'products': return <AdminProducts />
            case 'categories': return <AdminCategories />
            case 'orders': return <AdminOrders />
            case 'users': return <AdminUsers />
            case 'staff': return <AdminStaff />
            case 'promotions': return <AdminPromotions />
            case 'settings': return <AdminSettings />
            default: return <AdminDashboard />
        }
    }

    const currentMenu = MENU.find(m => m.id === currentPage) || MENU[0]

    return (
        <div style={{ minHeight: '100vh', background: '#111827', display: 'flex', fontFamily: '"DM Sans", system-ui, sans-serif' }}>

            {/* ── Sidebar ── */}
            <aside style={{
                width: sidebarOpen ? 240 : 68,
                background: '#1f2937',
                borderRight: '1px solid #374151',
                position: 'fixed', top: 0, left: 0, bottom: 0,
                zIndex: 40, display: 'flex', flexDirection: 'column',
                transition: 'width 0.25s ease',
                overflow: 'hidden',
            }}>
                {/* Logo */}
                <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: '1px solid #374151', flexShrink: 0 }}>
                    {sidebarOpen && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
                            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Coffee size={18} color="#f59e0b" />
                            </div>
                            <div>
                                <div style={{ color: '#f9fafb', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>COFFEE BLEND</div>
                                <div style={{ color: '#6b7280', fontSize: 10 }}>Admin Panel</div>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(v => !v)}
                        style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', flexShrink: 0 }}
                    >
                        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
                    {MENU.map(item => {
                        const Icon = item.icon
                        const active = currentPage === item.id
                        return (
                            <button
                                key={item.id}
                                onClick={() => setCurrentPage(item.id)}
                                title={!sidebarOpen ? item.label : ''}
                                style={{
                                    width: '100%', display: 'flex', alignItems: 'center',
                                    gap: 10, padding: sidebarOpen ? '10px 12px' : '10px 0',
                                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                                    background: active ? `${item.color}18` : 'none',
                                    border: active ? `1px solid ${item.color}44` : '1px solid transparent',
                                    borderRadius: 8, cursor: 'pointer', marginBottom: 4,
                                    color: active ? item.color : '#9ca3af',
                                    transition: 'all 0.15s', whiteSpace: 'nowrap',
                                }}
                                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#374151'; e.currentTarget.style.color = '#f9fafb' } }}
                                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#9ca3af' } }}
                            >
                                <Icon size={18} style={{ flexShrink: 0 }} />
                                {sidebarOpen && <span style={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>{item.label}</span>}
                            </button>
                        )
                    })}
                </nav>

                {/* Logout */}
                <div style={{ padding: '10px 8px', borderTop: '1px solid #374151', flexShrink: 0 }}>
                    <button
                        onClick={handleLogout}
                        title={!sidebarOpen ? 'Đăng xuất' : ''}
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center',
                            gap: 10, padding: sidebarOpen ? '10px 12px' : '10px 0',
                            justifyContent: sidebarOpen ? 'flex-start' : 'center',
                            background: 'none', border: '1px solid transparent',
                            borderRadius: 8, cursor: 'pointer', color: '#ef4444',
                            transition: 'all 0.15s', whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'transparent' }}
                    >
                        <LogOut size={18} style={{ flexShrink: 0 }} />
                        {sidebarOpen && <span style={{ fontSize: 13, fontWeight: 500 }}>Đăng Xuất</span>}
                    </button>
                </div>
            </aside>

            {/* ── Main ── */}
            <main style={{ flex: 1, marginLeft: sidebarOpen ? 240 : 68, transition: 'margin-left 0.25s ease', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

                {/* Topbar */}
                <header style={{
                    height: 64, background: '#1f2937', borderBottom: '1px solid #374151',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 24px', position: 'sticky', top: 0, zIndex: 30,
                }}>
                    {/* Breadcrumb */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: '#6b7280', fontSize: 13 }}>Admin</span>
                        <ChevronRight size={14} color="#374151" />
                        <span style={{ color: '#f9fafb', fontSize: 14, fontWeight: 600 }}>{currentMenu.label}</span>
                    </div>

                    {/* Right */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ color: '#f9fafb', fontSize: 13, fontWeight: 600 }}>
                                {adminUser?.userName || 'Admin'}
                            </div>
                            <div style={{ color: '#6b7280', fontSize: 11 }}>
                                {new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </div>
                        </div>
                        <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: 'rgba(245,158,11,0.2)', border: '2px solid rgba(245,158,11,0.4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#f59e0b', fontWeight: 700, fontSize: 14,
                        }}>
                            {(adminUser?.userName || 'A')[0].toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <div style={{ flex: 1, background: '#111827' }}>
                    {renderContent()}
                </div>
            </main>
        </div>
    )
}

export default AdminLayout