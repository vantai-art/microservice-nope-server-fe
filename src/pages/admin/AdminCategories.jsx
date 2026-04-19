// src/pages/admin/AdminCategories.jsx
// ✅ BE KHÔNG có bảng Category riêng — category là string trên Product entity
//    (field: category: String)
//
// Giải pháp:
//   - Đọc danh mục từ GET /products → lấy unique category strings
//   - "Thêm" danh mục = tạo sản phẩm mới với category name đó
//   - "Đổi tên" danh mục = PUT /admin/products/{id} cho từng sản phẩm trong danh mục đó
//   - "Xóa" danh mục = nút gán lại category (không xóa sản phẩm)
//   - Chi tiết hiện danh sách sản phẩm thuộc danh mục

import React, { useState, useEffect, useCallback } from 'react'
import {
    FolderOpen, Plus, Edit2, Trash2, Package,
    Search, X, RefreshCw, AlertCircle, ChevronRight,
    Check, ArrowLeft
} from 'lucide-react'
import http from '../../services/api'

const CAT_COLORS = [
    '#f59e0b', '#3b82f6', '#22c55e', '#8b5cf6',
    '#ef4444', '#06b6d4', '#f97316', '#ec4899',
    '#14b8a6', '#a855f7',
]

function catColor(name) {
    let h = 0
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff
    return CAT_COLORS[Math.abs(h) % CAT_COLORS.length]
}

