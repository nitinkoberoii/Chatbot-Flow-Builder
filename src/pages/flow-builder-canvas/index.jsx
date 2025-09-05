import React, { useState, useCallback } from 'react';
import Header from '../../components/ui/Header';
import PanelCoordinator from '../../components/ui/PanelCoordinator';
import CanvasController from '../../components/ui/CanvasController';
import FlowCanvas from './components/FlowCanvas';
import FlowValidation from './components/FlowValidation';

const FlowBuilderCanvas = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [validationState, setValidationState] = useState({ isValid: true, errors: [] });
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'unsaved', 'saving'
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [showMinimap, setShowMinimap] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [flowTitle, setFlowTitle] = useState("Customer Support Bot");
  const [interactionMode, setInteractionMode] = useState('select');

  // Handle node selection
  const handleNodeSelect = useCallback((node) => {
    setSelectedNode(node);
  }, []);

  // Handle node updates
  const handleNodeUpdate = useCallback((nodeId, newData) => {
    setSaveStatus('unsaved');
    // Update node data directly through reactFlowInstance
    if (reactFlowInstance) {
      const nodes = reactFlowInstance.getNodes();
      const updatedNodes = nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      });
      reactFlowInstance.setNodes(updatedNodes);
    }
  }, [reactFlowInstance]);

  // Handle adding new nodes
  const handleNodeAdd = useCallback((nodeType) => {
    // This would typically add a node at a default position
    // For now, we'll just show a message that user should drag from panel
    console.log(`Add ${nodeType} node - drag from panel to canvas`);
  }, []);

  // Handle validation changes
  const handleValidationChange = useCallback((newValidationState) => {
    setValidationState(newValidationState);
  }, []);

  // Handle save flow
  const handleSave = useCallback(async () => {
    if (!reactFlowInstance) return;
    
    setSaveStatus('saving');
    
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const nodes = reactFlowInstance?.getNodes();
      const edges = reactFlowInstance?.getEdges();
      
      // Validate before saving
      if (!validationState?.isValid) {
        console.log('Cannot save: Flow has validation errors');
        setSaveStatus('unsaved');
        return;
      }
      
      // Mock save to localStorage or API
      const flowData = {
        id: 'flow-' + Date.now(),
        title: flowTitle,
        nodes,
        edges,
        savedAt: new Date()?.toISOString()
      };
      
      localStorage.setItem('chatbot-flow', JSON.stringify(flowData));
      console.log('Flow saved successfully:', flowData);
      
      setSaveStatus('saved');
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('unsaved');
    }
  }, [reactFlowInstance, validationState?.isValid, flowTitle]);

  // Handle export
  const handleExport = useCallback(async (format) => {
    if (!reactFlowInstance) return;
    
    const nodes = reactFlowInstance.getNodes();
    const edges = reactFlowInstance.getEdges();
    const fileName = flowTitle?.toLowerCase()?.replace(/\s+/g, '-') || 'chatbot-flow';
    
    switch (format) {
      case 'json':
        const jsonData = JSON.stringify({ nodes, edges }, null, 2);
        const jsonBlob = new Blob([jsonData], { type: 'application/json' });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const jsonLink = document.createElement('a');
        jsonLink.href = jsonUrl;
        jsonLink.download = `${fileName}.json`;
        jsonLink.click();
        URL.revokeObjectURL(jsonUrl);
        break;
        
      case 'image':
        try {
          // Find the ReactFlow viewport element
          const viewport = document.querySelector('.react-flow__viewport');
          if (!viewport) {
            console.error('ReactFlow viewport not found');
            return;
          }
          
          // Use html2canvas to capture the flow
          const { default: html2canvas } = await import('html2canvas');
          const canvas = await html2canvas(viewport, {
            backgroundColor: '#ffffff',
            scale: 2, // Higher quality
            useCORS: true,
            allowTaint: true
          });
          
          // Convert to blob and download
          canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${fileName}.png`;
            link.click();
            URL.revokeObjectURL(url);
          }, 'image/png');
        } catch (error) {
          console.error('Failed to export image:', error);
          // Fallback: use ReactFlow's built-in screenshot if available
          if (reactFlowInstance.getViewport) {
            console.log('Using ReactFlow built-in export (if available)');
          }
        }
        break;
        
      case 'pdf':
        try {
          // First capture as image
          const viewport = document.querySelector('.react-flow__viewport');
          if (!viewport) {
            console.error('ReactFlow viewport not found');
            return;
          }
          
          const { default: html2canvas } = await import('html2canvas');
          const canvas = await html2canvas(viewport, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true,
            allowTaint: true
          });
          
          // Convert to PDF
          const { jsPDF } = await import('jspdf');
          const imgData = canvas.toDataURL('image/png');
          
          // Calculate dimensions to fit the page
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = imgWidth / imgHeight;
          
          const pdf = new jsPDF({
            orientation: ratio > 1 ? 'landscape' : 'portrait',
            unit: 'px',
            format: [imgWidth, imgHeight]
          });
          
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          pdf.save(`${fileName}.pdf`);
        } catch (error) {
          console.error('Failed to export PDF:', error);
        }
        break;
        
      default:
        console.log('Unknown export format:', format);
    }
  }, [reactFlowInstance, flowTitle]);

  // Handle settings
  const handleSettings = useCallback((settingType) => {
    console.log('Open settings:', settingType);
    // Could open modals or panels for different settings
  }, []);

  // Handle title change
  const handleTitleChange = useCallback((newTitle) => {
    setFlowTitle(newTitle);
    setSaveStatus('unsaved');
  }, []);

  // Handle canvas ready
  const handleCanvasReady = useCallback((instance) => {
    setReactFlowInstance(instance);
  }, []);

  // Handle zoom changes
  const handleZoomChange = useCallback((zoom) => {
    setZoomLevel(zoom);
  }, []);

  // Handle validation
  const handleValidate = useCallback(() => {
    // Validation is handled automatically by FlowCanvas
    console.log('Manual validation triggered');
  }, []);

  // Handle canvas controls
  const handleFitView = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance?.fitView({ padding: 0.2 });
    }
  }, [reactFlowInstance]);

  const handleZoomIn = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance?.zoomIn();
    }
  }, [reactFlowInstance]);

  const handleZoomOut = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance?.zoomOut();
    }
  }, [reactFlowInstance]);

  const handleCenterCanvas = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance?.setCenter(0, 0);
    }
  }, [reactFlowInstance]);

  const handleToggleMinimap = useCallback(() => {
    setShowMinimap(prev => !prev);
  }, []);

  const handleToggleGrid = useCallback(() => {
    setShowGrid(prev => !prev);
  }, []);

  const handleTogglePanelCollapse = useCallback(() => {
    setIsPanelCollapsed(prev => !prev);
  }, []);

  const handleInteractionModeChange = useCallback((mode) => {
    setInteractionMode(mode);
  }, []);

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <Header
        flowTitle={flowTitle}
        saveStatus={saveStatus}
        validationErrors={validationState?.errors}
        onSave={handleSave}
        onExport={handleExport}
        onSettings={handleSettings}
        onTitleChange={handleTitleChange}
      />
      {/* Main Content */}
      <div className="flex-1 flex relative" style={{ paddingTop: '60px' }}>
        {/* Left Panel */}
        <PanelCoordinator
          selectedNode={selectedNode}
          onNodeSelect={handleNodeSelect}
          onNodeUpdate={handleNodeUpdate}
          onNodeAdd={handleNodeAdd}
          isCollapsed={isPanelCollapsed}
          onToggleCollapse={handleTogglePanelCollapse}
        />

        {/* Canvas Area */}
        <div className={`flex-1 relative ${isPanelCollapsed ? 'ml-12' : 'ml-[300px]'} transition-all duration-300`}>
          <FlowCanvas
            selectedNode={selectedNode}
            onNodeSelect={handleNodeSelect}
            onNodeUpdate={handleNodeUpdate}
            onValidationChange={handleValidationChange}
            showMinimap={showMinimap}
            showGrid={showGrid}
            onCanvasReady={handleCanvasReady}
            onZoomChange={handleZoomChange}
            interactionMode={interactionMode}
          />

          {/* Canvas Controls */}
          <CanvasController
            reactFlowInstance={reactFlowInstance}
            validationState={validationState}
            onValidate={handleValidate}
            onFitView={handleFitView}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onToggleMinimap={handleToggleMinimap}
            showMinimap={showMinimap}
            onToggleGrid={handleToggleGrid}
            showGrid={showGrid}
            onCenterCanvas={handleCenterCanvas}
            zoomLevel={zoomLevel}
            onInteractionModeChange={handleInteractionModeChange}
            isPanelCollapsed={isPanelCollapsed}
          />

          {/* Validation Panel */}
          <FlowValidation
            validationState={validationState}
            onSave={handleSave}
            onValidate={handleValidate}
            isSaving={saveStatus === 'saving'}
          />
        </div>
      </div>
    </div>
  );
};

export default FlowBuilderCanvas;