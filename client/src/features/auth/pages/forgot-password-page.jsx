import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FullscreenLoader } from "@/components/ui/fullscreen-loader";
import { toast } from "sonner";
import { sendForgotPasswordEmail } from "@/features/auth/auth-service";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const response = await sendForgotPasswordEmail(email);
      toast.success(
        response?.message || "Đã gửi mã xác nhận đến email của bạn!"
      );
      navigate("/verify?from=reset-password", { state: { email } });
    } catch (error) {
      const message =
        error?.message || "Gửi mã xác nhận thất bại! Vui lòng thử lại.";
      toast.error("Lỗi gửi mã xác nhận:", {
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center bg-white mx-12 md:mx-0">
      {loading && <FullscreenLoader />}
      <Card className="w-full max-w-sm rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Quên mật khẩu</CardTitle>
          <CardDescription>
            Nhập email của bạn để nhận mã xác nhận
          </CardDescription>
          <CardAction>
            <Button variant="link" asChild>
              <Link to="/login">Đăng nhập</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <form onSubmit={onSubmit} noValidate>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 mt-4">
            <Button
              type="submit"
              className="w-full rounded-full"
              onClick={onSubmit}
              disabled={loading || !email}
            >
              Đăng nhập
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
