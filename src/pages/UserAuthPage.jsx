// src/pages/UserAuthPage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { login as apiLogin, register as apiRegister } from '../services/api'

const Input = ({ label, type = 'text', value, onChange, placeholder, required, disabled, icon }) => {
    const [focused, setFocused] = useState(false)
    const [showPwd, setShowPwd] = useState(false)
    const isPwd = type === 'password'
    return (
        <div style={{ marginBottom: 16 }}>
            {label && <label style={{ display: 'block', color: 'rgba(245,239,230,0.6)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 7 }}>{label}</label>}
            <div style={{ position: 'relative' }}>
                {icon && <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, pointerEvents: 'none' }}>{icon}</span>}
                <input
                    type={isPwd && showPwd ? 'text' : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{
                        width: '100%', boxSizing: 'border-box',
                        padding: icon ? '12px 44px 12px 42px' : '12px 44px 12px 16px',
                        background: focused ? 'rgba(212,168,83,0.06)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${focused ? 'rgba(212,168,83,0.5)' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: 10, color: '#f5efe6', fontSize: 14, outline: 'none',
                        transition: 'all 0.2s', fontFamily: '"DM Sans", system-ui, sans-serif',
                    }}
                />
                {isPwd && (
                    <button type="button" onClick={() => setShowPwd(!showPwd)} style={{
                        position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', color: 'rgba(245,239,230,0.4)', cursor: 'pointer', fontSize: 15, padding: 0,
                    }}>{showPwd ? '🙈' : '👁️'}</button>
                )}
            </div>
        </div>
    )
}

export default function UserAuthPage() {
    const navigate = useNavigate()
    const { login } = useApp()
    const [mode, setMode] = useState('login') // 'login' | 'register'
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [loginData, setLoginData] = useState({ userName: '', userPassword: '' })
    const [regData, setRegData] = useState({
        userName: '', userPassword: '', confirmPassword: '',
        firstName: '', lastName: '', email: '', phoneNumber: ''
    })

    const handleLogin = async (e) => {
        e.preventDefault()
        setError(''); setSuccess(''); setLoading(true)
        try {
            const res = await apiLogin(loginData.userName, loginData.userPassword)
            const data = res.data
            if (!data?.id) throw new Error('Phản hồi không hợp lệ')
            login(data)
            setSuccess('Đăng nhập thành công!')
            setTimeout(() => {
                const role = data.role || ''
                if (role === 'ROLE_ADMIN') { navigate('/admin'); return }
                if (role === 'ROLE_STAFF') { navigate('/staff'); return }
                navigate('/')
            }, 700)
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Sai tên đăng nhập hoặc mật khẩu')
        } finally { setLoading(false) }
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setError(''); setSuccess('')
        if (!regData.userName.trim()) return setError('Vui lòng nhập tên đăng nhập')
        if (regData.userPassword.length < 4) return setError('Mật khẩu ít nhất 4 ký tự')
        if (regData.userPassword !== regData.confirmPassword) return setError('Mật khẩu không khớp')
        if (!regData.email.trim()) return setError('Vui lòng nhập email')
        if (!regData.firstName.trim() || !regData.lastName.trim()) return setError('Vui lòng nhập đầy đủ họ tên')
        setLoading(true)
        try {
            await apiRegister({
                userName: regData.userName, userPassword: regData.userPassword, active: 1,
                userDetails: { firstName: regData.firstName, lastName: regData.lastName, email: regData.email, phoneNumber: regData.phoneNumber },
            })
            setSuccess('Đăng ký thành công! Đang chuyển sang đăng nhập...')
            const savedName = regData.userName
            setRegData({ userName: '', userPassword: '', confirmPassword: '', firstName: '', lastName: '', email: '', phoneNumber: '' })
            setTimeout(() => { setMode('login'); setLoginData({ userName: savedName, userPassword: '' }); setSuccess('') }, 1500)
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Đăng ký thất bại')
        } finally { setLoading(false) }
    }

    return (
        <div style={{
            minHeight: '100vh', background: '#080808',
            display: 'flex', fontFamily: '"DM Sans", system-ui, sans-serif',
        }}>
            {/* Left panel - branding */}
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: 60, background: 'linear-gradient(160deg, #0e0a04 0%, #1a1105 50%, #0e0a04 100%)',
                borderRight: '1px solid rgba(212,168,83,0.1)', position: 'relative', overflow: 'hidden',
            }} className="auth-left-panel">
                {/* Ambient glow */}
                <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 400, height: 400, background: 'radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', textAlign: 'center', maxWidth: 380 }}>
                    {/* Logo mark */}
                    <div style={{
                        width: 88, height: 88, borderRadius: 24, margin: '0 auto 28px',
                        background: 'linear-gradient(135deg, #d4a853 0%, #8b6914 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 42, boxShadow: '0 0 60px rgba(212,168,83,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
                    }}>☕</div>

                    <h1 style={{ color: '#f5efe6', fontWeight: 900, fontSize: 36, margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                        COFFEE<br />
                        <span style={{ color: '#d4a853' }}>BLEND</span>
                    </h1>
                    <p style={{ color: 'rgba(245,239,230,0.45)', fontSize: 15, lineHeight: 1.7, margin: '16px 0 40px' }}>
                        Nơi mỗi tách cà phê là<br />một trải nghiệm khó quên
                    </p>

                    {/* Feature pills */}
                    {['☕ Cà phê nguyên chất', '⚡ Đặt hàng nhanh chóng', '🎁 Ưu đãi thành viên'].map((feat, i) => (
                        <div key={i} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            background: 'rgba(212,168,83,0.08)', border: '1px solid rgba(212,168,83,0.15)',
                            borderRadius: 999, padding: '7px 16px', margin: '4px',
                            color: 'rgba(245,239,230,0.7)', fontSize: 13,
                        }}>{feat}</div>
                    ))}
                </div>
            </div>

            {/* Right panel - form */}
            <div style={{
                width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column',
                justifyContent: 'center', padding: '40px 48px', overflowY: 'auto',
            }} className="auth-right-panel">

                {/* Back to home */}
                <button onClick={() => navigate('/')} style={{
                    background: 'none', border: 'none', color: 'rgba(245,239,230,0.4)',
                    fontSize: 13, cursor: 'pointer', padding: 0, marginBottom: 32,
                    display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s', alignSelf: 'flex-start',
                }}
                    onMouseEnter={e => e.currentTarget.style.color = '#d4a853'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,239,230,0.4)'}
                >← Về trang chủ</button>

                {/* Tab switcher */}
                <div style={{
                    display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 12,
                    padding: 4, marginBottom: 32, border: '1px solid rgba(255,255,255,0.08)',
                }}>
                    {[{ id: 'login', label: 'Đăng Nhập' }, { id: 'register', label: 'Đăng Ký' }].map(tab => (
                        <button key={tab.id} onClick={() => { setMode(tab.id); setError(''); setSuccess('') }} style={{
                            flex: 1, padding: '10px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 14,
                            fontWeight: 600, transition: 'all 0.25s', fontFamily: '"DM Sans", system-ui, sans-serif',
                            background: mode === tab.id ? 'linear-gradient(135deg, #d4a853, #c49530)' : 'transparent',
                            color: mode === tab.id ? '#0a0a0a' : 'rgba(245,239,230,0.5)',
                            boxShadow: mode === tab.id ? '0 2px 12px rgba(212,168,83,0.25)' : 'none',
                        }}>{tab.label}</button>
                    ))}
                </div>

                {/* Title */}
                <div style={{ marginBottom: 28 }}>
                    <h2 style={{ color: '#f5efe6', fontWeight: 800, fontSize: 24, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
                        {mode === 'login' ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}
                    </h2>
                    <p style={{ color: 'rgba(245,239,230,0.4)', fontSize: 14, margin: 0 }}>
                        {mode === 'login' ? 'Đăng nhập để đặt hàng và theo dõi đơn hàng' : 'Tham gia cộng đồng Coffee Blend'}
                    </p>
                </div>

                {/* Alerts */}
                {error && (
                    <div style={{
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                        <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
                        <span style={{ color: '#fca5a5', fontSize: 13 }}>{error}</span>
                    </div>
                )}
                {success && (
                    <div style={{
                        background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                        borderRadius: 10, padding: '12px 16px', marginBottom: 20,
                    }}>
                        <span style={{ color: '#86efac', fontSize: 13 }}>✅ {success}</span>
                    </div>
                )}

                {/* LOGIN FORM */}
                {mode === 'login' ? (
                    <form onSubmit={handleLogin}>
                        <Input label="Tên đăng nhập" value={loginData.userName} icon="👤"
                            onChange={e => setLoginData({ ...loginData, userName: e.target.value })}
                            placeholder="Nhập tên đăng nhập" required disabled={loading} />
                        <Input label="Mật khẩu" type="password" value={loginData.userPassword} icon="🔒"
                            onChange={e => setLoginData({ ...loginData, userPassword: e.target.value })}
                            placeholder="Nhập mật khẩu" required disabled={loading} />
                        <button type="submit" disabled={loading} style={{
                            width: '100%', background: loading ? 'rgba(212,168,83,0.4)' : 'linear-gradient(135deg, #d4a853, #c49530)',
                            color: '#0a0a0a', border: 'none', borderRadius: 12, padding: '14px',
                            fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
                            boxShadow: loading ? 'none' : '0 4px 20px rgba(212,168,83,0.3)', transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8,
                            fontFamily: '"DM Sans", system-ui, sans-serif',
                        }}>
                            {loading ? <><span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid rgba(10,10,10,0.3)', borderTopColor: '#0a0a0a', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Đang đăng nhập...</> : 'Đăng Nhập →'}
                        </button>
                    </form>
                ) : (
                    /* REGISTER FORM */
                    <form onSubmit={handleRegister}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <Input label="Họ *" value={regData.firstName} icon="👤"
                                onChange={e => setRegData({ ...regData, firstName: e.target.value })}
                                placeholder="Nguyễn" required disabled={loading} />
                            <Input label="Tên *" value={regData.lastName}
                                onChange={e => setRegData({ ...regData, lastName: e.target.value })}
                                placeholder="Văn A" required disabled={loading} />
                        </div>
                        <Input label="Tên đăng nhập *" value={regData.userName} icon="🏷️"
                            onChange={e => setRegData({ ...regData, userName: e.target.value })}
                            placeholder="username (duy nhất)" required disabled={loading} />
                        <Input label="Email *" type="email" value={regData.email} icon="📧"
                            onChange={e => setRegData({ ...regData, email: e.target.value })}
                            placeholder="email@example.com" required disabled={loading} />
                        <Input label="Số điện thoại" type="tel" value={regData.phoneNumber} icon="📱"
                            onChange={e => setRegData({ ...regData, phoneNumber: e.target.value })}
                            placeholder="0912345678" disabled={loading} />
                        <Input label="Mật khẩu *" type="password" value={regData.userPassword} icon="🔒"
                            onChange={e => setRegData({ ...regData, userPassword: e.target.value })}
                            placeholder="Ít nhất 4 ký tự" required disabled={loading} />
                        <Input label="Xác nhận mật khẩu *" type="password" value={regData.confirmPassword} icon="🔏"
                            onChange={e => setRegData({ ...regData, confirmPassword: e.target.value })}
                            placeholder="Nhập lại mật khẩu" required disabled={loading} />
                        <button type="submit" disabled={loading} style={{
                            width: '100%', background: loading ? 'rgba(212,168,83,0.4)' : 'linear-gradient(135deg, #d4a853, #c49530)',
                            color: '#0a0a0a', border: 'none', borderRadius: 12, padding: '14px',
                            fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
                            boxShadow: loading ? 'none' : '0 4px 20px rgba(212,168,83,0.3)', transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            fontFamily: '"DM Sans", system-ui, sans-serif',
                        }}>
                            {loading ? <><span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid rgba(10,10,10,0.3)', borderTopColor: '#0a0a0a', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Đang đăng ký...</> : 'Tạo Tài Khoản →'}
                        </button>
                    </form>
                )}
            </div>

            <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @media (max-width: 768px) {
          .auth-left-panel { display: none !important; }
          .auth-right-panel { max-width: 100% !important; padding: 32px 24px !important; }
        }
      `}</style>
        </div>
    )
}