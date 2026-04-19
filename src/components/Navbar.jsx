// src/components/Navbar.jsx
import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

export default function Navbar() {
    const { user, logout, isAdmin, isStaff, cartCount } = useApp()
    const nav = useNavigate()
    const loc = useLocation()
    const [open, setOpen] = useState(false)

    const go = (path) => { nav(path); setOpen(false) }

    const isActive = (path) => loc.pathname === path

    const handleLogout = () => {
        logout()
        nav('/login')
        setOpen(false)
    }

    return (
        <nav style={{
            position: 'sticky', top: 0, zIndex: 100,
            background: 'rgba(10,10,10,0.92)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid #1a1a1a',
            padding: '0 24px',
        }}>
            <div style={{
                maxWidth: 1200, margin: '0 auto',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                height: 60,
            }}>
                {/* Logo */}
                <button onClick={() => go('/')} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8,
                }}>
                    <span style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: 20, fontWeight: 700, color: '#d4a853',
                        letterSpacing: '-0.02em',
                    }}>🌈 Rainbow</span>
                    <span style={{
                        fontFamily: 'DM Mono, monospace',
                        fontSize: 11, color: '#5a5550', letterSpacing: '0.1em', textTransform: 'uppercase',
                    }}>Forest</span>
                </button>

                {/* Nav links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {[
                        { label: 'Sản phẩm', path: '/products' },
                        ...(isAdmin ? [{ label: 'Admin', path: '/admin' }] : []),
                        ...(isStaff ? [{ label: 'Nhân viên', path: '/staff' }] : []),
                    ].map(({ label, path }) => (
                        <button key={path} onClick={() => go(path)} style={{
                            background: isActive(path) ? 'rgba(212,168,83,0.1)' : 'none',
                            border: 'none', color: isActive(path) ? '#d4a853' : '#8a8580',
                            padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
                            fontSize: 14, fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
                            transition: 'all 0.2s',
                        }}
                            onMouseEnter={e => { if (!isActive(path)) e.currentTarget.style.color = '#f0ede6' }}
                            onMouseLeave={e => { if (!isActive(path)) e.currentTarget.style.color = '#8a8580' }}
                        >{label}</button>
                    ))}

                    {/* Cart */}
                    {user && !isAdmin && !isStaff && (
                        <button onClick={() => go('/cart')} style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            position: 'relative', padding: '6px 10px',
                            color: isActive('/cart') ? '#d4a853' : '#8a8580',
                            fontSize: 18, transition: 'color 0.2s',
                        }}>
                            🛒
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute', top: 2, right: 4,
                                    background: '#d4a853', color: '#0a0a0a',
                                    borderRadius: '50%', width: 16, height: 16,
                                    fontSize: 10, fontWeight: 700,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>{cartCount}</span>
                            )}
                        </button>
                    )}

                    {/* Orders */}
                    {user && !isAdmin && !isStaff && (
                        <button onClick={() => go('/orders')} style={{
                            background: 'none', border: 'none',
                            color: isActive('/orders') ? '#d4a853' : '#8a8580',
                            padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
                            fontSize: 14, fontFamily: 'DM Sans, sans-serif',
                            transition: 'color 0.2s',
                        }}>Đơn hàng</button>
                    )}

                    {/* Auth */}
                    {user ? (
                        <div style={{ position: 'relative' }}>
                            <button onClick={() => setOpen(!open)} style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                background: '#1a1a1a', border: '1px solid #2a2a2a',
                                borderRadius: 20, padding: '6px 14px 6px 8px',
                                cursor: 'pointer', color: '#f0ede6', fontSize: 13,
                                fontFamily: 'DM Sans, sans-serif',
                            }}>
                                <div style={{
                                    width: 26, height: 26, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #d4a853, #3d8b5e)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 11, fontWeight: 700, color: '#0a0a0a',
                                }}>
                                    {(user.userName || user.username || 'U')[0].toUpperCase()}
                                </div>
                                {user.userName || user.username}
                            </button>
                            {open && (
                                <div style={{
                                    position: 'absolute', right: 0, top: '110%',
                                    background: '#1a1a1a', border: '1px solid #2a2a2a',
                                    borderRadius: 10, overflow: 'hidden', minWidth: 160,
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                                }}>
                                    <div style={{ padding: '8px 0' }}>
                                        <button onClick={() => go('/profile')} style={menuItemStyle}>Hồ sơ</button>
                                        <button onClick={handleLogout} style={{ ...menuItemStyle, color: '#c0392b' }}>Đăng xuất</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button onClick={() => go('/login')} className="btn btn-primary" style={{ padding: '7px 16px', fontSize: 13 }}>
                            Đăng nhập
                        </button>
                    )}
                </div>
            </div>
        </nav>
    )
}

const menuItemStyle = {
    display: 'block', width: '100%', padding: '9px 16px',
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#8a8580', fontSize: 13, fontFamily: 'DM Sans, sans-serif',
    textAlign: 'left', transition: 'all 0.15s',
}