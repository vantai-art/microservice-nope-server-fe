import React from 'react';
import { Award, Coffee, User } from 'lucide-react';
import Footer from '../components/Footer';
function AboutPage() {
    return (
        <div className="min-h-screen bg-black pt-20">
            <div
                className="relative h-96 flex items-center justify-center text-white"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&h=600&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative text-center z-10 px-4">
                    <h1 className="text-5xl font-bold mb-4">VỀ CHÚNG TÔI</h1>
                    <p className="text-xl">Câu chuyện về Coffee Blend</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto text-white">
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold mb-6 text-amber-500">Câu Chuyện Của Chúng Tôi</h2>
                        <p className="text-gray-300 leading-relaxed mb-6">
                            Coffee Blend được thành lập vào năm 2020 với niềm đam mê mãnh liệt về cà phê. Chúng tôi tin rằng mỗi tách cà phê không chỉ là thức uống, mà còn là một trải nghiệm, một câu chuyện và một khoảnh khắc đáng nhớ.
                        </p>
                        <p className="text-gray-300 leading-relaxed mb-6">
                            Từ những hạt cà phê tuyển chọn kỹ lượng từ các vùng trồng nổi tiếng, đến quy trình rang xay và pha chế chuyên nghiệp, chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng nhất.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-amber-500 mb-2">5+</div>
                            <div className="text-gray-400">Năm Kinh Nghiệm</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-bold text-amber-500 mb-2">50+</div>
                            <div className="text-gray-400">Sản Phẩm Đa Dạng</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-bold text-amber-500 mb-2">10k+</div>
                            <div className="text-gray-400">Khách Hàng Hài Lòng</div>
                        </div>
                    </div>

                    <div className="bg-gray-900 p-8 rounded-lg">
                        <h2 className="text-3xl font-bold mb-6 text-amber-500">Giá Trị Cốt Lõi</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <Award className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold mb-2">Chất Lượng</h3>
                                    <p className="text-gray-400">Cam kết 100% nguyên liệu tươi ngon, được kiểm định nghiêm ngặt</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Coffee className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold mb-2">Đam Mê</h3>
                                    <p className="text-gray-400">Niềm yêu thích cà phê thúc đẩy chúng tôi không ngừng sáng tạo</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <User className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold mb-2">Khách Hàng Là Trung Tâm</h3>
                                    <p className="text-gray-400">Sự hài lòng của khách hàng luôn là ưu tiên hàng đầu</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default AboutPage;