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
