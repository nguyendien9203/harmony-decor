export const NAVIGATION_MENU = [
  { label: "Trang Chủ", id: "home" },
  { label: "Về Chúng Tôi", id: "about-us" },
  { label: "Bộ Sưu Tập", id: "collection" },
];

export const getAccountMenuItems = (logout, navigate) => [
  { label: "Hồ sơ", path: "profile" },
  { label: "Đơn hàng", path: "orders" },
  {
    label: "Đăng xuất",
    path: "logout",
    onClick: () => {
      logout();
      navigate("/");
    },
  },
];
