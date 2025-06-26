import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfServicePage = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Điều khoản dịch vụ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 text-gray-700 text-sm leading-relaxed">
          <p>
            Khi sử dụng website hoặc ứng dụng của chúng tôi, bạn đồng ý tuân thủ
            và bị ràng buộc bởi các điều khoản sau:
          </p>

          <ul className="list-disc pl-5 space-y-1">
            <li>Không sử dụng dịch vụ cho mục đích bất hợp pháp.</li>
            <li>Không can thiệp, làm gián đoạn hệ thống hoặc bảo mật.</li>
            <li>Tuân thủ các quy định của pháp luật Việt Nam.</li>
          </ul>

          <p>
            Chúng tôi có quyền thay đổi nội dung điều khoản mà không cần thông
            báo trước. Việc tiếp tục sử dụng đồng nghĩa bạn đã đồng ý với các
            điều khoản cập nhật.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsOfServicePage;
