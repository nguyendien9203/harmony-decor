import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Loader from "@/components/ui/loader";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { sendVerificationEmail } from "@/features/auth/auth-service";

export default function VerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const from = queryParams.get("from") || "";

  const email = location.state?.email || "";
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    if (submitting || otp.length < 6) return;

    setSubmitting(true);
    try {
      await verifyEmail(email, otp);

      toast.success("Xác minh thành công!");
      setSubmitting(false);
      setOtp("");

      // Redirect based on the "from" parameter
      if (from === "reset-password") {
        navigate("/reset-password", { replace: true, state: { email } });
      } else if (from === "verification-email") {
        navigate("/", { replace: true });
      }
    } catch (error) {
      setSubmitting(false);
      const message = error?.message || "Xác minh thất bại! Vui lòng thử lại.";
      toast.error("Lỗi xác minh:", {
        description: message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resending) return;

    setResending(true);
    try {
      const response = await sendVerificationEmail(email);
      toast.success(response.message);
      setOtp("");
      setSubmitting(false);
    } catch (error) {
      const message = error.message || "Gửi lại mã xác minh thất bại!";
      toast.error("Lỗi gửi mã:", {
        description: message,
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-white mx-12 md:mx-0">
      <Card className="w-full max-w-md rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Xác minh tài khoản của bạn</CardTitle>
          <CardDescription>
            Nhập mã xác minh đã được gửi đến email hoặc số điện thoại của bạn.
          </CardDescription>
          <CardAction>
            <Button variant="link" asChild>
              <Link to="/login">Đăng nhập</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            className="mx-auto"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleVerify();
              }
            }}
          >
            <InputOTPGroup>
              {[...Array(6)].map((_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button
            className="w-full rounded-full"
            onClick={handleVerify}
            disabled={submitting || otp.length < 6}
          >
            {submitting ? "Đang xác minh..." : "Xác nhận"}
          </Button>
          <Button
            variant="link"
            className="w-full rounded-full border-none shadow-none bg-transparent text-sm"
            onClick={handleResendOtp}
          >
            {resending ? (
              <>
                <Loader className="mr-1" />
                Đang gửi lại...
              </>
            ) : (
              <span className=" underline-offset-4 hover:underline">
                Gửi lại mã
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
