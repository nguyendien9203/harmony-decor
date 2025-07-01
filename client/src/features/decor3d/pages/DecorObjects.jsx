import React, { Suspense } from 'react';
import { useDecorStore } from '@/stores/decorStore';
import { useGLTF } from '@react-three/drei';

const DecorItemSimple = ({ item }) => {
  const { scene } = useGLTF(item.model);
  return (
    <primitive
      object={scene.clone()}
      position={item.position}
      rotation={item.rotation}
      scale={item.scale}
    />
  );
};

const DecorObjects = () => {
  const decorList = useDecorStore((state) => state.decorList);
  return (
    <Suspense fallback={null}>
      {decorList.map((item) => (
        <DecorItemSimple key={item.id} item={item} />
      ))}
    </Suspense>
  );
};

export default DecorObjects;
