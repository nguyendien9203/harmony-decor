export const ORDER_STATUS = [
  { value: "ALL", label: "Tất cả" },
  { value: "PENDING", label: "Đang chờ xử lý" },
  { value: "PROCESSING", label: "Đang xử lý" },
  { value: "SHIPPED", label: "Đã giao hàng" },
  { value: "DELIVERED", label: "Đã nhận hàng" },
  { value: "RETURNED", label: "Đã trả hàng" },
  { value: "CANCELLED", label: "Đã hủy" },
];

export const ORDER_STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-green-100 text-green-800",
  DELIVERED: "bg-purple-100 text-purple-800",
  RETURNED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-800",
};

export const PAYMENT_STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-blue-100 text-blue-800",
};

export const convertOrderStatus = (status) => {
  const foundStatus = ORDER_STATUS.find((s) => s.value === status);
  return foundStatus ? foundStatus.label : "Không xác định";
};

export const convertOrderStatusColor = (status) => {
  return ORDER_STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
};

export const convertPaymentStatusColor = (status) => {
  return PAYMENT_STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
};
