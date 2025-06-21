import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "@/utils/config";

const BASE_URL = `${API_BASE_URL}/products`;

// Lấy tất cả sản phẩm (có thể truyền params: page, search, sort, status...)
export const getAllProducts = async (params = {}) => {
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

// Lấy chi tiết sản phẩm theo id
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Thêm sản phẩm mới

export const addProduct = async (data, isFormData = false) => {
  try {
    const token = localStorage.getItem("token"); 

    const headers = {
      Authorization: `Bearer ${token}`,
      ...(isFormData && { "Content-Type": "multipart/form-data" }),
    };

    const response = await axios.post(BASE_URL, data, { headers });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (id, data, isFormData = false) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, data, {
      headers: getAuthHeaders(isFormData),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 