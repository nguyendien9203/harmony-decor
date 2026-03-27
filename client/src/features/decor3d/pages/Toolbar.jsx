// src/Toolbar.jsx
import React, { useState, useEffect } from 'react';
import { Button, Select } from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CameraOutlined,
  DownloadOutlined,
  FolderAddOutlined,
  FolderOpenOutlined,
  UploadOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useDecorStore } from '@/stores/decorStore';

const { Option } = Select;
const resolutions = [
  { label: 'HD (1920×1080)', value: '1920x1080' },
  { label: '4K (3840×2160)', value: '3840x2160' },
];

const Toolbar = ({ onTakeScreenshot }) => {
  const savePreset         = useDecorStore((s) => s.savePreset);
  const loadPreset         = useDecorStore((s) => s.loadPreset);
  const initializePresets  = useDecorStore((s) => s.initializePresets);
  const presets            = useDecorStore((s) => s.presets);
  const resetFloorInput    = useDecorStore((s) => s.resetFloorInput);

  const undo       = useDecorStore((s) => s.undo);
  const redo       = useDecorStore((s) => s.redo);
  const canUndo    = useDecorStore((s) => s.past.length > 0);
  const canRedo    = useDecorStore((s) => s.future.length > 0);

  const floorColor      = useDecorStore((s) => s.floorColor);
  const setFloorColor   = useDecorStore((s) => s.setFloorColor);
  const setFloorTexture = useDecorStore((s) => s.setFloorTexture);

  const [selectedPreset, setSelectedPreset] = useState(null);
  const [resolution, setResolution]         = useState(resolutions[0].value);
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);

  useEffect(() => {
    initializePresets();
  }, [initializePresets]);

  const handleExportJSON = () => {
    const data = JSON.stringify(useDecorStore.getState().decorList, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'decor-layout.json';
    link.click();
  };

  const handleSavePreset = () => {
    const nextIndex = Object.keys(presets).length + 1;
    const name = `Preset ${nextIndex}`;
    savePreset(name);
  };

  const handleSelectPreset = (value) => {
    setSelectedPreset(value);
    if (value) loadPreset(value);
    else useDecorStore.getState().resetLayout();
    setShowPresetDropdown(false);
  };

  const handleUploadTexture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setFloorTexture(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleResetFloor = () => {
    if (
      window.confirm(
        'Bạn có chắc muốn tạo lại sàn? Tất cả đồ trang trí sẽ bị xóa.'
      )
    ) {
      resetFloorInput();
    }
  };

  const tooltips = {
    undo:    'Undo',
    redo:    'Redo',
    capture: 'Chụp ảnh',
    export:  'Export JSON',
    save:    'Lưu preset',
    load:    'Load preset',
    color:   'Floor Color',
    upload:  'Upload Texture',
    reset:   'Tạo lại sàn',
  };

  const renderButton = (icon, onClick, tooltipText, disabled = false) => (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={(e) => {
        const tip = e.currentTarget.querySelector('.tooltip');
        tip.style.opacity = 1;
        tip.style.visibility = 'visible';
      }}
      onMouseLeave={(e) => {
        const tip = e.currentTarget.querySelector('.tooltip');
        tip.style.opacity = 0;
        tip.style.visibility = 'hidden';
      }}
    >
      <Button
        type="text"
        icon={icon}
        onClick={onClick}
        disabled={disabled}
        style={{
          fontSize:    20,
          padding:     8,
          borderRadius:'50%',
          width:       40,
          height:      40,
          display:     'flex',
          alignItems:  'center',
          justifyContent:'center',
        }}
      />
      <span
        className="tooltip"
        style={{
          position:     'absolute',
          top:          '100%',
          left:         '50%',
          transform:    'translateX(-50%)',
          background:   '#000',
          color:        '#fff',
          padding:      '4px 8px',
          borderRadius: 4,
          fontSize:     12,
          whiteSpace:   'nowrap',
          opacity:      0,
          visibility:   'hidden',
          transition:   'opacity 0.2s',
          marginTop:    4,
        }}
      >
        {tooltipText}
      </span>
    </div>
  );

  return (
    <div
      className="toolbar-container"
      style={{
        width:          60,
        height:         '80%',
        position:       'fixed',
        top:            '50%',
        transform:      'translateY(-50%)',
        right:          0,
        background:     '#fff',
        borderRadius:   '16px 0 0 16px',
        boxShadow:      '-2px 0 6px rgba(0,0,0,0.1)',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            16,
        padding:        '16px 0',
        zIndex:         1000,
      }}
    >
      {renderButton(<ArrowLeftOutlined />, undo, tooltips.undo, !canUndo)}
      {renderButton(<ArrowRightOutlined />, redo, tooltips.redo, !canRedo)}
      {renderButton(
        <CameraOutlined />,
        () => onTakeScreenshot(resolution),
        tooltips.capture
      )}
      {renderButton(<DownloadOutlined />, handleExportJSON, tooltips.export)}
      {renderButton(<FolderAddOutlined />, handleSavePreset, tooltips.save)}
      {renderButton(
        <FolderOpenOutlined />,
        () => setShowPresetDropdown(!showPresetDropdown),
        tooltips.load
      )}

      {showPresetDropdown && (
        <Select
          placeholder="Chọn preset"
          value={selectedPreset}
          allowClear
          onChange={handleSelectPreset}
          style={{
            position:   'absolute',
            right:      70,
            top:        '50%',
            transform:  'translateY(-50%)',
            width:      150,
            zIndex:     2000,
          }}
        >
          {Object.keys(presets).map((name) => (
            <Option key={name} value={name}>
              {name}
            </Option>
          ))}
        </Select>
      )}

      {/* Floor Color Picker */}
      <div
        style={{ position: 'relative' }}
        onMouseEnter={(e) => {
          const tip = e.currentTarget.querySelector('.tooltip');
          tip.style.opacity = 1;
          tip.style.visibility = 'visible';
        }}
        onMouseLeave={(e) => {
          const tip = e.currentTarget.querySelector('.tooltip');
          tip.style.opacity = 0;
          tip.style.visibility = 'hidden';
        }}
      >
        <Button
          type="text"
          icon={
            <span
              style={{
                width:        20,
                height:       20,
                background:   floorColor,
                display:      'block',
                borderRadius: '50%',
              }}
            />
          }
          onClick={() => document.getElementById('floorColorInput').click()}
          style={{
            fontSize:    20,
            padding:     8,
            borderRadius:'50%',
            width:       40,
            height:      40,
            display:     'flex',
            alignItems:  'center',
            justifyContent:'center',
          }}
        />
        <span
          className="tooltip"
          style={{
            position:     'absolute',
            top:          '100%',
            left:         '50%',
            transform:    'translateX(-50%)',
            background:   '#000',
            color:        '#fff',
            padding:      '4px 8px',
            borderRadius: 4,
            fontSize:     12,
            whiteSpace:   'nowrap',
            opacity:      0,
            visibility:   'hidden',
            transition:   'opacity 0.2s',
            marginTop:    4,
          }}
        >
          {tooltips.color}
        </span>
        <input
          id="floorColorInput"
          type="color"
          value={floorColor}
          onChange={(e) => setFloorColor(e.target.value)}
          style={{ display: 'none' }}
        />
      </div>

      {/* Upload Texture */}
      <div
        style={{ position: 'relative' }}
        onMouseEnter={(e) => {
          const tip = e.currentTarget.querySelector('.tooltip');
          tip.style.opacity = 1;
          tip.style.visibility = 'visible';
        }}
        onMouseLeave={(e) => {
          const tip = e.currentTarget.querySelector('.tooltip');
          tip.style.opacity = 0;
          tip.style.visibility = 'hidden';
        }}
      >
        <Button
          type="text"
          icon={<UploadOutlined />}
          onClick={() => document.getElementById('textureUpload').click()}
          style={{
            fontSize:    20,
            padding:     8,
            borderRadius:'50%',
            width:       40,
            height:      40,
            display:     'flex',
            alignItems:  'center',
            justifyContent:'center',
          }}
        />
        <span
          className="tooltip"
          style={{
            position:     'absolute',
            top:          '100%',
            left:         '50%',
            transform:    'translateX(-50%)',
            background:   '#000',
            color:        '#fff',
            padding:      '4px 8px',
            borderRadius: 4,
            fontSize:     12,
            whiteSpace:   'nowrap',
            opacity:      0,
            visibility:   'hidden',
            transition:   'opacity 0.2s',
            marginTop:    4,
          }}
        >
          {tooltips.upload}
        </span>
        <input
          id="textureUpload"
          type="file"
          accept="image/*"
          onChange={handleUploadTexture}
          style={{ display: 'none' }}
        />
      </div>

      {/* Reset Floor */}
      {renderButton(<HomeOutlined />, handleResetFloor, tooltips.reset)}
    </div>
  );
};

export default Toolbar;
