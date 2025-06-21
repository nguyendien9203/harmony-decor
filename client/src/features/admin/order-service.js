import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "@/utils/config";

const BASE_URL = `${API_BASE_URL}/orders`;

// Lấy tất cả orders (có thể truyền params: page, search...)
export const getAllOrders = async (params = {}) => {
  try {
    const response = await axios.get(BASE_URL, {
      params,
      headers: getAuthHeaders(),
    });
    return response.data.orders;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Lấy chi tiết order theo id
export const getOrderById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Cập nhật trạng thái order
export const updateOrderStatus = async (id, data) => {
  try {
    const response = await axios.patch(`${BASE_URL}/${id}`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
// Xoá order
export const deleteOrder = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 