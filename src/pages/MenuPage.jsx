// pages/MenuPage.jsx
// FIX: Xóa fetch('/api/categories') — endpoint không tồn tại trong BE
//      Category là string trên Product entity, lấy unique values từ /products (đã có trong AppContext)
import React, { useState, useMemo } from 'react';
import { ShoppingCart, Star, Filter, Package } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import Footer from '../components/Footer';

function MenuPage() {
    const { products, addToCart, loading, error } = useAppContext();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showFilters, setShowFilters] = useState(true);

    // ── Lấy danh sách category unique từ products (BE không có /api/categories) ──
    const categories = useMemo(() => {
        const seen = new Set();
        const result = [];
        products.forEach(p => {
            const name = (typeof p.category === 'string' ? p.category : p.category?.name) || 'Khác';
            if (!seen.has(name)) {
                seen.add(name);
                result.push({ name });
            }
        });
        return result;
    }, [products]);

    // ── Lọc sản phẩm theo danh mục ──────────────────────────────
    const displayProducts = useMemo(() => {
        if (selectedCategory === null) return [];
        if (selectedCategory === 'all') return products;
        return products.filter(p => {
            const cat = typeof p.category === 'string' ? p.category : p.category?.name;
            return cat === selectedCategory;
        });
    }, [products, selectedCategory]);

    // ── Thêm giỏ hàng ────────────────────────────────────────────
    const handleAddToCart = (product) => {
        addToCart(product);
        const note = document.createElement('div');
        note.style.cssText = 'position:fixed;top:80px;right:16px;background:#16a34a;color:#fff;padding:12px 20px;border-radius:8px;z-index:9999;font-family:DM Sans,sans-serif;font-size:14px;box-shadow:0 4px 16px rgba(0,0,0,0.4)';
        note.textContent = `✅ Đã thêm "${product.name}" vào giỏ hàng!`;
        document.body.appendChild(note);
        setTimeout(() => note.remove(), 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-20">
            {/* Hero */}
            <div
                className="relative h-80 flex items-center justify-center text-white mb-12"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=600&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative text-center z-10 px-4">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">THỰC ĐƠN</h1>
                    <p className="text-xl text-amber-100">Khám phá những món ăn & thức uống đặc sắc</p>
                </div>
            </div>

            {/* Nội dung chính */}
            <div className="container mx-auto px-4 py-12">
                {/* Nút Toggle Bộ Lọc */}
                <div className="flex justify-center mb-8">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all"
                    >
                        <Filter className="w-5 h-5" />
                        {showFilters ? 'Ẩn Danh Mục' : 'Hiện Danh Mục'}
                    </button>
                </div>

                {/* Categories */}
                {showFilters && (
                    <div className="mb-12 animate-fade-in">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">DANH MỤC SẢN PHẨM</h2>

                        {loading ? (
                            <div className="text-center text-gray-400 py-8">Đang tải danh mục...</div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {/* Nút Tất Cả */}
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className={`relative overflow-hidden rounded-lg transition-all transform hover:scale-105 ${selectedCategory === 'all' ? 'ring-4 ring-amber-500' : 'hover:ring-2 hover:ring-amber-400'
                                        }`}
                                >
                                    <div className="h-32 flex items-center justify-center bg-gradient-to-br from-amber-600 to-amber-800">
                                        <Package className="w-12 h-12 text-white" />
                                    </div>
                                    <div className="bg-gray-800 p-3 text-center">
                                        <span className="text-white font-semibold">Tất Cả</span>
                                        <span className="block text-gray-400 text-xs mt-1">{products.length} sản phẩm</span>
                                    </div>
                                </button>

                                {/* Các danh mục lấy từ products */}
                                {categories.map((cat) => {
                                    const count = products.filter(p => {
                                        const c = typeof p.category === 'string' ? p.category : p.category?.name;
                                        return c === cat.name;
                                    }).length;
                                    return (
                                        <button
                                            key={cat.name}
                                            onClick={() => setSelectedCategory(cat.name)}
                                            className={`relative overflow-hidden rounded-lg transition-all transform hover:scale-105 ${selectedCategory === cat.name ? 'ring-4 ring-amber-500' : 'hover:ring-2 hover:ring-amber-400'
                                                }`}
                                        >
                                            <div className="h-32 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                                                <Package className="w-12 h-12 text-amber-400/70" />
                                            </div>
                                            <div className="bg-gray-800 p-3 text-center">
                                                <span className="text-white font-semibold text-sm">{cat.name}</span>
                                                <span className="block text-gray-400 text-xs mt-1">{count} sản phẩm</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Tiêu đề danh mục đang chọn */}
                <div className="text-center mb-8">
                    {selectedCategory === null ? (
                        <h3 className="text-xl text-gray-400">
                            Vui lòng chọn một danh mục để xem sản phẩm
                        </h3>
                    ) : (
                        <h3 className="text-xl text-gray-300">
                            Đang xem:{' '}
                            <span className="text-amber-500 font-bold text-2xl">
                                {selectedCategory === 'all' ? 'Tất cả' : selectedCategory}
                            </span>
                            {' '}<span className="text-gray-500 text-base">({displayProducts.length} sản phẩm)</span>
                        </h3>
                    )}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-16 text-gray-400 text-xl">
                        <div className="animate-spin h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        Đang tải sản phẩm...
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-red-900 text-red-100 p-6 rounded-lg mb-8 text-center">
                        <p className="text-xl font-bold mb-2">Lỗi tải sản phẩm</p>
                        <p>{error}</p>
                    </div>
                )}

                {/* Products Grid */}
                {!loading && !error && (
                    <>
                        {selectedCategory === null ? (
                            <div className="text-center py-16 text-gray-400">
                                <Package className="w-16 h-16 mx-auto mb-3 text-gray-600" />
                                <p className="text-xl">Hãy chọn một danh mục để xem sản phẩm</p>
                            </div>
                        ) : displayProducts.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <Package className="w-16 h-16 mx-auto mb-3 text-gray-600" />
                                <p className="text-xl">Không có sản phẩm nào trong danh mục này</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {displayProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-amber-500 transition-all transform hover:scale-105"
                                    >
                                        {/* Image */}
                                        <div className="relative h-56 overflow-hidden bg-gray-800 group">
                                            <img
                                                src={product.imageUrl || 'https://via.placeholder.com/400x400/1f2937/d97706?text=No+Image'}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/400x400/1f2937/d97706?text=No+Image';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 flex items-center justify-center transition-all">
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
                                                >
                                                    <ShoppingCart className="w-5 h-5" />
                                                    Thêm Vào Giỏ
                                                </button>
                                            </div>
                                            <span className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                {(typeof product.category === 'string' ? product.category : product.category?.name) || 'Khác'}
                                            </span>
                                        </div>

                                        {/* Info */}
                                        <div className="p-5">
                                            <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">
                                                {product.name}
                                            </h3>
                                            <p className="text-gray-400 text-sm mb-3 line-clamp-2 h-10">
                                                {product.description || 'Chưa có mô tả'}
                                            </p>

                                            {/* Rating */}
                                            <div className="flex items-center gap-1 mb-3">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-4 h-4 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                                                    />
                                                ))}
                                                <span className="text-gray-400 text-sm ml-1">(4.8)</span>
                                            </div>

                                            {/* Price & Cart */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                                                <span className="text-amber-500 font-bold text-xl">
                                                    {(product.price || 0).toLocaleString('vi-VN')}đ
                                                </span>
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    className="bg-gray-800 hover:bg-amber-600 text-white p-3 rounded-lg transition-colors group"
                                                    title="Thêm vào giỏ hàng"
                                                >
                                                    <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            <Footer />

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out; }
            `}</style>
        </div>
    );
}

export default MenuPage;