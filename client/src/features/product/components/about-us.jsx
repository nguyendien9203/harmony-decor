import img1 from "@/assets/images/decor-ban-lam-viec.webp";
import img2 from "@/assets/images/phong-cach-hien-dai-ca-tinh.webp";
import img3 from "@/assets/images/decor-cay-canh-de-ban.webp";
import img4 from "@/assets/images/phong-cach-toi-gian-thanh-lich.webp";
import img5 from "@/assets/images/hop-dung-but.webp";

export default function AboutUs() {
  return (
    <section
      id="about-us"
      className="w-full py-6 mx-auto flex flex-col items-center mt-12"
    >
      <h2 className="text-3xl font-semibold mb-8 text-center">Về chúng tôi</h2>

      {/* Grid Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 w-full">
        {/* Left 2/3 */}
        <div className="md:col-span-2 relative h-64 md:h-96 rounded-xl overflow-hidden w-full">
          <img
            src={img1}
            alt="Simulate Study Space"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center p-6 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Tự Do Thiết Kế Không Gian
            </h2>
            <p className="text-base md:text-lg">
              Mô phỏng bàn học 3D giúp bạn tự do lựa chọn phong cách cá nhân.
            </p>
          </div>
        </div>

        {/* Right 1/3 */}
        <div className="relative h-64 md:h-96 rounded-xl overflow-hidden w-full">
          <img
            src={img2}
            alt="Decor Tools"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center p-6 text-white">
            <h2 className="text-lg md:text-xl font-semibold mb-1">
              Công Cụ Decor Đa Dạng
            </h2>
            <p>Nhiều món đồ decor sẵn sàng cho bạn lựa chọn.</p>
          </div>
        </div>
      </div>

      {/* Grid Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* Item 1 */}
        <div className="relative h-64 rounded-xl overflow-hidden w-full">
          <img
            src={img3}
            alt="Smart Suggestion"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center p-5 text-white">
            <h3 className="text-lg md:text-xl font-semibold mb-1">
              Đề Xuất Thông Minh
            </h3>
            <p>Gợi ý món đồ phù hợp theo màu sắc và bố cục.</p>
          </div>
        </div>

        {/* Item 2 */}
        <div className="relative h-64 rounded-xl overflow-hidden w-full">
          <img
            src={img4}
            alt="Community Share"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center p-5 text-white">
            <h3 className="text-lg md:text-xl font-semibold mb-1">
              Chia Sẻ Thiết Kế
            </h3>
            <p>Kết nối và truyền cảm hứng từ cộng đồng người dùng.</p>
          </div>
        </div>

        {/* Item 3 */}
        <div className="relative h-64 rounded-xl overflow-hidden w-full">
          <img
            src={img5}
            alt="Realistic Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center p-5 text-white">
            <h3 className="text-lg md:text-xl font-semibold mb-1">
              Xem Trước Thực Tế
            </h3>
            <p>Hình ảnh 3D chân thực trước khi đặt mua sản phẩm.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
