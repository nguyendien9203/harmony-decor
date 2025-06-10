import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/layouts/main-layout";

import HomePage from "@/features/product/pages/home-page";
import ProductDetailPage from "@/features/product/pages/product-detail-page";
import CartPage from "@/features/cart/pages/cart-page";
import CheckoutPage from "@/features/checkout/pages/checkout-page";
import OrderListPage from "@/features/order/pages/order-list-page";
import OrderDetailPage from "@/features/order/pages/order-detail-page";

// Authentication pages
import LoginPage from "@/features/auth/pages/login-page";
import RegisterPage from "@/features/auth/pages/register-page";
import VerifyPage from "@/features/auth/pages/verify-page";
import ForgotPasswordPage from "@/features/auth/pages/forgot-password-page";
import ResetPasswordPage from "@/features/auth/pages/reset-password-page";

import AdminRoute from "@/routes/admin-route";
import PrivateRoute from "@/routes/private-route";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "product/:slug", element: <ProductDetailPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "orders", element: <OrderListPage /> },
      { path: "orders/:id", element: <OrderDetailPage /> },

      // Authentication routes
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "verify", element: <VerifyPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
      {
        element: <PrivateRoute />,
        children: [
          // Add private routes here
          // Example: { path: "checkout", element: <CheckoutPage /> },
        ],
      },
    ],
  },
  {
    element: <AdminRoute />,
    children: [
      // Add admin routes here
      // Example: { path: "admin/dashboard", element: <AdminDashboardPage /> },
    ],
  },
]);
