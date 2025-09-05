import React, { useCallback, useRef, useState, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

import TextNode from './TextNode';
import QuestionNode from './QuestionNode';
import ConditionNode from './ConditionNode';
import ActionNode from './ActionNode';
import DelayNode from './DelayNode';
import WebhookNode from './WebhookNode';
import VariableNode from './VariableNode';
import EndNode from './EndNode';

const nodeTypes = {
  text: TextNode,
  question: QuestionNode,
  condition: ConditionNode,
  action: ActionNode,
  delay: DelayNode,
  webhook: WebhookNode,
  variable: VariableNode,
  end: EndNode,
};

const FlowCanvas = ({
  selectedNode,
  onNodeSelect,
  onNodeUpdate,
  onValidationChange,
  showMinimap,
  showGrid,
  onCanvasReady,
  onZoomChange,
  interactionMode = 'select'
}) => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { project } = useReactFlow();

  // Initialize with a welcome text node
  useEffect(() => {
    const initialNodes = [
      {
        id: 'welcome-1',
        type: 'text',
        position: { x: 250, y: 100 },
        data: {
          label: 'Welcome Message',
          message: 'Hello! Welcome to our chatbot.',
          showTyping: true
        },
      },
    ];
    setNodes(initialNodes);
  }, [setNodes]);

  // Validate flow whenever nodes or edges change
  useEffect(() => {
    validateFlow();
  }, [nodes, edges]);

  // Pass reactFlowInstance to parent when ready
  useEffect(() => {
    if (reactFlowInstance && onCanvasReady) {
      onCanvasReady(reactFlowInstance);
    }
  }, [reactFlowInstance, onCanvasReady]);

  const validateFlow = useCallback(() => {
    const errors = [];
    
    // Check for nodes without incoming connections (except start nodes)
    const nodeIds = nodes?.map(n => n?.id);
    const targetNodeIds = edges?.map(e => e?.target);
    
    nodes?.forEach(node => {
      // Skip validation for the first node (start node)
      if (nodes?.indexOf(node) === 0) return;
      
      if (!targetNodeIds?.includes(node?.id)) {
        errors?.push({
          message: `Node "${node?.data?.label || node?.id}" has no incoming connections`,
          nodeId: node?.id,
          type: 'connection'
        });
      }
      
      // Check for empty required fields
      if (node?.type === 'text' && !node?.data?.message?.trim()) {
        errors?.push({
          message: `Text node "${node?.data?.label || node?.id}" has empty message`,
          nodeId: node?.id,
          type: 'content'
        });
      }
      
      if (node?.type === 'question' && !node?.data?.question?.trim()) {
        errors?.push({
          message: `Question node "${node?.data?.label || node?.id}" has empty question`,
          nodeId: node?.id,
          type: 'content'
        });
      }
    });

    const isValid = errors?.length === 0;
    onValidationChange({ isValid, errors });
  }, [nodes, edges, onValidationChange]);

  const onConnect = useCallback(
    (params) => {
      // Check if source handle already has a connection
      const existingEdge = edges?.find(
        edge => edge?.source === params?.source && edge?.sourceHandle === params?.sourceHandle
      );
      
      if (existingEdge) {
        // Remove existing edge before adding new one
        setEdges(eds => eds?.filter(e => e?.id !== existingEdge?.id));
      }
      
      setEdges((eds) => addEdge(params, eds));
    },
    [edges, setEdges]
  );

  const onDragOver = useCallback((event) => {
    event?.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event?.preventDefault();

      const reactFlowBounds = reactFlowWrapper?.current?.getBoundingClientRect();
      const type = event?.dataTransfer?.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = project({
        x: event?.clientX - reactFlowBounds?.left,
        y: event?.clientY - reactFlowBounds?.top,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: getDefaultNodeData(type),
      };

      setNodes((nds) => nds?.concat(newNode));
    },
    [project, setNodes]
  );

  const getDefaultNodeData = (type) => {
    const defaults = {
      text: {
        label: 'Text Message',
        message: 'Enter your message here',
        showTyping: false
      },
      question: {
        label: 'Question',
        question: 'What would you like to know?',
        inputType: 'text',
        variableName: 'user_response'
      },
      condition: {
        label: 'Condition',
        conditionType: 'equals',
        variable: 'user_response',
        compareValue: 'yes'
      },
      action: {
        label: 'Action',
        actionType: 'api_call',
        description: 'Perform an action'
      },
      delay: {
        label: 'Delay',
        duration: 2,
        showTyping: false
      },
      webhook: {
        label: 'Webhook',
        url: 'https://api.example.com/webhook',
        method: 'POST'
      },
      variable: {
        label: 'Set Variable',
        variableName: 'variable_name',
        value: 'variable_value'
      },
      end: {
        label: 'End Conversation',
        message: 'Thank you for using our chatbot!'
      }
    };
    
    return defaults?.[type] || { label: 'Unknown Node' };
  };

  const onNodeClick = useCallback((event, node) => {
    onNodeSelect(node);
  }, [onNodeSelect]);

  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  const onMove = useCallback((event, viewport) => {
    if (onZoomChange) {
      onZoomChange(viewport.zoom);
    }
  }, [onZoomChange]);

  const onNodeDataChange = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds?.map((node) => {
        if (node?.id === nodeId) {
          return { ...node, data: { ...node?.data, ...newData } };
        }
        return node;
      })
    );
    onNodeUpdate(nodeId, newData);
  }, [setNodes, onNodeUpdate]);

  const onNodesDelete = useCallback((deletedNodes) => {
    // If the selected node is being deleted, clear selection
    if (selectedNode && deletedNodes?.find(node => node?.id === selectedNode?.id)) {
      onNodeSelect(null);
    }
  }, [selectedNode, onNodeSelect]);

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodesDelete={onNodesDelete}
        onMove={onMove}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-canvas"
        panOnDrag={interactionMode === 'pan'}
        selectionOnDrag={interactionMode === 'select'}
        panOnScroll={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
      >
        <Background 
          variant="dots" 
          gap={20} 
          size={1} 
          color="var(--color-canvas-grid)"
          style={{ display: showGrid ? 'block' : 'none' }}
        />
        {showMinimap && (
          <MiniMap
            style={{
              height: 120,
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
            }}
            zoomable
            pannable
          />
        )}
        <Controls
          style={{
            display: 'none' // We use custom controls
          }}
        />
      </ReactFlow>
    </div>
  );
};

// Wrapper component to provide ReactFlow context
const FlowCanvasWrapper = (props) => {
  return (
    <ReactFlowProvider>
      <FlowCanvas {...props} />
    </ReactFlowProvider>
  );
};

export default FlowCanvasWrapper;