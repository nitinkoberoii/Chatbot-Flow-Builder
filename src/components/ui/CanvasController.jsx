import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const CanvasController = ({ 
  reactFlowInstance = null,
  validationState = { isValid: true, errors: [] },
  onValidate = () => {},
  onFitView = () => {},
  onZoomIn = () => {},
  onZoomOut = () => {},
  onToggleMinimap = () => {},
  showMinimap = false,
  onToggleGrid = () => {},
  showGrid = true,
  onCenterCanvas = () => {},
  zoomLevel = 1,
  onInteractionModeChange = () => {},
  isPanelCollapsed = false
}) => {
  const [showValidationDetails, setShowValidationDetails] = useState(false);
  const [interactionMode, setInteractionMode] = useState('select'); // 'select' or 'pan'

  const handleFitView = () => {
    if (reactFlowInstance) {
      reactFlowInstance?.fitView({ padding: 0.2 });
    }
    onFitView();
  };

  const handleZoomIn = () => {
    if (reactFlowInstance) {
      reactFlowInstance?.zoomIn();
    }
    onZoomIn();
  };

  const handleZoomOut = () => {
    if (reactFlowInstance) {
      reactFlowInstance?.zoomOut();
    }
    onZoomOut();
  };

  const handleCenterCanvas = () => {
    if (reactFlowInstance) {
      reactFlowInstance?.setCenter(0, 0);
    }
    onCenterCanvas();
  };

  const formatZoomLevel = (zoom) => {
    return `${Math.round(zoom * 100)}%`;
  };

  const handleModeChange = (mode) => {
    setInteractionMode(mode);
    onInteractionModeChange(mode);
  };

  const handleKeyDown = (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return; // Don't trigger shortcuts when typing in inputs
    }
    
    if (e.key === 'v' || e.key === 'V') {
      e.preventDefault();
      handleModeChange('select');
    } else if (e.key === 'h' || e.key === 'H') {
      e.preventDefault();
      handleModeChange('pan');
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Main Canvas Controls - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-canvas-controls">
        <div className="floating-control p-2 space-y-2">
          {/* Zoom Controls */}
          <div className="flex flex-col space-y-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              className="w-10 h-10"
              title="Zoom In"
            >
              <Icon name="Plus" size={18} />
            </Button>
            
            <div className="px-2 py-1 text-xs font-mono text-center text-muted-foreground bg-muted/50 rounded">
              {formatZoomLevel(zoomLevel)}
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              className="w-10 h-10"
              title="Zoom Out"
            >
              <Icon name="Minus" size={18} />
            </Button>
          </div>

          <div className="border-t border-border pt-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFitView}
              className="w-10 h-10"
              title="Fit to View"
            >
              <Icon name="Maximize2" size={18} />
            </Button>
          </div>

          <div className="border-t border-border pt-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCenterCanvas}
              className="w-10 h-10"
              title="Center Canvas"
            >
              <Icon name="Crosshair" size={18} />
            </Button>
          </div>

          {/* Interaction Mode Controls */}
          <div className="border-t border-border pt-2">
            <div className="flex flex-col space-y-1">
              <Button
                variant={interactionMode === 'select' ? "default" : "ghost"}
                size="icon"
                onClick={() => handleModeChange('select')}
                className="w-10 h-10"
                title="Selection Mode (V)"
              >
                <Icon name="MousePointer" size={18} />
              </Button>
              
              <Button
                variant={interactionMode === 'pan' ? "default" : "ghost"}
                size="icon"
                onClick={() => handleModeChange('pan')}
                className="w-10 h-10"
                title="Pan Mode (H)"
              >
                <Icon name="Hand" size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Keyboard Shortcuts Helper
      <div className="fixed bottom-6 left-6 z-canvas-controls">
        <div className="floating-control p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Could open a shortcuts modal
              console.log('Keyboard shortcuts');
            }}
            iconName="Keyboard"
            iconSize={16}
            title="Keyboard Shortcuts (Ctrl+?)"
            className="text-xs opacity-60 hover:opacity-100"
          >
          </Button>
        </div>
      </div> */}
    </>
  );
};

export default CanvasController;