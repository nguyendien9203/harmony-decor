import React from "react";
import Sidebar from "./Sidebar";
import CanvasScene from "./CanvasScene";

const Decor3D = () => {
  return (
    <div
      id="decor-3d"
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100vw",
        height: "100vh",
        backgroundImage: `
          linear-gradient(rgba(200, 200, 255, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(200, 200, 255, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
        backgroundColor: "#f8f8f8",
      }}
    >
      <Sidebar />
      <div style={{ flex: 1, position: "relative" }}>
        <CanvasScene />
      </div>
    </div>
  );
};

export default Decor3D;
