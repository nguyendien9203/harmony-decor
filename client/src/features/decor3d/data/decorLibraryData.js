// ───────────────────────────────────────────────────────────────────────────────
//   src/data/decorLibraryData.js
// ───────────────────────────────────────────────────────────────────────────────

// This file exports an array of DecorMeta objects.
// Each object includes category, thumbnailUrl, modelUrl, defaultScale, etc.

export const decorLibrary = [
  // ===== Category: Đèn bàn =====
  {
    modelId: "lamp01",
    name: "Đèn LED Mini",
    category: "Đèn bàn",
    thumbnailUrl: "/thumbnails/lamp01.png",
    modelUrl: "/models/lamp01.glb",
    defaultColor: "#ffffff",
    defaultScale: 0.5,
    baseDimensions: { width: 0.1, height: 0.2, depth: 0.1 }
  },
  {
    modelId: "lamp02",
    name: "Đèn Cổ Điển",
    category: "Đèn bàn",
    thumbnailUrl: "/thumbnails/lamp02.png",
    modelUrl: "/models/lamp02.glb",
    defaultColor: "#f5f3e7",
    defaultScale: 0.6,
    baseDimensions: { width: 0.12, height: 0.25, depth: 0.12 }
  },

  // ===== Category: Cây cảnh =====
  {
    modelId: "plant01",
    name: "Chậu Cây Xương Rồng",
    category: "Cây cảnh",
    thumbnailUrl: "/thumbnails/plant01.png",
    modelUrl: "/models/plant01.glb",
    defaultColor: "#228B22",
    defaultScale: 0.7,
    baseDimensions: { width: 0.15, height: 0.3, depth: 0.15 }
  },
  {
    modelId: "plant02",
    name: "Bonsai Mini",
    category: "Cây cảnh",
    thumbnailUrl: "/thumbnails/plant02.png",
    modelUrl: "/models/plant02.glb",
    defaultColor: "#2E8B57",
    defaultScale: 0.65,
    baseDimensions: { width: 0.2, height: 0.25, depth: 0.2 }
  },

  // ===== Category: Khung ảnh =====
  {
    modelId: "frame01",
    name: "Khung Ảnh Gỗ",
    category: "Khung ảnh",
    thumbnailUrl: "/thumbnails/frame01.png",
    modelUrl: "/models/frame01.glb",
    defaultColor: "#8B4513",
    defaultScale: 0.4,
    baseDimensions: { width: 0.25, height: 0.2, depth: 0.02 }
  },
  {
    modelId: "frame02",
    name: "Khung Ảnh Kim Loại",
    category: "Khung ảnh",
    thumbnailUrl: "/thumbnails/frame02.png",
    modelUrl: "/models/frame02.glb",
    defaultColor: "#CCCCCC",
    defaultScale: 0.45,
    baseDimensions: { width: 0.3, height: 0.25, depth: 0.015 }
  },

  // ===== Category: Giá sách =====
  {
    modelId: "shelf01",
    name: "Giá Sách Mini Gỗ",
    category: "Giá sách",
    thumbnailUrl: "/thumbnails/shelf01.png",
    modelUrl: "/models/shelf01.glb",
    defaultColor: "#DEB887",
    defaultScale: 0.8,
    baseDimensions: { width: 0.5, height: 0.3, depth: 0.15 }
  },
  {
    modelId: "shelf02",
    name: "Giá Sách Kim Loại",
    category: "Giá sách",
    thumbnailUrl: "/thumbnails/shelf02.png",
    modelUrl: "/models/shelf02.glb",
    defaultColor: "#808080",
    defaultScale: 0.85,
    baseDimensions: { width: 0.6, height: 0.35, depth: 0.2 }
  },

  // ===== Category: Đồ học tập =====
  {
    modelId: "stationery01",
    name: "Hộp Bút Mica",
    category: "Đồ học tập",
    thumbnailUrl: "/thumbnails/stationery01.png",
    modelUrl: "/models/stationery01.glb",
    defaultColor: "#FFFFFF",
    defaultScale: 0.5,
    baseDimensions: { width: 0.12, height: 0.15, depth: 0.12 }
  },
  {
    modelId: "stationery02",
    name: "Giá Kẹp Tài Liệu",
    category: "Đồ học tập",
    thumbnailUrl: "/thumbnails/stationery02.png",
    modelUrl: "/models/stationery02.glb",
    defaultColor: "#FFD700",
    defaultScale: 0.6,
    baseDimensions: { width: 0.2, height: 0.25, depth: 0.05 }
  }
];
