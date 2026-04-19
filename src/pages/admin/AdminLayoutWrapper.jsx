// src/pages/admin/AdminLayoutWrapper.jsx
// Wrapper đồng bộ URL ↔ currentPage trong AdminLayout
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AdminLayout from './AdminLayout'

// Map URL path → page id
const PATH_TO_PAGE = {
    '/admin': 'dashboard',
    '/admin/dashboard': 'dashboard',
    '/admin/products': 'products',
    '/admin/categories': 'categories',
    '/admin/orders': 'orders',
    '/admin/users': 'users',
    '/admin/staff': 'staff',
    '/admin/promotions': 'promotions',
    '/admin/settings': 'settings',
}

// Map page id → URL path
const PAGE_TO_PATH = {
    dashboard: '/admin/dashboard',
    products: '/admin/products',
    categories: '/admin/categories',
    orders: '/admin/orders',
    users: '/admin/users',
    staff: '/admin/staff',
    promotions: '/admin/promotions',
    settings: '/admin/settings',
}

export default function AdminLayoutWrapper({ page }) {
    const navigate = useNavigate()
    const location = useLocation()

    // Lấy currentPage từ URL hiện tại (ưu tiên hơn prop)
    const pageFromUrl = PATH_TO_PAGE[location.pathname] || page || 'dashboard'
    const [currentPage, setCurrentPage] = useState(pageFromUrl)

    // Đồng bộ khi URL thay đổi từ bên ngoài
    useEffect(() => {
        const p = PATH_TO_PAGE[location.pathname]
        if (p && p !== currentPage) setCurrentPage(p)
    }, [location.pathname])

    // Khi user click menu → cập nhật state + URL
    const handleSetPage = (p) => {
        setCurrentPage(p)
        const path = PAGE_TO_PATH[p] || '/admin'
        if (location.pathname !== path) navigate(path, { replace: true })
    }

    return (
        <AdminLayout
            currentPage={currentPage}
            setCurrentPage={handleSetPage}
        />
    )
}