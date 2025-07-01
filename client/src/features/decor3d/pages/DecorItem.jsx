import React, { useRef, useState, useEffect } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useDecorStore } from '@/stores/decorStore';
import { Tooltip } from 'antd';
import {
  ArrowsAltOutlined,
  PlusOutlined,
  MinusOutlined,
  SettingOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

const DecorItem = ({ item }) => {
  const { scene } = useGLTF(item.model);
  const { camera, gl, controls } = useThree();

  const setPosition    = useDecorStore((s) => s.setPosition);
  const setTransform   = useDecorStore((s) => s.setTransform);
  const selectedId     = useDecorStore((s) => s.selectedId);
  const setSelectedId  = useDecorStore((s) => s.setSelectedId);
  const setEditingGlob = useDecorStore((s) => s.setEditing);
  const deleteItem     = useDecorStore((s) => s.deleteItem);
  const resetItem      = useDecorStore((s) => s.resetItem);

  const [editing, setEditing]     = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const isSelected = selectedId === item.id;

  // Khi bỏ chọn, tắt panel edit
  useEffect(() => {
    if (!isSelected) setEditing(false);
  }, [isSelected]);

  // Đồng bộ trạng thái editing để block OrbitControls
  useEffect(() => {
    setEditingGlob(editing);
    return () => setEditingGlob(false);
  }, [editing]);

  // Click phải để mở menu
  const handleSelect = (e) => {
    e.stopPropagation();
    if (e.button === 2) {
      setSelectedId(isSelected ? null : item.id);
    }
  };

  // Nhấn giữ trái để kéo thả
  const handlePointerDown = (e) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    document.body.style.cursor = 'grabbing';
    gl.domElement.style.pointerEvents = 'none';
    controls.enabled = false;
    setIsDragging(true);

    const onMove = (ev) => {
      const ndcX = (ev.clientX / window.innerWidth) * 2 - 1;
      const ndcY = -(ev.clientY / window.innerHeight) * 2 + 1;
      const ray = new THREE.Raycaster();
      ray.setFromCamera({ x: ndcX, y: ndcY }, camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.05);
      const pt = new THREE.Vector3();
      ray.ray.intersectPlane(plane, pt);
      if (pt) setPosition(item.id, [pt.x, 0.05, pt.z]);
    };

    const onUp = () => {
      document.body.style.cursor = 'default';
      gl.domElement.style.pointerEvents = 'auto';
      controls.enabled = true;
      setIsDragging(false);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  // Helpers cho các nút action
  const update = (key, value) => {
    setTransform(item.id, key, value);
  };

  const handleScaleUp = (e) => {
    e?.stopPropagation();
    const newScale = item.scale.map((s) => Math.min(s + 0.1, 3));
    update('scale', newScale);
  };

  const handleScaleDown = (e) => {
    e?.stopPropagation();
    const newScale = item.scale.map((s) => Math.max(s - 0.1, 0.3));
    update('scale', newScale);
  };

  const actions = [
    { icon: ArrowsAltOutlined, title: 'Di chuyển',   onClick: () => {} },
    { icon: PlusOutlined,      title: 'Phóng to',     onClick: handleScaleUp },
    { icon: MinusOutlined,     title: 'Thu nhỏ',      onClick: handleScaleDown },
    { icon: SettingOutlined,   title: 'Tuỳ chỉnh',    onClick: () => setEditing(!editing) },
    { icon: ReloadOutlined,    title: 'Reset',        onClick: () => resetItem(item.id) },
    { icon: DeleteOutlined,    title: 'Xoá',          onClick: () => deleteItem(item.id), color: 'red' },
  ];

  return (
    <group
      position={item.position}
      onContextMenu={handleSelect}
      onPointerDown={handlePointerDown}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!isDragging) document.body.style.cursor = 'pointer';
      }}
      onPointerMove={(e) => {
        e.stopPropagation();
        if (!isDragging) document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        if (!isDragging) document.body.style.cursor = 'default';
      }}
    >
      {/* 3D model + mesh-level hover để chắc chắn nhận pointer */}
      <primitive
        object={scene.clone()}
        scale={item.scale}
        rotation={item.rotation}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (!isDragging) document.body.style.cursor = 'pointer';
        }}
        onPointerMove={(e) => {
          e.stopPropagation();
          if (!isDragging) document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          if (!isDragging) document.body.style.cursor = 'default';
        }}
      />

      {/* Vòng cung icon menu */}
      {isSelected && (
        <Html position={[1.2, 1.2, 0]} center>
          <div style={{ position: 'relative', width: 100, height: 160 }}>
            {actions.map((act, i) => {
              const start = -Math.PI / 2;
              const end   = Math.PI / 2;
              const ang   = start + (i / (actions.length - 1)) * (end - start);
              const R     = 60;
              const x     = R * Math.cos(ang);
              const y     = R * Math.sin(ang);
              const Icon  = act.icon;

              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left:  `${50 + x}px`,
                    top:   `${80 + y}px`,
                    transform: 'translate(-50%,-50%)',
                  }}
                >
                  <Tooltip title={act.title} placement="left">
                    <Icon
                      style={{
                        fontSize: 20,
                        cursor:   'pointer',
                        background:'#fff',
                        borderRadius:'50%',
                        padding: 6,
                        color:   act.color || 'black',
                        boxShadow:'0 2px 6px rgba(0,0,0,0.2)',
                        transition:'transform 0.2s',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        act.onClick(e);
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  </Tooltip>
                </div>
              );
            })}
          </div>
        </Html>
      )}

      {/* Panel tuỳ chỉnh */}
      {isSelected && editing && (
        <Html position={[1.5, 1.2, 0]} center>
          <div style={{
            position: 'absolute',
            left:     '80px',
            top:      '10px',
            background: '#fff',
            padding:   10,
            borderRadius: 8,
            boxShadow:  '0 2px 6px rgba(0,0,0,0.2)',
            minWidth:  160,
            zIndex:   10,
          }}>
            <label style={{ display: 'block', fontSize: 12 }}>
              Scale:
              <input
                type="range"
                min="0.3"
                max="3"
                step="0.1"
                value={item.scale[0]}
                onChange={(e) =>
                  update('scale', [
                    +e.target.value,
                    +e.target.value,
                    +e.target.value,
                  ])
                }
                style={{ width: '100%' }}
              />
            </label>
            <label style={{ display: 'block', fontSize: 12 }}>
              Xoay:
              <input
                type="range"
                min="0"
                max="6.28"
                step="0.1"
                value={item.rotation[1]}
                onChange={(e) =>
                  update('rotation', [0, +e.target.value, 0])
                }
                style={{ width: '100%' }}
              />
            </label>
            <label style={{ display: 'block', fontSize: 12 }}>
              Màu:
              <input
                type="color"
                value={item.color || '#ffffff'}
                onChange={(e) => update('color', e.target.value)}
              />
            </label>
          </div>
        </Html>
      )}
    </group>
  );
};

export default DecorItem;
