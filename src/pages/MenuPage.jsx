import React, { useState } from 'react';
import { ShoppingCart, Star, Filter } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import Footer from '../components/Footer';

function MenuPage() {
    const { products, addToCart } = useAppContext();
    const [selectedCategory, setSelectedCategory] = useState('Tất cả');
    const [showFilters, setShowFilters] = useState(false);

    const categories = ['Tất cả', 'Cà Phê', 'Món Chính', 'Đồ Uống', 'Tráng Miệng'];

    const filteredProducts = selectedCategory === 'Tất cả'
        ? products
        : products.filter(p => p.category === selectedCategory);

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

    return (
        <div className="min-h-screen bg-black pt-20">
            {/* Hero Section */}
            <div
                className="relative h-80 flex items-center justify-center text-white mb-12"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=600&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative text-center z-10 px-4">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">THỰC ĐƠN</h1>
                    <p className="text-xl">Khám phá hương vị đặc biệt</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Filter Toggle Button */}
                <div className="flex justify-center mb-8">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                    >
                        <Filter className="w-5 h-5" />
                        {showFilters ? 'Ẩn Bộ Lọc' : 'Hiện Bộ Lọc'}
                    </button>
                </div>

                {/* Category Filters - Chỉ hiện khi showFilters = true */}
                {showFilters && (
                    <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2 rounded-lg font-medium transition-colors ${selectedCategory === category
                                        ? 'bg-amber-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-amber-500 transition-all hover:transform hover:scale-105">
                            {/* Product Image - FIXED SIZE */}
                            <div className="relative h-56 overflow-hidden bg-gray-800 group">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400x400/1f2937/d97706?text=No+Image';
                                    }}
                                />
                                {/* Overlay khi hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        Thêm Vào Giỏ
                                    </button>
                                </div>
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
                                            Đã bao gồm VAT
                                        </div>
                                    </div>
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
            </div>

            <Footer />

            {/* CSS cho animations */}
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
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
        </div>
    );
}

export default MenuPage;