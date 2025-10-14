// pages/staff/StaffPage.jsx
import React, { useState } from 'react';
import { Coffee, ShoppingCart, User, LogOut, Grid, List, Plus, Minus, Trash2, X } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

function StaffPage() {
    const { products, categories } = useAppContext();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('TẤT CẢ');
    const [cart, setCart] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    const allCategories = ['TẤT CẢ', ...categories];

    const filteredProducts = selectedCategory === 'TẤT CẢ'
        ? products
        : products.filter(p => p.category?.name === selectedCategory);

    const handleAddToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            setCart(prev => prev.filter(item => item.id !== productId));
            return;
        }
        setCart(prev =>
            prev.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert('Vui lòng chọn món!');
            return;
        }
        if (!selectedTable) {
            alert('Vui lòng chọn bàn!');
            return;
        }
        alert(`Đã tạo đơn hàng cho Bàn ${selectedTable}\nTổng: ${cartTotal.toLocaleString('vi-VN')}đ`);
        setCart([]);
        setSelectedTable(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar - Menu */}
            <div className="w-2/3 bg-white p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Coffee className="w-8 h-8 text-amber-600" />
                        <div>
                            <h1 className="text-2xl font-bold">COFFEE BLEND</h1>
                            <p className="text-sm text-gray-500">Staff Panel</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="font-semibold">Nhân viên: Admin</p>
                            <p className="text-sm text-gray-500">Bàn: {selectedTable || 'Chưa chọn'}</p>
                        </div>
                        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg">
                            <LogOut className="w-5 h-5 text-red-600" />
                        </button>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                    {allCategories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {cat.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-h-[calc(100vh-250px)] overflow-y-auto">
                    {filteredProducts.map(product => (
                        <div
                            key={product.id}
                            onClick={() => handleAddToCart(product)}
                            className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
                        >
                            <img
                                src={product.imageUrl || product.image}
                                alt={product.name}
                                className="w-full h-32 object-cover rounded-lg mb-3"
                            />
                            <h3 className="font-bold text-sm mb-1 line-clamp-1">{product.name}</h3>
                            <p className="text-xs text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-amber-600 font-bold">
                                    {product.price.toLocaleString('vi-VN')} đ
                                </span>
                                <button className="bg-amber-600 text-white p-1.5 rounded-lg hover:bg-amber-700">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Sidebar - Order Details */}
            <div className="w-1/3 bg-gray-50 p-6 border-l">
                <h2 className="text-xl font-bold mb-6">CHI TIẾT ĐỂN HÀNG</h2>

                {/* Table Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2">Chọn bàn:</label>
                    <select
                        value={selectedTable || ''}
                        onChange={(e) => setSelectedTable(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500"
                    >
                        <option value="">-- Chọn bàn --</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <option key={num} value={num}>Bàn {num}</option>
                        ))}
                    </select>
                </div>

                {/* Cart Items */}
                <div className="space-y-3 mb-6 max-h-[calc(100vh-400px)] overflow-y-auto">
                    {cart.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <ShoppingCart className="w-12 h-12 mx-auto mb-2" />
                            <p>Chưa có món nào</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <img
                                        src={item.imageUrl || item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-sm mb-1">{item.name}</h3>
                                        <p className="text-xs text-gray-500 mb-2">
                                            Số lượng: {item.quantity}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-amber-600 font-bold">
                                                {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Total & Checkout */}
                <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-bold">Tổng cộng:</span>
                        <span className="text-2xl font-bold text-amber-600">
                            {cartTotal.toLocaleString('vi-VN')} đ
                        </span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || !selectedTable}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        THANH TOÁN
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StaffPage;