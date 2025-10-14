import React, { useState } from 'react';
import { Save, Globe, Bell, Shield, Palette, Database, Mail, Package } from 'lucide-react';

function AdminSettings() {
    const [settings, setSettings] = useState({
        // Thông tin chung
        storeName: 'Coffee Blend',
        storeEmail: 'contact@coffeeblend.vn',
        storePhone: '0328778198',
        storeAddress: '2/60, Thủ Đức, TP.HCM',

        // Cài đặt thông báo
        emailNotifications: true,
        orderNotifications: true,
        promotionNotifications: false,

        // Cài đặt cửa hàng
        currency: 'VND',
        timezone: 'Asia/Ho_Chi_Minh',
        language: 'vi',
        taxRate: 10,

        // Giao diện
        themeColor: '#D97706',
        darkMode: true,

        // Vận chuyển
        freeShippingThreshold: 200000,
        shippingFee: 30000
    });

    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        // Lưu cài đặt (gọi API)
        console.log('Lưu cài đặt:', settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const themeColors = [
        { value: '#D97706', name: 'Cam' },
        { value: '#DC2626', name: 'Đỏ' },
        { value: '#3B82F6', name: 'Xanh Dương' },
        { value: '#10B981', name: 'Xanh Lá' },
        { value: '#8B5CF6', name: 'Tím' },
        { value: '#EC4899', name: 'Hồng' }
    ];

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Cài Đặt Hệ Thống</h1>
                <p className="text-gray-400">Quản lý cấu hình và tùy chỉnh hệ thống</p>
            </div>

            {saved && (
                <div className="mb-6 bg-green-500/20 border border-green-500 text-green-400 px-6 py-4 rounded-lg flex items-center gap-3">
                    <Save className="w-5 h-5" />
                    <span>Cài đặt đã được lưu thành công!</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Thông Tin Chung */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-amber-500/20 p-3 rounded-lg">
                            <Globe className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Thông Tin Chung</h2>
                            <p className="text-gray-400 text-sm">Thông tin cơ bản về cửa hàng</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-white mb-2 font-medium">Tên Cửa Hàng</label>
                            <input
                                type="text"
                                value={settings.storeName}
                                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                                className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-amber-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-white mb-2 font-medium">Email</label>
                            <input
                                type="email"
                                value={settings.storeEmail}
                                onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                                className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-amber-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-white mb-2 font-medium">Số Điện Thoại</label>
                            <input
                                type="tel"
                                value={settings.storePhone}
                                onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                                className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-amber-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-white mb-2 font-medium">Địa Chỉ</label>
                            <textarea
                                value={settings.storeAddress}
                                onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                                className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-amber-500 outline-none"
                                rows={2}
                            />
                        </div>
                    </div>
                </div>

                {/* Thông Báo */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-blue-500/20 p-3 rounded-lg">
                            <Bell className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Thông Báo</h2>
                            <p className="text-gray-400 text-sm">Cài đặt thông báo hệ thống</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                            <div>
                                <div className="text-white font-medium">Thông Báo Email</div>
                                <div className="text-gray-400 text-sm">Nhận thông báo qua email</div>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                                className={`relative w-14 h-7 rounded-full transition-colors ${settings.emailNotifications ? 'bg-amber-600' : 'bg-gray-600'
                                    }`}
                            >
                                <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.emailNotifications ? 'translate-x-7' : ''
                                    }`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                            <div>
                                <div className="text-white font-medium">Thông Báo Đơn Hàng</div>
                                <div className="text-gray-400 text-sm">Thông báo khi có đơn hàng mới</div>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, orderNotifications: !settings.orderNotifications })}
                                className={`relative w-14 h-7 rounded-full transition-colors ${settings.orderNotifications ? 'bg-amber-600' : 'bg-gray-600'
                                    }`}
                            >
                                <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.orderNotifications ? 'translate-x-7' : ''
                                    }`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                            <div>
                                <div className="text-white font-medium">Thông Báo Khuyến Mãi</div>
                                <div className="text-gray-400 text-sm">Thông báo về chương trình khuyến mãi</div>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, promotionNotifications: !settings.promotionNotifications })}
                                className={`relative w-14 h-7 rounded-full transition-colors ${settings.promotionNotifications ? 'bg-amber-600' : 'bg-gray-600'
                                    }`}
                            >
                                <span
                                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.promotionNotifications ? 'translate-x-7' : ''
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cài Đặt Cửa Hàng */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-green-500/20 p-3 rounded-lg">
                            <Package className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Cài Đặt Cửa Hàng</h2>
                            <p className="text-gray-400 text-sm">Ngôn ngữ, thuế và định dạng</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-white mb-2 font-medium">Ngôn Ngữ</label>
                            <select
                                value={settings.language}
                                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                                className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-amber-500 outline-none"
                            >
                                <option value="vi">Tiếng Việt</option>
                                <option value="en">English</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-white mb-2 font-medium">Múi Giờ</label>
                            <input
                                type="text"
                                value={settings.timezone}
                                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                                className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-amber-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-white mb-2 font-medium">Thuế (%)</label>
                            <input
                                type="number"
                                value={settings.taxRate}
                                onChange={(e) => setSettings({ ...settings, taxRate: parseInt(e.target.value) })}
                                className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-amber-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Giao Diện */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-purple-500/20 p-3 rounded-lg">
                            <Palette className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Giao Diện</h2>
                            <p className="text-gray-400 text-sm">Tùy chỉnh màu sắc và chế độ giao diện</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-white mb-2 font-medium">Màu Chủ Đạo</label>
                            <div className="flex gap-3">
                                {themeColors.map((color) => (
                                    <button
                                        key={color.value}
                                        onClick={() => setSettings({ ...settings, themeColor: color.value })}
                                        className={`w-10 h-10 rounded-lg border-2 ${settings.themeColor === color.value ? 'border-white' : 'border-transparent'
                                            }`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                            <div>
                                <div className="text-white font-medium">Chế Độ Tối</div>
                                <div className="text-gray-400 text-sm">Bật/tắt dark mode</div>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
                                className={`relative w-14 h-7 rounded-full transition-colors ${settings.darkMode ? 'bg-amber-600' : 'bg-gray-600'
                                    }`}
                            >
                                <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.darkMode ? 'translate-x-7' : ''
                                    }`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nút lưu */}
            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleSave}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
                >
                    <Save className="w-5 h-5" />
                    Lưu Cài Đặt
                </button>
            </div>
        </div>
    );
}

export default AdminSettings;
