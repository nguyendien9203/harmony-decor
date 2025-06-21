export const API_BASE_URL = import.meta.env.VITE_BASE_API_URL;
export const API_PROVINCES = import.meta.env.VITE_API_PROVINCES_URL;

export const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Token không tồn tại");
  }
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};
