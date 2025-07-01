import React, { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { formatDateTime, formatCurrency } from "@/utils/format";
import { getOrderById } from "@/features/order/order-service";
import { FullscreenLoader } from "@/components/ui/fullscreen-loader";

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get("orderId");
  const success = searchParams.get("success");

  console.log("Order ID:", orderId);
  console.log("Success status:", success);

  useEffect(() => {
    if (success !== "true" || !orderId) {
      toast.error("Thiếu thông tin đơn hàng");
      navigate("/");
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await getOrderById(orderId);
        setOrder(orderData.formatOrder);
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Không thể lấy thông tin đơn hàng. Vui lòng thử lại sau.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, success, navigate]);

  if (loading) {
    return <FullscreenLoader />;
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Không tìm thấy đơn hàng.</p>
      </div>
    );
  }

  const {
    items,
    total,
    totalAmount,
    discountAmount,
    createdAt,
    paymentMethod,
    transactionId,
  } = order;

  if (loading) {
    return <FullscreenLoader />;
  }

  return (
    <div className="flex justify-center py-10 px-4">
      <Card className="w-full max-w-2xl shadow-none">
        <CardHeader className="flex flex-col items-center">
          <BadgeCheck className="w-16 h-16 text-green-500 mb-2" />
          <CardTitle className="text-xl text-center">
            Đặt hàng thành công
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1 text-center">
            Xác nhận đơn hàng của bạn đã được ghi nhận.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Order Summary */}
          <div className="space-y-4 text-sm pt-6">
            {/* Transaction ID */}
            {transactionId && (
              <div className="pb-4 border-b">
                <p className="text-black">Mã giao dịch</p>
                <p className="text-gray-600 mt-1 text-xs">
                  {transactionId || "Không có mã giao dịch"}
                </p>
              </div>
            )}

            {/* Transaction Date */}
            <div className="pb-4 border-b">
              <p className="text-black">Ngày đặt hàng</p>
              <p className="text-gray-600 mt-1 text-xs">
                {formatDateTime(createdAt)}
              </p>
            </div>

            {/* Payment Method */}
            <div className="pb-4 border-b">
              <p className="text-black">Phương thức thanh toán</p>
              <p className="text-gray-600 mt-1 text-xs">
                {paymentMethod === "ONLINE_PAYMENT"
                  ? "Thanh toán online"
                  : "Thanh toán khi nhận hàng (COD)"}
              </p>
            </div>

            <Link
              to="/orders"
              className="text-blue-600 text-sm font-semibold block mt-1"
            >
              Kiểm tra trạng thái đơn hàng
            </Link>
          </div>

          {/* Product List */}
          <div>
            <h3 className="font-semibold mb-4 text-xl">Đơn hàng của bạn</h3>
            {/* Order Items */}
            <div className="space-y-3 divide-y flex-grow mb-4">
              {items.map(({ productId, name, images, price, quantity }) => (
                <div
                  key={productId}
                  className="flex justify-between items-center"
                >
                  <div className="flex gap-3 items-center w-full">
                    {/* Product Image*/}
                    {images && (
                      <img
                        src={images}
                        alt={name}
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                    )}

                    {/* Product Info */}
                    <div className="flex flex-col justify-between w-full h-full">
                      {/* Name */}
                      <div className="font-semibold text-gray-800 mb-1 text-sm">
                        {name}
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{formatCurrency(price)}</span>
                        <span>x{quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total summary */}
          <div className="border-t pt-4 space-y-2 text-sm md:mt-auto">
            <div className="flex justify-between">
              <span>Tổng</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>Miễn phí</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-xs">
                <span>Mã giảm giá</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm">
              <span>Tổng cộng</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>

            {/* Continue Shopping */}
            <Button className="w-full mt-4" onClick={() => navigate("/")}>
              Tiếp tục mua sắm
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccessPage;
