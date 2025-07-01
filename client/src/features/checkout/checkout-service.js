import axios from "axios";
import { API_PROVINCES, API_BASE_URL, getAuthHeaders } from "@/utils/config";

// Get list of provinces
export const getProvinces = async () => {
  try {
    const response = await axios.get(`${API_PROVINCES}/p/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};

// Get list of districts by province ID
export const getDistrictsByProvinceId = async (provinceId) => {
  try {
    const response = await axios.get(
      `${API_PROVINCES}/p/${provinceId}?depth=2`
    );
    return response.data.districts || [];
  } catch (error) {
    console.error("Error fetching districts:", error);
    throw error;
  }
};

// Get list of wards by district ID
export const getWardsByDistrictId = async (districtId) => {
  try {
    const response = await axios.get(
      `${API_PROVINCES}/d/${districtId}?depth=2`
    );
    return response.data.wards || [];
  } catch (error) {
    console.error("Error fetching wards:", error);
    throw error;
  }
};

// Validate discount code
export const validateDiscountCode = async (code, total) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/discounts/validate`,
      { code, total },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error validating discount code:", error);
    throw error;
  }
};
