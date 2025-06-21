import { createBrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import * as Lazy from "@/routes/lazy-route";

import { FullscreenLoader } from "@/components/ui/fullscreen-loader";
import MainLayout from "@/layouts/main-layout";

import AdminRoute from "@/routes/admin-route";
import PrivateRoute from "@/routes/private-route";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // Public routes
      {
        index: true,
        element: (
          <Suspense fallback={<FullscreenLoader />}>
            <Lazy.HomePage />
          </Suspense>
        ),
      },
      {
        path: "product/:slug",
        element: (
          <Suspense fallback={<FullscreenLoader />}>
            <Lazy.ProductDetailPage />
          </Suspense>
        ),
      },
      {
        path: "cart",
        element: (
          <Suspense fallback={<FullscreenLoader />}>
            <Lazy.CartPage />
          </Suspense>
        ),
      },

      // Authentication routes
      {
        path: "login",
        element: (
          <Suspense fallback={<FullscreenLoader />}>
            <Lazy.LoginPage />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<FullscreenLoader />}>
            <Lazy.RegisterPage />
          </Suspense>
        ),
      },
      {
        path: "verify",
        element: (
          <Suspense fallback={<FullscreenLoader />}>
            <Lazy.VerifyPage />
          </Suspense>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <Suspense fallback={<FullscreenLoader />}>
            <Lazy.ForgotPasswordPage />
          </Suspense>
        ),
      },
      {
        path: "reset-password",
        element: (
          <Suspense fallback={<FullscreenLoader />}>
            <Lazy.ResetPasswordPage />
          </Suspense>
        ),
      },

      // Private routes
      {
        element: <PrivateRoute />,
        children: [
          // Add private routes here
          {
            path: "checkout",
            element: (
              <Suspense fallback={<FullscreenLoader />}>
                <Lazy.CheckoutPage />
              </Suspense>
            ),
          },
          {
            path: "payment/vnpay-return",
            element: (
              <Suspense fallback={<FullscreenLoader />}>
                <Lazy.VnpayReturnPage />
              </Suspense>
            ),
          },
          {
            path: "order-success",
            element: (
              <Suspense fallback={<FullscreenLoader />}>
                <Lazy.OrderSuccessPage />
              </Suspense>
            ),
          },
          {
            path: "payment-failure",
            element: (
              <Suspense fallback={<FullscreenLoader />}>
                <Lazy.PaymentFailedPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },

  // Admin public routes
  {
    path: "/admin/login",
    element: (
      <Suspense fallback={<FullscreenLoader />}>
        <Lazy.AdminLogin />
      </Suspense>
    ),
  },

  // Admin private routes
  {
    element: <AdminRoute />,
    children: [
      // Add admin routes here
      {
        path: "admin/dashboard",
        element: (
          <Suspense fallback={<FullscreenLoader />}>
            <Lazy.AdminDashboard />
          </Suspense>
        ),
      },
      {
        path: "admin/dashboard/product",
        element: (
          <Suspense fallback={<FullscreenLoader />}>
            <Lazy.ProductDashboard />
          </Suspense>
        ),
      },
      {
        path: "admin/dashboard/user",
        element: (
          <Suspense fallback={<FullscreenLoader />}>
            <Lazy.UserDashboard />
          </Suspense>
        ),
      },
      {
        path: "admin/dashboard/order",
        element: (
          <Suspense fallback={<FullscreenLoader />}>
            <Lazy.OrderDashboard />
          </Suspense>
        ),
      },
      {
        path: "admin/dashboard/discount",
        element: (
          <Suspense fallback={<FullscreenLoader />}>
            <Lazy.DiscountDashboard />
          </Suspense>
        ),
      },
    ],
  },
]);
