import React from 'react';
import { Tour } from 'antd';

const steps = [
  {
    title: 'Giới thiệu dự án',
    description: 'Harmony Decor là nền tảng trực quan giúp bạn tự do bố trí decor 3D: kéo-thả, xoay, scale, thay đổi màu sắc và lưu lại bố cục chuyên nghiệp chỉ với vài cú click.',
    target: null,
    style:      { zIndex: 2001 },
    arrowStyle: { zIndex: 2001 },
  },
  {
    title: 'Thư viện decor',
    description: 'Chọn món decor từ thanh bên trái và kéo vào sàn để bố trí.',
    target:     () => document.querySelector('.sidebar-container'),
    style:      { zIndex: 2001 },
    arrowStyle: { zIndex: 2001 },
  },
  {
    title: 'Canvas 3D',
    description: 'Kéo chuột để xoay và xem bố cục tổng thể.',
    target:     () => document.querySelector('.canvas-container'),
    style:      { zIndex: 2001 },
    arrowStyle: { zIndex: 2001 },
  },
  {
    title: 'Chỉnh sửa decor',
    description: 'Click phải vào món decor để chỉnh sửa (di chuyển, xoay, scale, xóa).',
    target:     () => document.querySelector('.canvas-container'),
    style:      { zIndex: 2001 },
    arrowStyle: { zIndex: 2001 },
  },
  {
    title: 'Bắt đầu tạo sàn',
    description: 'Sau khi hoàn tất hướng dẫn, bạn sẽ nhập kích thước sàn để bắt đầu.',
    target: null,
    style:      { zIndex: 2001, maxWidth: 300 },
    arrowStyle: { zIndex: 2001 },
  },
];

const IntroTooltip = ({ open, onClose }) => (
  <Tour
    open={open}
    onClose={onClose}
    steps={steps}
    maskStyle={{ zIndex: 2000, backgroundColor: 'rgba(0,0,0,0.5)' }}
    arrow={false}
    maskClosable={false}
    showNavigation
    showProgress
    locale={{
      close:  'Đóng',
      prev:   'Trước',
      next:   'Tiếp',
      finish: 'Bắt đầu',
    }}
  />
);

export default IntroTooltip;
