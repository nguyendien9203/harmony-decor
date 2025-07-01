import React, { useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { FullscreenLoader } from "@/components/ui/fullscreen-loader";

const OauthSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleTokenResponse } = useAuth();

  const from = location.state?.from || "/";

  const handleOrderRedirect = useCallback(async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("accessToken");

    if (token) {
      const user = await handleTokenResponse(token);
      if (user) {
        if (user.roles === "ADMIN") {
          navigate("/admin/dashboard", { replace: true });
        } else if (user.roles === "USER") {
          navigate(from, { replace: true });
        }
      }
    }
  }, [handleTokenResponse, navigate, from]);

  useEffect(() => {
    handleOrderRedirect();
  }, [handleOrderRedirect]);

  return <FullscreenLoader />;
};

export default OauthSuccessPage;
