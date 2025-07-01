import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Về Chúng Tôi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Harmony Decor - Nơi Sáng Tạo Không Gian Học Tập</h2>
            <p className="text-gray-600 mb-4">
              Harmony Decor là nền tảng mô phỏng bàn học 3D, giúp bạn thỏa sức sáng tạo không gian cá nhân. 
              Chúng tôi tin rằng một không gian học tập được thiết kế tốt sẽ truyền cảm hứng và nâng cao hiệu quả học tập.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Sứ Mệnh</h3>
            <p className="text-gray-600 mb-4">
              Chúng tôi cam kết mang đến những giải pháp thiết kế không gian học tập tối ưu, 
              giúp người dùng dễ dàng hình dung và tạo lập không gian học tập lý tưởng cho riêng mình.
            </p>

            <h3 className="text-xl font-semibold mb-3">Tầm Nhìn</h3>
            <p className="text-gray-600 mb-4">
              Trở thành nền tảng hàng đầu trong lĩnh vực thiết kế và mô phỏng không gian học tập 3D, 
              góp phần nâng cao chất lượng môi trường học tập cho mọi người.
            </p>

            <h3 className="text-xl font-semibold mb-3">Giá Trị Cốt Lõi</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Sáng tạo và đổi mới</li>
              <li>Chất lượng và chuyên nghiệp</li>
              <li>Hướng đến trải nghiệm người dùng</li>
              <li>Phát triển bền vững</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage; 