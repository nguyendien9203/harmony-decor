import React, { useState } from 'react';
import { Button, Input, Card } from 'antd';
import { useDecorStore } from '@/stores/decorStore';

const FloorInput = () => {
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);
  const setFloorDimensions = useDecorStore((s) => s.setFloorDimensions);

  const handleCreate = () => {
    if (width > 0 && height > 0) {
      setFloorDimensions(Number(width), Number(height));
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2000,
        background: 'rgba(0, 0, 0, 0.5)',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card
        title="Thiết lập kích thước sàn"
        style={{
          width: 400,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
            Chiều rộng (m):
          </label>
          <Input
            type="number"
            min="1"
            max="50"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="Nhập chiều rộng"
          />
        </div>
        
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
            Chiều dài (m):
          </label>
          <Input
            type="number"
            min="1"
            max="50"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Nhập chiều dài"
          />
        </div>

        <div style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            size="large"
            onClick={handleCreate}
            disabled={!width || !height || width <= 0 || height <= 0}
          >
            Tạo sàn
          </Button>
        </div>
        
        <div style={{ 
          marginTop: 12, 
          fontSize: 12, 
          color: '#666', 
          textAlign: 'center' 
        }}>
          Kích thước khuyến nghị: 5-20m
        </div>
      </Card>
    </div>
  );
};

export default FloorInput;