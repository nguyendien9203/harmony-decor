import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/contexts/auth-context";
import { router } from "@/routes/index.jsx";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </>
    </AuthProvider>
  </StrictMode>
);
