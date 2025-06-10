import axios from "axios";
import { API_BASE_URL } from "@/utils/config";

const BASE_URL = `${API_BASE_URL}/orders`;

// Tạo đơn hàng mới (chỉ dành cho CUSTOMER)
export const createOrder = async (orderData, token) => {
  try {
    const response = await axios.post(BASE_URL, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Lấy danh sách đơn hàng của CUSTOMER
export const getMyOrders = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Lấy chi tiết đơn hàng (CUSTOMER hoặc ADMIN)
export const getOrderById = async (id, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Hủy đơn hàng (chỉ CUSTOMER khi trạng thái là PENDING)
export const cancelOrder = async (id, token) => {
  try {
    const response = await axios.patch(`${BASE_URL}/${id}`, { orderStatus: "CANCELLED" }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 