// src/pages/admin/AdminPromotions.jsx
// ⚠️  BE KHÔNG có bảng Promotions / PromotionProducts
//     → Giải pháp: lưu promotions trong localStorage (client-side)
//     và áp dụng bằng cách cập nhật giá sản phẩm qua PUT /admin/products/{id}
// ✅ Tích hợp với BE:
//   GET /products              → load danh sách sản phẩm để áp khuyến mãi
//   PUT /admin/products/{id}   → cập nhật giá sau khi áp / gỡ khuyến mãi

import React, { useState, useEffect, useCallback } from 'react'
import { Plus, Edit2, Trash2, Tag, Search, X, Check, Package, RefreshCw, Zap } from 'lucide-react'
import http from '../../services/api'

const S = {
    wrap: { padding: 24, color: '#f9fafb' },
    card: { background: '#1f2937', border: '1px solid #374151', borderRadius: 12 },
    input: { width: '100%', background: '#111827', color: '#f9fafb', border: '1px solid #374151', borderRadius: 8, padding: '9px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' },
    label: { display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' },
}

const PROMO_KEY = 'cb_promotions'

function loadPromos() {
    try { return JSON.parse(localStorage.getItem(PROMO_KEY)) || [] } catch { return [] }
}
function savePromos(list) {
    localStorage.setItem(PROMO_KEY, JSON.stringify(list))
}

function Toast({ msg, type }) {
    const c = type === 'error' ? '#ef4444' : '#22c55e'
    return <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: '#1f2937', border: `1px solid ${c}`, borderLeft: `4px solid ${c}`, borderRadius: 10, padding: '12px 20px', color: '#f9fafb', fontSize: 13, maxWidth: 360 }}>{msg}</div>
}

const EMPTY_FORM = { name: '', discountPercent: '', startDate: '', endDate: '', description: '', selectedProducts: [] }

