import axios from "axios";
import { API_BASE_URL, getAuthHeaders, API_PROVINCES } from "@/utils/config";

const BASE_URL = `${API_BASE_URL}/orders`;

// Tạo đơn hàng mới (chỉ dành cho CUSTOMER)
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(BASE_URL, orderData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Lấy danh sách đơn hàng của CUSTOMER
export const getMyOrders = async ({ status, page }) => {
  try {
    const response = await axios.get(`${BASE_URL}/get-orders-by-user`, {
      params: {
        status: status || "ALL",
        page: page || 1,
      },
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Huy động đơn hàng (chỉ dành cho CUSTOMER)
export const cancelOrder = async (orderId) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/${orderId}`,
      {
        orderStatus: "CANCELLED",
      },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
