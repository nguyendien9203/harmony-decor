import React, { useEffect, useState } from "react";
import { getMyOrders } from "../order-service";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "react-router-dom";

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

const OrderListPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await getMyOrders(token);
        setOrders(res.orders || []);
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[40vh]">Đang tải đơn hàng...</div>;
  }

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <h2 className="text-xl font-semibold mb-4">Bạn chưa có đơn hàng nào.</h2>
        <Link to="/" className="text-blue-600 underline hover:text-blue-800 transition">Tiếp tục mua sắm</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Đơn hàng của tôi</h2>
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="p-3 font-semibold text-left">Mã đơn</th>
              <th className="p-3 font-semibold text-center">Ngày đặt</th>
              <th className="p-3 font-semibold text-center">Tổng tiền</th>
              <th className="p-3 font-semibold text-center">Trạng thái</th>
              <th className="p-3 font-semibold text-center">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                <td className="p-3 font-mono">{order._id.slice(-6).toUpperCase()}</td>
                <td className="p-3 text-center">{new Date(order.createdAt).toLocaleString("vi-VN")}</td>
                <td className="p-3 text-center font-semibold text-gray-900">{order.totalAmount.toLocaleString()}₫</td>
                <td className={`p-3 text-center font-semibold ${statusColor[order.orderStatus]}`}>{statusLabel[order.orderStatus]}</td>
                <td className="p-3 text-center">
                  <Link to={`/orders/${order._id}`} className="text-blue-600 hover:underline">Xem</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderListPage; 