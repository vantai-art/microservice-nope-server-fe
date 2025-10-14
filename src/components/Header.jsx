// components/Header.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu as MenuIcon, Coffee, X } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import CartSidebar from './CartSidebar';

function Header() {
    const { cartCount } = useAppContext();
    const [showCart, setShowCart] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { path: '/', label: 'TRANG CHỦ' },
        { path: '/menu', label: 'THỰC ĐƠN' },
        { path: '/services', label: 'DỊCH VỤ' },
        { path: '/blog', label: 'TIN TỨC' },
        { path: '/about', label: 'GIỚI THIỆU' },
        { path: '/shop', label: 'CỬA HÀNG' },
        { path: '/contact', label: 'LIÊN HỆ' }
    ];

    const handleNavClick = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    return (
        <>
            <header className="bg-black/90 backdrop-blur-sm text-white fixed w-full top-0 z-50 shadow-lg">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div onClick={() => handleNavClick('/')} className="flex items-center space-x-2 cursor-pointer">
                            <Coffee className="w-8 h-8 text-amber-500" />
                            <div>
                                <div className="text-2xl font-bold">COFFEE</div>
                                <div className="text-xs tracking-widest">BLEND</div>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex space-x-6 text-sm font-medium">
                            {navItems.map(item => (
                                <button
                                    key={item.path}
                                    onClick={() => handleNavClick(item.path)}
                                    className={`hover:text-amber-400 transition-colors ${location.pathname === item.path ? 'text-amber-400' : ''
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => handleNavClick('/admin/login')}
                                className="hidden lg:block text-sm hover:text-amber-400 transition-colors"
                            >
                                ADMIN
                            </button>

                            <button
                                onClick={() => setShowCart(true)}
                                className="relative hover:text-amber-400 transition-colors"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-black/95 border-t border-gray-800">
                        <nav className="container mx-auto px-4 py-4 flex flex-col space-y-3">
                            {navItems.map(item => (
                                <button
                                    key={item.path}
                                    onClick={() => handleNavClick(item.path)}
                                    className={`text-left py-2 hover:text-amber-400 transition-colors ${location.pathname === item.path ? 'text-amber-400' : ''
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                            <button
                                onClick={() => handleNavClick('/admin/login')}
                                className="text-left py-2 hover:text-amber-400 transition-colors"
                            >
                                ADMIN
                            </button>
                        </nav>
                    </div>
                )}
            </header>

            {showCart && <CartSidebar onClose={() => setShowCart(false)} />}
        </>
    );
}

export default Header;