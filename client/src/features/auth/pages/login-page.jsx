import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

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

import { useAuth } from "@/hooks/use-auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const from = location.state?.from || "/";

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const response = await login(email, password);

      if (user.roles === "ADMIN") {
        toast.success(response?.message || "Đăng nhập thành công!");
        navigate("/admin", { replace: true });
      } else if (user.roles === "USER") {
        toast.success(response?.message || "Đăng nhập thành công!");
        navigate(from, { replace: true });
      }
    } catch (error) {
      setLoading(false);
      const message = error?.message || "Đăng nhập thất bại! Vui lòng thử lại.";
      if (error?.status === 400) {
        toast.info("Xác minh Email", {
          description: message,
        });
        navigate("/verify?from=verification-email", { state: { email } });
        return;
      }

      toast.error("Lỗi đăng nhập:", {
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
          <CardTitle>Đăng nhập tài khoản của bạn</CardTitle>
          <CardDescription>
            Nhập email và mật khẩu để đăng nhập vào tài khoản của bạn.
          </CardDescription>
          <CardAction>
            <Button variant="link" asChild>
              <Link to="/register">Đăng ký</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <form onSubmit={onSubmit} noValidate>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Link
                    to="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mật khẩu của bạn"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 mt-4">
            <Button
              type="submit"
              className="w-full rounded-full"
              onClick={onSubmit}
              disabled={loading || !email || !password}
            >
              Đăng nhập
            </Button>
            <Button variant="outline" className="w-full rounded-full">
              Đăng nhập với Google
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
