import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "@/utils/config";

const BASE_URL = `${API_BASE_URL}/users`;

export const getAllUsers = async (params = {}) => {
  try {
    const response = await axios.get(BASE_URL, {
      params,
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Lấy thông tin chi tiết user theo id
export const getUserInfo = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Cập nhật trạng thái user
export const updateStatus = async (id, status) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/status/${id}`,
      { status },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 