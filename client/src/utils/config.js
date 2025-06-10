export const API_BASE_URL = import.meta.env.VITE_BASE_API_URL;
export const API_PROVINCES = import.meta.env.VITE_API_PROVINCES_URL;

export const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Token không tồn tại");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};
