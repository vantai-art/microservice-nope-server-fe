import React from 'react';
import { Coffee, Truck, Award, Clock } from 'lucide-react';
import Footer from '../components/Footer';
function ServicesPage() {
    const services = [
        {
            icon: <Coffee className="w-12 h-12" />,
            title: 'Phục Vụ Tại Bàn',
            description: 'Đội ngũ nhân viên chuyên nghiệp, phục vụ tận tình'
        },
        {
            icon: <Truck className="w-12 h-12" />,
            title: 'Giao Hàng Tận Nơi',
            description: 'Giao hàng nhanh chóng trong vòng 30 phút'
        },
        {
            icon: <Award className="w-12 h-12" />,
            title: 'Chất Lượng Đảm Bảo',
            description: 'Cam kết 100% nguyên liệu tươi ngon'
        },
        {
            icon: <Clock className="w-12 h-12" />,
            title: 'Mở Cửa 24/7',
            description: 'Phục vụ quý khách suốt ngày đêm'
        }
    ];

    return (
        <div className="min-h-screen bg-black pt-20">
            <div
                className="relative h-64 flex items-center justify-center text-white"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&h=400&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-black/60"></div>
                <h1 className="relative text-5xl font-bold z-10">DỊCH VỤ</h1>
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="bg-gray-900 p-8 rounded-lg text-center text-white hover:bg-gray-800 transition-colors">
                            <div className="text-amber-500 flex justify-center mb-4">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                            <p className="text-gray-400">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
}
export default ServicesPage;
