// contexts/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext phải được sử dụng trong AppProvider');
    }
    return context;
};

export function AppProvider({ children }) {
    // Products State
    const [products, setProducts] = useState([
        { id: 1, name: 'Cà Phê Cappuccino', description: 'Hương vị đậm đà với lớp bọt sữa mịn màng', price: 45000, category: 'Cà Phê', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop', stock: 50 },
        { id: 2, name: 'Cà Phê Latte', description: 'Sự kết hợp hoàn hảo giữa cà phê và sữa tươi', price: 42000, category: 'Cà Phê', image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=400&fit=crop', stock: 45 },
        { id: 3, name: 'Cà Phê Espresso', description: 'Đậm đà, mạnh mẽ cho người sành điệu', price: 38000, category: 'Cà Phê', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop', stock: 60 },
        { id: 4, name: 'Cà Phê Mocha', description: 'Vị chocolate ngọt ngào hoà quyện cà phê', price: 48000, category: 'Cà Phê', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=400&fit=crop', stock: 40 },
        { id: 5, name: 'Bít Tết Bò', description: 'Bít tết bò Úc nướng chín vừa, kèm rau củ', price: 189000, category: 'Món Chính', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop', stock: 25 },
        { id: 6, name: 'Nước Cam Tươi', description: 'Nước cam vắt tươi 100% không đường', price: 35000, category: 'Đồ Uống', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop', stock: 80 },
        { id: 7, name: 'Bánh Chocolate', description: 'Bánh chocolate nhiều lớp thơm ngon', price: 55000, category: 'Tráng Miệng', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop', stock: 30 },
    ]);

    const [categories] = useState(['Cà Phê', 'Món Chính', 'Đồ Uống', 'Tráng Miệng']);

    // Cart State
    const [cart, setCart] = useState([]);

    // Admin Auth State - Lưu vào localStorage
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
        const saved = localStorage.getItem('isAdminAuth');
        return saved === 'true';
    });

    // Lưu admin auth vào localStorage khi thay đổi
    useEffect(() => {
        localStorage.setItem('isAdminAuth', isAdminAuthenticated);
    }, [isAdminAuthenticated]);

    // Blog State
    const [blogPosts] = useState([
        {
            id: 1,
            title: 'Bí quyết pha chế cà phê ngon',
            excerpt: 'Khám phá những bí mật đằng sau tách cà phê hoàn hảo...',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop',
            author: 'Admin',
            date: '15/09/2024',
            views: 245
        },
        {
            id: 2,
            title: 'Top 5 món tráng miệng tại Coffee Blend',
            excerpt: 'Những món tráng miệng không thể bỏ qua khi đến quán...',
            image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=400&fit=crop',
            author: 'Admin',
            date: '20/09/2024',
            views: 189
        }
    ]);

    // Cart Functions
    const addToCart = (product) => {
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

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart(prev =>
            prev.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    // Cart Calculations
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Product Functions
    const addProduct = (product) => {
        const newProduct = { ...product, id: Date.now() };
        setProducts(prev => [...prev, newProduct]);
    };

    const updateProduct = (id, updatedProduct) => {
        setProducts(prev =>
            prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p)
        );
    };

    const deleteProduct = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    // Order Functions
    const createOrder = (customerInfo) => {
        const newOrder = {
            id: `DH${Date.now()}`,
            items: [...cart],
            total: cartTotal,
            status: 'Chờ xử lý',
            date: new Date().toLocaleDateString('vi-VN'),
            time: new Date().toLocaleTimeString('vi-VN'),
            ...customerInfo
        };

        console.log('Đơn hàng mới:', newOrder);
        // Ở đây bạn có thể gọi API để lưu đơn hàng

        return newOrder;
    };

    const value = {
        // Products
        products,
        setProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        categories,

        // Cart
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,

        // Order
        createOrder,

        // Admin
        isAdminAuthenticated,
        setIsAdminAuthenticated,

        // Blog
        blogPosts
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}