export default function AdminCategories() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')

    // Modal: null | { mode: 'add' | 'rename', catName?: string }
    const [modal, setModal] = useState(null)
    // Detail view: null | string (category name)
    const [detail, setDetail] = useState(null)
    // Toast
    const [toast, setToast] = useState(null)

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    // ── Fetch products ───────────────────────────────────────
    const fetchProducts = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const res = await http.get('/products')
            setProducts(Array.isArray(res.data) ? res.data : [])
        } catch (e) {
            setError('Không thể tải sản phẩm: ' + e.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchProducts() }, [fetchProducts])

    // ── Build category list từ products ──────────────────────
    const catMap = {}
    products.forEach(p => {
        const cat = (typeof p.category === 'string' ? p.category : p.category?.name) || 'Khác'
        if (!catMap[cat]) catMap[cat] = []
        catMap[cat].push(p)
    })
    const categories = Object.entries(catMap)
        .sort((a, b) => b[1].length - a[1].length)
        .filter(([name]) => name.toLowerCase().includes(search.toLowerCase()))

    // ── Rename category: PUT /admin/products/{id} cho từng sản phẩm ──
    const handleRename = async (oldName, newName) => {
        if (!newName.trim() || newName === oldName) return setModal(null)
        const targets = products.filter(p => {
            const cat = (typeof p.category === 'string' ? p.category : p.category?.name) || 'Khác'
            return cat === oldName
        })
        try {
            await Promise.all(targets.map(p =>
                http.put(`/admin/products/${p.id}`, { ...p, category: newName.trim() })
            ))
            showToast(`Đổi tên "${oldName}" → "${newName.trim()}" (${targets.length} sản phẩm)`)
            fetchProducts()
        } catch (e) {
            showToast('Lỗi đổi tên: ' + e.message, 'error')
        }
        setModal(null)
    }

    // ── Reassign category ─────────────────────────────────────
    const handleReassign = async (catName, newCat) => {
        if (!newCat.trim()) return
        const targets = products.filter(p => {
            const cat = (typeof p.category === 'string' ? p.category : p.category?.name) || 'Khác'
            return cat === catName
        })
        try {
            await Promise.all(targets.map(p =>
                http.put(`/admin/products/${p.id}`, { ...p, category: newCat.trim() })
            ))
            showToast(`Đã chuyển ${targets.length} sản phẩm sang "${newCat.trim()}"`)
            fetchProducts()
        } catch (e) {
            showToast('Lỗi: ' + e.message, 'error')
        }
    }

    // ── Detail view ───────────────────────────────────────────
    if (detail) {
        const detailProducts = catMap[detail] || []
        return (
            <div style={{ padding: 24, color: '#f9fafb' }}>
                <button
                    onClick={() => setDetail(null)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, fontSize: 14 }}
                >
                    <ArrowLeft size={16} /> Quay lại danh mục
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: `${catColor(detail)}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FolderOpen size={22} color={catColor(detail)} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{detail}</h1>
                        <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>{detailProducts.length} sản phẩm</p>
                    </div>
                </div>

                <div style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 12, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#111827' }}>
                                {['ID', 'Tên sản phẩm', 'Giá', 'Tồn kho', 'Mô tả'].map(h => (
                                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {detailProducts.map((p, i) => (
                                <tr key={p.id} style={{ borderTop: '1px solid #374151', background: i % 2 === 1 ? '#111827' : 'transparent' }}>
                                    <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: 12 }}>#{p.id}</td>
                                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{p.productName || p.name}</td>
                                    <td style={{ padding: '12px 16px', color: '#f59e0b', fontWeight: 600 }}>
                                        {Number(p.price || 0).toLocaleString('vi-VN')}đ
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
                                            background: (p.availability || 0) > 0 ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                                            color: (p.availability || 0) > 0 ? '#22c55e' : '#ef4444'
                                        }}>
                                            {p.availability ?? 0}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px', color: '#9ca3af', fontSize: 12, maxWidth: 200 }}>
                                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {p.discription || p.description || '—'}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    // ── Main view ─────────────────────────────────────────────
    return (
        <div style={{ padding: 24, color: '#f9fafb' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, marginBottom: 4 }}>Danh Mục Sản Phẩm</h1>
                    <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>
                        {Object.keys(catMap).length} danh mục · {products.length} sản phẩm
                        <span style={{ marginLeft: 8, fontSize: 11, color: '#4b5563' }}>
                            (danh mục được lấy từ trường category của sản phẩm)
                        </span>
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={fetchProducts} style={{ background: '#1f2937', color: '#d1d5db', border: '1px solid #374151', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <RefreshCw size={14} />Làm mới
                    </button>
                    <button onClick={() => setModal({ mode: 'add' })} style={{ background: '#f59e0b', color: '#111', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Plus size={14} />Thêm danh mục
                    </button>
                </div>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 20, maxWidth: 400 }}>
                <Search size={16} color="#6b7280" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Tìm danh mục..."
                    style={{ width: '100%', background: '#1f2937', color: '#f9fafb', border: '1px solid #374151', borderRadius: 8, padding: '9px 12px 9px 36px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
            </div>

            {/* Error */}
            {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', color: '#fca5a5', fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertCircle size={16} />{error}
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
                    <div style={{ width: 36, height: 36, border: '3px solid #374151', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>
            ) : (
                <>
                    {/* Category grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                        {categories.length === 0 ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#6b7280' }}>
                                <FolderOpen size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                                <p>Chưa có danh mục nào</p>
                            </div>
                        ) : categories.map(([name, prods]) => {
                            const color = catColor(name)
                            const available = prods.filter(p => (p.availability || 0) > 0).length
                            return (
                                <div key={name} style={{
                                    background: '#1f2937', border: '1px solid #374151',
                                    borderRadius: 12, padding: 20, cursor: 'pointer',
                                    transition: 'all 0.2s', position: 'relative', overflow: 'hidden'
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)' }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#374151'; e.currentTarget.style.transform = 'translateY(0)' }}
                                >
                                    {/* Color strip */}
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: '12px 12px 0 0' }} />

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                        <div style={{ width: 42, height: 42, borderRadius: 10, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FolderOpen size={20} color={color} />
                                        </div>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button
                                                onClick={e => { e.stopPropagation(); setModal({ mode: 'rename', catName: name }) }}
                                                style={{ width: 30, height: 30, border: 'none', borderRadius: 6, background: 'rgba(59,130,246,0.15)', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                title="Đổi tên"
                                            >
                                                <Edit2 size={13} />
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: 12 }}>
                                        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{name}</div>
                                        <div style={{ fontSize: 12, color: '#6b7280' }}>
                                            {prods.length} sản phẩm · {available} còn hàng
                                        </div>
                                    </div>

                                    {/* Mini bar */}
                                    <div style={{ height: 4, background: '#374151', borderRadius: 2, overflow: 'hidden', marginBottom: 14 }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${prods.length > 0 ? (available / prods.length) * 100 : 0}%`,
                                            background: color, borderRadius: 2
                                        }} />
                                    </div>

                                    <button
                                        onClick={() => setDetail(name)}
                                        style={{ width: '100%', background: 'none', border: `1px solid ${color}44`, borderRadius: 8, color: color, padding: '7px 0', cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                                    >
                                        Xem sản phẩm <ChevronRight size={13} />
                                    </button>
                                </div>
                            )
                        })}
                    </div>

                    {/* Summary table */}
                    {categories.length > 0 && (
                        <div style={{ marginTop: 24, background: '#1f2937', border: '1px solid #374151', borderRadius: 12, overflow: 'hidden' }}>
                            <div style={{ padding: '14px 20px', borderBottom: '1px solid #374151', fontWeight: 600, fontSize: 14 }}>
                                Tổng quan theo danh mục
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#111827' }}>
                                        {['Danh mục', 'Số sản phẩm', 'Còn hàng', 'Hết hàng', 'Giá TB'].map(h => (
                                            <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map(([name, prods], i) => {
                                        const available = prods.filter(p => (p.availability || 0) > 0).length
                                        const avgPrice = prods.length > 0
                                            ? prods.reduce((s, p) => s + Number(p.price || 0), 0) / prods.length
                                            : 0
                                        return (
                                            <tr key={name} style={{ borderTop: '1px solid #374151', background: i % 2 === 1 ? '#111827' : 'transparent' }}>
                                                <td style={{ padding: '10px 16px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: catColor(name), flexShrink: 0 }} />
                                                        <span style={{ fontWeight: 500 }}>{name}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '10px 16px', color: '#9ca3af' }}>{prods.length}</td>
                                                <td style={{ padding: '10px 16px', color: '#22c55e', fontWeight: 600 }}>{available}</td>
                                                <td style={{ padding: '10px 16px', color: prods.length - available > 0 ? '#ef4444' : '#6b7280' }}>
                                                    {prods.length - available}
                                                </td>
                                                <td style={{ padding: '10px 16px', color: '#f59e0b', fontWeight: 600 }}>
                                                    {avgPrice.toLocaleString('vi-VN', { maximumFractionDigits: 0 })}đ
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* ── Modal ── */}
            {modal && (
                <CategoryModal
                    mode={modal.mode}
                    catName={modal.catName}
                    existingCategories={Object.keys(catMap)}
                    onClose={() => setModal(null)}
                    onRename={handleRename}
                    onAdd={(name) => {
                        // "Thêm" chỉ là ghi nhớ tên — sản phẩm sẽ gán khi tạo mới
                        showToast(`Tên danh mục "${name}" đã sẵn sàng. Gán vào sản phẩm khi tạo mới.`, 'info')
                        setModal(null)
                    }}
                    showToast={showToast}
                />
            )}

            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
                    background: '#1f2937', border: `1px solid ${toast.type === 'error' ? '#ef4444' : toast.type === 'info' ? '#3b82f6' : '#22c55e'}`,
                    borderLeft: `4px solid ${toast.type === 'error' ? '#ef4444' : toast.type === 'info' ? '#3b82f6' : '#22c55e'}`,
                    borderRadius: 10, padding: '12px 20px', color: '#f9fafb', fontSize: 13,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)', maxWidth: 360
                }}>
                    {toast.msg}
                </div>
            )}
        </div>
    )
}

