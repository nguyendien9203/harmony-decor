import React, { useState } from 'react';
import { Button } from 'antd';
import { decorLibrary } from '../data/decorLibraryData';

// Lấy danh sách category duy nhất từ decorLibrary
const categories = [...new Set(decorLibrary.map(item => item.category))];

// Mapping icon cho từng category
const categoryIcons = {
  'Đèn bàn': '💡',
  'Cây cảnh': '🌱',
  'Khung ảnh': '🖼️',
  'Giá sách': '📚',
  'Đồ học tập': '✏️',
};

const Sidebar = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Lọc item theo category được chọn
  const filteredItems = selectedCategory
    ? decorLibrary.filter(item => item.category === selectedCategory)
    : [];

  // Hàm xử lý click vào category
  const handleCategoryClick = (category) => {
    setSelectedCategory(prev => (prev === category ? null : category));
  };

  return (
    <>
      {/* Sidebar chứa các icon category */}
      <div
        style={{
          width: 60,
          height: '60%',
          position: 'fixed',
          top: '50%',
          transform: 'translateY(-50%)',
          left: 0,
          background: '#fff',
          borderRadius: '0 16px 16px 0',
          boxShadow: '2px 0 6px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: '16px 0',
          zIndex: 1000,
        }}
      >
        {categories.map((category, idx) => (
          <Button
            key={idx}
            type="text"
            onClick={() => handleCategoryClick(category)}
            style={{
              fontSize: 24,
              padding: 8,
              borderRadius: '50%',
              background: selectedCategory === category ? '#e6f7ff' : 'transparent',
              transition: 'background 0.2s',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f0f0')}
            onMouseLeave={(e) => (e.currentTarget.style.background = selectedCategory === category ? '#e6f7ff' : 'transparent')}
          >
            {categoryIcons[category] || '📦'}
          </Button>
        ))}
      </div>

      {/* Dropdown hiển thị danh sách item */}
      {selectedCategory && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: 60,
            transform: 'translateY(-50%)',
            width: 200,
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '2px 2px 10px rgba(0,0,0,0.1)',
            padding: '16px',
            zIndex: 2000,
            display: selectedCategory ? 'block' : 'none',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{selectedCategory}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredItems.map((item, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('model', item.modelUrl);
                  document.body.style.cursor = 'grabbing';
                  console.log('Dragging item:', item.name);
                }}
                onDragEnd={() => {
                  document.body.style.cursor = 'default';
                  console.log('Drag ended');
                }}
                onMouseEnter={() => (document.body.style.cursor = 'pointer')}
                onMouseLeave={() => (document.body.style.cursor = 'default')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'grab',
                }}
              >
                <img
                  src={item.thumbnailUrl}
                  alt={item.name}
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: 'cover',
                    borderRadius: 4,
                    border: '1px solid #d9d9d9',
                  }}
                />
                <span style={{ fontSize: 12 }}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;