export default function AdminPromotions() {
    const [promos, setPromos] = useState(loadPromos)
    const [products, setProducts] = useState([])
    const [tab, setTab] = useState('promos') // 'promos' | 'apply'
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null) // null | { mode:'add'|'edit', promo? }
    const [form, setForm] = useState(EMPTY_FORM)
    const [submitting, setSub] = useState(false)
    const [applying, setApplying] = useState(null) // promo being applied
    const [toast, setToast] = useState(null)
    const [loadingProd, setLoadingProd] = useState(false)

    const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500) }

    const fetchProducts = useCallback(async () => {
        setLoadingProd(true)
        try {
            const res = await http.get('/products')
            setProducts(Array.isArray(res.data) ? res.data : [])
        } catch (e) {
            showToast('Không thể tải sản phẩm: ' + e.message, 'error')
        } finally { setLoadingProd(false) }
    }, [])

    useEffect(() => { fetchProducts() }, [fetchProducts])

    const persist = (list) => { setPromos(list); savePromos(list) }

    const openAdd = () => { setForm(EMPTY_FORM); setModal({ mode: 'add' }) }
    const openEdit = (p) => {
        setForm({ name: p.name, discountPercent: p.discountPercent, startDate: p.startDate || '', endDate: p.endDate || '', description: p.description || '', selectedProducts: p.appliedProductIds || [] })
        setModal({ mode: 'edit', promo: p })
    }

    const handleSave = (e) => {
        e.preventDefault()
        if (!form.name || !form.discountPercent) { showToast('Nhập tên và % giảm giá', 'error'); return }
        const pct = Number(form.discountPercent)
        if (isNaN(pct) || pct <= 0 || pct > 100) { showToast('% giảm giá phải từ 1–100', 'error'); return }
        setSub(true)
        if (modal.mode === 'add') {
            const newP = { id: Date.now(), name: form.name, discountPercent: pct, startDate: form.startDate, endDate: form.endDate, description: form.description, appliedProductIds: [], active: true, createdAt: new Date().toISOString() }
            persist([...promos, newP])
            showToast('Đã tạo khuyến mãi!')
        } else {
            persist(promos.map(p => p.id === modal.promo.id ? { ...p, name: form.name, discountPercent: pct, startDate: form.startDate, endDate: form.endDate, description: form.description } : p))
            showToast('Đã cập nhật!')
        }
        setSub(false)
        setModal(null)
    }

    const deletePromo = (id) => {
        if (!window.confirm('Xóa khuyến mãi này?')) return
        persist(promos.filter(p => p.id !== id))
        showToast('Đã xóa!')
    }

    const toggleActive = (id) => {
        persist(promos.map(p => p.id === id ? { ...p, active: !p.active } : p))
    }

    // ── Áp dụng khuyến mãi vào sản phẩm qua BE ──────────────
    const applyToProduct = async (promo, product) => {
        const alreadyApplied = promo.appliedProductIds?.includes(product.id)
        const originalPrice = product._originalPrice || product.price
        const newPrice = alreadyApplied
            ? originalPrice  // gỡ: khôi phục giá gốc
            : Math.round(originalPrice * (1 - promo.discountPercent / 100))

        setSub(true)
        try {
            await http.put(`/admin/products/${product.id}`, {
                ...product,
                price: newPrice,
                _originalPrice: alreadyApplied ? undefined : originalPrice,
            })
            // Cập nhật local products
            setProducts(prev => prev.map(p => p.id === product.id ? { ...p, price: newPrice, _originalPrice: alreadyApplied ? undefined : originalPrice } : p))
            // Cập nhật promo appliedProductIds
            const updated = promos.map(pr => pr.id === promo.id ? {
                ...pr,
                appliedProductIds: alreadyApplied
                    ? pr.appliedProductIds.filter(pid => pid !== product.id)
                    : [...(pr.appliedProductIds || []), product.id]
            } : pr)
            persist(updated)
            showToast(`${alreadyApplied ? 'Đã gỡ' : 'Đã áp'} KM ${promo.discountPercent}% cho "${product.productName || product.name}"`)
        } catch (e) {
            showToast('Lỗi cập nhật giá: ' + (e.response?.data?.message || e.message), 'error')
        } finally { setSub(false) }
    }

    const filtered = promos.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

    const isExpired = (p) => p.endDate && new Date(p.endDate) < new Date()

    return (
        <div style={S.wrap}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, marginBottom: 4 }}>Quản Lý Khuyến Mãi</h1>
                    <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>
                        {promos.filter(p => p.active).length} đang hoạt động · {promos.length} tổng
                        <span style={{ marginLeft: 8, fontSize: 11, color: '#4b5563' }}>(lưu local, áp dụng qua BE)</span>
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={fetchProducts} style={{ background: '#374151', color: '#d1d5db', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <RefreshCw size={13} />Tải lại SP
                    </button>
                    <button onClick={openAdd} style={{ background: '#f59e0b', color: '#111', border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Plus size={14} />Tạo khuyến mãi
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {[['promos', 'Danh sách KM'], ['apply', 'Áp dụng vào sản phẩm']].map(([v, l]) => (
                    <button key={v} onClick={() => setTab(v)} style={{ background: tab === v ? '#f59e0b' : '#1f2937', color: tab === v ? '#111' : '#9ca3af', border: `1px solid ${tab === v ? '#f59e0b' : '#374151'}`, borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                        {l}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 16, maxWidth: 360 }}>
                <Search size={14} color="#6b7280" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm khuyến mãi..." style={{ ...S.input, paddingLeft: 34 }} />
            </div>

            {/* ── Tab: Danh sách KM ── */}
            {tab === 'promos' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
                    {filtered.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#6b7280' }}>
                            <Tag size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                            <p>Chưa có khuyến mãi nào. Tạo mới để bắt đầu!</p>
                        </div>
                    )}
                    {filtered.map(p => {
                        const expired = isExpired(p)
                        const statusColor = !p.active ? '#6b7280' : expired ? '#ef4444' : '#22c55e'
                        const statusLabel = !p.active ? 'Tắt' : expired ? 'Hết hạn' : 'Hoạt động'
                        return (
                            <div key={p.id} style={{ ...S.card, padding: 20, position: 'relative', opacity: (!p.active || expired) ? 0.7 : 1 }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: statusColor, borderRadius: '12px 12px 0 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', fontWeight: 700, fontSize: 16 }}>
                                            {p.discountPercent}%
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                                            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: `${statusColor}22`, color: statusColor, fontWeight: 600 }}>{statusLabel}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 5 }}>
                                        <button onClick={() => openEdit(p)} style={{ width: 28, height: 28, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit2 size={12} /></button>
                                        <button onClick={() => deletePromo(p.id)} style={{ width: 28, height: 28, background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={12} /></button>
                                    </div>
                                </div>

                                {p.description && <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 10 }}>{p.description}</p>}

                                <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 12 }}>
                                    {p.startDate && <span>📅 {p.startDate}</span>}
                                    {p.startDate && p.endDate && <span> → </span>}
                                    {p.endDate && <span>{p.endDate}</span>}
                                    {!p.startDate && !p.endDate && <span>Không giới hạn thời gian</span>}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 12, color: '#6b7280' }}>
                                        Đã áp: <b style={{ color: '#f9fafb' }}>{p.appliedProductIds?.length || 0}</b> sản phẩm
                                    </span>
                                    <button onClick={() => toggleActive(p.id)} style={{
                                        background: p.active ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                                        color: p.active ? '#ef4444' : '#22c55e',
                                        border: `1px solid ${p.active ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
                                        borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 600
                                    }}>
                                        {p.active ? '⏸ Tắt' : '▶ Bật'}
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* ── Tab: Áp dụng vào SP ── */}
            {tab === 'apply' && (
                <div>
                    {promos.filter(p => p.active && !isExpired(p)).length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>
                            <Zap size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                            <p>Không có khuyến mãi nào đang hoạt động.</p>
                        </div>
                    ) : (
                        promos.filter(p => p.active && !isExpired(p)).map(promo => (
                            <div key={promo.id} style={{ ...S.card, marginBottom: 16, overflow: 'hidden' }}>
                                <div style={{ padding: '14px 20px', background: 'rgba(245,158,11,0.08)', borderBottom: '1px solid #374151', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <Tag size={16} color="#f59e0b" />
                                        <span style={{ fontWeight: 700 }}>{promo.name}</span>
                                        <span style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b', padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700 }}>-{promo.discountPercent}%</span>
                                    </div>
                                    <span style={{ fontSize: 12, color: '#6b7280' }}>Áp dụng: {promo.appliedProductIds?.length || 0} SP</span>
                                </div>
                                {loadingProd ? (
                                    <div style={{ padding: 20, textAlign: 'center', color: '#6b7280', fontSize: 13 }}>Đang tải sản phẩm...</div>
                                ) : (
                                    <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr>
                                                    {['Sản phẩm', 'Danh mục', 'Giá gốc', 'Giá sau KM', 'Trạng thái', 'Áp dụng'].map(h => (
                                                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', background: '#111827' }}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.map((prod, i) => {
                                                    const applied = promo.appliedProductIds?.includes(prod.id)
                                                    const origP = prod._originalPrice || prod.price
                                                    const afterP = Math.round(origP * (1 - promo.discountPercent / 100))
                                                    return (
                                                        <tr key={prod.id} style={{ background: i % 2 === 1 ? '#0f172a' : 'transparent', borderTop: '1px solid #374151' }}>
                                                            <td style={{ padding: '10px 16px', fontWeight: 600, fontSize: 13 }}>{prod.productName || prod.name}</td>
                                                            <td style={{ padding: '10px 16px', fontSize: 12, color: '#9ca3af' }}>{prod.category || '—'}</td>
                                                            <td style={{ padding: '10px 16px', fontSize: 12, color: '#9ca3af', textDecoration: applied ? 'line-through' : '' }}>
                                                                {Number(origP).toLocaleString('vi-VN')}đ
                                                            </td>
                                                            <td style={{ padding: '10px 16px', fontSize: 13, color: '#f59e0b', fontWeight: 600 }}>
                                                                {Number(afterP).toLocaleString('vi-VN')}đ
                                                            </td>
                                                            <td style={{ padding: '10px 16px' }}>
                                                                {applied
                                                                    ? <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600 }}>Đã áp</span>
                                                                    : <span style={{ background: 'rgba(107,114,128,0.15)', color: '#6b7280', padding: '2px 8px', borderRadius: 99, fontSize: 11 }}>Chưa áp</span>
                                                                }
                                                            </td>
                                                            <td style={{ padding: '10px 16px' }}>
                                                                <button onClick={() => applyToProduct(promo, prod)} disabled={submitting} style={{
                                                                    background: applied ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                                                                    color: applied ? '#ef4444' : '#22c55e',
                                                                    border: `1px solid ${applied ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
                                                                    borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 600
                                                                }}>
                                                                    {applied ? 'Gỡ KM' : 'Áp dụng'}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Modal tạo/sửa KM */}
            {modal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }} onClick={() => setModal(null)}>
                    <div style={{ ...S.card, width: '100%', maxWidth: 440 }} onClick={e => e.stopPropagation()}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{modal.mode === 'add' ? 'Tạo khuyến mãi' : 'Sửa khuyến mãi'}</h2>
                            <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSave} style={{ padding: 20 }}>
                            {[
                                { k: 'name', l: 'Tên khuyến mãi *', required: true, type: 'text', placeholder: 'VD: Flash Sale cuối tuần' },
                                { k: 'discountPercent', l: 'Giảm giá (%) *', required: true, type: 'number', placeholder: 'VD: 20' },
                            ].map(f => (
                                <div key={f.k} style={{ marginBottom: 12 }}>
                                    <label style={S.label}>{f.l}</label>
                                    <input type={f.type} value={form[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))} required={f.required} placeholder={f.placeholder} min={f.type === 'number' ? 1 : undefined} max={f.type === 'number' ? 100 : undefined} style={S.input} />
                                </div>
                            ))}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                                {[['startDate', 'Ngày bắt đầu'], ['endDate', 'Ngày kết thúc']].map(([k, l]) => (
                                    <div key={k}>
                                        <label style={S.label}>{l}</label>
                                        <input type="date" value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} style={S.input} />
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={S.label}>Mô tả</label>
                                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} style={{ ...S.input, resize: 'vertical' }} />
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button type="button" onClick={() => setModal(null)} style={{ flex: 1, background: '#374151', color: '#d1d5db', border: 'none', borderRadius: 8, padding: '10px 0', cursor: 'pointer', fontSize: 13 }}>Hủy</button>
                                <button type="submit" disabled={submitting} style={{ flex: 2, background: '#f59e0b', color: '#111', border: 'none', borderRadius: 8, padding: '10px 0', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                                    {modal.mode === 'add' ? 'Tạo khuyến mãi' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {toast && <Toast {...toast} />}
        </div>
    )
}