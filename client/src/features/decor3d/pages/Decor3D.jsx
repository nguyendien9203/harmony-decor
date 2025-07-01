import React, { useState } from 'react';
import { useDecorStore }  from '@/stores/decorStore';
import Sidebar            from './Sidebar';
import CanvasScene        from './CanvasScene';
import FloorInput         from './FloorInput';
import IntroTooltip       from './IntroTooltip';

const Decor3D = () => {
  const [tourOpen, setTourOpen] = useState(true);
  const showFloorInput          = useDecorStore(s => s.showFloorInput);

  return (
    <div
      style={{
        display:       'flex',
        flexDirection: 'row',
        width:         '100vw',
        height:        '100vh',
        backgroundImage: `
          linear-gradient(rgba(200,200,255,0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(200,200,255,0.3) 1px, transparent 1px)
        `,
        backgroundSize:  '20px 20px',
        backgroundColor: '#f8f8f8',
      }}
    >
      {/* 1) Tour overlay */}
      <IntroTooltip open={tourOpen} onClose={() => setTourOpen(false)} />

      {/* 2) Phần UI chính chỉ hiện khi tour xong */}
      {!tourOpen && (
        <>
          <div
            className="sidebar-container"
            style={{ width: 60, position: 'fixed', left: 0 }}
          >
            <Sidebar />
          </div>

          <div
            className="canvas-container"
            style={{ flex: 1, position: 'relative', marginLeft: 60 }}
          >
            <CanvasScene />

            {/* 3) Modal FloorInput chỉ hiện khi tour xong và trước khi tạo sàn */}
            {showFloorInput && <FloorInput />}
          </div>
        </>
      )}
    </div>
  );
};

export default Decor3D;
