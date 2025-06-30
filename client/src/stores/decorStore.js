import { create } from 'zustand';

export const useDecorStore = create((set, get) => ({
  // 🗂 Decor items + UI state
  decorList: [],
  selectedId: null,
  editing: false,
  presets: {},

  // 🌪 History stacks for undo/redo
  past: [],
  future: [],

  // 🎨 Floor background settings
  floorColor: '#e0e0e0',
  floorTexture: null,
  
  // 📐 Floor dimensions
  floorWidth: 10,
  floorHeight: 10,
  showFloorInput: true,
  floorCreated: false,

  // —— History helpers ——
  _saveHistory: () => {
    const { past, decorList } = get();
    const snapshot = JSON.parse(JSON.stringify(decorList));
    set({ past: [...past, snapshot], future: [] });
  },

  // —— Core actions ——  
  setSelectedId: (id) => set({ selectedId: id }),
  setEditing: (val) => set({ editing: val }),

  // —— Floor dimension actions ——
  setFloorDimensions: (width, height) => {
    set({ 
      floorWidth: width, 
      floorHeight: height, 
      showFloorInput: false,
      floorCreated: true 
    });
  },
  
  resetFloorInput: () => {
    set({ 
      showFloorInput: true, 
      floorCreated: false,
      decorList: [],
      selectedId: null,
      editing: false,
      past: [],
      future: []
    });
  },

  addItem: (modelPath, position = [0, 0.05, 0]) => {
    get()._saveHistory();
    set((state) => ({
      decorList: [
        ...state.decorList,
        {
          id: Date.now() + Math.random(),
          model: modelPath,
          position,
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          color: '#ffffff',
          label: '',
          desc: '',
        },
      ],
    }));
  },

  setPosition: (id, position) => {
    get()._saveHistory();
    set((state) => ({
      decorList: state.decorList.map((item) =>
        item.id === id ? { ...item, position } : item
      ),
    }));
  },

  setTransform: (id, key, value) => {
    get()._saveHistory();
    set((state) => ({
      decorList: state.decorList.map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      ),
    }));
  },

  deleteItem: (id) => {
    get()._saveHistory();
    set((state) => ({
      decorList: state.decorList.filter((item) => item.id !== id),
      selectedId: null,
      editing: false,
    }));
  },

  resetItem: (id) => {
    get()._saveHistory();
    set((state) => ({
      decorList: state.decorList.map((item) =>
        item.id === id
          ? { ...item, scale: [1, 1, 1], rotation: [0, 0, 0], color: '#ffffff' }
          : item
      ),
    }));
  },

  resetLayout: () => {
    // Xóa toàn bộ decor và history
    set({ decorList: [], selectedId: null, editing: false, past: [], future: [] });
  },

  // —— Undo / Redo ——
  undo: () => {
    const { past, future, decorList } = get();
    if (!past.length) return;
    const previous = past[past.length - 1];
    const newPast  = past.slice(0, -1);
    const snapshot = JSON.parse(JSON.stringify(decorList));
    set({
      decorList: previous,
      past: newPast,
      future: [snapshot, ...future],
      selectedId: null,
      editing: false,
    });
  },

  redo: () => {
    const { past, future, decorList } = get();
    if (!future.length) return;
    const next    = future[0];
    const newFuture = future.slice(1);
    const snapshot  = JSON.parse(JSON.stringify(decorList));
    set({
      decorList: next,
      past: [...past, snapshot],
      future: newFuture,
      selectedId: null,
      editing: false,
    });
  },

  // —— Floor background setters ——
  setFloorColor: (color) => set({ floorColor: color }),
  setFloorTexture: (textureURL) => set({ floorTexture: textureURL }),

  // —— Preset logic ——
  savePreset: (name) => {
    const current = JSON.parse(localStorage.getItem('decorPresets') || '{}');
    const updated = { ...current, [name]: [...get().decorList] };
    localStorage.setItem('decorPresets', JSON.stringify(updated));
    set({ presets: updated });
  },
  loadPreset: (name) => {
    const saved = JSON.parse(localStorage.getItem('decorPresets') || '{}');
    const preset = saved[name] || [];
    set({ decorList: preset, selectedId: null, editing: false });
  },
  initializePresets: () => {
    const saved = JSON.parse(localStorage.getItem('decorPresets') || '{}');
    set({ presets: saved });
  },
}));