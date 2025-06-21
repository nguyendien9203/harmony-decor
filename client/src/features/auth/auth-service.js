import axios from "axios";

import { API_BASE_URL } from "@/utils/config";

const BASE_URL = `${API_BASE_URL}/auth`;

// Login user
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      email,
      password,
    });

    const { accessToken } = response.data;
  if (!accessToken) {
     throw new Error("Token không được trả về từ server");
  }
localStorage.setItem("token", accessToken);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};



// Register a new user
export const register = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Send OTP to email for verification
export const sendVerificationEmail = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/send-verification-otp`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Send OTP for forgot password
export const sendForgotPasswordEmail = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/send-forgot-password-otp`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Verify email with OTP
export const verifyEmail = async (email, otp) => {
  try {
    const response = await axios.post(`${BASE_URL}/verify-email`, {
      email,
      otp,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Reset password
export const resetPassword = async (email, newPassword) => {
  try {
    const response = await axios.post(`${BASE_URL}/reset-password`, {
      newPassword,
      email,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Change password
export const changePassword = async (email, oldPassword, newPassword) => {
  try {
    const response = await axios.post(`${BASE_URL}/change-password`, {
      email,
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
