import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';

function AdminProducts() {
    const [products, setProducts] = useState([
        {
            id: 1,
            name: 'Cà Phê Cappuccino',
            description: 'Hương vị đậm đà với lớp bọt sữa mịn màng',
            price: 45000,
            category: 'Cà Phê',
            image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop',
            stock: 50
        },
        {
            id: 2,
            name: 'Cà Phê Latte',
            description: 'Sự kết hợp hoàn hảo giữa cà phê và sữa tươi',
            price: 42000,
            category: 'Cà Phê',
            image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=400&fit=crop',
            stock: 45
        },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Cà Phê',
        image: '',
        stock: ''
    });

    const categories = ['Cà Phê', 'Món Chính', 'Đồ Uống', 'Tráng Miệng'];

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData(product);
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: 'Cà Phê',
                image: '',
                stock: ''
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingProduct) {
            setProducts(products.map(p =>
                p.id === editingProduct.id ? { ...formData, id: p.id } : p
            ));
        } else {
            setProducts([...products, { ...formData, id: Date.now() }]);
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Quản Lý Sản Phẩm</h1>
                <p className="text-gray-400">Quản lý danh sách sản phẩm của cửa hàng</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-700 focus:border-amber-500 outline-none"
                    />
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 whitespace-nowrap"
                >
                    <Plus className="w-5 h-5" />
                    Thêm Sản Phẩm
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                    <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-amber-500 transition-colors">
                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-white font-bold text-lg">{product.name}</h3>
                                <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">
                                    {product.category}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-amber-500 font-bold text-xl">
                                    {product.price.toLocaleString('vi-VN')}đ
                                </span>
                                <span className="text-gray-400 text-sm">
                                    Kho: <span className="text-white font-semibold">{product.stock}</span>
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleOpenModal(product)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex items-center justify-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">
                                {editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-white mb-2 font-medium">Tên Sản Phẩm *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-amber-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-white mb-2 font-medium">Mô Tả</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-amber-500 outline-none"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white mb-2 font-medium">Giá (VNĐ) *</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                        className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-amber-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white mb-2 font-medium">Số Lượng Kho *</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                        className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-amber-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-white mb-2 font-medium">Danh Mục *</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-amber-500 outline-none"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-white mb-2 font-medium">URL Hình Ảnh *</label>
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-amber-500 outline-none"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            {formData.image && (
                                <div>
                                    <label className="block text-white mb-2 font-medium">Xem Trước</label>
                                    <img src={formData.image} alt="Preview" className="w-full h-48 object-cover rounded" />
                                </div>
                            )}

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded font-semibold"
                                >
                                    {editingProduct ? 'Cập Nhật' : 'Thêm Mới'}
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded font-semibold"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminProducts;