import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "@/utils/config";

const BASE_URL = `${API_BASE_URL}/discounts`;

// Lấy tất cả discount (có thể truyền params: page, search...)
export const getAllDiscounts = async (params = {}) => {
  try {
    const response = await axios.get(BASE_URL, {
      params,
      headers: getAuthHeaders(),
    });
    return response.data.discounts;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Lấy chi tiết discount theo id
export const getDiscountById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Thêm discount mới
export const createDiscount = async (data) => {
  try {
    const response = await axios.post(BASE_URL, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Cập nhật discount
export const updateDiscount = async (id, data) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Xoá discount
export const deleteDiscount = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 