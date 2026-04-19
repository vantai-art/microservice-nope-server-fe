// src/pages/admin/AdminUsers.jsx
// ✅ BE endpoints:
//   GET    /users        → List<User> { id, userName, active, userDetails:{firstName,lastName,email,phoneNumber,...}, role:{roleName} }
//   GET    /users/{id}   → User
//   PUT    /users/{id}   → User (toggle active: 0/1)
//   DELETE /users/{id}   → 200 OK
//   GET    /order/user/{userId} → List<Order> (để đếm đơn hàng)
// KHÔNG dùng JWT token

import React, { useState, useEffect, useCallback } from 'react'
import { Search, Eye, Trash2, Edit2, X, RefreshCw, Users, UserCheck, UserX, ShoppingBag, Mail, Phone, MapPin } from 'lucide-react'
import http from '../../services/api'

const S = {
    wrap: { padding: 24, color: '#f9fafb', fontFamily: 'inherit' },
    card: { background: '#1f2937', border: '1px solid #374151', borderRadius: 12 },
    th: { padding: '12px 16px', textAlign: 'left', fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', background: '#111827' },
    td: { padding: '12px 16px', borderTop: '1px solid #374151' },
    badge: (bg, c) => ({ display: 'inline-block', padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: bg, color: c }),
    btn: (bg) => ({ background: bg, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }),
    input: { width: '100%', background: '#111827', color: '#f9fafb', border: '1px solid #374151', borderRadius: 8, padding: '9px 14px', fontSize: 13, outline: 'none', boxSizing: 'border-box' },
}

function Toast({ msg, type }) {
    const c = type === 'error' ? '#ef4444' : '#22c55e'
    return (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: '#1f2937', border: `1px solid ${c}`, borderLeft: `4px solid ${c}`, borderRadius: 10, padding: '12px 20px', color: '#f9fafb', fontSize: 13, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', maxWidth: 360 }}>
            {msg}
        </div>
    )
}

function getName(u) {
    const d = u.userDetails
    if (d?.firstName || d?.lastName) return `${d.firstName || ''} ${d.lastName || ''}`.trim()
    return u.userName
}

export default function AdminUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all') // all | active | inactive
    const [selected, setSelected] = useState(null)  // user for detail modal
    const [toast, setToast] = useState(null)

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    // ── Fetch GET /users ──────────────────────────────────────
    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const res = await http.get('/users')
            const list = Array.isArray(res.data) ? res.data : []
            // Chỉ lấy ROLE_USER (khách hàng)
            const customers = list.filter(u => {
                const r = u.role?.roleName || ''
                return r === 'ROLE_USER' || r === ''
            })
            setUsers(customers)
        } catch (e) {
            showToast('Không thể tải danh sách khách hàng: ' + e.message, 'error')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchUsers() }, [fetchUsers])

    // ── Toggle active: PUT /users/{id} ────────────────────────
    const toggleActive = async (u) => {
        const newActive = u.active === 1 ? 0 : 1
        const label = newActive === 1 ? 'kích hoạt' : 'khóa'
        if (!window.confirm(`Bạn có chắc muốn ${label} tài khoản "${u.userName}"?`)) return
        try {
            await http.put(`/users/${u.id}`, { ...u, active: newActive })
            setUsers(prev => prev.map(x => x.id === u.id ? { ...x, active: newActive } : x))
            if (selected?.id === u.id) setSelected(s => ({ ...s, active: newActive }))
            showToast(`Đã ${label} tài khoản ${u.userName}`)
        } catch (e) {
            showToast('Lỗi cập nhật: ' + (e.response?.data?.message || e.message), 'error')
        }
    }

    // ── DELETE /users/{id} ────────────────────────────────────
    const deleteUser = async (u) => {
        if (!window.confirm(`Xóa vĩnh viễn tài khoản "${u.userName}"?`)) return
        try {
            await http.delete(`/users/${u.id}`)
            setUsers(prev => prev.filter(x => x.id !== u.id))
            if (selected?.id === u.id) setSelected(null)
            showToast(`Đã xóa ${u.userName}`)
        } catch (e) {
            showToast('Lỗi xóa: ' + (e.response?.data?.message || e.message), 'error')
        }
    }

    const filtered = users.filter(u => {
        const q = search.toLowerCase()
        const name = getName(u).toLowerCase()
        const matchSearch = u.userName.toLowerCase().includes(q) || name.includes(q) || (u.userDetails?.email || '').toLowerCase().includes(q)
        const matchFilter = filter === 'all' || (filter === 'active' && u.active === 1) || (filter === 'inactive' && u.active !== 1)
        return matchSearch && matchFilter
    })

    const activeCount = users.filter(u => u.active === 1).length
    const inactiveCount = users.filter(u => u.active !== 1).length

    return (
        <div style={S.wrap}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, marginBottom: 4 }}>Quản Lý Khách Hàng</h1>
                    <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>{users.length} khách hàng đã đăng ký</p>
                </div>
                <button onClick={fetchUsers} style={S.btn('#374151')}>
                    <RefreshCw size={14} />Làm mới
                </button>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
                {[
                    { icon: <Users size={18} />, label: 'Tổng', value: users.length, color: '#3b82f6' },
                    { icon: <UserCheck size={18} />, label: 'Đang hoạt động', value: activeCount, color: '#22c55e' },
                    { icon: <UserX size={18} />, label: 'Bị khóa', value: inactiveCount, color: '#ef4444' },
                ].map(s => (
                    <div key={s.label} style={{ ...S.card, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ color: s.color }}>{s.icon}</div>
                        <div>
                            <div style={{ fontSize: 11, color: '#6b7280' }}>{s.label}</div>
                            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search + filter */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={15} color="#6b7280" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm tên, username, email..."
                        style={{ ...S.input, paddingLeft: 36 }} />
                </div>
                {['all', 'active', 'inactive'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                        background: filter === f ? '#f59e0b' : '#1f2937',
                        color: filter === f ? '#111' : '#9ca3af',
                        border: `1px solid ${filter === f ? '#f59e0b' : '#374151'}`,
                        borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600
                    }}>
                        {{ all: 'Tất cả', active: 'Hoạt động', inactive: 'Bị khóa' }[f]}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div style={{ ...S.card, overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: 60, textAlign: 'center' }}>
                        <div style={{ width: 36, height: 36, border: '3px solid #374151', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                        <p style={{ color: '#6b7280', fontSize: 13 }}>Đang tải...</p>
                        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                {['Khách hàng', 'Username', 'Email', 'SĐT', 'Trạng thái', 'Thao tác'].map(h => (
                                    <th key={h} style={S.th}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={6} style={{ ...S.td, textAlign: 'center', color: '#6b7280', padding: 40 }}>Không có dữ liệu</td></tr>
                            ) : filtered.map((u, i) => (
                                <tr key={u.id} style={{ background: i % 2 === 1 ? '#111827' : 'transparent' }}>
                                    <td style={S.td}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                                                {getName(u)[0]?.toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 13 }}>{getName(u)}</div>
                                                <div style={{ color: '#6b7280', fontSize: 11 }}>ID #{u.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ ...S.td, color: '#9ca3af', fontSize: 13 }}>{u.userName}</td>
                                    <td style={{ ...S.td, fontSize: 12, color: '#d1d5db' }}>{u.userDetails?.email || '—'}</td>
                                    <td style={{ ...S.td, fontSize: 12, color: '#d1d5db' }}>{u.userDetails?.phoneNumber || '—'}</td>
                                    <td style={S.td}>
                                        <span style={u.active === 1
                                            ? S.badge('rgba(34,197,94,0.15)', '#22c55e')
                                            : S.badge('rgba(239,68,68,0.15)', '#ef4444')
                                        }>
                                            {u.active === 1 ? 'Hoạt động' : 'Bị khóa'}
                                        </span>
                                    </td>
                                    <td style={S.td}>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button onClick={() => setSelected(u)} style={{ width: 32, height: 32, background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Xem chi tiết">
                                                <Eye size={14} />
                                            </button>
                                            <button onClick={() => toggleActive(u)} style={{ width: 32, height: 32, background: u.active === 1 ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)', color: u.active === 1 ? '#ef4444' : '#22c55e', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={u.active === 1 ? 'Khóa' : 'Kích hoạt'}>
                                                {u.active === 1 ? <UserX size={14} /> : <UserCheck size={14} />}
                                            </button>
                                            <button onClick={() => deleteUser(u)} style={{ width: 32, height: 32, background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Xóa">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Detail modal */}
            {selected && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }} onClick={() => setSelected(null)}>
                    <div style={{ ...S.card, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Chi Tiết Khách Hàng</h2>
                            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}><X size={18} /></button>
                        </div>
                        <div style={{ padding: 20 }}>
                            {/* Avatar + name */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(245,158,11,0.2)', border: '2px solid rgba(245,158,11,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', fontWeight: 700, fontSize: 22 }}>
                                    {getName(selected)[0]?.toUpperCase() || '?'}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 16 }}>{getName(selected)}</div>
                                    <div style={{ color: '#6b7280', fontSize: 12 }}>@{selected.userName} · ID #{selected.id}</div>
                                    <span style={selected.active === 1 ? S.badge('rgba(34,197,94,0.15)', '#22c55e') : S.badge('rgba(239,68,68,0.15)', '#ef4444')}>
                                        {selected.active === 1 ? 'Hoạt động' : 'Bị khóa'}
                                    </span>
                                </div>
                            </div>

                            {/* Details */}
                            <div style={{ background: '#111827', borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                                {[
                                    { icon: <Mail size={14} />, label: 'Email', val: selected.userDetails?.email },
                                    { icon: <Phone size={14} />, label: 'Điện thoại', val: selected.userDetails?.phoneNumber },
                                    { icon: <MapPin size={14} />, label: 'Địa chỉ', val: [selected.userDetails?.street, selected.userDetails?.streetNumber, selected.userDetails?.locality, selected.userDetails?.country].filter(Boolean).join(', ') },
                                ].map(row => row.val ? (
                                    <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <span style={{ color: '#f59e0b' }}>{row.icon}</span>
                                        <span style={{ color: '#6b7280', fontSize: 12, minWidth: 70 }}>{row.label}</span>
                                        <span style={{ color: '#d1d5db', fontSize: 13 }}>{row.val}</span>
                                    </div>
                                ) : null)}
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={() => toggleActive(selected)} style={{ flex: 1, background: selected.active === 1 ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)', color: selected.active === 1 ? '#ef4444' : '#22c55e', border: `1px solid ${selected.active === 1 ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`, borderRadius: 8, padding: '9px 0', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                                    {selected.active === 1 ? '🔒 Khóa tài khoản' : '🔓 Kích hoạt'}
                                </button>
                                <button onClick={() => deleteUser(selected)} style={{ flex: 1, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '9px 0', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                                    🗑 Xóa tài khoản
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {toast && <Toast {...toast} />}
        </div>
    )
}