export function formatDateTime(dateString) {
  if (!dateString) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(dateString));
}

export function formatCurrency(amount) {
  if (typeof amount !== "number") return "";

  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}
