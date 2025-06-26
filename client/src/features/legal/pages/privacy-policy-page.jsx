import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Chính sách bảo mật
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 text-gray-700 text-sm leading-relaxed">
          <p>
            Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Dưới đây là
            chính sách thu thập và sử dụng dữ liệu:
          </p>

          <ul className="list-disc pl-5 space-y-1">
            <li>
              Thông tin thu thập: Họ tên, email, số điện thoại, ảnh đại diện,...
            </li>
            <li>
              Mục đích: Xác minh tài khoản, liên hệ hỗ trợ, cải thiện dịch vụ.
            </li>
            <li>
              Chúng tôi không chia sẻ thông tin cho bên thứ ba mà không có sự
              đồng ý của bạn.
            </li>
            <li>
              Bạn có thể yêu cầu chỉnh sửa hoặc xoá thông tin bất kỳ lúc nào.
            </li>
          </ul>

          <p>
            Việc sử dụng dịch vụ đồng nghĩa với việc bạn đồng ý với chính sách
            bảo mật này.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicyPage;
