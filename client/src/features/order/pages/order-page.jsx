import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  User,
  Phone,
  Mail,
  MapPin,
  HandCoins,
  ChevronDown,
  ClipboardList,
} from "lucide-react";
import { PaginationControls } from "@/components/ui/pagination-controls";
import {
  ORDER_STATUS,
  convertOrderStatus,
  convertOrderStatusColor,
  convertPaymentStatusColor,
} from "@/constants/status";
import {
  getProvinces,
  getDistrictsByProvinceId,
  getWardsByDistrictId,
} from "@/features/checkout/checkout-service";
import { getMyOrders, cancelOrder } from "@/features/order/order-service";
import { formatDateTime, formatCurrency } from "@/utils/format";
import clsx from "clsx";
import CancelDialog from "@/features/order/components/cancel-dialog";

const ITEMS_PER_PAGE = 2;

const OrderPage = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    limit: ITEMS_PER_PAGE,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getMyOrders({ status: statusFilter, page });

        const mappedOrders = await Promise.all(
          response.orders.map(async (order) => {
            const { shippingAddress } = order;

            const province = await getProvinces().then((provinces) =>
              provinces.find((p) => p.code === shippingAddress.province)
            );

            const district = await getDistrictsByProvinceId(
              shippingAddress.province
            ).then((districts) =>
              districts.find((d) => d.code === shippingAddress.district)
            );

            const ward = await getWardsByDistrictId(
              shippingAddress.district
            ).then((wards) =>
              wards.find((w) => w.code === shippingAddress.ward)
            );

            return {
              ...order,
              shippingAddress: {
                ...shippingAddress,
                province: province.name,
                district: district.name,
                ward: ward.name,
              },
            };
          })
        );

        setOrders(mappedOrders);
        setPagination(response.pagination);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [statusFilter, page]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      toast.success("Huỷ đơn hàng thành công");

      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o._id === orderId ? { ...o, orderStatus: "CANCELLED" } : o
        )
      );
    } catch (error) {
      toast.error("Không thể huỷ đơn hàng. Vui lòng thử lại sau.");
      console.error("Failed to cancel order:", error);
    }
  };

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const convertPaymentMethod = (method) => {
    if (method === "CASH_ON_DELIVERY") return "Thanh toán khi nhận hàng";
    if (method === "ONLINE_PAYMENT") return "Thanh toán online";
    return "Không rõ";
  };

  const convertPaymentStatus = (status) => {
    if (status === "PENDING") return "Chưa thanh toán";
    if (status === "PAID") return "Đã thanh toán";
    if (status === "FAILED") return "Thanh toán thất bại";
    return "Không rõ";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Đơn hàng</h2>

      {/* Status Filter */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[240px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {ORDER_STATUS.map(({ value, label }, index) => (
              <SelectItem key={index} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders */}
      {orders.length === 0 ? (
        <div className="container mx-auto py-12 flex flex-col items-center">
          <ClipboardList className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Không tìm thấy đơn hàng
          </h2>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => {
            const isOpen = openIndex === index;
            const isUnpaid =
              order.paymentStatus === "PENDING" &&
              order.paymentMethod === "ONLINE_PAYMENT";
            const isPending = order.orderStatus === "PENDING";
            //const isBuy = order.orderStatus === "CANCELLED";
            return (
              <div
                key={index}
                className="border rounded-2xl transition-all overflow-hidden"
              >
                <div
                  role="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-4 py-3 hover:bg-gray-50 text-left cursor-pointer"
                >
                  <div className="flex flex-wrap sm:flex-nowrap justify-between items-start gap-6">
                    {/* LEFT: Order info & Shipping Address */}
                    <div className="flex flex-col gap-1 text-sm flex-1 min-w-[250px]">
                      <div className="font-semibold">
                        Mã đơn hàng: {order._id}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        {formatDateTime(order.createdAt)}
                      </div>

                      <div className="text-xs text-gray-600 space-y-0.5">
                        <p className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {order.shippingAddress?.recipientName}
                        </p>
                        <p className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          {order.shippingAddress?.phone}
                        </p>
                        <p className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          {order.shippingAddress?.email}
                        </p>
                        <p className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {[
                            order.shippingAddress.street,
                            order.shippingAddress.ward,
                            order.shippingAddress.district,
                            order.shippingAddress.province,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        {/* // Payment method */}
                        <p className="flex items-center gap-1">
                          <HandCoins className="w-3.5 h-3.5" />
                          {convertPaymentMethod(order.paymentMethod)}
                        </p>
                      </div>

                      <div className="mt-1 flex gap-2 flex-wrap">
                        <Badge
                          className={convertOrderStatusColor(order.orderStatus)}
                        >
                          {convertOrderStatus(order.orderStatus)}
                        </Badge>
                        <Badge
                          className={convertPaymentStatusColor(
                            order.paymentStatus
                          )}
                        >
                          {convertPaymentStatus(order.paymentStatus)}
                        </Badge>
                      </div>
                    </div>

                    {/* RIGHT: Images + Total + Toggle + Action buttons */}
                    <div className="flex flex-col text-sm w-full sm:w-auto items-end justify-between">
                      {/* Top row: images + total + toggle */}
                      <div className="flex items-center gap-4 w-full justify-between sm:justify-end">
                        {/* Images */}
                        <div className="flex items-center gap-2">
                          {order.items.slice(0, 3).map((item, i) => (
                            <img
                              key={i}
                              src={item.images}
                              alt={item.name}
                              className="w-8 h-8 object-cover rounded border"
                            />
                          ))}
                        </div>

                        {/* Total */}
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Tổng</div>
                          {order.discountAmount ? (
                            <>
                              <div className="font-bold">
                                {formatCurrency(order.totalAmount)}
                              </div>
                              <div className="text-xs line-through text-gray-400">
                                {formatCurrency(order.total)}
                              </div>
                            </>
                          ) : (
                            <div className="font-bold">
                              {formatCurrency(order.total)}
                            </div>
                          )}
                        </div>

                        {/* Toggle */}
                        <ChevronDown
                          className={clsx(
                            "h-5 w-5 transition-transform",
                            isOpen && "rotate-180"
                          )}
                        />
                      </div>

                      {/* Action buttons (always bottom) */}
                      {(isUnpaid || isPending) && (
                        <div className="flex gap-2 mt-2 w-full sm:justify-end">
                          {isUnpaid && (
                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate("/checkout", { state: { order } });
                              }}
                            >
                              Thanh toán lại
                            </Button>
                          )}

                          {isPending && (
                            <CancelDialog
                              onConfirm={() => {
                                handleCancelOrder(order._id);
                                setOpenIndex(null);
                              }}
                              trigger={
                                <Button
                                  variant="destructive"
                                  onClick={(e) => e.stopPropagation()}
                                  className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 transition"
                                >
                                  Huỷ đơn hàng
                                </Button>
                              }
                            />
                          )}
                          {/* {isBuy && (
                          <Button
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/checkout", { state: { order } });
                            }}
                          >
                            Mua lại
                          </Button>
                        )} */}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div
                  className={clsx(
                    "transition-all duration-300 ease-in-out overflow-hidden",
                    isOpen ? "max-h-[1000px] border-t" : "max-h-0"
                  )}
                >
                  <div className="bg-white px-4 pb-4 pt-2 space-y-4">
                    {order.items.map(
                      ({ name, images, price, quantity }, idx) => (
                        <div
                          key={idx}
                          className="flex gap-4 p-4 border rounded-2xl shadow-sm bg-white"
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
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6">
        <PaginationControls
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          setPage={setPage}
        />
      </div>
    </div>
  );
};

export default OrderPage;