// ── Modal thêm / đổi tên danh mục ───────────────────────────────
function CategoryModal({ mode, catName, existingCategories, onClose, onRename, onAdd }) {
    const [value, setValue] = useState(mode === 'rename' ? catName : '')
    const [submitting, setSubmitting] = useState(false)
    const isRename = mode === 'rename'

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!value.trim()) return
        setSubmitting(true)
        if (isRename) await onRename(catName, value.trim())
        else onAdd(value.trim())
        setSubmitting(false)
    }

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
            onClick={onClose}>
            <div style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 16, padding: 28, width: 380, boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}
                onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                        {isRename ? `Đổi tên "${catName}"` : 'Thêm danh mục mới'}
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}><X size={18} /></button>
                </div>

                {!isRename && (
                    <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#93c5fd' }}>
                        💡 Danh mục trong BE là trường text trên sản phẩm. Tên này sẽ được dùng khi bạn tạo hoặc chỉnh sửa sản phẩm.
                    </div>
                )}

                {isRename && (
                    <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#fcd34d' }}>
                        ⚠️ Tất cả sản phẩm trong "{catName}" sẽ được cập nhật.
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Tên danh mục
                        </label>
                        <input
                            value={value} onChange={e => setValue(e.target.value)}
                            autoFocus placeholder="VD: Cà phê, Trà sữa, Bánh ngọt..."
                            style={{ width: '100%', background: '#111827', color: '#f9fafb', border: '1px solid #374151', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                        />
                        {/* Gợi ý danh mục hiện có */}
                        {!isRename && existingCategories.length > 0 && (
                            <div style={{ marginTop: 8 }}>
                                <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>Danh mục hiện có:</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                    {existingCategories.map(c => (
                                        <button key={c} type="button"
                                            onClick={() => setValue(c)}
                                            style={{ background: '#374151', color: '#d1d5db', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer' }}>
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                        <button type="button" onClick={onClose} style={{ flex: 1, background: '#374151', color: '#d1d5db', border: 'none', borderRadius: 8, padding: '10px 0', cursor: 'pointer', fontSize: 14 }}>
                            Hủy
                        </button>
                        <button type="submit" disabled={submitting || !value.trim()} style={{
                            flex: 2, background: value.trim() ? '#f59e0b' : '#374151',
                            color: value.trim() ? '#111' : '#6b7280',
                            border: 'none', borderRadius: 8, padding: '10px 0', cursor: value.trim() ? 'pointer' : 'not-allowed',
                            fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                        }}>
                            {submitting ? (
                                <div style={{ width: 16, height: 16, border: '2px solid #111', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                            ) : (
                                <><Check size={15} />{isRename ? 'Đổi tên' : 'Xác nhận'}</>
                            )}
                        </button>
                    </div>
                </form>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
        </div>
    )
}