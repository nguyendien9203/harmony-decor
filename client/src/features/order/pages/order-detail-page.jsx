import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getOrderById, cancelOrder } from "../order-service";

const statusColor = {
  PENDING: "text-yellow-600",
  PROCESSING: "text-blue-600",
  SHIPPED: "text-purple-600",
  DELIVERED: "text-green-600",
  CANCELLED: "text-red-600",
};

const statusLabel = {
  PENDING: "Chờ xác nhận",
  PROCESSING: "Đang xử lý",
  SHIPPED: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await getOrderById(id, token);
        setOrder(res.order);
      } catch (err) {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Bạn chắc chắn muốn hủy đơn hàng này?")) return;
    setCancelling(true);
    try {
      const token = localStorage.getItem("accessToken");
      await cancelOrder(id, token);
      alert("Đã hủy đơn hàng thành công!");
      navigate("/orders");
    } catch (err) {
      alert("Hủy đơn hàng thất bại!");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[40vh]">Đang tải chi tiết đơn hàng...</div>;
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <h2 className="text-xl font-semibold mb-4">Không tìm thấy đơn hàng.</h2>
        <Link to="/orders" className="text-blue-600 underline hover:text-blue-800 transition">Quay lại danh sách đơn hàng</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Chi tiết đơn hàng</h2>
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-2">
          <div>
            <div className="font-mono text-gray-700">Mã đơn: <span className="font-bold">{order._id.slice(-6).toUpperCase()}</span></div>
            <div className="text-gray-500 text-sm">Ngày đặt: {new Date(order.createdAt).toLocaleString("vi-VN")}</div>
          </div>
          <div className={`font-semibold ${statusColor[order.orderStatus]}`}>{statusLabel[order.orderStatus]}</div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Sản phẩm</h3>
          <div className="divide-y">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-3">
                <span className="font-medium text-gray-800">{item.productId?.name || item.productId}</span>
                <span className="text-gray-500 text-sm">x{item.quantity}</span>
                <span className="font-semibold text-gray-900">{(item.price * item.quantity).toLocaleString()}₫</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Địa chỉ giao hàng</h3>
          <div className="text-gray-700">
            {order.shippingAddress.recipientName} | {order.shippingAddress.phone}<br />
            {order.shippingAddress.street}, {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.city}
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Phương thức thanh toán</h3>
          <div className="text-gray-700">
            {order.paymentMethod === "CASH_ON_DELIVERY" ? "Thanh toán khi nhận hàng" : "Thanh toán online"}
          </div>
        </div>
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-700">Ghi chú: {order.note || "(Không có)"}</div>
          <div className="text-xl font-bold text-black bg-gray-50 rounded-lg px-6 py-2 shadow-inner">
            Tổng: {order.totalAmount.toLocaleString()}₫
          </div>
        </div>
        {order.orderStatus === "PENDING" && (
          <button
            className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold text-lg hover:bg-red-700 transition disabled:opacity-50"
            disabled={cancelling}
            onClick={handleCancel}
          >
            {cancelling ? "Đang hủy..." : "Hủy đơn hàng"}
          </button>
        )}
        <div className="mt-6 text-center">
          <Link to="/orders" className="text-blue-600 underline hover:text-blue-800 transition">Quay lại danh sách đơn hàng</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage; 