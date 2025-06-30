import React from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import FloorPlane from './FloorPlane';
import DecorItem from './DecorItem';
import Toolbar from './Toolbar';
import FloorInput from './FloorInput';
import { useDecorStore } from '@/stores/decorStore';

/**
 * DropZone: gắn sự kiện dragover/drop lên chính canvas WebGL.
 * Khi drop: đọc model từ dataTransfer, raycast tính vị trí trên mặt phẳng rồi addItem.
 */
function DropZone() {
  const addItem = useDecorStore((s) => s.addItem);
  const floorWidth = useDecorStore((s) => s.floorWidth);
  const floorHeight = useDecorStore((s) => s.floorHeight);
  const { gl, camera } = useThree();

  React.useEffect(() => {
    const canvas = gl.domElement;

    const handleDragOver = (e) => {
      e.preventDefault();
      canvas.style.cursor = 'copy';
    };

    const handleDragLeave = () => {
      canvas.style.cursor = 'auto';
    };

    const handleDrop = (e) => {
      e.preventDefault();
      canvas.style.cursor = 'auto';
      const modelPath = e.dataTransfer.getData('model');
      if (!modelPath) return;

      // Tính tọa độ NDC
      const rect = canvas.getBoundingClientRect();
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Raycast xuống mặt phẳng y=0.05
      const ray = new THREE.Raycaster();
      ray.setFromCamera({ x: ndcX, y: ndcY }, camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.05);
      const pt = new THREE.Vector3();
      ray.ray.intersectPlane(plane, pt);

      // Kiểm tra xem điểm có nằm trong phạm vi sàn không
      const halfWidth = floorWidth / 2;
      const halfHeight = floorHeight / 2;
      
      if (pt && 
          pt.x >= -halfWidth && pt.x <= halfWidth && 
          pt.z >= -halfHeight && pt.z <= halfHeight) {
        // Thêm item vào store
        addItem(modelPath, [pt.x, 0.05, pt.z]);
      }
    };

    canvas.addEventListener('dragover', handleDragOver);
    canvas.addEventListener('dragleave', handleDragLeave);
    canvas.addEventListener('drop', handleDrop);
    return () => {
      canvas.removeEventListener('dragover', handleDragOver);
      canvas.removeEventListener('dragleave', handleDragLeave);
      canvas.removeEventListener('drop', handleDrop);
    };
  }, [gl.domElement, camera, addItem, floorWidth, floorHeight]);

  return null;
}

const CanvasScene = () => {
  const decorList = useDecorStore((s) => s.decorList);
  const setSelectedId = useDecorStore((s) => s.setSelectedId);
  const editing = useDecorStore((s) => s.editing);
  const showFloorInput = useDecorStore((s) => s.showFloorInput);
  const floorCreated = useDecorStore((s) => s.floorCreated);

  // Hàm chụp ảnh đã có preserveDrawingBuffer
  const handleScreenshot = (res) => {
    document.body.classList.add('hide-ui');
    setTimeout(() => {
      const [w, h] = res.split('x').map(Number);
      const canvas = document.getElementsByTagName('canvas')[0];
      const off = document.createElement('canvas');
      off.width = w;
      off.height = h;
      const ctx = off.getContext('2d');
      ctx.drawImage(canvas, 0, 0, w, h);
      off.toBlob((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `decor_snapshot_${w}x${h}.png`;
        link.click();
        document.body.classList.remove('hide-ui');
      });
    }, 100);
  };

  return (
    <div style={{ position: 'relative', flex: 1 }}>
      {/* Hiển thị FloorInput nếu chưa tạo sàn */}
      {showFloorInput && <FloorInput />}
      
      {/* Chỉ hiển thị Toolbar khi đã tạo sàn */}
      {floorCreated && <Toolbar onTakeScreenshot={handleScreenshot} />}
      
      <Canvas
        gl={{ preserveDrawingBuffer: true }}
        camera={{ position: [0, 5, 10], fov: 60 }}
        style={{ width: '100%', height: '100vh' }}
        onPointerMissed={() => setSelectedId(null)}
      >
        {/* Chỉ render nội dung 3D khi đã tạo sàn */}
        {floorCreated && (
          <>
            {/* Bật DropZone */}
            <DropZone />

            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 10, 5]} intensity={1} />
            <OrbitControls makeDefault enabled={!editing} />
            <FloorPlane />

            {decorList.map((item) => (
              <DecorItem key={item.id} item={item} />
            ))}
          </>
        )}
      </Canvas>
    </div>
  );
};

export default CanvasScene;