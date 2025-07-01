import React from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useDecorStore } from '@/stores/decorStore';

const FloorPlane = () => {
  const color = useDecorStore((s) => s.floorColor);
  const textureURL = useDecorStore((s) => s.floorTexture);
  const floorWidth = useDecorStore((s) => s.floorWidth);
  const floorHeight = useDecorStore((s) => s.floorHeight);

  // Hooks luôn ở vị trí đầu
  const textures = useLoader(
    THREE.TextureLoader,
    textureURL ? [textureURL] : []
  );
  const map = textures.length > 0 ? textures[0] : null;

  // Nếu có texture, thiết lập repeat để không bị stretch
  if (map) {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(floorWidth / 2, floorHeight / 2);
  }

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[floorWidth, floorHeight]} />
      <meshStandardMaterial
        color={!map ? color : undefined}
        map={map || undefined}
      />
    </mesh>
  );
};

export default FloorPlane;