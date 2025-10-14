// pages/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LogOut, Menu, X, LayoutDashboard, Package,
    ShoppingBag, FolderOpen, Users, FileText,
    Settings, Coffee
} from 'lucide-react';

function AdminLayout({ children, currentPage, setCurrentPage, onLogout }) {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        { id: 'dashboard', label: 'Tổng Quan', icon: <LayoutDashboard className="w-5 h-5" /> },
        { id: 'products', label: 'Sản Phẩm', icon: <Package className="w-5 h-5" /> },
        { id: 'categories', label: 'Danh Mục', icon: <FolderOpen className="w-5 h-5" /> },
        { id: 'orders', label: 'Đơn Hàng', icon: <ShoppingBag className="w-5 h-5" /> },
        { id: 'users', label: 'Khách Hàng', icon: <Users className="w-5 h-5" /> },
        { id: 'blog', label: 'Bài Viết', icon: <FileText className="w-5 h-5" /> },
        { id: 'settings', label: 'Cài Đặt', icon: <Settings className="w-5 h-5" /> }
    ];

    const handleMenuClick = (itemId) => {
        console.log('Menu clicked:', itemId); // Debug
        setCurrentPage(itemId);
    };

    const handleLogout = () => {
        if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
            localStorage.removeItem('isAdminAuth'); // Xóa localStorage
            onLogout();
            navigate('/admin/login');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex">
            {/* Sidebar */}
            <aside className={`bg-gray-800 border-r border-gray-700 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'
                } fixed h-full z-40`}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
                    {sidebarOpen && (
                        <div className="flex items-center space-x-2">
                            <Coffee className="w-8 h-8 text-amber-500" />
                            <div className="text-white">
                                <div className="text-lg font-bold">COFFEE BLEND</div>
                                <div className="text-xs text-gray-400">Admin Panel</div>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="p-4 space-y-2">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleMenuClick(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentPage === item.id
                                    ? 'bg-amber-600 text-white'
                                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                }`}
                            title={!sidebarOpen ? item.label : ''}
                        >
                            {item.icon}
                            {sidebarOpen && <span className="font-medium">{item.label}</span>}
                        </button>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title={!sidebarOpen ? 'Đăng Xuất' : ''}
                    >
                        <LogOut className="w-5 h-5" />
                        {sidebarOpen && <span className="font-medium">Đăng Xuất</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Top Bar */}
                <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6 sticky top-0 z-30">
                    <div>
                        <h1 className="text-white text-xl font-bold">
                            {menuItems.find(item => item.id === currentPage)?.label || 'Tổng Quan'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-white font-medium">Admin</div>
                            <div className="text-gray-400 text-sm">admin@coffeeblend.com</div>
                        </div>
                        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                            A
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="min-h-[calc(100vh-4rem)]">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default AdminLayout;