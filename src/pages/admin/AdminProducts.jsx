// src/pages/admin/AdminProducts.jsx
// ✅ BE endpoints (qua API Gateway port 8080):
//   GET    /products              → List<Product> { id, productName, price, discription, category(string), availability }
//   POST   /admin/products        → Product
//   PUT    /admin/products/{id}   → Product
//   DELETE /admin/products/{id}   → 200 OK
// KHÔNG dùng JWT — BE dùng session

import React, { useState, useEffect, useCallback } from 'react'
import { Plus, Edit2, Trash2, Search, X, RefreshCw, Package } from 'lucide-react'
import http from '../../services/api'

const S = {
    wrap: { padding: 24, color: '#f9fafb' },
    card: { background: '#1f2937', border: '1px solid #374151', borderRadius: 12 },
    input: { width: '100%', background: '#111827', color: '#f9fafb', border: '1px solid #374151', borderRadius: 8, padding: '9px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' },
    label: { display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' },
}

function Toast({ msg, type }) {
    const c = type === 'error' ? '#ef4444' : '#22c55e'
    return <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: '#1f2937', border: `1px solid ${c}`, borderLeft: `4px solid ${c}`, borderRadius: 10, padding: '12px 20px', color: '#f9fafb', fontSize: 13, maxWidth: 360 }}>{msg}</div>
}

const EMPTY = { productName: '', discription: '', price: '', availability: '', category: '' }

