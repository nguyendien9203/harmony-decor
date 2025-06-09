import axios from "axios";

import { API_BASE_URL } from "@/utils/config";

const BASE_URL = `${API_BASE_URL}/products`;

// Fetch all products with search, filter, and pagination
export const getAllProducts = async ({ page, search, sort }) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: { page, search, sort, status: "ACTIVE" },
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
