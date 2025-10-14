import React from 'react';
import { Package, ShoppingBag, Users, DollarSign, TrendingUp } from 'lucide-react';

function AdminDashboard() {
    const stats = [
        { title: 'Tổng Sản Phẩm', value: '47', icon: <Package className="w-8 h-8" />, color: 'bg-blue-500', change: '+12%' },
        { title: 'Đơn Hàng Mới', value: '23', icon: <ShoppingBag className="w-8 h-8" />, color: 'bg-green-500', change: '+8%' },
        { title: 'Khách Hàng', value: '156', icon: <Users className="w-8 h-8" />, color: 'bg-purple-500', change: '+15%' },
        { title: 'Doanh Thu', value: '45.2M', icon: <DollarSign className="w-8 h-8" />, color: 'bg-amber-500', change: '+23%' }
    ];

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Bảng Điều Khiển</h1>
                <p className="text-gray-400">Chào mừng trở lại! Đây là tổng quan hệ thống của bạn.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-amber-500 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.color} p-3 rounded-lg text-white`}>
                                {stat.icon}
                            </div>
                            <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                {stat.change}
                            </span>
                        </div>
                        <div className="text-gray-400 text-sm mb-1">{stat.title}</div>
                        <div className="text-white text-2xl font-bold">{stat.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminDashboard;