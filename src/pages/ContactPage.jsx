import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Facebook, Instagram, Twitter } from 'lucide-react';

function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Dữ liệu form:', formData);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        }, 3000);
    };

    const contactInfo = [
        {
            icon: <Phone className="w-6 h-6" />,
            title: 'Điện Thoại',
            content: '+84 901 234 567',
            link: 'tel:+84901234567'
        },
        {
            icon: <Mail className="w-6 h-6" />,
            title: 'Email',
            content: 'contact@coffeeblend.vn',
            link: 'mailto:contact@coffeeblend.vn'
        },
        {
            icon: <MapPin className="w-6 h-6" />,
            title: 'Địa Chỉ',
            content: '123 Nguyễn Huệ, Quận 1, TP.HCM',
            link: 'https://maps.google.com'
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: 'Giờ Mở Cửa',
            content: 'Thứ 2 - Chủ Nhật: 7:00 - 23:00',
            link: null
        }
    ];

    return (
        <div className="min-h-screen bg-black pt-20">
            {/* Hero Section */}
            <div
                className="relative h-80 flex items-center justify-center text-white"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200&h=600&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative text-center z-10 px-4">
                    <h1 className="text-5xl font-bold mb-4">LIÊN HỆ VỚI CHÚNG TÔI</h1>
                    <p className="text-xl">Chúng tôi luôn sẵn sàng lắng nghe ý kiến của bạn</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Form Liên Hệ */}
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">Gửi Tin Nhắn</h2>

                        {submitted && (
                            <div className="bg-green-500/20 border border-green-500 text-green-400 px-6 py-4 rounded-lg mb-6 flex items-center gap-3">
                                <Send className="w-5 h-5" />
                                <span>Cảm ơn bạn! Chúng tôi sẽ phản hồi sớm nhất có thể.</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-white mb-2 font-medium">Họ và Tên *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-amber-500 outline-none"
                                        placeholder="Nguyễn Văn A"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white mb-2 font-medium">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-amber-500 outline-none"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-white mb-2 font-medium">Số Điện Thoại</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-amber-500 outline-none"
                                        placeholder="0901234567"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white mb-2 font-medium">Chủ Đề</label>
                                    <select
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-amber-500 outline-none"
                                    >
                                        <option value="">Chọn chủ đề</option>
                                        <option value="general">Câu hỏi chung</option>
                                        <option value="order">Đặt hàng</option>
                                        <option value="complaint">Khiếu nại</option>
                                        <option value="suggestion">Góp ý</option>
                                        <option value="other">Khác</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-white mb-2 font-medium">Nội Dung *</label>
                                <textarea
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows={6}
                                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-amber-500 outline-none resize-none"
                                    placeholder="Nhập nội dung tin nhắn của bạn..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                            >
                                <Send className="w-5 h-5" />
                                Gửi Tin Nhắn
                            </button>
                        </form>
                    </div>

                    {/* Thông Tin Liên Hệ */}
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">Thông Tin Liên Hệ</h2>

                        <div className="space-y-6 mb-10">
                            {contactInfo.map((info, index) => (
                                <div key={index} className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-amber-500 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-amber-500/20 p-3 rounded-lg text-amber-500">
                                            {info.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-white font-bold mb-2">{info.title}</h3>
                                            {info.link ? (
                                                <a href={info.link} className="text-gray-400 hover:text-amber-500 transition-colors">
                                                    {info.content}
                                                </a>
                                            ) : (
                                                <p className="text-gray-400">{info.content}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mạng Xã Hội */}
                        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                            <h3 className="text-white font-bold mb-4">Kết Nối Với Chúng Tôi</h3>
                            <div className="flex gap-4">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-white transition-colors">
                                    <Facebook className="w-6 h-6" />
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-pink-600 hover:bg-pink-700 p-3 rounded-lg text-white transition-colors">
                                    <Instagram className="w-6 h-6" />
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-sky-600 hover:bg-sky-700 p-3 rounded-lg text-white transition-colors">
                                    <Twitter className="w-6 h-6" />
                                </a>
                            </div>
                        </div>

                        {/* Bản Đồ */}
                        <div className="mt-8 bg-gray-900 p-2 rounded-lg border border-gray-800 overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.3193500367!2d106.69530731533315!3d10.786808392314348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3330bcc9%3A0x5ed4b6e88c9b8e!2zTmd1eeG7hW4gSHXhu4UsIFF1YW4gMSwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s"
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Vị trí Coffee Blend"
                                className="rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;