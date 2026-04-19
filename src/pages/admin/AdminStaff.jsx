// src/pages/admin/AdminStaff.jsx
// ✅ BE endpoints:
//   GET  /users/staffs  → List<User> (ROLE_STAFF)
//   GET  /users/admins  → List<User> (ROLE_ADMIN)
//   POST /users/staff   → tạo staff: { userName, userPassword, userDetails:{firstName,lastName,email,phoneNumber} }
//   POST /users/admin   → tạo admin: { userName, userPassword, userDetails:{...} }
//   PUT  /users/{id}    → cập nhật user
//   DELETE /users/{id}  → xóa user
// KHÔNG dùng JWT token

import React, { useState, useEffect, useCallback } from 'react'
import { Search, Plus, Eye, Trash2, Edit2, X, RefreshCw, Shield, UserCog } from 'lucide-react'
import http from '../../services/api'

const S = {
    wrap: { padding: 24, color: '#f9fafb' },
    card: { background: '#1f2937', border: '1px solid #374151', borderRadius: 12 },
    th: { padding: '12px 16px', textAlign: 'left', fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', background: '#111827' },
    td: { padding: '12px 16px', borderTop: '1px solid #374151' },
    input: { width: '100%', background: '#111827', color: '#f9fafb', border: '1px solid #374151', borderRadius: 8, padding: '9px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' },
    label: { display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' },
}

const ROLE_INFO = {
    ROLE_ADMIN: { label: 'Admin', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
    ROLE_STAFF: { label: 'Nhân viên', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
}

function getName(u) {
    const d = u.userDetails
    if (d?.firstName || d?.lastName) return `${d.firstName || ''} ${d.lastName || ''}`.trim()
    return u.userName
}

function Toast({ msg, type }) {
    const c = type === 'error' ? '#ef4444' : '#22c55e'
    return <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: '#1f2937', border: `1px solid ${c}`, borderLeft: `4px solid ${c}`, borderRadius: 10, padding: '12px 20px', color: '#f9fafb', fontSize: 13, maxWidth: 360 }}>{msg}</div>
}

const EMPTY_FORM = { userName: '', userPassword: '', firstName: '', lastName: '', email: '', phoneNumber: '' }

export default function AdminStaff() {
    const [staff, setStaff] = useState([]) // ROLE_STAFF
    const [admins, setAdmins] = useState([]) // ROLE_ADMIN
    const [tab, setTab] = useState('staff') // 'staff' | 'admin'
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null) // null | { mode:'add'|'edit'|'detail', roleTarget?:'staff'|'admin', user? }
    const [form, setForm] = useState(EMPTY_FORM)
    const [submitting, setSub] = useState(false)
    const [toast, setToast] = useState(null)

    const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000) }

    const fetchAll = useCallback(async () => {
        setLoading(true)
        try {
            const [sRes, aRes] = await Promise.allSettled([
                http.get('/users/staffs'),
                http.get('/users/admins'),
            ])
            setStaff(sRes.status === 'fulfilled' && Array.isArray(sRes.value.data) ? sRes.value.data : [])
            setAdmins(aRes.status === 'fulfilled' && Array.isArray(aRes.value.data) ? aRes.value.data : [])
        } catch (e) {
            showToast('Lỗi tải dữ liệu: ' + e.message, 'error')
        } finally { setLoading(false) }
    }, [])

    useEffect(() => { fetchAll() }, [fetchAll])

    const openAdd = (roleTarget) => {
        setForm(EMPTY_FORM)
        setModal({ mode: 'add', roleTarget })
    }

    const openEdit = (u) => {
        setForm({
            userName: u.userName || '',
            userPassword: '',
            firstName: u.userDetails?.firstName || '',
            lastName: u.userDetails?.lastName || '',
            email: u.userDetails?.email || '',
            phoneNumber: u.userDetails?.phoneNumber || '',
        })
        setModal({ mode: 'edit', user: u })
    }

    // ── POST /users/staff hoặc /users/admin ───────────────────
    const handleAdd = async (e) => {
        e.preventDefault()
        if (!form.userName || !form.userPassword || !form.firstName) {
            showToast('Vui lòng điền đủ các trường bắt buộc (*)', 'error'); return
        }
        setSub(true)
        const payload = {
            userName: form.userName,
            userPassword: form.userPassword,
            active: 1,
            userDetails: {
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                phoneNumber: form.phoneNumber,
            }
        }
        const url = modal.roleTarget === 'admin' ? '/users/admin' : '/users/staff'
        try {
            await http.post(url, payload)
            showToast(`Tạo tài khoản thành công!`)
            setModal(null)
            fetchAll()
        } catch (e) {
            showToast('Lỗi: ' + (e.response?.data?.message || e.message), 'error')
        } finally { setSub(false) }
    }

    // ── PUT /users/{id} ───────────────────────────────────────
    const handleEdit = async (e) => {
        e.preventDefault()
        const u = modal.user
        setSub(true)
        const payload = {
            ...u,
            userName: form.userName,
            ...(form.userPassword ? { userPassword: form.userPassword } : {}),
            userDetails: {
                ...u.userDetails,
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                phoneNumber: form.phoneNumber,
            }
        }
        try {
            await http.put(`/users/${u.id}`, payload)
            showToast('Cập nhật thành công!')
            setModal(null)
            fetchAll()
        } catch (e) {
            showToast('Lỗi: ' + (e.response?.data?.message || e.message), 'error')
        } finally { setSub(false) }
    }

    // ── DELETE /users/{id} ────────────────────────────────────
    const handleDelete = async (u) => {
        if (!window.confirm(`Xóa tài khoản "${u.userName}"?`)) return
        try {
            await http.delete(`/users/${u.id}`)
            showToast('Đã xóa!')
            fetchAll()
        } catch (e) {
            showToast('Lỗi xóa: ' + (e.response?.data?.message || e.message), 'error')
        }
    }

    const list = tab === 'staff' ? staff : admins
    const roleKey = tab === 'staff' ? 'ROLE_STAFF' : 'ROLE_ADMIN'
    const ri = ROLE_INFO[roleKey]

    const filtered = list.filter(u => {
        const q = search.toLowerCase()
        return u.userName.toLowerCase().includes(q) || getName(u).toLowerCase().includes(q) || (u.userDetails?.email || '').toLowerCase().includes(q)
    })

    return (
        <div style={S.wrap}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, marginBottom: 4 }}>Quản Lý Nhân Viên</h1>
                    <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>{staff.length} nhân viên · {admins.length} admin</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={fetchAll} style={{ background: '#374151', color: '#d1d5db', border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <RefreshCw size={14} />Làm mới
                    </button>
                    <button onClick={() => openAdd('staff')} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Plus size={14} />Thêm nhân viên
                    </button>
                    <button onClick={() => openAdd('admin')} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Shield size={14} />Thêm Admin
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {[['staff', 'Nhân viên (ROLE_STAFF)', '#3b82f6'], ['admin', 'Quản trị viên (ROLE_ADMIN)', '#ef4444']].map(([v, l, c]) => (
                    <button key={v} onClick={() => setTab(v)} style={{ background: tab === v ? c : '#1f2937', color: tab === v ? '#fff' : '#9ca3af', border: `1px solid ${tab === v ? c : '#374151'}`, borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                        {l}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 16, maxWidth: 400 }}>
                <Search size={14} color="#6b7280" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm tên, username, email..."
                    style={{ ...S.input, paddingLeft: 34 }} />
            </div>

            {/* Table */}
            <div style={{ ...S.card, overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: 60, textAlign: 'center' }}>
                        <div style={{ width: 32, height: 32, border: '3px solid #374151', borderTopColor: ri.color, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' }} />
                        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                        <p style={{ color: '#6b7280', fontSize: 13 }}>Đang tải...</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>{['Họ tên', 'Username', 'Email', 'SĐT', 'Role', 'Thao tác'].map(h => (
                                <th key={h} style={S.th}>{h}</th>
                            ))}</tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={6} style={{ ...S.td, textAlign: 'center', color: '#6b7280', padding: 40 }}>Không có dữ liệu</td></tr>
                            ) : filtered.map((u, i) => {
                                const r = ROLE_INFO[u.role?.roleName] || ri
                                return (
                                    <tr key={u.id} style={{ background: i % 2 === 1 ? '#111827' : 'transparent' }}>
                                        <td style={S.td}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${r.bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: r.color, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                                                    {getName(u)[0]?.toUpperCase() || '?'}
                                                </div>
                                                <span style={{ fontWeight: 600, fontSize: 13 }}>{getName(u)}</span>
                                            </div>
                                        </td>
                                        <td style={{ ...S.td, color: '#9ca3af', fontSize: 12 }}>{u.userName}</td>
                                        <td style={{ ...S.td, fontSize: 12 }}>{u.userDetails?.email || '—'}</td>
                                        <td style={{ ...S.td, fontSize: 12 }}>{u.userDetails?.phoneNumber || '—'}</td>
                                        <td style={S.td}>
                                            <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: r.bg, color: r.color }}>
                                                {r.label}
                                            </span>
                                        </td>
                                        <td style={S.td}>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button onClick={() => openEdit(u)} style={{ width: 30, height: 30, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Sửa"><Edit2 size={13} /></button>
                                                <button onClick={() => handleDelete(u)} style={{ width: 30, height: 30, background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Xóa"><Trash2 size={13} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal thêm/sửa */}
            {modal && (modal.mode === 'add' || modal.mode === 'edit') && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }} onClick={() => setModal(null)}>
                    <div style={{ ...S.card, width: '100%', maxWidth: 440, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>
                                {modal.mode === 'add' ? `Thêm ${modal.roleTarget === 'admin' ? 'Admin' : 'Nhân viên'}` : 'Chỉnh sửa tài khoản'}
                            </h2>
                            <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}><X size={18} /></button>
                        </div>
                        <form onSubmit={modal.mode === 'add' ? handleAdd : handleEdit} style={{ padding: 20 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                                {[
                                    { k: 'firstName', l: 'Họ *', required: true },
                                    { k: 'lastName', l: 'Tên', required: false },
                                ].map(f => (
                                    <div key={f.k}>
                                        <label style={S.label}>{f.l}</label>
                                        <input value={form[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))} required={f.required} style={S.input} />
                                    </div>
                                ))}
                            </div>
                            {[
                                { k: 'userName', l: 'Username *', required: true, type: 'text' },
                                { k: 'userPassword', l: modal.mode === 'edit' ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu *', required: modal.mode === 'add', type: 'password' },
                                { k: 'email', l: 'Email', required: false, type: 'email' },
                                { k: 'phoneNumber', l: 'Số điện thoại', required: false, type: 'tel' },
                            ].map(f => (
                                <div key={f.k} style={{ marginBottom: 12 }}>
                                    <label style={S.label}>{f.l}</label>
                                    <input type={f.type || 'text'} value={form[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))} required={f.required} style={S.input} />
                                </div>
                            ))}
                            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                                <button type="button" onClick={() => setModal(null)} style={{ flex: 1, background: '#374151', color: '#d1d5db', border: 'none', borderRadius: 8, padding: '10px 0', cursor: 'pointer', fontSize: 13 }}>Hủy</button>
                                <button type="submit" disabled={submitting} style={{ flex: 2, background: '#f59e0b', color: '#111', border: 'none', borderRadius: 8, padding: '10px 0', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                                    {submitting ? 'Đang xử lý...' : modal.mode === 'add' ? 'Tạo tài khoản' : 'Lưu thay đổi'}
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