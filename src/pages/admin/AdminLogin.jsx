// src/pages/admin/AdminLogin.jsx  ← ĐÃ SỬA
// Lỗi cũ:
//  1. Gọi /api/auth/login — KHÔNG TỒN TẠI trong BE
//     BE thực tế: POST /login với body { userName, userPassword }
//  2. Expect token JWT — BE KHÔNG trả JWT, trả về object user trực tiếp
//  3. Check role === "ADMIN" — BE trả "ROLE_ADMIN"

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User, Coffee, AlertCircle } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import { login as apiLogin } from '../../services/api'

function AdminLogin() {
    const navigate = useNavigate()
    const { login } = useApp()
    const [formData, setFormData] = useState({ userName: '', userPassword: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // POST /login → { id, userName, role, userDetails, active }
            const res = await apiLogin(formData.userName, formData.userPassword)
            const data = res.data

            if (!data || !data.id) throw new Error('Phản hồi không hợp lệ từ server')

            // BE trả role là "ROLE_ADMIN"
            const role = data.role || ''
            if (role !== 'ROLE_ADMIN') {
                throw new Error('Tài khoản này không có quyền Admin!')
            }

            // Lưu vào context (context tự lưu localStorage['user'])
            login(data)

            navigate('/admin', { replace: true })

        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Đăng nhập thất bại'
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-600 rounded-full mb-4">
                        <Coffee className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
                    <p className="text-gray-400">Đăng nhập vào hệ thống quản trị</p>
                </div>

                <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 p-8">
                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-white block mb-2 font-medium">Tên đăng nhập</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.userName}
                                    onChange={e => setFormData({ ...formData, userName: e.target.value })}
                                    className="w-full bg-gray-700 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:border-amber-500 outline-none"
                                    placeholder="Nhập tên đăng nhập"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-white block mb-2 font-medium">Mật khẩu</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={formData.userPassword}
                                    onChange={e => setFormData({ ...formData, userPassword: e.target.value })}
                                    className="w-full bg-gray-700 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:border-amber-500 outline-none"
                                    placeholder="Nhập mật khẩu"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                            {loading
                                ? <><div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white" /><span>Đang đăng nhập...</span></>
                                : 'Đăng nhập'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button onClick={() => navigate('/')}
                            className="text-gray-400 hover:text-amber-500 transition-colors">
                            ← Quay về trang chủ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin