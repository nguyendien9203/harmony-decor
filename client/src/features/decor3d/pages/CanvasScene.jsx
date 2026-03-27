import React from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls }    from '@react-three/drei';
import * as THREE           from 'three';
import FloorPlane           from './FloorPlane';
import DecorItem            from './DecorItem';
import Toolbar              from './Toolbar';
import { useDecorStore }    from '@/stores/decorStore';

function DropZone() {
  const addItem     = useDecorStore(s => s.addItem);
  const width       = useDecorStore(s => s.floorWidth);
  const height      = useDecorStore(s => s.floorHeight);
  const { gl, camera } = useThree();

  React.useEffect(() => {
    const canvas = gl.domElement;
    const over   = e => { e.preventDefault(); canvas.style.cursor='copy'; };
    const leave  = () => canvas.style.cursor='auto';
    const drop   = e => {
      e.preventDefault();
      canvas.style.cursor='auto';
      const model = e.dataTransfer.getData('model');
      if (!model) return;
      const rect = canvas.getBoundingClientRect();
      const xNdc = ((e.clientX-rect.left)/rect.width)*2-1;
      const yNdc = -((e.clientY-rect.top)/rect.height)*2+1;
      const ray = new THREE.Raycaster();
      ray.setFromCamera({ x:xNdc, y:yNdc }, camera);
      const plane = new THREE.Plane(new THREE.Vector3(0,1,0), -0.05);
      const pt = new THREE.Vector3();
      ray.ray.intersectPlane(plane, pt);
      if (
        pt &&
        pt.x >= -width/2 && pt.x <= width/2 &&
        pt.z >= -height/2 && pt.z <= height/2
      ) addItem(model, [pt.x,0.05,pt.z]);
    };
    canvas.addEventListener('dragover', over);
    canvas.addEventListener('dragleave', leave);
    canvas.addEventListener('drop', drop);
    return () => {
      canvas.removeEventListener('dragover', over);
      canvas.removeEventListener('dragleave', leave);
      canvas.removeEventListener('drop', drop);
    };
  }, [gl.domElement, camera, addItem, width, height]);

  return null;
}

const CanvasScene = () => {
  const decorList    = useDecorStore(s => s.decorList);
  const setSelected  = useDecorStore(s => s.setSelectedId);
  const editing      = useDecorStore(s => s.editing);
  const floorCreated = useDecorStore(s => s.floorCreated);

  const handleScreenshot = res => {
    document.body.classList.add('hide-ui');
    setTimeout(() => {
      const [w,h] = res.split('x').map(Number);
      const canvas = document.querySelector('canvas');
      const off    = document.createElement('canvas');
      off.width  = w;
      off.height = h;
      off.getContext('2d').drawImage(canvas, 0,0, w,h);
      off.toBlob(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `snapshot_${w}x${h}.png`;
        link.click();
        document.body.classList.remove('hide-ui');
      });
    }, 100);
  };

  return (
    <div className="toolbar-container" style={{ position:'relative', flex:1 }}>
      {floorCreated && <Toolbar onTakeScreenshot={handleScreenshot} />}

      <Canvas
        gl={{ preserveDrawingBuffer:true }}
        camera={{ position:[0,5,10], fov:60 }}
        style={{ width:'100%', height:'100vh' }}
        onPointerMissed={()=>setSelected(null)}
      >
        {floorCreated && <DropZone />}
        {floorCreated && (
          <>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5,10,5]} intensity={1} />
            <OrbitControls makeDefault enabled={!editing} />
            <FloorPlane />
            {decorList.map(item => <DecorItem key={item.id} item={item} />)}
          </>
        )}
      </Canvas>
    </div>
  );
};

export default CanvasScene;
