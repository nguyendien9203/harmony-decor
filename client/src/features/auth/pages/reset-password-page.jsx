import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-sm rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Đặt lại mật khẩu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Mật khẩu mới</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button type="submit" className="w-full rounded-full">
              Xác nhận
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
