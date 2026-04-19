// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

export default function CheckoutPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { cart, cartTotal, updateQuantity, removeFromCart, clearCart, createOrder, user, axiosInstance } = useApp()

    const [loading, setLoading] = useState(false)
    const [vnpayLoading, setVnpayLoading] = useState(false)
    const [done, setDone] = useState(null)
    const [note, setNote] = useState('')
    const [error, setError] = useState('')

    // ── Xử lý redirect từ VNPay về ─────────────────────────────────
    useEffect(() => {
        const vnpayResult = searchParams.get('vnpay')
        const txnRef = searchParams.get('txnRef')
        const errorCode = searchParams.get('error')
        const code = searchParams.get('code')

        if (vnpayResult === 'success') {
            setDone({ vnpay: true, transactionRef: txnRef })
        } else if (vnpayResult === 'failed') {
            const msg = code === '24'
                ? 'Bạn đã hủy giao dịch VNPay.'
                : `Thanh toán VNPay thất bại (mã lỗi: ${code})`
            setError(msg)
        } else if (errorCode) {
            setError('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.')
        }
    }, [searchParams])

    // ── Đặt hàng COD (giữ nguyên) ──────────────────────────────────
    const handleOrderCOD = async () => {
        if (cart.length === 0) return
        setError(''); setLoading(true)
        try {
            const order = await createOrder()
            setDone(order)
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Đặt hàng thất bại')
        } finally { setLoading(false) }
    }

    // ── Thanh toán VNPay ───────────────────────────────────────────
    const handleVNPay = async () => {
        if (cart.length === 0 || !user) return
        setError(''); setVnpayLoading(true)
        try {
            // 1. Đặt hàng trước để có orderId
            const order = await createOrder()

            // 2. Tạo URL VNPay từ payment-service
            const res = await axiosInstance.post('/api/payments/vnpay/create', {
                orderId: order.id,
                userId: user.id,
                amount: Number(order.total),
            })

            const { paymentUrl } = res.data?.data || res.data
            if (!paymentUrl) throw new Error('Không nhận được URL thanh toán')

            // 3. Redirect sang VNPay
            window.location.href = paymentUrl

        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Không thể tạo thanh toán VNPay')
            setVnpayLoading(false)
        }
    }

    // ── Success state (COD) ────────────────────────────────────────
    if (done && !done.vnpay) return (
        <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
            <div style={{ background: '#121212', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20, padding: '52px 48px', maxWidth: 460, width: '100%', textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>✅</div>
                <h2 style={{ color: '#f5efe6', fontSize: 24, fontWeight: 800, margin: '0 0 8px' }}>Đặt hàng thành công!</h2>
                <p style={{ color: 'rgba(245,239,230,0.5)', fontSize: 14, margin: '0 0 8px' }}>Thanh toán khi nhận hàng (COD)</p>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 20px', marginBottom: 28, textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ color: 'rgba(245,239,230,0.5)', fontSize: 13 }}>Mã đơn hàng</span>
                        <span style={{ color: '#d4a853', fontWeight: 700, fontSize: 13 }}>#{done.id}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'rgba(245,239,230,0.5)', fontSize: 13 }}>Tổng tiền</span>
                        <span style={{ color: '#f5efe6', fontWeight: 700, fontSize: 13 }}>{Number(done.total || 0).toLocaleString('vi-VN')}đ</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => navigate('/my-orders')} style={{ flex: 1, background: 'linear-gradient(135deg, #d4a853, #c49530)', color: '#0a0a0a', border: 'none', borderRadius: 10, padding: 13, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", system-ui, sans-serif' }}>Xem đơn hàng</button>
                    <button onClick={() => navigate('/shop')} style={{ flex: 1, background: 'rgba(255,255,255,0.07)', color: '#f5efe6', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: 13, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", system-ui, sans-serif' }}>Tiếp tục mua</button>
                </div>
            </div>
        </div>
    )

    // ── Success state (VNPay) ──────────────────────────────────────
    if (done && done.vnpay) return (
        <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
            <div style={{ background: '#121212', border: '1px solid rgba(99,194,116,0.3)', borderRadius: 20, padding: '52px 48px', maxWidth: 460, width: '100%', textAlign: 'center' }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>🏦</div>
                <h2 style={{ color: '#f5efe6', fontSize: 24, fontWeight: 800, margin: '0 0 8px' }}>Thanh toán VNPay thành công!</h2>
                <p style={{ color: 'rgba(245,239,230,0.5)', fontSize: 14, margin: '0 0 24px' }}>Giao dịch đã được xác nhận bởi VNPay</p>
                {done.transactionRef && (
                    <div style={{ background: 'rgba(99,194,116,0.07)', border: '1px solid rgba(99,194,116,0.2)', borderRadius: 12, padding: '12px 20px', marginBottom: 28 }}>
                        <span style={{ color: 'rgba(245,239,230,0.5)', fontSize: 13 }}>Mã giao dịch: </span>
                        <span style={{ color: '#63c274', fontWeight: 700, fontSize: 13 }}>{done.transactionRef}</span>
                    </div>
                )}
                <button onClick={() => navigate('/my-orders')} style={{ width: '100%', background: 'linear-gradient(135deg, #d4a853, #c49530)', color: '#0a0a0a', border: 'none', borderRadius: 10, padding: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", system-ui, sans-serif' }}>
                    Xem đơn hàng →
                </button>
            </div>
        </div>
    )

    // ── Empty cart ─────────────────────────────────────────────────
    if (cart.length === 0 && !searchParams.get('vnpay')) return (
        <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
            <div style={{ fontSize: 64 }}>🛒</div>
            <h2 style={{ color: '#f5efe6', fontSize: 22, fontWeight: 700, margin: 0 }}>Giỏ hàng trống</h2>
            <p style={{ color: 'rgba(245,239,230,0.4)', fontSize: 14, margin: 0 }}>Hãy thêm sản phẩm trước khi thanh toán</p>
            <button onClick={() => navigate('/shop')} style={{ background: 'linear-gradient(135deg, #d4a853, #c49530)', color: '#0a0a0a', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Đến cửa hàng →</button>
        </div>
    )

    const isProcessing = loading || vnpayLoading

    return (
        <div style={{ minHeight: '100vh', background: '#080808', paddingTop: 88, fontFamily: '"DM Sans", system-ui, sans-serif', color: '#f5efe6' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

                {/* Header */}
                <div style={{ marginBottom: 32 }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'rgba(245,239,230,0.4)', fontSize: 13, cursor: 'pointer', padding: 0, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}
                        onMouseEnter={e => e.currentTarget.style.color = '#d4a853'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,239,230,0.4)'}
                    >← Quay lại</button>
                    <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Thanh Toán</h1>
                </div>

                {/* Error */}
                {error && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span>⚠️</span>
                        <span style={{ color: '#fca5a5', fontSize: 14 }}>{error}</span>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }} className="checkout-grid">

                    {/* Left - Cart items */}
                    <div>
                        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 700, fontSize: 15 }}>Sản phẩm ({cart.length})</span>
                                <button onClick={clearCart} style={{ background: 'none', border: 'none', color: 'rgba(239,68,68,0.6)', fontSize: 12, cursor: 'pointer', padding: 0 }}>Xóa tất cả</button>
                            </div>
                            {cart.map((item, idx) => (
                                <div key={item.id} style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: idx < cart.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                                    <div style={{ width: 60, height: 60, borderRadius: 10, overflow: 'hidden', background: '#1e1e1e', flexShrink: 0 }}>
                                        <img src={item.imageUrl || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=120&h=120&fit=crop'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=120&h=120&fit=crop' }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                                        <div style={{ color: '#d4a853', fontSize: 13, fontWeight: 700 }}>{item.price.toLocaleString('vi-VN')}đ / cái</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#f5efe6', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                        <span style={{ fontWeight: 700, fontSize: 14, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#f5efe6', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: 14, color: '#d4a853', minWidth: 80, textAlign: 'right' }}>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</div>
                                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: 'rgba(245,239,230,0.3)', cursor: 'pointer', padding: 4 }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#e57373'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,239,230,0.3)'}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Note */}
                        <div style={{ marginTop: 16, background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
                            <label style={{ display: 'block', color: 'rgba(245,239,230,0.5)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Ghi chú (tùy chọn)</label>
                            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Yêu cầu đặc biệt, dị ứng thực phẩm..."
                                style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f5efe6', fontSize: 14, padding: '12px 14px', resize: 'vertical', minHeight: 90, outline: 'none', fontFamily: '"DM Sans", system-ui, sans-serif' }}
                                onFocus={e => e.currentTarget.style.borderColor = 'rgba(212,168,83,0.4)'}
                                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
                        </div>
                    </div>

                    {/* Right - Summary + Payment */}
                    <div>
                        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, position: 'sticky', top: 88 }}>
                            <h3 style={{ fontWeight: 700, fontSize: 16, margin: '0 0 20px' }}>Tóm tắt đơn hàng</h3>

                            {/* User info */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px', background: 'rgba(212,168,83,0.07)', border: '1px solid rgba(212,168,83,0.15)', borderRadius: 12, marginBottom: 20 }}>
                                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #d4a853, #3d8b5e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#0a0a0a' }}>{(user?.userName || 'U')[0].toUpperCase()}</div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 14 }}>{user?.userName}</div>
                                    <div style={{ color: 'rgba(245,239,230,0.4)', fontSize: 12 }}>Thành viên</div>
                                </div>
                            </div>

                            {/* Line items */}
                            <div style={{ marginBottom: 16 }}>
                                {cart.map(item => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <span style={{ color: 'rgba(245,239,230,0.6)', fontSize: 13, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name} × {item.quantity}</span>
                                        <span style={{ fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16, marginBottom: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 700, fontSize: 15 }}>Tổng cộng</span>
                                    <span style={{ color: '#d4a853', fontWeight: 800, fontSize: 22 }}>{cartTotal.toLocaleString('vi-VN')}đ</span>
                                </div>
                            </div>

                            {/* ── VNPAY BUTTON ─────────────────────────────── */}
                            <button
                                onClick={handleVNPay}
                                disabled={isProcessing || cart.length === 0}
                                style={{
                                    width: '100%',
                                    background: isProcessing ? 'rgba(0,90,180,0.3)' : 'linear-gradient(135deg, #005ab4, #003d8f)',
                                    color: '#fff',
                                    border: '1px solid rgba(0,120,220,0.4)',
                                    borderRadius: 12,
                                    padding: '15px',
                                    fontSize: 15,
                                    fontWeight: 800,
                                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 10,
                                    marginBottom: 12,
                                    transition: 'all 0.2s',
                                    fontFamily: '"DM Sans", system-ui, sans-serif',
                                }}
                            >
                                {vnpayLoading ? (
                                    <><span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Đang chuyển sang VNPay...</>
                                ) : (
                                    <>
                                        {/* Logo VNPay dạng text badge */}
                                        <span style={{ background: '#fff', color: '#005ab4', borderRadius: 4, padding: '2px 7px', fontSize: 12, fontWeight: 900, letterSpacing: '-0.5px' }}>VN<span style={{ color: '#e30019' }}>PAY</span></span>
                                        Thanh toán qua VNPay
                                    </>
                                )}
                            </button>

                            {/* ── COD BUTTON ────────────────────────────────── */}
                            <button
                                onClick={handleOrderCOD}
                                disabled={isProcessing || cart.length === 0}
                                style={{
                                    width: '100%',
                                    background: isProcessing ? 'rgba(212,168,83,0.3)' : 'rgba(212,168,83,0.12)',
                                    color: isProcessing ? 'rgba(212,168,83,0.4)' : '#d4a853',
                                    border: '1px solid rgba(212,168,83,0.3)',
                                    borderRadius: 12,
                                    padding: '13px',
                                    fontSize: 14,
                                    fontWeight: 700,
                                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    marginBottom: 10,
                                    transition: 'all 0.2s',
                                    fontFamily: '"DM Sans", system-ui, sans-serif',
                                }}
                            >
                                {loading ? (
                                    <><span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(212,168,83,0.3)', borderTopColor: '#d4a853', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Đang xử lý...</>
                                ) : '💵 Thanh toán khi nhận hàng (COD)'}
                            </button>

                            <button onClick={() => navigate('/shop')} style={{ width: '100%', background: 'rgba(255,255,255,0.06)', color: 'rgba(245,239,230,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: '"DM Sans", system-ui, sans-serif' }}>
                                ← Tiếp tục mua sắm
                            </button>

                            {/* Secure badge */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, color: 'rgba(245,239,230,0.3)', fontSize: 12 }}>
                                🔒 Thanh toán an toàn & bảo mật
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg) } }
                @media (max-width: 768px) {
                    .checkout-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    )
}