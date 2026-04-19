// src/pages/UserSettings.jsx
// Cài đặt người dùng thường: Profile, Địa chỉ, Thông báo, Giao diện, Bảo mật

import React, { useState, useEffect, useCallback } from 'react'
import {
    Save, Bell, Palette, User, MapPin, Lock,
    Loader2, AlertCircle, CheckCircle2, Eye, EyeOff, X, Info, RefreshCw, ChevronLeft
} from 'lucide-react'
import http from '../services/api'
import { useNavigate } from 'react-router-dom'

const S = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#f0ede6', fontFamily: '"DM Sans", system-ui, sans-serif' },
    header: { background: '#111', borderBottom: '1px solid #1e1e1e', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 },
    wrap: { padding: '24px', maxWidth: 760, margin: '0 auto' },
    section: { background: '#111', border: '1px solid #1e1e1e', borderRadius: 14, marginBottom: 18, overflow: 'hidden' },
    sectionHeader: { display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', borderBottom: '1px solid #1e1e1e' },
    sectionBody: { padding: 20 },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 },
    fullRow: { marginBottom: 14 },
    label: { display: 'block', fontSize: 11, color: '#555', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 },
    input: { width: '100%', background: '#0a0a0a', color: '#f0ede6', border: '1px solid #1e1e1e', borderRadius: 8, padding: '9px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' },
    select: { width: '100%', background: '#0a0a0a', color: '#f0ede6', border: '1px solid #1e1e1e', borderRadius: 8, padding: '9px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box', cursor: 'pointer' },
    toggle: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #111' },
    saveBtn: { display: 'flex', alignItems: 'center', gap: 8, background: '#d4a853', color: '#0a0a0a', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
}

function Toggle({ value, onChange }) {
    return (
        <div onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 12, cursor: 'pointer', background: value ? '#d4a853' : '#222', position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: value ? 23 : 3, transition: 'left .2s' }} />
        </div>
    )
}

function SectionHeader({ icon: Icon, title, color = '#d4a853' }) {
    return (
        <div style={S.sectionHeader}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={15} color={color} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#f0ede6' }}>{title}</span>
        </div>
    )
}

function Toast({ msg, type, onClose }) {
    const c = type === 'error' ? '#ef4444' : '#22c55e'
    const Icon = type === 'error' ? AlertCircle : CheckCircle2
    return (
        <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9999, background: '#111', border: `1px solid ${c}`, borderLeft: `4px solid ${c}`, borderRadius: 10, padding: '12px 16px', color: '#f0ede6', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10, maxWidth: 360, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
            <Icon size={16} color={c} /><span style={{ flex: 1 }}>{msg}</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}><X size={14} /></button>
        </div>
    )
}

const TABS = [
    { id: 'profile', label: 'Hồ sơ', icon: User, color: '#d4a853' },
    { id: 'address', label: 'Địa chỉ', icon: MapPin, color: '#10b981' },
    { id: 'notify', label: 'Thông báo', icon: Bell, color: '#3b82f6' },
    { id: 'appearance', label: 'Giao diện', icon: Palette, color: '#8b5cf6' },
    { id: 'security', label: 'Bảo mật', icon: Lock, color: '#ef4444' },
]

