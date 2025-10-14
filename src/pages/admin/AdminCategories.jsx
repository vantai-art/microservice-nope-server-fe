import React, { useState } from 'react';
import { Plus, Edit2, Trash2, FolderOpen, X } from 'lucide-react';

function AdminCategories() {
    const [categories, setCategories] = useState([
        { id: 1, name: 'Cà Phê', productCount: 15, description: 'Các loại cà phê đặc sắc', color: '#D97706' },
        { id: 2, name: 'Món Chính', productCount: 8, description: 'Món ăn chính hấp dẫn', color: '#DC2626' },
        { id: 3, name: 'Đồ Uống', productCount: 12, description: 'Nước giải khát tươi mát', color: '#3B82F6' },
        { id: 4, name: 'Tráng Miệng', productCount: 10, description: 'Bánh ngọt và tráng miệng', color: '#EC4899' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: '#D97706'
    });

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                description: category.description,
                color: category.color
            });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', description: '', color: '#D97706' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCategory(null);
    };

    const handleSubmit = () => {
        if (!formData.name.trim()) {
            alert('Vui lòng nhập tên danh mục!');
            return;
        }

        if (editingCategory) {
            setCategories(categories.map(c =>
                c.id === editingCategory.id ? { ...c, ...formData } : c
            ));
        } else {
            setCategories([...categories, {
                id: Date.now(),
                ...formData,
                productCount: 0
            }]);
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        const category = categories.find(c => c.id === id);
        if (category && category.productCount > 0) {
            if (!window.confirm(`Danh mục "${category.name}" có ${category.productCount} sản phẩm. Bạn có chắc muốn xóa?`)) {
                return;
            }
        }
        setCategories(categories.filter(c => c.id !== id));
    };

    const colorOptions = [
        { value: '#D97706', name: 'Cam' },
        { value: '#DC2626', name: 'Đỏ' },
        { value: '#3B82F6', name: 'Xanh Dương' },
        { value: '#EC4899', name: 'Hồng' },
        { value: '#10B981', name: 'Xanh Lá' },
        { value: '#8B5CF6', name: 'Tím' },
    ];

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Quản Lý Danh Mục</h1>
                <p className="text-gray-400">Quản lý các danh mục sản phẩm của cửa hàng</p>
            </div>

            <div className="flex justify-between items-center mb-6">
                <div className="text-gray-400">
                    Tổng số: <span className="text-white font-semibold">{categories.length}</span> danh mục
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Thêm Danh Mục
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map(category => (
                    <div key={category.id} className="bg-gray-800 rounded-lg border border-gray-700 hover:border-amber-500 transition-colors overflow-hidden">
                        <div
                            className="h-24 flex items-center justify-center"
                            style={{ backgroundColor: category.color }}
                        >
                            <FolderOpen className="w-12 h-12 text-white" />
                        </div>
                        <div className="p-5">
                            <h3 className="text-white font-bold text-xl mb-2">{category.name}</h3>
                            <p className="text-gray-400 text-sm mb-4 min-h-[40px]">{category.description}</p>

                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
                                <span className="text-gray-400 text-sm">Số sản phẩm:</span>
                                <span className="text-amber-500 font-bold text-lg">{category.productCount}</span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleOpenModal(category)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex items-center justify-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
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
                    <div className="bg-gray-800 rounded-lg max-w-md w-full">
                        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">
                                {editingCategory ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-white mb-2 font-medium">Tên Danh Mục *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-amber-500 outline-none"
                                    placeholder="Nhập tên danh mục"
                                />
                            </div>

                            <div>
                                <label className="block text-white mb-2 font-medium">Mô Tả</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-amber-500 outline-none"
                                    rows={3}
                                    placeholder="Mô tả về danh mục này"
                                />
                            </div>

                            <div>
                                <label className="block text-white mb-2 font-medium">Màu Sắc</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {colorOptions.map(color => (
                                        <button
                                            key={color.value}
                                            onClick={() => setFormData({ ...formData, color: color.value })}
                                            className={`p-4 rounded-lg border-2 transition-all ${formData.color === color.value
                                                    ? 'border-white scale-105'
                                                    : 'border-gray-600 hover:border-gray-500'
                                                }`}
                                            style={{ backgroundColor: color.value }}
                                        >
                                            <span className="text-white font-medium text-sm">{color.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded font-semibold"
                                >
                                    {editingCategory ? 'Cập Nhật' : 'Thêm Mới'}
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

export default AdminCategories;