export default function AdminProducts() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [catFilter, setCat] = useState('all')
    const [modal, setModal] = useState(null) // null | { mode:'add'|'edit', product? }
    const [form, setForm] = useState(EMPTY)
    const [submitting, setSub] = useState(false)
    const [toast, setToast] = useState(null)

    const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000) }

    const fetchProducts = useCallback(async () => {
        setLoading(true)
        try {
            const res = await http.get('/products')
            setProducts(Array.isArray(res.data) ? res.data : [])
        } catch (e) {
            showToast('Không thể tải sản phẩm: ' + e.message, 'error')
        } finally { setLoading(false) }
    }, [])

    useEffect(() => { fetchProducts() }, [fetchProducts])

    // Unique categories
    const cats = ['all', ...new Set(products.map(p => (typeof p.category === 'string' ? p.category : p.category?.name) || 'Khác'))]

    const openAdd = () => { setForm(EMPTY); setModal({ mode: 'add' }) }
    const openEdit = (p) => {
        setForm({
            productName: p.productName || p.name || '',
            discription: p.discription || p.description || '',
            price: p.price || '',
            availability: p.availability ?? p.stockQuantity ?? '',
            category: (typeof p.category === 'string' ? p.category : p.category?.name) || '',
        })
        setModal({ mode: 'edit', product: p })
    }

    // ── POST /admin/products | PUT /admin/products/{id} ───────
    const handleSave = async (e) => {
        e.preventDefault()
        if (!form.productName.trim()) { showToast('Nhập tên sản phẩm', 'error'); return }
        if (!form.price) { showToast('Nhập giá sản phẩm', 'error'); return }
        if (!form.category.trim()) { showToast('Nhập danh mục', 'error'); return }

        const payload = {
            productName: form.productName.trim(),
            discription: form.discription.trim(),
            price: Number(form.price),
            availability: Number(form.availability) || 0,
            category: form.category.trim(),
        }
        setSub(true)
        try {
            if (modal.mode === 'add') {
                const res = await http.post('/admin/products', payload)
                setProducts(prev => [...prev, res.data || payload])
                showToast('Thêm sản phẩm thành công!')
            } else {
                await http.put(`/admin/products/${modal.product.id}`, payload)
                setProducts(prev => prev.map(p => p.id === modal.product.id ? { ...p, ...payload } : p))
                showToast('Cập nhật sản phẩm thành công!')
            }
            setModal(null)
        } catch (e) {
            showToast('Lỗi: ' + (e.response?.data?.message || e.message), 'error')
        } finally { setSub(false) }
    }

    // ── DELETE /admin/products/{id} ───────────────────────────
    const handleDelete = async (p) => {
        if (!window.confirm(`Xóa sản phẩm "${p.productName || p.name}"?`)) return
        try {
            await http.delete(`/admin/products/${p.id}`)
            setProducts(prev => prev.filter(x => x.id !== p.id))
            showToast('Đã xóa sản phẩm!')
        } catch (e) {
            showToast('Lỗi xóa: ' + (e.response?.data?.message || e.message), 'error')
        }
    }

    const filtered = products.filter(p => {
        const name = (p.productName || p.name || '').toLowerCase()
        const cat = (typeof p.category === 'string' ? p.category : p.category?.name) || 'Khác'
        return name.includes(search.toLowerCase()) &&
            (catFilter === 'all' || cat === catFilter)
    })

    return (
        <div style={S.wrap}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, marginBottom: 4 }}>Quản Lý Sản Phẩm</h1>
                    <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>{products.length} sản phẩm · {cats.length - 1} danh mục</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={fetchProducts} style={{ background: '#374151', color: '#d1d5db', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <RefreshCw size={13} />Làm mới
                    </button>
                    <button onClick={openAdd} style={{ background: '#f59e0b', color: '#111', border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Plus size={14} />Thêm sản phẩm
                    </button>
                </div>
            </div>

            {/* Search + category filter */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                    <Search size={14} color="#6b7280" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm tên sản phẩm..."
                        style={{ ...S.input, paddingLeft: 34 }} />
                </div>
                <select value={catFilter} onChange={e => setCat(e.target.value)} style={{ background: '#1f2937', color: '#f9fafb', border: '1px solid #374151', borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none' }}>
                    {cats.map(c => (
                        <option key={c} value={c}>{c === 'all' ? 'Tất cả danh mục' : c}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div style={{ ...S.card, overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: 60, textAlign: 'center' }}>
                        <div style={{ width: 32, height: 32, border: '3px solid #374151', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' }} />
                        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                        <p style={{ color: '#6b7280', fontSize: 13 }}>Đang tải...</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                {['ID', 'Tên sản phẩm', 'Danh mục', 'Giá', 'Tồn kho', 'Mô tả', 'Thao tác'].map(h => (
                                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', background: '#111827' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
                                    <Package size={40} style={{ opacity: 0.3, margin: '0 auto 10px', display: 'block' }} />
                                    Không có sản phẩm nào
                                </td></tr>
                            ) : filtered.map((p, i) => (
                                <tr key={p.id} style={{ background: i % 2 === 1 ? '#111827' : 'transparent', borderTop: '1px solid #374151' }}>
                                    <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: 12 }}>#{p.id}</td>
                                    <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 13 }}>{p.productName || p.name}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                                            {(typeof p.category === 'string' ? p.category : p.category?.name) || 'Khác'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px', color: '#f59e0b', fontWeight: 700, fontSize: 13 }}>
                                        {Number(p.price || 0).toLocaleString('vi-VN')}đ
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{
                                            display: 'inline-block', padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
                                            background: (p.availability || 0) > 0 ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                                            color: (p.availability || 0) > 0 ? '#22c55e' : '#ef4444'
                                        }}>
                                            {p.availability ?? 0}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px', color: '#9ca3af', fontSize: 12, maxWidth: 180 }}>
                                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {p.discription || p.description || '—'}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button onClick={() => openEdit(p)} style={{ width: 32, height: 32, background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Sửa"><Edit2 size={14} /></button>
                                            <button onClick={() => handleDelete(p)} style={{ width: 32, height: 32, background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Xóa"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal thêm / sửa */}
            {modal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }} onClick={() => setModal(null)}>
                    <div style={{ ...S.card, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>
                                {modal.mode === 'add' ? 'Thêm sản phẩm mới' : `Sửa: ${modal.product?.productName || modal.product?.name}`}
                            </h2>
                            <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSave} style={{ padding: 20 }}>
                            <div style={{ marginBottom: 14 }}>
                                <label style={S.label}>Tên sản phẩm *</label>
                                <input value={form.productName} onChange={e => setForm(p => ({ ...p, productName: e.target.value }))} required placeholder="Cà phê đen, Trà sữa trân châu..." style={S.input} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                                <div>
                                    <label style={S.label}>Giá (VNĐ) *</label>
                                    <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} required min={0} placeholder="35000" style={S.input} />
                                </div>
                                <div>
                                    <label style={S.label}>Tồn kho (availability)</label>
                                    <input type="number" value={form.availability} onChange={e => setForm(p => ({ ...p, availability: e.target.value }))} min={0} placeholder="100" style={S.input} />
                                </div>
                            </div>

                            <div style={{ marginBottom: 14 }}>
                                <label style={S.label}>Danh mục * <span style={{ color: '#4b5563', fontSize: 10, textTransform: 'none' }}>(text tự do, BE lưu string)</span></label>
                                <input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} required placeholder="Coffee, Tea, Food..." style={S.input} />
                                {/* Gợi ý danh mục hiện có */}
                                {cats.filter(c => c !== 'all').length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                                        {cats.filter(c => c !== 'all').map(c => (
                                            <button key={c} type="button" onClick={() => setForm(p => ({ ...p, category: c }))}
                                                style={{ background: form.category === c ? '#f59e0b' : '#374151', color: form.category === c ? '#111' : '#d1d5db', border: 'none', borderRadius: 6, padding: '3px 10px', fontSize: 11, cursor: 'pointer' }}>
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div style={{ marginBottom: 20 }}>
                                <label style={S.label}>Mô tả <span style={{ color: '#4b5563', fontSize: 10, textTransform: 'none' }}>(BE field: discription)</span></label>
                                <textarea value={form.discription} onChange={e => setForm(p => ({ ...p, discription: e.target.value }))} rows={3} placeholder="Mô tả sản phẩm..." style={{ ...S.input, resize: 'vertical' }} />
                            </div>

                            <div style={{ display: 'flex', gap: 8 }}>
                                <button type="button" onClick={() => setModal(null)} style={{ flex: 1, background: '#374151', color: '#d1d5db', border: 'none', borderRadius: 8, padding: '10px 0', cursor: 'pointer', fontSize: 13 }}>Hủy</button>
                                <button type="submit" disabled={submitting} style={{ flex: 2, background: '#f59e0b', color: '#111', border: 'none', borderRadius: 8, padding: '10px 0', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                                    {submitting ? 'Đang xử lý...' : modal.mode === 'add' ? 'Thêm sản phẩm' : 'Lưu thay đổi'}
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