import { BadgeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const PaymentFailedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center py-10 px-4">
      <Card className="w-full max-w-2xl shadow-none">
        <CardHeader className="flex flex-col items-center">
          <BadgeX className="w-16 h-16 text-red-500 mb-2" />
          <CardTitle className="text-xl text-center">
            Thanh toán không thành công
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-sm text-gray-500 text-center">
            Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.
          </p>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/cart")}
          >
            Quay lại giỏ hàng
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFailedPage;
