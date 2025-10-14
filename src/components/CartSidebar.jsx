import React, { useState } from 'react';
import { X, ShoppingCart, Trash2, CreditCard, Smartphone } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

function CartSidebar({ onClose }) {
    const { cart, cartTotal, removeFromCart, updateQuantity, clearCart, createOrder } = useAppContext();
    const [showCheckout, setShowCheckout] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('qr'); // 'qr' hoặc 'cod'
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        phone: '',
        address: '',
        note: ''
    });

    const handleCheckout = () => {
        if (cart.length === 0) return;
        setShowCheckout(true);
    };

    const handleProceedToPayment = () => {
        if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        setShowPayment(true);
    };

    const handleConfirmOrder = () => {
        const order = createOrder({
            ...customerInfo,
            paymentMethod: paymentMethod === 'qr' ? 'Chuyển khoản QR' : 'COD'
        });

        alert(`Đặt hàng thành công!\nMã đơn: ${order.id}\nChúng tôi sẽ liên hệ bạn sớm.`);
        clearCart();
        setShowCheckout(false);
        setShowPayment(false);
        setCustomerInfo({ name: '', phone: '', address: '', note: '' });
        onClose();
    };

    const handleBackToInfo = () => {
        setShowPayment(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <div className="relative bg-white w-full max-w-md h-full overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">
                            {showPayment ? 'Thanh Toán' : showCheckout ? 'Thông Tin Đặt Hàng' : 'Giỏ Hàng'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Empty Cart */}
                    {cart.length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">Giỏ hàng trống</p>
                        </div>
                    ) : showPayment ? (
                        /* ==================== PAYMENT SCREEN ==================== */
                        <div>
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <h3 className="font-bold mb-2">Thông tin đơn hàng</h3>
                                <div className="text-sm space-y-1 text-gray-600">
                                    <p><strong>Họ tên:</strong> {customerInfo.name}</p>
                                    <p><strong>SĐT:</strong> {customerInfo.phone}</p>
                                    <p><strong>Địa chỉ:</strong> {customerInfo.address}</p>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold mb-4">Chọn phương thức thanh toán</h3>

                            {/* Payment Methods */}
                            <div className="space-y-3 mb-6">
                                <button
                                    onClick={() => setPaymentMethod('qr')}
                                    className={`w-full p-4 border-2 rounded-lg flex items-center gap-3 transition-colors ${paymentMethod === 'qr'
                                        ? 'border-amber-500 bg-amber-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Smartphone className="w-6 h-6 text-amber-600" />
                                    <div className="text-left flex-1">
                                        <div className="font-bold">Chuyển khoản QR</div>
                                        <div className="text-sm text-gray-500">Quét mã QR để thanh toán</div>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'qr' ? 'border-amber-500 bg-amber-500' : 'border-gray-300'
                                        }`}>
                                        {paymentMethod === 'qr' && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                                    </div>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('cod')}
                                    className={`w-full p-4 border-2 rounded-lg flex items-center gap-3 transition-colors ${paymentMethod === 'cod'
                                        ? 'border-amber-500 bg-amber-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <CreditCard className="w-6 h-6 text-green-600" />
                                    <div className="text-left flex-1">
                                        <div className="font-bold">Thanh toán khi nhận hàng (COD)</div>
                                        <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt</div>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-amber-500 bg-amber-500' : 'border-gray-300'
                                        }`}>
                                        {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                                    </div>
                                </button>
                            </div>

                            {/* QR Code Display */}
                            {paymentMethod === 'qr' && (
                                <div className="bg-gray-50 rounded-lg p-6 mb-6 text-center">
                                    <h4 className="font-bold mb-4">Quét mã QR để thanh toán</h4>

                                    {/* QR Code */}
                                    <div className="bg-white p-4 rounded-lg inline-block mb-4">
                                        <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                                            <img
                                                src="/QRCODE.png"
                                                alt="QR Code"
                                                className="w-full h-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p><strong>Ngân hàng:</strong> MB Bank (Quân Đội)</p>
                                        <p><strong>STK:</strong> 0123456789</p>
                                        <p><strong>Chủ TK:</strong> COFFEE BLEND</p>
                                        <p><strong>Số tiền:</strong> <span className="text-amber-600 font-bold">{cartTotal.toLocaleString('vi-VN')}đ</span></p>
                                        <p><strong>Nội dung:</strong> COFFEE {customerInfo.phone}</p>
                                    </div>

                                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                                        ⓘ Vui lòng chuyển khoản đúng nội dung để đơn hàng được xử lý nhanh nhất
                                    </div>
                                </div>
                            )}

                            {/* Total */}
                            <div className="border-t pt-4 mb-4">
                                <div className="flex justify-between text-xl font-bold mb-2">
                                    <span>Tổng cộng:</span>
                                    <span className="text-amber-600">{cartTotal.toLocaleString('vi-VN')}đ</span>
                                </div>
                                {paymentMethod === 'qr' && (
                                    <p className="text-sm text-gray-500 text-center">
                                        Sau khi chuyển khoản xong, vui lòng bấm "Xác Nhận Đã Thanh Toán"
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <button
                                onClick={handleConfirmOrder}
                                className="w-full bg-amber-600 text-white py-3 rounded hover:bg-amber-700 mb-2 transition-colors font-semibold"
                            >
                                {paymentMethod === 'qr' ? 'Xác Nhận Đã Thanh Toán' : 'Xác Nhận Đặt Hàng'}
                            </button>
                            <button
                                onClick={handleBackToInfo}
                                className="w-full border border-gray-300 py-3 rounded hover:bg-gray-50 transition-colors"
                            >
                                Quay Lại
                            </button>
                        </div>
                    ) : showCheckout ? (
                        /* ==================== CHECKOUT FORM ==================== */
                        <div>
                            <h3 className="text-lg font-bold mb-4">Thông Tin Giao Hàng</h3>
                            <div className="space-y-4 mb-6">
                                <input
                                    type="text"
                                    placeholder="Họ và tên *"
                                    value={customerInfo.name}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                    className="w-full border rounded px-4 py-2 focus:outline-none focus:border-amber-500"
                                />
                                <input
                                    type="tel"
                                    placeholder="Số điện thoại *"
                                    value={customerInfo.phone}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                    className="w-full border rounded px-4 py-2 focus:outline-none focus:border-amber-500"
                                />
                                <textarea
                                    placeholder="Địa chỉ giao hàng *"
                                    value={customerInfo.address}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                                    className="w-full border rounded px-4 py-2 focus:outline-none focus:border-amber-500"
                                    rows={3}
                                />
                                <textarea
                                    placeholder="Ghi chú (không bắt buộc)"
                                    value={customerInfo.note}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, note: e.target.value })}
                                    className="w-full border rounded px-4 py-2 focus:outline-none focus:border-amber-500"
                                    rows={2}
                                />
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-4">
                                    <span className="font-bold">Tổng cộng:</span>
                                    <span className="text-xl font-bold text-amber-600">
                                        {cartTotal.toLocaleString('vi-VN')}đ
                                    </span>
                                </div>
                                <button
                                    onClick={handleProceedToPayment}
                                    className="w-full bg-amber-600 text-white py-3 rounded hover:bg-amber-700 mb-2 transition-colors"
                                >
                                    Tiếp Tục Thanh Toán
                                </button>
                                <button
                                    onClick={() => setShowCheckout(false)}
                                    className="w-full border border-gray-300 py-3 rounded hover:bg-gray-50 transition-colors"
                                >
                                    Quay Lại
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* ==================== CART ITEMS ==================== */
                        <>
                            <div className="space-y-4 mb-6">
                                {cart.map(item => (
                                    <div key={item.id} className="flex gap-4 border-b pb-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{item.name}</h3>
                                            <p className="text-amber-600 font-bold">
                                                {item.price.toLocaleString('vi-VN')}đ
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="w-12 text-center font-semibold">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center transition-colors"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="ml-auto text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex items-center justify-between text-xl font-bold mb-4">
                                    <span>Tổng cộng:</span>
                                    <span className="text-amber-600">
                                        {cartTotal.toLocaleString('vi-VN')}đ
                                    </span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-amber-600 text-white py-3 rounded hover:bg-amber-700 transition-colors"
                                >
                                    Thanh Toán
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CartSidebar;