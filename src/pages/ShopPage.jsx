// pages/ShopPage.jsx
import React, { useState } from 'react';
import { ShoppingCart, Search, Filter, Star } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import Footer from '../components/Footer';

function ShopPage() {
    const { products, addToCart } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tất cả');
    const [sortBy, setSortBy] = useState('default');

    const categories = ['Tất cả', 'Cà Phê', 'Món Chính', 'Đồ Uống', 'Tráng Miệng'];

    const handleAddToCart = (product) => {
        addToCart(product);
        // Hiển thị thông báo
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in';
        notification.textContent = `Đã thêm "${product.name}" vào giỏ hàng!`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    };

    // Filter products
    let filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Tất cả' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Sort products
    if (sortBy === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    return (
        <div className="min-h-screen bg-black pt-20 pb-12">
            {/* Header Banner */}
            <div
                className="relative h-64 flex items-center justify-center text-white mb-12"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200&h=400&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative text-center z-10">
                    <h1 className="text-5xl font-bold mb-4">CỬA HÀNG</h1>
                    <p className="text-xl">Khám phá thực đơn đa dạng của chúng tôi</p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {/* Search & Filter Bar */}
                <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-800">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-700 focus:border-amber-500 outline-none"
                            />
                        </div>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-amber-500 outline-none"
                        >
                            <option value="default">Mặc định</option>
                            <option value="price-asc">Giá: Thấp đến Cao</option>
                            <option value="price-desc">Giá: Cao đến Thấp</option>
                        </select>
                    </div>

                    {/* Category Filters */}
                    <div className="mt-6 pt-6 border-t border-gray-800">
                        <div className="flex items-center gap-3 mb-3">
                            <Filter className="w-5 h-5 text-amber-500" />
                            <h3 className="text-white font-semibold">Bộ Lọc:</h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === category
                                            ? 'bg-amber-600 text-white'
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-gray-400">
                        Hiển thị <span className="text-white font-semibold">{filteredProducts.length}</span> sản phẩm
                        {searchTerm && <span> cho "<span className="text-amber-500">{searchTerm}</span>"</span>}
                        {selectedCategory !== 'Tất cả' && <span> trong <span className="text-amber-500">{selectedCategory}</span></span>}
                    </p>
                </div>

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <ShoppingCart className="w-20 h-20 mx-auto text-gray-700 mb-4" />
                        <h3 className="text-2xl text-white font-bold mb-2">Không tìm thấy sản phẩm</h3>
                        <p className="text-gray-400">Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-amber-500 transition-all hover:transform hover:scale-105">
                                {/* Product Image - FIXED SIZE */}
                                <div className="relative h-56 overflow-hidden bg-gray-800">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x400/1f2937/d97706?text=No+Image';
                                        }}
                                    />
                                    <span className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        {product.category}
                                    </span>
                                </div>

                                {/* Product Info */}
                                <div className="p-5">
                                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">{product.name}</h3>
                                    <p className="text-gray-400 text-sm mb-3 line-clamp-2 h-10">{product.description}</p>

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

                                    {/* Price & Add to Cart */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                                        <div>
                                            <div className="text-amber-500 font-bold text-xl">
                                                {product.price.toLocaleString('vi-VN')}đ
                                            </div>
                                            <div className="text-gray-500 text-xs mt-1">
                                                Kho: {product.stock}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Thêm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />

            {/* CSS cho animation thông báo */}
            <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
        </div>
    );
}

export default ShopPage;