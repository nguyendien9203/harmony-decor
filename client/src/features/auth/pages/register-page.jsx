import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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
import { Checkbox } from "@/components/ui/checkbox";
import { FullscreenLoader } from "@/components/ui/fullscreen-loader";
import { toast } from "sonner";

import clsx from "clsx"; // Giúp xử lý class điều kiện
import { register as registerApi } from "@/features/auth/auth-service"; // Import hàm đăng ký từ service

// Zod schema
const schema = z
  .object({
    name: z.string().min(2, "Họ tên ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    phone: z
      .string()
      .min(10, "Ít nhất 10 số")
      .max(15, "Tối đa 15 số")
      .regex(/^\d+$/, "Chỉ chứa số"),
    password: z.string().min(8, "Mật khẩu ít nhất 8 ký tự"),
    confirmPassword: z.string().min(8, "Mật khẩu ít nhất 8 ký tự"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

const RegisterPage = () => {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    if (loading || !agreed) return;
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
      };

      const response = await registerApi(payload);

      toast.success(
        response?.message ||
          "Đăng ký thành công! Vui lòng xác minh email của bạn."
      );

      // Redirect to verification page
      navigate("/verify?from=verification-email", {
        state: { email: data.email },
      });
    } catch (error) {
      const message = error?.message || "Đăng ký thất bại! Vui lòng thử lại.";
      toast.error("Lỗi đăng ký:", {
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-white mx-12 md:mx-0">
      {loading && <FullscreenLoader />}
      <Card className="w-full max-w-xl rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Đăng ký tài khoản của bạn</CardTitle>
          <CardDescription>
            Nhập email và mật khẩu để tạo tài khoản mới.
          </CardDescription>
          <CardAction>
            <Button variant="link" asChild>
              <Link to="/login">Đăng nhập</Link>
            </Button>
          </CardAction>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent>
            <div className="grid gap-4">
              {/* Họ tên */}
              <div className="grid gap-2">
                <Label htmlFor="name">Họ tên</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className={clsx({ "border-red-500": errors.name })}
                  {...register("name")}
                />
                <p className="text-red-600 text-sm min-h-[1.5rem]">
                  {errors.name?.message}
                </p>
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    className={clsx({ "border-red-500": errors.email })}
                    {...register("email")}
                  />
                  <p className="text-red-600 text-sm min-h-[1.5rem]">
                    {errors.email?.message}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0123456789"
                    className={clsx({ "border-red-500": errors.phone })}
                    {...register("phone")}
                  />
                  <p className="text-red-600 text-sm min-h-[1.5rem]">
                    {errors.phone?.message}
                  </p>
                </div>
              </div>

              {/* Password + Confirm */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mật khẩu của bạn"
                    className={clsx({ "border-red-500": errors.password })}
                    {...register("password")}
                  />
                  <p className="text-red-600 text-sm min-h-[1.5rem]">
                    {errors.password?.message}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    className={clsx({
                      "border-red-500": errors.confirmPassword,
                    })}
                    {...register("confirmPassword")}
                  />
                  <p className="text-red-600 text-sm min-h-[1.5rem]">
                    {errors.confirmPassword?.message}
                  </p>
                </div>
              </div>

              {/* Checkbox điều khoản */}
              <div className="flex items-start gap-2 mt-2">
                <Checkbox
                  id="terms"
                  checked={agreed}
                  onCheckedChange={(value) => setAgreed(!!value)}
                />
                <div className="text-sm text-gray-700 leading-tight mb-5">
                  Tôi đã đọc và đồng ý với{" "}
                  <span
                    className="text-blue-600 underline cursor-pointer"
                    onClick={() => navigate("/terms-of-service")}
                  >
                    Điều khoản sử dụng
                  </span>{" "}
                  và{" "}
                  <span
                    className="text-blue-600 underline cursor-pointer"
                    onClick={() => navigate("/privacy-policy")}
                  >
                    Chính sách bảo mật
                  </span>{" "}
                  của Harmony Decor
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="w-full rounded-full"
              disabled={!agreed || loading}
            >
              Đăng ký
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;
