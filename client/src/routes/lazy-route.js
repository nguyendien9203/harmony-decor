import { lazy } from "react";

export const HomePage = lazy(() =>
  import("@/features/product/pages/home-page")
);
export const ProductDetailPage = lazy(() =>
  import("@/features/product/pages/product-detail-page")
);
export const CartPage = lazy(() => import("@/features/cart/pages/cart-page"));
export const CheckoutPage = lazy(() =>
  import("@/features/checkout/pages/checkout-page")
);
export const OrderPage = lazy(() =>
  import("@/features/order/pages/order-page")
);
export const OrderSuccessPage = lazy(() =>
  import("@/features/order/pages/order-success-page")
);
export const PaymentFailedPage = lazy(() =>
  import("@/features/payment/pages/payment-failed-page")
);
export const VnpayReturnPage = lazy(() =>
  import("@/features/payment/components/vnpay-return")
);
export const ProfilePage = lazy(() =>
  import("@/features/user/pages/profile-page")
);
export const LoginPage = lazy(() => import("@/features/auth/pages/login-page"));
export const RegisterPage = lazy(() =>
  import("@/features/auth/pages/register-page")
);
export const VerifyPage = lazy(() =>
  import("@/features/auth/pages/verify-page")
);
export const ForgotPasswordPage = lazy(() =>
  import("@/features/auth/pages/forgot-password-page")
);
export const ResetPasswordPage = lazy(() =>
  import("@/features/auth/pages/reset-password-page")
);
export const PrivacyPolicyPage = lazy(() =>
  import("@/features/legal/pages/privacy-policy-page")
);
export const TermsOfServicePage = lazy(() =>
  import("@/features/legal/pages/terms-of-service-page")
);
export const Decor3DPage = lazy(() =>
  import("@/features/decor3d/pages/Decor3D")
); 
// Admin pages
export const AdminDashboard = lazy(() =>
  import("@/features/admin/pages/admin-dashboard")
);
export const AdminLogin = lazy(() =>
  import("@/features/admin/pages/admin-login")
);
export const UserDashboard = lazy(() =>
  import("@/features/admin/pages/user-dashboard")
);
export const OrderDashboard = lazy(() =>
  import("@/features/admin/pages/order-dashboard")
);
export const DiscountDashboard = lazy(() =>
  import("@/features/admin/pages/discount-dashboard")
);
export const ProductDashboard = lazy(() =>
  import("@/features/admin/pages/product-dashboard")
);
