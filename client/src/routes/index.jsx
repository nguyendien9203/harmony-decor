import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/layouts/main-layout";

import HomePage from "@/features/product/pages/home-page";
import ProductDetailPage from "@/features/product/pages/product-detail-page";
import CartPage from "@/features/cart/pages/cart-page";
import CheckoutPage from "@/features/checkout/pages/checkout-page";
import AboutUs from "@/components/ui/about-us";
import Collection from "@/components/ui/collection";

// Authentication pages
import LoginPage from "@/features/auth/pages/login-page";
import RegisterPage from "@/features/auth/pages/register-page";
import VerifyPage from "@/features/auth/pages/verify-page";
import ForgotPasswordPage from "@/features/auth/pages/forgot-password-page";
import ResetPasswordPage from "@/features/auth/pages/reset-password-page";

import AdminRoute from "@/routes/admin-route";
import PrivateRoute from "@/routes/private-route";
import AdminDashboard from "@/features/admin/pages/admin-dashboard";
import AdminLogin from "@/features/admin/pages/admin-login";
import UserDashboard from "@/features/admin/pages/user-dashboard";
import OrderDashboard from "@/features/admin/pages/order-dashboard";
import DiscountDashboard from "@/features/admin/pages/discount-dashboard";
import ProductDashboard from "@/features/admin/pages/product-dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "product/:slug", element: <ProductDetailPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "about-us", element: <AboutUs /> },
      { path: "collection", element: <Collection /> },
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
  // Đặt route này RIÊNG, không bọc trong AdminRoute
  { path: "/admin/login", element: <AdminLogin /> },

  {
    element: <AdminRoute />,
    children: [
      { path: "admin/dashboard", element: <AdminDashboard /> },
      { path: "admin/dashboard/product", element: <ProductDashboard /> },
      { path: "admin/dashboard/user", element: <UserDashboard /> },
      { path: "admin/dashboard/order", element: <OrderDashboard /> },
      { path: "admin/dashboard/discount", element: <DiscountDashboard /> },
      // Các route admin khác (KHÔNG BAO GỒM /admin/login)
    ],
  },
]);
