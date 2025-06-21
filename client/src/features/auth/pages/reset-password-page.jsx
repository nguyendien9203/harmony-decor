import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
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
import { FullscreenLoader } from "@/components/ui/fullscreen-loader";
import { toast } from "sonner";

import clsx from "clsx";
import { resetPassword } from "@/features/auth/auth-service";

// Zod schema for form validation
const schema = z
  .object({
    newPassword: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
    confirmPassword: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await resetPassword(email, data.newPassword);

      toast.success(response?.message || "Đặt lại mật khẩu thành công!");

      navigate("/login", { replace: true });
    } catch (error) {
      const message =
        error?.message || "Đặt lại mật khẩu thất bại! Vui lòng thử lại.";
      toast.error("Lỗi đặt lại mật khẩu:", {
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
          <CardTitle>Đặt lại mật khẩu</CardTitle>
          <CardDescription>
            Nhập mật khẩu mới của bạn để đặt lại mật khẩu tài khoản.
          </CardDescription>
          <CardAction>
            <Button variant="link" asChild>
              <Link to="/login">Đăng nhập</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  {...register("newPassword")}
                  className={clsx(errors.newPassword && "border-red-500")}
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Xác nhận mật khẩu mới"
                  {...register("confirmPassword")}
                  className={clsx(errors.confirmPassword && "border-red-500")}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 mt-4">
            <Button
              type="submit"
              className="w-full rounded-full"
              disabled={
                loading || !watch("newPassword") || !watch("confirmPassword")
              }
            >
              Đặt lại mật khẩu
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
