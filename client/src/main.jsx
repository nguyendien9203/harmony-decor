import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { router } from "@/routes/index.jsx";
import AuthProvider from "@/contexts/auth-context";
import CartProvider from "./contexts/cart-context";
import BuyNowProvider from "./contexts/buy-now-context";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BuyNowProvider>
        <CartProvider>
          <RouterProvider router={router} />
          <Toaster richColors position="top-right" />
        </CartProvider>
      </BuyNowProvider>
    </AuthProvider>
  </StrictMode>
);
