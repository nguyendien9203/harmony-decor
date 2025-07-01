export const API_BASE_URL = import.meta.env.VITE_BASE_API_URL;
export const API_PROVINCES = import.meta.env.VITE_API_PROVINCES_URL;
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

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

export const getGoogleOAuthURL = () => {
  const rootUrl = import.meta.env.VITE_GOOGLE_ROOT_URL;

  const options = {
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope: import.meta.env.VITE_GOOGLE_SCOPE_URL,
  };

  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
};
