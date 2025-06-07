import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/main-layout";
import HomePage from "@/features/home/pages/home-page";
import LoginPage from "@/features/auth/pages/login-page";
import RegisterPage from "@/features/auth/pages/register-page";
import VerifyPage from "@/features/auth/pages/verify-page";
import ForgotPasswordPage from "@/features/auth/pages/forgot-password-page";
import ResetPasswordPage from "@/features/auth/pages/reset-password-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "verify", element: <VerifyPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
    ],
  },
]);
