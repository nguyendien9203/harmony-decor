import axios from "axios";

import { API_BASE_URL, getAuthHeaders } from "@/utils/config";

const BASE_URL = `${API_BASE_URL}/products`;

// Fetch all products with search, filter, and pagination
export const getAllProducts = async ({ page, search, sort }) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: { page, search, sort, status: ["ACTIVE", "OUT_OF_STOCK"] },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Fetch product bu slug
export const getProductBySlug = async (slug) => {
  try {
    const response = await axios.get(`${BASE_URL}/slug/${slug}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add a review to a product
export const addProductReview = async (productId, reviewData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/${productId}/reviews`,
      reviewData,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update review of a product
export const updateProductReview = async (productId, reviewId, reviewData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/${productId}/reviews/${reviewId}`,
      reviewData,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
