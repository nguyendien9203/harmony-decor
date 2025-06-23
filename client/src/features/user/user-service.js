import axios from "axios";

import { API_BASE_URL, getAuthHeaders } from "@/utils/config";

const BASE_URL = `${API_BASE_URL}/users`;

// Get user information
export const getUserInfo = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/user-info`, {
      headers: getAuthHeaders(),
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update user information
export const updateUserInfo = async (formData) => {
  try {
    const response = await axios.put(`${BASE_URL}/user-info`, formData, {
      headers: { "Content-Type": "multipart/form-data", ...getAuthHeaders() },
    });

    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
