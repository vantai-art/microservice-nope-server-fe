// src/pages/ShopPage.jsx
import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import CartSidebar from '../components/CartSidebar'

const SORT_OPTIONS = [
    { value: 'default', label: 'Mặc định' },
    { value: 'price-asc', label: 'Giá thấp → cao' },
    { value: 'price-desc', label: 'Giá cao → thấp' },
    { value: 'name', label: 'Tên A → Z' },
]

function ProductCard({ product, onAdd }) {
    const [adding, setAdding] = useState(false)
    const inStock = (product.stockQuantity || product.availability || 0) > 0

    const handleAdd = async () => {
        if (!inStock) return
        setAdding(true)
        onAdd(product)
        setTimeout(() => setAdding(false), 800)
    }

    return (
        <div style={{
            background: '#111', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16, overflow: 'hidden', transition: 'all 0.25s', cursor: 'default',
            display: 'flex', flexDirection: 'column',
        }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(212,168,83,0.3)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none' }}
        >
            {/* Image */}
            <div style={{ position: 'relative', height: 180, overflow: 'hidden', background: '#1e1e1e' }}>
                <img
                    src={product.imageUrl || `https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&sig=${product.id}`}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
                    onMouseLeave={e => e.target.style.transform = 'none'}
                />
                {/* Category badge */}
                <span style={{
                    position: 'absolute', top: 12, left: 12,
                    background: 'rgba(8,8,8,0.75)', backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(212,168,83,0.25)', borderRadius: 999,
                    padding: '4px 10px', fontSize: 11, fontWeight: 600, color: '#d4a853', letterSpacing: '0.05em',
                }}>{product.category?.name || product.category || 'Khác'}</span>
                {/* Out of stock overlay */}
                {!inStock && (
                    <div style={{
                        position: 'absolute', inset: 0, background: 'rgba(8,8,8,0.7)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <span style={{ color: '#ef4444', fontWeight: 700, fontSize: 13, background: 'rgba(8,8,8,0.8)', padding: '6px 14px', borderRadius: 8 }}>Hết hàng</span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ color: '#f5efe6', fontWeight: 700, fontSize: 14, margin: '0 0 6px', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.name}
                </h3>
                {product.description && (
                    <p style={{ color: 'rgba(245,239,230,0.4)', fontSize: 12, margin: '0 0 12px', lineHeight: 1.5, flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {product.description}
                    </p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                        <div style={{ color: '#d4a853', fontWeight: 800, fontSize: 16 }}>{product.price.toLocaleString('vi-VN')}đ</div>
                        <div style={{ color: 'rgba(245,239,230,0.35)', fontSize: 11 }}>Còn {product.stockQuantity || product.availability || 0}</div>
                    </div>
                    <button onClick={handleAdd} disabled={!inStock || adding} style={{
                        width: 38, height: 38, borderRadius: 10, cursor: inStock ? 'pointer' : 'not-allowed',
                        background: adding ? 'rgba(34,197,94,0.2)' : inStock ? 'linear-gradient(135deg, #d4a853, #c49530)' : 'rgba(255,255,255,0.05)',
                        border: adding ? '1px solid rgba(34,197,94,0.4)' : inStock ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        color: adding ? '#86efac' : inStock ? '#0a0a0a' : 'rgba(255,255,255,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, transition: 'all 0.2s',
                        boxShadow: inStock && !adding ? '0 2px 10px rgba(212,168,83,0.25)' : 'none',
                    }}>
                        {adding ? '✓' : '+'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function ShopPage() {
    const navigate = useNavigate()
    const { products, cart, addToCart, loading, error, fetchProducts } = useApp()
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('default')
    const [activeCategory, setActiveCategory] = useState('ALL')
    const [showCart, setShowCart] = useState(false)
    const [toastMsg, setToastMsg] = useState(null)

    const cartCount = cart.reduce((s, i) => s + i.quantity, 0)

    // Build category list from products
    const categories = useMemo(() => {
        const cats = new Set()
        products.forEach(p => {
            const c = (typeof p.category === 'string' ? p.category : p.category?.name) || 'Khác'
            cats.add(c)
        })
        return ['ALL', ...Array.from(cats).sort()]
    }, [products])

    const filtered = useMemo(() => {
        let list = products.filter(p => {
            const nameMatch = p.name?.toLowerCase().includes(search.toLowerCase())
            const cat = (typeof p.category === 'string' ? p.category : p.category?.name) || 'Khác'
            const catMatch = activeCategory === 'ALL' || cat === activeCategory
            return nameMatch && catMatch
        })
        if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
        else if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
        else if (sortBy === 'name') list = [...list].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        return list
    }, [products, search, sortBy, activeCategory])

    const handleAdd = (product) => {
        addToCart(product)
        setToastMsg(`Đã thêm "${product.name}" vào giỏ!`)
        setTimeout(() => setToastMsg(null), 2500)
        setTimeout(() => setShowCart(true), 300)
    }

    return (
        <div style={{ minHeight: '100vh', background: '#080808', paddingTop: 68, fontFamily: '"DM Sans", system-ui, sans-serif', color: '#f5efe6' }}>

            {/* Page hero */}
            <div style={{
                background: 'linear-gradient(160deg, #0e0a04 0%, #1a1105 60%, #080808 100%)',
                borderBottom: '1px solid rgba(212,168,83,0.1)', padding: '36px 24px 32px',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 200, background: 'radial-gradient(ellipse, rgba(212,168,83,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, position: 'relative' }}>
                    <div>
                        <h1 style={{ fontSize: 30, fontWeight: 900, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                            ☕ Cửa Hàng
                        </h1>
                        <p style={{ color: 'rgba(245,239,230,0.45)', fontSize: 14, margin: 0 }}>
                            {products.length} sản phẩm · {categories.length - 1} danh mục
                        </p>
                    </div>

                    {/* Cart FAB */}
                    <button onClick={() => setShowCart(true)} style={{
                        position: 'relative', display: 'flex', alignItems: 'center', gap: 10,
                        background: cartCount > 0 ? 'linear-gradient(135deg, #d4a853, #c49530)' : 'rgba(255,255,255,0.08)',
                        border: cartCount > 0 ? 'none' : '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 12, padding: '11px 20px', cursor: 'pointer',
                        color: cartCount > 0 ? '#0a0a0a' : 'rgba(245,239,230,0.8)',
                        fontWeight: 700, fontSize: 14, transition: 'all 0.25s',
                        boxShadow: cartCount > 0 ? '0 4px 20px rgba(212,168,83,0.3)' : 'none',
                        fontFamily: '"DM Sans", system-ui, sans-serif',
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        Giỏ hàng {cartCount > 0 && `(${cartCount})`}
                    </button>
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 60px' }}>

                {/* Search + Sort bar */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,239,230,0.3)', fontSize: 16, pointerEvents: 'none' }}>🔍</span>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm sản phẩm..." style={{
                            width: '100%', boxSizing: 'border-box', padding: '11px 16px 11px 42px',
                            background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
                            color: '#f5efe6', fontSize: 14, outline: 'none', transition: 'border-color 0.2s',
                            fontFamily: '"DM Sans", system-ui, sans-serif',
                        }}
                            onFocus={e => e.currentTarget.style.borderColor = 'rgba(212,168,83,0.5)'}
                            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                    </div>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
                        background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
                        color: '#f5efe6', fontSize: 14, padding: '11px 16px', cursor: 'pointer', outline: 'none',
                        fontFamily: '"DM Sans", system-ui, sans-serif',
                    }}>
                        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>

                {/* Category tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                            padding: '7px 18px', borderRadius: 999, fontSize: 13, fontWeight: 600,
                            border: `1px solid ${activeCategory === cat ? 'rgba(212,168,83,0.5)' : 'rgba(255,255,255,0.1)'}`,
                            background: activeCategory === cat ? 'rgba(212,168,83,0.15)' : 'rgba(255,255,255,0.04)',
                            color: activeCategory === cat ? '#d4a853' : 'rgba(245,239,230,0.5)',
                            cursor: 'pointer', transition: 'all 0.2s',
                            fontFamily: '"DM Sans", system-ui, sans-serif',
                        }}>{cat === 'ALL' ? 'Tất cả' : cat}</button>
                    ))}
                </div>

                {/* Loading */}
                {loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '80px 0' }}>
                        <div style={{ width: 44, height: 44, border: '3px solid rgba(212,168,83,0.2)', borderTopColor: '#d4a853', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                        <p style={{ color: 'rgba(245,239,230,0.4)', fontSize: 14 }}>Đang tải sản phẩm...</p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 14, padding: '32px', textAlign: 'center' }}>
                        <p style={{ color: '#fca5a5', marginBottom: 16, fontSize: 15 }}>⚠️ {error}</p>
                        <button onClick={fetchProducts} style={{
                            background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)',
                            color: '#fca5a5', borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontSize: 13,
                            fontFamily: '"DM Sans", system-ui, sans-serif',
                        }}>Thử lại</button>
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && filtered.length === 0 && (
                    <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '64px 32px', textAlign: 'center' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                        <h3 style={{ color: '#f5efe6', fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>Không tìm thấy sản phẩm</h3>
                        <p style={{ color: 'rgba(245,239,230,0.4)', fontSize: 14, margin: 0 }}>Thử thay đổi từ khóa tìm kiếm hoặc danh mục</p>
                    </div>
                )}

                {/* Products grid */}
                {!loading && !error && filtered.length > 0 && (
                    <>
                        <p style={{ color: 'rgba(245,239,230,0.4)', fontSize: 13, marginBottom: 20 }}>
                            Hiển thị <span style={{ color: '#f5efe6', fontWeight: 600 }}>{filtered.length}</span> sản phẩm
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 18 }}>
                            {filtered.map(product => (
                                <ProductCard key={product.id} product={product} onAdd={handleAdd} />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Toast */}
            {toastMsg && (
                <div style={{
                    position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
                    background: '#1a1a1a', border: '1px solid rgba(34,197,94,0.4)',
                    borderLeft: '4px solid #22c55e', borderRadius: 12, padding: '13px 22px',
                    color: '#f5efe6', fontSize: 14, fontWeight: 600, zIndex: 2000, whiteSpace: 'nowrap',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)', animation: 'toastIn 0.3s cubic-bezier(0.16,1,0.3,1)',
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                }}>✅ {toastMsg}</div>
            )}

            {showCart && <CartSidebar onClose={() => setShowCart(false)} />}

            <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes toastIn { from { transform: translateX(-50%) translateY(20px); opacity: 0 } to { transform: translateX(-50%) translateY(0); opacity: 1 } }
      `}</style>
        </div>
    )
}