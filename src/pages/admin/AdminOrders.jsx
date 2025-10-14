import React, { useState } from 'react';
import { Search, Eye, Trash2, Package, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';

function AdminOrders() {
    const [orders, setOrders] = useState([
        {
            id: 'DH001',
            customer: { name: 'Nguyễn Văn A', phone: '0901234567', email: 'nguyenvana@gmail.com' },
            items: [
                { name: 'Cà Phê Cappuccino', quantity: 2, price: 45000 },
                { name: 'Bánh Chocolate', quantity: 1, price: 55000 }
            ],
            total: 145000,
            status: 'Chờ xử lý',
            date: '10/10/2024',
            time: '09:30',
            address: '123 Nguyễn Huệ, Q1, TP.HCM',
            note: 'Giao hàng buổi chiều'
        },
        {
            id: 'DH002',
            customer: { name: 'Trần Thị B', phone: '0912345678', email: 'tranthib@gmail.com' },
            items: [
                { name: 'Cà Phê Latte', quantity: 1, price: 42000 },
                { name: 'Bít Tết Bò', quantity: 1, price: 189000 }
            ],
            total: 231000,
            status: 'Đang giao',
            date: '10/10/2024',
            time: '10:15',
            address: '456 Lê Lợi, Q1, TP.HCM',
            note: ''
        },
        {
            id: 'DH003',
            customer: { name: 'Lê Văn C', phone: '0923456789', email: 'levanc@gmail.com' },
            items: [
                { name: 'Cà Phê Mocha', quantity: 3, price: 48000 },
                { name: 'Nước Cam Tươi', quantity: 2, price: 35000 }
            ],
            total: 214000,
            status: 'Hoàn thành',
            date: '09/10/2024',
            time: '14:20',
            address: '789 Võ Văn Tần, Q3, TP.HCM',
            note: ''
        },
        {
            id: 'DH004',
            customer: { name: 'Phạm Thị D', phone: '0934567890', email: 'phamthid@gmail.com' },
            items: [
                { name: 'Cà Phê Espresso', quantity: 2, price: 38000 }
            ],
            total: 76000,
            status: 'Đã hủy',
            date: '09/10/2024',
            time: '11:45',
            address: '321 Hai Bà Trưng, Q1, TP.HCM',
            note: 'Khách hủy đơn'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tất cả');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const statusOptions = ['Tất cả', 'Chờ xử lý', 'Đang giao', 'Hoàn thành', 'Đã hủy'];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Chờ xử lý': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            case 'Đang giao': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            case 'Hoàn thành': return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'Đã hủy': return 'bg-red-500/20 text-red-400 border-red-500/50';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Chờ xử lý': return <Clock className="w-4 h-4" />;
            case 'Đang giao': return <Package className="w-4 h-4" />;
            case 'Hoàn thành': return <CheckCircle className="w-4 h-4" />;
            case 'Đã hủy': return <XCircle className="w-4 h-4" />;
            default: return null;
        }
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
        if (selectedOrder?.id === orderId) {
            setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
    };

    const deleteOrder = (orderId) => {
        if (window.confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
            setOrders(orders.filter(order => order.id !== orderId));
            if (selectedOrder?.id === orderId) {
                setShowDetailModal(false);
                setSelectedOrder(null);
            }
        }
    };

    const viewOrderDetail = (order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    const filteredOrders = orders.filter(order => {
        const matchSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.phone.includes(searchTerm);
        const matchStatus = statusFilter === 'Tất cả' || order.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'Chờ xử lý').length,
        delivering: orders.filter(o => o.status === 'Đang giao').length,
        completed: orders.filter(o => o.status === 'Hoàn thành').length,
        cancelled: orders.filter(o => o.status === 'Đã hủy').length
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Quản Lý Đơn Hàng</h1>
                <p className="text-gray-400">Theo dõi và xử lý đơn hàng của khách</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-1">Tổng đơn</div>
                    <div className="text-2xl font-bold text-white">{stats.total}</div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <div className="text-yellow-400 text-sm mb-1">Chờ xử lý</div>
                    <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="text-blue-400 text-sm mb-1">Đang giao</div>
                    <div className="text-2xl font-bold text-blue-400">{stats.delivering}</div>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <div className="text-green-400 text-sm mb-1">Hoàn thành</div>
                    <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div className="text-red-400 text-sm mb-1">Đã hủy</div>
                    <div className="text-2xl font-bold text-red-400">{stats.cancelled}</div>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm mã đơn, tên khách, số điện thoại..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-700 focus:border-amber-500 outline-none"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-gray-800 text-white pl-12 pr-8 py-3 rounded-lg border border-gray-700 focus:border-amber-500 outline-none appearance-none min-w-[200px]"
                    >
                        {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-900">
                            <tr>
                                <th className="px-6 py-4 text-left text-white font-semibold">Mã đơn</th>
                                <th className="px-6 py-4 text-left text-white font-semibold">Khách hàng</th>
                                <th className="px-6 py-4 text-left text-white font-semibold">Ngày giờ</th>
                                <th className="px-6 py-4 text-left text-white font-semibold">Tổng tiền</th>
                                <th className="px-6 py-4 text-left text-white font-semibold">Trạng thái</th>
                                <th className="px-6 py-4 text-center text-white font-semibold">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                        Không tìm thấy đơn hàng nào
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-amber-400 font-bold">{order.id}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-white font-medium">{order.customer.name}</div>
                                            <div className="text-gray-400 text-sm">{order.customer.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-white">{order.date}</div>
                                            <div className="text-gray-400 text-sm">{order.time}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-amber-500 font-bold">
                                                {order.total.toLocaleString('vi-VN')}đ
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => viewOrderDetail(order)}
                                                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteOrder(order.id)}
                                                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                                                    title="Xóa đơn"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Detail Modal */}
            {showDetailModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-white">Chi Tiết Đơn Hàng</h2>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-amber-400 font-bold text-lg">{selectedOrder.id}</span>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedOrder.status)}`}>
                                    {getStatusIcon(selectedOrder.status)}
                                    {selectedOrder.status}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Customer Info */}
                            <div>
                                <h3 className="text-white font-bold mb-3">Thông Tin Khách Hàng</h3>
                                <div className="bg-gray-900 rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Họ tên:</span>
                                        <span className="text-white font-medium">{selectedOrder.customer.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Điện thoại:</span>
                                        <span className="text-white font-medium">{selectedOrder.customer.phone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Email:</span>
                                        <span className="text-white font-medium">{selectedOrder.customer.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Địa chỉ:</span>
                                        <span className="text-white font-medium text-right">{selectedOrder.address}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="text-white font-bold mb-3">Sản Phẩm Đã Đặt</h3>
                                <div className="space-y-2">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="bg-gray-900 rounded-lg p-4 flex justify-between items-center">
                                            <div>
                                                <div className="text-white font-medium">{item.name}</div>
                                                <div className="text-gray-400 text-sm">Số lượng: {item.quantity}</div>
                                            </div>
                                            <div className="text-amber-500 font-bold">
                                                {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-gray-900 rounded-lg p-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-400">Ngày đặt:</span>
                                    <span className="text-white">{selectedOrder.date} - {selectedOrder.time}</span>
                                </div>
                                {selectedOrder.note && (
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-400">Ghi chú:</span>
                                        <span className="text-white text-right">{selectedOrder.note}</span>
                                    </div>
                                )}
                                <div className="border-t border-gray-700 pt-2 mt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-bold text-lg">Tổng cộng:</span>
                                        <span className="text-amber-500 font-bold text-2xl">
                                            {selectedOrder.total.toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Update Status */}
                            <div>
                                <h3 className="text-white font-bold mb-3">Cập Nhật Trạng Thái</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {statusOptions.filter(s => s !== 'Tất cả').map(status => (
                                        <button
                                            key={status}
                                            onClick={() => updateOrderStatus(selectedOrder.id, status)}
                                            className={`py-2 px-4 rounded-lg font-medium transition-colors ${selectedOrder.status === status
                                                    ? 'bg-amber-600 text-white'
                                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminOrders;