// src/pages/UserOrdersPage.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

const STATUS = {
    PAYMENT_EXPECTED: { label: 'Chờ thanh toán', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: '⏳' },
    PAID: { label: 'Đã thanh toán', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', icon: '💳' },
    SHIPPING: { label: 'Đang giao hàng', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', icon: '🚚' },
    DELIVERED: { label: 'Đã giao thành công', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', icon: '✅' },
    CANCELLED: { label: 'Đã hủy', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', icon: '❌' },
}

export default function UserOrdersPage() {
    const navigate = useNavigate()
    const { user, axiosInstance } = useApp()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState('ALL')

    const loadOrders = useCallback(async () => {
        if (!user) { navigate('/auth'); return }
        setLoading(true); setError(null)
        try {
            const res = await axiosInstance.get(`/order/user/${user.id}`)
            const data = res.data
            setOrders(Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []))
        } catch (err) {
            if (err.response?.status === 404) setOrders([])
            else setError('Không thể tải đơn hàng. Vui lòng thử lại.')
        } finally { setLoading(false) }
    }, [user, navigate, axiosInstance])

    useEffect(() => { loadOrders() }, [loadOrders])

    const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter)
    const fmt = (n) => Number(n || 0).toLocaleString('vi-VN')
    const fmtDate = (d) => {
        if (!d) return ''
        try { return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) }
        catch { return d }
    }

    return (
        <div style={{
            minHeight: '100vh', background: '#080808', paddingTop: 88,
            fontFamily: '"DM Sans", system-ui, sans-serif', color: '#f5efe6',
        }}>
            <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>

                {/* Header */}
                <div style={{ marginBottom: 32, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <button onClick={() => navigate('/')} style={{
                            background: 'none', border: 'none', color: 'rgba(245,239,230,0.4)',
                            fontSize: 13, cursor: 'pointer', padding: 0, marginBottom: 10,
                            display: 'flex', alignItems: 'center', gap: 6,
                        }}
                            onMouseEnter={e => e.currentTarget.style.color = '#d4a853'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,239,230,0.4)'}
                        >← Về trang chủ</button>
                        <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>Đơn hàng của tôi</h1>
                        <p style={{ color: 'rgba(245,239,230,0.4)', fontSize: 14, margin: 0 }}>
                            Xin chào, <span style={{ color: '#d4a853', fontWeight: 600 }}>{user?.userName}</span> · {orders.length} đơn hàng
                        </p>
                    </div>
                    <button onClick={loadOrders} disabled={loading} style={{
                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 10, padding: '10px 16px', color: 'rgba(245,239,230,0.7)',
                        fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                        transition: 'all 0.2s', fontFamily: '"DM Sans", system-ui, sans-serif',
                    }}>
                        <span style={{ display: 'inline-block', animation: loading ? 'spin 0.7s linear infinite' : 'none' }}>🔄</span>
                        Làm mới
                    </button>
                </div>

                {/* Filter tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                    {[{ id: 'ALL', label: `Tất cả (${orders.length})` }, ...Object.entries(STATUS).map(([id, s]) => ({
                        id, label: `${s.icon} ${s.label} (${orders.filter(o => o.status === id).length})`
                    }))].map(tab => (
                        <button key={tab.id} onClick={() => setFilter(tab.id)} style={{
                            padding: '8px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                            border: `1px solid ${filter === tab.id ? 'rgba(212,168,83,0.5)' : 'rgba(255,255,255,0.1)'}`,
                            background: filter === tab.id ? 'rgba(212,168,83,0.15)' : 'rgba(255,255,255,0.04)',
                            color: filter === tab.id ? '#d4a853' : 'rgba(245,239,230,0.5)',
                            cursor: 'pointer', transition: 'all 0.2s',
                            fontFamily: '"DM Sans", system-ui, sans-serif',
                        }}>{tab.label}</button>
                    ))}
                </div>

                {/* Loading */}
                {loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '80px 0' }}>
                        <div style={{ width: 44, height: 44, border: '3px solid rgba(212,168,83,0.2)', borderTopColor: '#d4a853', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                        <p style={{ color: 'rgba(245,239,230,0.4)', fontSize: 14 }}>Đang tải đơn hàng...</p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div style={{
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                        borderRadius: 14, padding: '24px', textAlign: 'center',
                    }}>
                        <p style={{ color: '#fca5a5', marginBottom: 16 }}>{error}</p>
                        <button onClick={loadOrders} style={{
                            background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)',
                            color: '#fca5a5', borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontSize: 13,
                            fontFamily: '"DM Sans", system-ui, sans-serif',
                        }}>Thử lại</button>
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && filtered.length === 0 && (
                    <div style={{
                        background: '#111', border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 16, padding: '64px 32px', textAlign: 'center',
                    }}>
                        <div style={{ fontSize: 52, marginBottom: 16 }}>📦</div>
                        <h3 style={{ color: '#f5efe6', fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>
                            {filter === 'ALL' ? 'Chưa có đơn hàng nào' : 'Không có đơn ở trạng thái này'}
                        </h3>
                        <p style={{ color: 'rgba(245,239,230,0.4)', fontSize: 14, margin: '0 0 24px' }}>
                            {filter === 'ALL' ? 'Hãy khám phá cửa hàng và đặt món bạn yêu thích!' : 'Thử chọn bộ lọc khác'}
                        </p>
                        <button onClick={() => navigate('/shop')} style={{
                            background: 'linear-gradient(135deg, #d4a853, #c49530)', color: '#0a0a0a',
                            border: 'none', borderRadius: 10, padding: '11px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                            fontFamily: '"DM Sans", system-ui, sans-serif',
                        }}>Đến Cửa Hàng →</button>
                    </div>
                )}

                {/* Orders list */}
                {!loading && !error && filtered.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {[...filtered].sort((a, b) => b.id - a.id).map(order => {
                            const si = STATUS[order.status] || { label: order.status, color: '#9ca3af', bg: 'rgba(156,163,175,0.1)', icon: '❓' }
                            return (
                                <div key={order.id} style={{
                                    background: '#111', border: '1px solid rgba(255,255,255,0.07)',
                                    borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = `${si.color}40`}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
                                >
                                    {/* Top bar */}
                                    <div style={{
                                        padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
                                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                            <div style={{
                                                width: 40, height: 40, borderRadius: 10, background: si.bg,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0,
                                            }}>{si.icon}</div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: 15 }}>Đơn hàng <span style={{ color: '#d4a853' }}>#{order.id}</span></div>
                                                <div style={{ color: 'rgba(245,239,230,0.4)', fontSize: 12, marginTop: 2 }}>
                                                    {fmtDate(order.orderedDate)} · {order.user?.userName || user?.userName || 'Khách'}
                                                </div>
                                            </div>
                                        </div>
                                        <span style={{
                                            padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                                            background: si.bg, color: si.color, border: `1px solid ${si.color}40`,
                                        }}>{si.label}</span>
                                    </div>

                                    {/* Items summary */}
                                    {order.items && order.items.length > 0 && (
                                        <div style={{ padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                                {order.items.map((item, idx) => (
                                                    <span key={idx} style={{
                                                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                                        borderRadius: 8, padding: '5px 12px', fontSize: 12, color: 'rgba(245,239,230,0.7)',
                                                    }}>
                                                        {item.product?.productName || item.product?.name || 'Sản phẩm'} × {item.quantity}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                                        <div style={{ display: 'flex', gap: 24 }}>
                                            <div>
                                                <div style={{ color: 'rgba(245,239,230,0.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Tổng tiền</div>
                                                <div style={{ color: '#d4a853', fontWeight: 800, fontSize: 18 }}>{fmt(order.total)}đ</div>
                                            </div>
                                            {order.items && (
                                                <div>
                                                    <div style={{ color: 'rgba(245,239,230,0.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Số món</div>
                                                    <div style={{ fontWeight: 700, fontSize: 16 }}>{order.items.length}</div>
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: 10 }}>
                                            {order.status === 'PAYMENT_EXPECTED' && (
                                                <button onClick={() => navigate(`/checkout`)} style={{
                                                    background: 'linear-gradient(135deg, #d4a853, #c49530)', color: '#0a0a0a',
                                                    border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                                    fontFamily: '"DM Sans", system-ui, sans-serif',
                                                }}>Thanh toán ngay</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
    )
}