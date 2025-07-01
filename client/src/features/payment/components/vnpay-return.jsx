import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FullscreenLoader } from "@/components/ui/fullscreen-loader";
import { handlePaymentReturn } from "../payment-service";

const VnpayReturn = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const processPaymentReturn = async () => {
      const query = new URLSearchParams(location.search);
      const transactionId = query.get("vnp_TransactionNo");

      const queryParams = {};
      query.forEach((value, key) => {
        queryParams[key] = value;
      });

      try {
        const response = await handlePaymentReturn(queryParams);
        if (response.status === 200) {
          const order = response.order;
          navigate("/order-success", {
            state: { order, transactionId },
          });
        } else {
          toast.error("Thanh toán không thành công. Vui lòng thử lại.");
          navigate("/payment-failure");
        }
      } catch (error) {
        console.error("Payment return error:", error);
        toast.error("Đã xảy ra lỗi trong quá trình xử lý thanh toán.");
        navigate("/payment-failure");
      }
    };

    processPaymentReturn();
  }, [location.search, navigate]);

  return <FullscreenLoader />;
};

export default VnpayReturn;
