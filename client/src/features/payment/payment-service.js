import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "@/utils/config";

const BASE_URL = `${API_BASE_URL}/payments`;

// Create payment URL
export const createPayment = async (amount, orderId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/create-payment`,
      { amount, orderId },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Handle payment return
export const handlePaymentReturn = async (queryParams) => {
  try {
    const response = await axios.get(`${BASE_URL}/vnpay-return`, {
      params: queryParams,
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Handle payment notification
export const handlePaymentNotification = async (queryParams) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/vnpay-ipn`,
      {
        queryParams,
      },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
