// src/pages/staff/StaffLoginPage.jsx
// Trang login riêng cho Staff
// FIX: file cũ bị nhầm nội dung (chứa code StaffPage POS)
//      login() lưu vào localStorage['staff_user'] — không đụng customer/admin

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User, Coffee, AlertCircle, ChevronLeft } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import { login as apiLogin } from '../../services/api'

export default function StaffLoginPage() {
    const navigate  = useNavigate()
    const { login } = useApp()

    const [formData, setFormData] = useState({ userName: '', userPassword: '' })
    const [error,    setError]    = useState('')
    const [loading,  setLoading]  = useState(false)
    const [showPwd,  setShowPwd]  = useState(false)

    const handleChange = (field) => (e) =>
        setFormData(prev => ({ ...prev, [field]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res  = await apiLogin(formData.userName, formData.userPassword)
            const data = res.data

            if (!data || !data.id) throw new Error('Phản hồi không hợp lệ từ server')

            const role = data.role || ''
            if (role !== 'ROLE_STAFF' && role !== 'ROLE_ADMIN') {
                throw new Error('Tài khoản này không có quyền Staff!')
            }

            // login() nhận ROLE_STAFF → lưu vào localStorage['staff_user']
            // Không ảnh hưởng admin_user hay customer_user
            login(data)
            navigate('/staff', { replace: true })

        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Đăng nhập thất bại'
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: '"DM Sans", system-ui, sans-serif', padding: 16,
        }}>
            <div style={{ width: '100%', maxWidth: 420 }}>

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 72, height: 72, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                        marginBottom: 16, boxShadow: '0 8px 32px rgba(14,165,233,0.35)',
                    }}>
                        <Coffee size={32} color="#fff" />
                    </div>
                    <h1 style={{ color: '#f1f5f9', fontSize: 26, fontWeight: 700, margin: '0 0 6px' }}>
                        Staff Portal
                    </h1>
                    <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
                        Đăng nhập vào hệ thống nhân viên
                    </p>
                </div>

                {/* Card */}
                <div style={{
                    background: '#1e293b', border: '1px solid #334155',
                    borderRadius: 16, padding: 32,
                    boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
                }}>

                    {/* Error */}
                    {error && (
                        <div style={{
                            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)',
                            borderRadius: 10, padding: '12px 16px', marginBottom: 20,
                            display: 'flex', alignItems: 'center', gap: 10, color: '#fca5a5',
                        }}>
                            <AlertCircle size={18} style={{ flexShrink: 0 }} />
                            <span style={{ fontSize: 14 }}>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Username */}
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                                Tên đăng nhập
                            </label>
                            <div style={{ position: 'relative' }}>
                                <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                                <input
                                    type="text"
                                    value={formData.userName}
                                    onChange={handleChange('userName')}
                                    placeholder="Nhập tên đăng nhập"
                                    required
                                    style={{
                                        width: '100%', boxSizing: 'border-box',
                                        padding: '12px 14px 12px 42px',
                                        background: '#0f172a', border: '1px solid #334155',
                                        borderRadius: 10, color: '#f1f5f9', fontSize: 14,
                                        outline: 'none', transition: 'border-color 0.2s',
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#0ea5e9'}
                                    onBlur={e  => e.target.style.borderColor = '#334155'}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: 28 }}>
                            <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                                Mật khẩu
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                                <input
                                    type={showPwd ? 'text' : 'password'}
                                    value={formData.userPassword}
                                    onChange={handleChange('userPassword')}
                                    placeholder="Nhập mật khẩu"
                                    required
                                    style={{
                                        width: '100%', boxSizing: 'border-box',
                                        padding: '12px 44px 12px 42px',
                                        background: '#0f172a', border: '1px solid #334155',
                                        borderRadius: 10, color: '#f1f5f9', fontSize: 14,
                                        outline: 'none', transition: 'border-color 0.2s',
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#0ea5e9'}
                                    onBlur={e  => e.target.style.borderColor = '#334155'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(v => !v)}
                                    style={{
                                        position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', color: '#475569',
                                        cursor: 'pointer', fontSize: 16, padding: 0,
                                    }}
                                >{showPwd ? '🙈' : '👁️'}</button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '13px',
                                background: loading ? '#334155' : 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                                border: 'none', borderRadius: 10, color: '#fff',
                                fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                transition: 'opacity 0.2s',
                                boxShadow: loading ? 'none' : '0 4px 16px rgba(14,165,233,0.35)',
                            }}
                        >
                            {loading ? (
                                <>
                                    <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                                    Đang đăng nhập...
                                </>
                            ) : 'Đăng nhập'}
                        </button>
                    </form>
                </div>

                {/* Back link */}
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'none', border: 'none', color: '#475569',
                            cursor: 'pointer', fontSize: 14, display: 'inline-flex',
                            alignItems: 'center', gap: 6, transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#0ea5e9'}
                        onMouseLeave={e => e.currentTarget.style.color = '#475569'}
                    >
                        <ChevronLeft size={16} /> Quay về trang chủ
                    </button>
                </div>
            </div>

            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    )
}
