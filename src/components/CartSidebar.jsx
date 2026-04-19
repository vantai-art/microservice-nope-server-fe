// src/components/CartSidebar.jsx
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

export default function CartSidebar({ onClose }) {
    const navigate = useNavigate()
    const { cart, cartTotal, removeFromCart, updateQuantity, clearCart, user } = useApp()

    // Prevent body scroll when open
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    const handleCheckout = () => {
        onClose()
        if (!user) { navigate('/auth'); return }
        navigate('/checkout')
    }

    return (
        <>
            {/* Backdrop */}
            <div onClick={onClose} style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)', zIndex: 1100,
                animation: 'fadeIn 0.2s ease',
            }} />

            {/* Drawer */}
            <div style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 420,
                background: '#0e0e0e', borderLeft: '1px solid rgba(212,168,83,0.15)',
                zIndex: 1101, display: 'flex', flexDirection: 'column',
                fontFamily: '"DM Sans", system-ui, sans-serif',
                animation: 'slideInRight 0.3s cubic-bezier(0.16,1,0.3,1)',
            }}>

                {/* Header */}
                <div style={{
                    padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10, background: 'rgba(212,168,83,0.15)',
                            border: '1px solid rgba(212,168,83,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="2" strokeLinecap="round">
                                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                        </div>
                        <div>
                            <div style={{ color: '#f5efe6', fontWeight: 700, fontSize: 16 }}>Giỏ Hàng</div>
                            <div style={{ color: 'rgba(245,239,230,0.4)', fontSize: 12 }}>{cart.length} sản phẩm</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {cart.length > 0 && (
                            <button onClick={clearCart} style={{
                                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                                color: '#e57373', borderRadius: 8, padding: '6px 12px', fontSize: 12,
                                cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)' }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)' }}
                            >Xóa tất cả</button>
                        )}
                        <button onClick={onClose} style={{
                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: 'rgba(245,239,230,0.7)', transition: 'all 0.2s',
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Items */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
                    {cart.length === 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, paddingBottom: 60 }}>
                            <div style={{
                                width: 80, height: 80, borderRadius: '50%', background: 'rgba(212,168,83,0.08)',
                                border: '1px solid rgba(212,168,83,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
                            }}>🛒</div>
                            <div style={{ color: '#f5efe6', fontSize: 16, fontWeight: 600 }}>Giỏ hàng trống</div>
                            <div style={{ color: 'rgba(245,239,230,0.4)', fontSize: 13, textAlign: 'center' }}>Hãy khám phá cửa hàng và thêm món bạn yêu thích!</div>
                            <button onClick={() => { onClose(); navigate('/shop') }} style={{
                                background: 'linear-gradient(135deg, #d4a853, #c49530)', color: '#0a0a0a',
                                border: 'none', borderRadius: 10, padding: '11px 24px',
                                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                            }}>Khám Phá Ngay</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {cart.map(item => (
                                <div key={item.id} style={{
                                    background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)',
                                    borderRadius: 14, padding: '14px', display: 'flex', gap: 14, alignItems: 'center',
                                    transition: 'border-color 0.2s',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,168,83,0.2)'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
                                >
                                    {/* Thumbnail */}
                                    <div style={{
                                        width: 64, height: 64, borderRadius: 10, overflow: 'hidden',
                                        background: '#2a2a2a', flexShrink: 0,
                                    }}>
                                        <img src={item.imageUrl || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=128&h=128&fit=crop'}
                                            alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=128&h=128&fit=crop' }}
                                        />
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ color: '#f5efe6', fontWeight: 600, fontSize: 14, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                                        <div style={{ color: '#d4a853', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
                                            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                        </div>
                                        {/* Qty control */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{
                                                width: 28, height: 28, borderRadius: 7, background: 'rgba(255,255,255,0.08)',
                                                border: '1px solid rgba(255,255,255,0.12)', color: '#f5efe6', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, lineHeight: 1,
                                                transition: 'all 0.15s',
                                            }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,168,83,0.2)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                            >−</button>
                                            <span style={{ color: '#f5efe6', fontWeight: 700, fontSize: 14, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{
                                                width: 28, height: 28, borderRadius: 7, background: 'rgba(255,255,255,0.08)',
                                                border: '1px solid rgba(255,255,255,0.12)', color: '#f5efe6', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, lineHeight: 1,
                                                transition: 'all 0.15s',
                                            }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,168,83,0.2)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                            >+</button>
                                        </div>
                                    </div>

                                    {/* Remove */}
                                    <button onClick={() => removeFromCart(item.id)} style={{
                                        background: 'none', border: 'none', color: 'rgba(245,239,230,0.3)',
                                        cursor: 'pointer', padding: 4, transition: 'color 0.2s', flexShrink: 0,
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#e57373'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,239,230,0.3)'}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div style={{
                        padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0,
                        background: 'linear-gradient(0deg, #0a0a0a 0%, transparent 100%)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <span style={{ color: 'rgba(245,239,230,0.6)', fontSize: 14 }}>Tổng cộng</span>
                            <span style={{ color: '#d4a853', fontWeight: 800, fontSize: 22 }}>
                                {cartTotal.toLocaleString('vi-VN')}đ
                            </span>
                        </div>
                        <button onClick={handleCheckout} style={{
                            width: '100%', background: 'linear-gradient(135deg, #d4a853, #c49530)',
                            color: '#0a0a0a', border: 'none', borderRadius: 12, padding: '14px',
                            fontSize: 15, fontWeight: 800, cursor: 'pointer', letterSpacing: '0.03em',
                            boxShadow: '0 4px 20px rgba(212,168,83,0.3)', transition: 'all 0.2s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(212,168,83,0.45)' }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(212,168,83,0.3)' }}
                        >Thanh Toán →</button>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideInRight { from { transform: translateX(100%) } to { transform: translateX(0) } }
      `}</style>
        </>
    )
}