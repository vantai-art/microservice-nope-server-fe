import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Eye } from 'lucide-react';

function AdminBlog() {
    const [posts, setPosts] = useState([
        {
            id: 1,
            title: 'Bí quyết pha chế cà phê ngon',
            excerpt: 'Khám phá những bí mật đằng sau tách cà phê hoàn hảo...',
            content: 'Nội dung chi tiết về cách pha chế cà phê...',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop',
            author: 'Admin',
            date: '15/09/2024',
            views: 245
        },
        {
            id: 2,
            title: 'Top 5 món tráng miệng tại Coffee Blend',
            excerpt: 'Những món tráng miệng không thể bỏ qua khi đến quán...',
            content: 'Danh sách các món tráng miệng đặc sắc...',
            image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=400&fit=crop',
            author: 'Admin',
            date: '20/09/2024',
            views: 189
        }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        author: 'Admin'
    });

    const handleOpenModal = (post = null) => {
        if (post) {
            setEditingPost(post);
            setFormData(post);
        } else {
            setEditingPost(null);
            setFormData({
                title: '',
                excerpt: '',
                content: '',
                image: '',
                author: 'Admin'
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingPost(null);
    };

    const handleSubmit = () => {
        if (editingPost) {
            setPosts(posts.map(p =>
                p.id === editingPost.id ? { ...formData, id: p.id, views: p.views, date: p.date } : p
            ));
        } else {
            setPosts([...posts, {
                ...formData,
                id: Date.now(),
                views: 0,
                date: new Date().toLocaleDateString('vi-VN')
            }]);
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
            setPosts(posts.filter(p => p.id !== id));
        }
    };

    const filteredPosts = posts.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Quản Lý Bài Viết</h1>
                <p className="text-gray-400">Quản lý nội dung blog và tin tức</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm bài viết..."
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
                    Thêm Bài Viết
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredPosts.map(post => (
                    <div key={post.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-amber-500 transition-colors">
                        <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                        <div className="p-6">
                            <h3 className="text-white font-bold text-xl mb-2">{post.title}</h3>
                            <p className="text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
                            <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                                <span>Tác giả: {post.author}</span>
                                <span>{post.date}</span>
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Eye className="w-4 h-4" />
                                    <span>{post.views} lượt xem</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleOpenModal(post)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex items-center justify-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(post.id)}
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
                    <div className="bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">
                                {editingPost ? 'Chỉnh Sửa Bài Viết' : 'Thêm Bài Viết Mới'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-white mb-2 font-medium">Tiêu Đề *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-amber-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-white mb-2 font-medium">Mô Tả Ngắn *</label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-amber-500 outline-none"
                                    rows={2}
                                />
                            </div>

                            <div>
                                <label className="block text-white mb-2 font-medium">Nội Dung *</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-amber-500 outline-none"
                                    rows={8}
                                />
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
                                    <img src={formData.image} alt="Preview" className="w-full h-64 object-cover rounded" />
                                </div>
                            )}

                            <div>
                                <label className="block text-white mb-2 font-medium">Tác Giả</label>
                                <input
                                    type="text"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-amber-500 outline-none"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded font-semibold"
                                >
                                    {editingPost ? 'Cập Nhật' : 'Thêm Mới'}
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

export default AdminBlog;