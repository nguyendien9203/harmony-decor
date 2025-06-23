import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FullscreenLoader } from "@/components/ui/fullscreen-loader";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { getUserInfo } from "@/features/user/user-service";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      const response = await login(email, password);
      const user = await getUserInfo();
      if (user.roles === "ADMIN") {
        toast.success(response?.message || "Đăng nhập admin thành công!");
        navigate("/admin/dashboard", { replace: true });
      } else {
        toast.error("Chỉ tài khoản ADMIN mới được phép đăng nhập!");
        logout();
      }
    } catch (error) {
      setLoading(false);
      const message = error?.message || "Đăng nhập thất bại! Vui lòng thử lại.";
      toast.error("Lỗi đăng nhập:", { description: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {loading && <FullscreenLoader />}
      <Card className="w-full max-w-sm rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Đăng nhập Quản trị viên</CardTitle>
          <CardDescription>Chỉ dành cho tài khoản ADMIN.</CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit} noValidate>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mật khẩu quản trị"
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
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