export default function UserSettings() {
    const navigate = useNavigate()
    const currentUser = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}') } catch { return {} } })()
    const userId = currentUser?.id

    const [activeTab, setActiveTab] = useState('profile')
    const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '' })
    const [address, setAddress] = useState({ street: '', streetNumber: '', zipCode: '', locality: '', country: 'Việt Nam' })
    const [notify, setNotify] = useState({ emailNotifications: true, orderNotifications: true, paymentAlerts: true, deliveryAlerts: true, promotionNotifications: false, newsletterSubscribed: false })
    const [appear, setAppear] = useState({ themeColor: '#d4a853', darkMode: false, fontSize: 'medium', language: 'vi' })
    const [pwForm, setPwForm] = useState({ newPassword: '', confirmPassword: '' })
    const [showPw, setShowPw] = useState({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState(null)

    const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500) }

    const loadData = useCallback(async () => {
        setLoading(true)
        try {
            const [userRes, settingsRes] = await Promise.allSettled([
                userId ? http.get(`/users/${userId}`) : Promise.resolve({ data: null }),
                userId ? http.get(`/settings/user/${userId}`) : Promise.resolve({ data: { data: {} } }),
            ])
            const u = userRes.status === 'fulfilled' ? userRes.value.data : null
            const s = settingsRes.status === 'fulfilled' ? (settingsRes.value.data?.data || {}) : {}

            if (u?.userDetails) {
                const d = u.userDetails
                setProfile({ firstName: d.firstName || '', lastName: d.lastName || '', email: d.email || '', phoneNumber: d.phoneNumber || '' })
                setAddress({ street: d.street || '', streetNumber: d.streetNumber || '', zipCode: d.zipCode || '', locality: d.locality || '', country: d.country || 'Việt Nam' })
            }
            setNotify(p => ({ ...p, ...s }))
            setAppear(p => ({ ...p, ...s }))
        } catch { } finally { setLoading(false) }
    }, [userId])

    useEffect(() => { loadData() }, [loadData])

    const handleSave = async () => {
        setSaving(true)
        try {
            // Cập nhật thông tin profile qua user-service
            if (userId) {
                await http.put(`/users/${userId}`, {
                    userDetails: { ...profile, ...address }
                })
                // Lưu settings (thông báo + giao diện) qua setting-service
                await http.put(`/settings/user/${userId}`, { settings: { ...notify, ...appear } })
            }
            localStorage.setItem('themeColor', appear.themeColor)
            showToast('✅ Đã cập nhật thông tin')
        } catch (e) {
            showToast('❌ Lỗi: ' + (e.response?.data?.message || e.message), 'error')
        } finally { setSaving(false) }
    }

    const handleChangePassword = async () => {
        if (!pwForm.newPassword || pwForm.newPassword.length < 6) { showToast('Mật khẩu phải ít nhất 6 ký tự', 'error'); return }
        if (pwForm.newPassword !== pwForm.confirmPassword) { showToast('Mật khẩu không khớp', 'error'); return }
        try {
            await http.put(`/users/${userId}`, { userPassword: pwForm.newPassword })
            setPwForm({ newPassword: '', confirmPassword: '' })
            showToast('✅ Đổi mật khẩu thành công')
        } catch { showToast('❌ Lỗi đổi mật khẩu', 'error') }
    }

    if (loading) return (
        <div style={{ ...S.page, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Loader2 size={28} color="#d4a853" style={{ animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
        </div>
    )

    return (
        <div style={S.page}>
            <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>

            {/* Header */}
            <div style={S.header}>
                <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#d4a853', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                    <ChevronLeft size={16} /> Quay lại
                </button>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: '#f0ede6' }}>Cài Đặt Tài Khoản</div>
                    <div style={{ fontSize: 11, color: '#555' }}>{profile.firstName} {profile.lastName} · {currentUser?.userName}</div>
                </div>
                <button onClick={handleSave} disabled={saving} style={S.saveBtn}>
                    {saving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={13} />}
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
            </div>

            <div style={S.wrap}>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: 4, background: '#111', borderRadius: 10, padding: 4, marginBottom: 20, overflowX: 'auto' }}>
                    {TABS.map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, minWidth: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', background: activeTab === t.id ? '#0a0a0a' : 'transparent', color: activeTab === t.id ? t.color : '#555', fontSize: 11, fontWeight: activeTab === t.id ? 700 : 500, transition: 'all .2s', whiteSpace: 'nowrap' }}>
                            <t.icon size={12} />{t.label}
                        </button>
                    ))}
                </div>

                {/* HỒ SƠ */}
                {activeTab === 'profile' && (
                    <div style={S.section}>
                        <SectionHeader icon={User} title="Thông tin cá nhân" />
                        <div style={S.sectionBody}>
                            <div style={{ display: 'flex', gap: 12, marginBottom: 20, padding: '12px 16px', background: '#0a0a0a', borderRadius: 10, alignItems: 'center' }}>
                                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #d4a853, #b8860b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#0a0a0a', fontWeight: 800 }}>
                                    {(profile.firstName?.[0] || currentUser?.userName?.[0] || '?').toUpperCase()}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 15, color: '#f0ede6' }}>{profile.firstName} {profile.lastName}</div>
                                    <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>@{currentUser?.userName}</div>
                                </div>
                            </div>
                            <div style={S.row}>
                                <div><label style={S.label}>Họ</label><input style={S.input} value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} placeholder="Nguyễn" /></div>
                                <div><label style={S.label}>Tên</label><input style={S.input} value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} placeholder="Văn A" /></div>
                            </div>
                            <div style={S.row}>
                                <div><label style={S.label}>Email</label><input style={S.input} type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} placeholder="email@example.com" /></div>
                                <div><label style={S.label}>Số điện thoại</label><input style={S.input} value={profile.phoneNumber} onChange={e => setProfile(p => ({ ...p, phoneNumber: e.target.value }))} placeholder="0900000000" /></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ĐỊA CHỈ */}
                {activeTab === 'address' && (
                    <div style={S.section}>
                        <SectionHeader icon={MapPin} title="Địa chỉ giao hàng" color="#10b981" />
                        <div style={S.sectionBody}>
                            <div style={S.row}>
                                <div><label style={S.label}>Đường / Phố</label><input style={S.input} value={address.street} onChange={e => setAddress(p => ({ ...p, street: e.target.value }))} placeholder="Đường Nguyễn Văn Linh" /></div>
                                <div><label style={S.label}>Số nhà</label><input style={S.input} value={address.streetNumber} onChange={e => setAddress(p => ({ ...p, streetNumber: e.target.value }))} placeholder="123" /></div>
                            </div>
                            <div style={S.row}>
                                <div><label style={S.label}>Phường / Xã / Thị trấn</label><input style={S.input} value={address.locality} onChange={e => setAddress(p => ({ ...p, locality: e.target.value }))} placeholder="Phường Bình Thuận" /></div>
                                <div><label style={S.label}>Mã bưu điện</label><input style={S.input} value={address.zipCode} onChange={e => setAddress(p => ({ ...p, zipCode: e.target.value }))} placeholder="70000" /></div>
                            </div>
                            <div style={S.fullRow}><label style={S.label}>Quốc gia</label>
                                <select style={S.select} value={address.country} onChange={e => setAddress(p => ({ ...p, country: e.target.value }))}>
                                    <option value="Việt Nam">🇻🇳 Việt Nam</option>
                                    <option value="Cambodia">🇰🇭 Cambodia</option>
                                    <option value="Thailand">🇹🇭 Thailand</option>
                                </select>
                            </div>
                            <div style={{ padding: '10px 14px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 8, fontSize: 12, color: '#6b7280' }}>
                                💡 Địa chỉ này sẽ được điền tự động khi bạn thanh toán đơn hàng
                            </div>
                        </div>
                    </div>
                )}

                {/* THÔNG BÁO */}
                {activeTab === 'notify' && (
                    <div style={S.section}>
                        <SectionHeader icon={Bell} title="Cài đặt thông báo" color="#3b82f6" />
                        <div style={S.sectionBody}>
                            {[
                                { key: 'orderNotifications', label: 'Thông báo đơn hàng', sub: 'Xác nhận khi đặt hàng thành công' },
                                { key: 'paymentAlerts', label: 'Thông báo thanh toán', sub: 'Xác nhận khi thanh toán thành công / thất bại' },
                                { key: 'deliveryAlerts', label: 'Thông báo giao hàng', sub: 'Cập nhật trạng thái vận chuyển' },
                                { key: 'emailNotifications', label: 'Nhận email thông báo', sub: 'Gửi tất cả thông báo vào email của bạn' },
                                { key: 'promotionNotifications', label: 'Thông báo khuyến mãi', sub: 'Ưu đãi, mã giảm giá, sự kiện đặc biệt' },
                                { key: 'newsletterSubscribed', label: 'Đăng ký nhận bản tin', sub: 'Nhận email thông tin mới hàng tuần' },
                            ].map(item => (
                                <div key={item.key} style={S.toggle}>
                                    <div><div style={{ fontSize: 13, color: '#e5e7eb' }}>{item.label}</div><div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{item.sub}</div></div>
                                    <Toggle value={!!notify[item.key]} onChange={v => setNotify(p => ({ ...p, [item.key]: v }))} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* GIAO DIỆN */}
                {activeTab === 'appearance' && (
                    <div style={S.section}>
                        <SectionHeader icon={Palette} title="Tuỳ chỉnh giao diện" color="#8b5cf6" />
                        <div style={S.sectionBody}>
                            <div style={S.fullRow}>
                                <label style={S.label}>Màu chủ đề</label>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                                    <input type="color" value={appear.themeColor || '#d4a853'} onChange={e => setAppear(p => ({ ...p, themeColor: e.target.value }))} style={{ width: 42, height: 36, padding: 2, background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: 6, cursor: 'pointer' }} />
                                    <input style={{ ...S.input, flex: 1 }} value={appear.themeColor || '#d4a853'} onChange={e => setAppear(p => ({ ...p, themeColor: e.target.value }))} maxLength={7} />
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {['#d4a853', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6', '#EC4899', '#f59e0b', '#06b6d4'].map(c => (
                                        <div key={c} onClick={() => setAppear(p => ({ ...p, themeColor: c }))} style={{ width: 26, height: 26, borderRadius: '50%', background: c, cursor: 'pointer', border: appear.themeColor === c ? '3px solid #fff' : '2px solid transparent', boxSizing: 'border-box' }} />
                                    ))}
                                </div>
                            </div>
                            <div style={S.row}>
                                <div><label style={S.label}>Ngôn ngữ</label>
                                    <select style={S.select} value={appear.language || 'vi'} onChange={e => setAppear(p => ({ ...p, language: e.target.value }))}>
                                        <option value="vi">🇻🇳 Tiếng Việt</option><option value="en">🇺🇸 English</option>
                                    </select></div>
                                <div><label style={S.label}>Cỡ chữ</label>
                                    <select style={S.select} value={appear.fontSize || 'medium'} onChange={e => setAppear(p => ({ ...p, fontSize: e.target.value }))}>
                                        <option value="small">Nhỏ</option><option value="medium">Vừa</option><option value="large">Lớn</option>
                                    </select></div>
                            </div>
                            <div style={S.toggle}>
                                <div><div style={{ fontSize: 13, color: '#e5e7eb' }}>Chế độ tối</div><div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>Sử dụng nền tối cho toàn bộ trang web</div></div>
                                <Toggle value={!!appear.darkMode} onChange={v => setAppear(p => ({ ...p, darkMode: v }))} />
                            </div>
                        </div>
                    </div>
                )}

                {/* BẢO MẬT */}
                {activeTab === 'security' && (
                    <div style={S.section}>
                        <SectionHeader icon={Lock} title="Bảo mật tài khoản" color="#ef4444" />
                        <div style={S.sectionBody}>
                            <div style={{ padding: '12px 14px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, marginBottom: 18, fontSize: 12, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Info size={14} color="#ef4444" />
                                <div>Không bao giờ chia sẻ mật khẩu của bạn với người khác. Hãy chọn mật khẩu mạnh ít nhất 6 ký tự.</div>
                            </div>
                            {['newPassword', 'confirmPassword'].map((field, i) => (
                                <div key={field} style={S.fullRow}>
                                    <label style={S.label}>{['Mật khẩu mới', 'Xác nhận mật khẩu'][i]}</label>
                                    <div style={{ position: 'relative' }}>
                                        <input style={{ ...S.input, paddingRight: 40 }} type={showPw[field] ? 'text' : 'password'} value={pwForm[field]} onChange={e => setPwForm(p => ({ ...p, [field]: e.target.value }))} placeholder="••••••••" />
                                        <button onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}>
                                            {showPw[field] ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button onClick={handleChangePassword} style={{ ...S.saveBtn, width: 'fit-content' }}>
                                <Lock size={13} /> Đổi mật khẩu
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    )
}