// pages/admin/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, User, Lock } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

function AdminLogin() {
    const navigate = useNavigate();
    const { setIsAdminAuthenticated } = useAppContext();
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simple authentication (trong thực tế nên dùng API)
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
            setIsAdminAuthenticated(true);
            localStorage.setItem('isAdminAuth', 'true'); // Lưu vào localStorage
            navigate('/admin');
            setError('');
        } else {
            setError('Sai tên đăng nhập hoặc mật khẩu!');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <Coffee className="w-12 h-12 text-amber-500" />
                        <div className="text-white">
                            <div className="text-3xl font-bold">COFFEE BLEND</div>
                            <div className="text-xs tracking-widest">ADMIN PANEL</div>
                        </div>
                    </div>
                    <p className="text-gray-400">Đăng nhập vào hệ thống quản trị</p>
                </div>

                {/* Login Form */}
                <div className="bg-gray-800 rounded-lg shadow-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-white mb-2 font-medium">
                                Tên Đăng Nhập
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={credentials.username}
                                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                    className="w-full bg-gray-700 text-white pl-12 pr-4 py-3 rounded border border-gray-600 focus:border-amber-500 outline-none"
                                    placeholder="Nhập tên đăng nhập"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-white mb-2 font-medium">
                                Mật Khẩu
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    className="w-full bg-gray-700 text-white pl-12 pr-4 py-3 rounded border border-gray-600 focus:border-amber-500 outline-none"
                                    placeholder="Nhập mật khẩu"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded font-semibold transition-colors"
                        >
                            Đăng Nhập
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            Demo: username: <span className="text-amber-500">admin</span> / password: <span className="text-amber-500">admin123</span>
                        </p>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        ← Quay lại trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
