import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { clearCart } from "@/features/cart/cart-service";
import { createOrder } from "@/features/order/order-service";

const paymentMethods = [
  { value: "CASH_ON_DELIVERY", label: "Thanh toán khi nhận hàng" },
  { value: "ONLINE_PAYMENT", label: "Thanh toán online" },
];

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const items = location.state?.items || [];

  const [address, setAddress] = useState({
    recipientName: "",
    phone: "",
    street: "",
    ward: "",
    district: "",
    city: "",
  });
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].value);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.recipientName || !address.phone || !address.street || !address.ward || !address.district || !address.city) {
      alert("Vui lòng nhập đầy đủ địa chỉ giao hàng!");
      return;
    }
    setSubmitting(true);
    try {
      const orderData = {
        items: items.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          recipientName: address.recipientName,
          phone: address.phone,
          street: address.street,
          ward: address.ward,
          district: address.district,
          city: address.city
        },
        paymentMethod,
        note,
        totalAmount: total
      };

      await createOrder(orderData);
      clearCart();
      alert("Đặt hàng thành công!");
      navigate("/orders");
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  if (!items.length) {
    return (
      <div className="container mx-auto py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Không có sản phẩm để thanh toán</h2>
        <Link to="/cart" className="text-blue-600 underline hover:text-blue-800 transition">Quay lại giỏ hàng</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 flex flex-col items-center min-h-[60vh]">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Thanh toán đơn hàng</h2>
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Sản phẩm</h3>
          <div className="divide-y">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg border" />
                  )}
                  <span className="font-medium text-gray-800">{item.name}</span>
                  <span className="text-gray-500 text-sm">x{item.quantity}</span>
                </div>
                <div className="font-semibold text-gray-900">{(item.price * item.quantity).toLocaleString()}₫</div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4 flex-col items-end">
            <span className="text-xl font-bold text-black bg-gray-50 rounded-lg px-6 py-2 shadow-inner">
              Tổng: {total.toLocaleString()}₫
            </span>
            <span className="text-green-600 font-semibold mt-2">Miễn phí vận chuyển</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Địa chỉ giao hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="recipientName" value={address.recipientName} onChange={handleChange} placeholder="Họ tên người nhận" className="border rounded-lg px-3 py-2 w-full" />
              <input name="phone" value={address.phone} onChange={handleChange} placeholder="Số điện thoại" className="border rounded-lg px-3 py-2 w-full" />
              <input name="street" value={address.street} onChange={handleChange} placeholder="Số nhà, đường" className="border rounded-lg px-3 py-2 w-full md:col-span-2" />
              <input name="ward" value={address.ward} onChange={handleChange} placeholder="Phường/Xã" className="border rounded-lg px-3 py-2 w-full" />
              <input name="district" value={address.district} onChange={handleChange} placeholder="Quận/Huyện" className="border rounded-lg px-3 py-2 w-full" />
              <input name="city" value={address.city} onChange={handleChange} placeholder="Tỉnh/Thành phố" className="border rounded-lg px-3 py-2 w-full" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Phương thức thanh toán</h3>
            <div className="flex gap-6">
              {paymentMethods.map((pm) => (
                <label key={pm.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={pm.value}
                    checked={paymentMethod === pm.value}
                    onChange={() => setPaymentMethod(pm.value)}
                  />
                  {pm.label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <textarea
              className="border rounded-lg px-3 py-2 w-full"
              placeholder="Ghi chú cho đơn hàng (tuỳ chọn)"
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-lg font-semibold text-lg hover:bg-gray-900 transition disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage; 