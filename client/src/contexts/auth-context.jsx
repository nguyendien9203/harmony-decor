import React, { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import {
  login as performLogin,
  verifyEmail as performVerifyEmail,
} from "@/features/auth/auth-service";
import { getUserInfo } from "@/features/user/user-service";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    setUser(null);
  }, []);

  //Set user from token and fetch additional user info
  const setUserFromToken = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userInfo = await getUserInfo();
      setUser({ ...decoded, ...userInfo });
    } catch (err) {
      console.error("Token không hợp lệ hoặc lỗi lấy user info:", err);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // Set user from token when component mounts
  useEffect(() => {
    setUserFromToken();
  }, [setUserFromToken]);

  // Handle token response and set user
  const handleTokenResponse = useCallback(async (token) => {
    localStorage.setItem("accessToken", token);
    const decoded = jwtDecode(token);
    const userInfo = await getUserInfo();
    const mergedUser = { ...decoded, ...userInfo };
    setUser(mergedUser);
    return mergedUser;
  }, []);

  const login = useCallback(
    async (email, password) => {
      const response = await performLogin(email, password);
      const user = await handleTokenResponse(response.accessToken);
      return {
        roles: user.roles,
        message: response.message,
      };
    },
    [handleTokenResponse]
  );

  // Verify email with OTP
  const verifyEmail = useCallback(
    async (email, otp) => {
      const response = await performVerifyEmail(email, otp);
      await handleTokenResponse(response.accessToken);
    },
    [handleTokenResponse]
  );

  // Check if user is authenticated
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        verifyEmail,
        logout,
        isAuthenticated,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
