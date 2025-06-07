import React from "react";
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
import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-sm mt-10">
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
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mật khẩu</Label>
                </div>
                <Input id="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Nhập lại mật khẩu</Label>
                </div>
                <Input id="password" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full rounded-full">
            Đăng ký
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
