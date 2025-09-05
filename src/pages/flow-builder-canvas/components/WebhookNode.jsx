import React, { memo } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import Icon from '../../../components/AppIcon';

const WebhookNode = ({ data, selected, id }) => {
  const { deleteElements } = useReactFlow();

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };
  return (
    <div className={`
      bg-card border-2 rounded-lg shadow-sm min-w-[200px] max-w-[300px]
      ${selected ? 'border-primary shadow-md' : 'border-border'}
      transition-all duration-micro
    `}>
      {/* Node Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-primary/10">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary/20 rounded flex items-center justify-center">
            <Icon name="Link" size={14} color="var(--color-primary)" />
          </div>
          <span className="text-sm font-medium text-foreground">
            {data?.label || 'Webhook'}
          </span>
        </div>
        <button
          onClick={handleDelete}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-destructive/10 transition-colors group"
          title="Delete node"
        >
          <Icon name="X" size={12} color="var(--color-muted-foreground)" className="group-hover:text-destructive" />
        </button>
      </div>
      {/* Node Content */}
      <div className="p-3">
        <div className="text-sm text-foreground mb-2 truncate">
          {data?.url || 'https://api.example.com/webhook'}
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <div className="px-2 py-1 bg-primary/10 rounded text-primary font-medium">
            {data?.method || 'POST'}
          </div>
        </div>
      </div>
      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position?.Left}
        className="w-3 h-3 bg-muted border-2 border-border hover:border-primary transition-colors"
        style={{ left: -6 }}
      />
      <Handle
        type="source"
        position={Position?.Right}
        className="w-3 h-3 bg-primary border-2 border-primary-foreground hover:scale-110 transition-transform"
        style={{ right: -6 }}
      />
    </div>
  );
};

export default memo(WebhookNode);