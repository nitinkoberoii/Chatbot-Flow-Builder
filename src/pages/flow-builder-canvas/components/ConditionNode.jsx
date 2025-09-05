import React, { memo } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import Icon from '../../../components/AppIcon';

const ConditionNode = ({ data, selected, id }) => {
  const { deleteElements } = useReactFlow();

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };
  const getConditionIcon = (type) => {
    switch (type) {
      case 'equals': return 'Equal';
      case 'contains': return 'Search';
      case 'greater': return 'ChevronUp';
      case 'less': return 'ChevronDown';
      default: return 'GitBranch';
    }
  };

  return (
    <div className={`
      bg-card border-2 rounded-lg shadow-sm min-w-[200px] max-w-[300px]
      ${selected ? 'border-primary shadow-md' : 'border-border'}
      transition-all duration-micro
    `}>
      {/* Node Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-warning/10">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-warning/20 rounded flex items-center justify-center">
            <Icon name="GitBranch" size={14} color="var(--color-warning)" />
          </div>
          <span className="text-sm font-medium text-foreground">
            {data?.label || 'Condition'}
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
        <div className="text-sm text-foreground mb-2">
          If {data?.variable || 'variable'}
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-1">
          <Icon name={getConditionIcon(data?.conditionType)} size={12} />
          <span>{data?.conditionType || 'equals'}</span>
        </div>
        
        <div className="text-xs text-foreground font-mono bg-muted/50 px-2 py-1 rounded">
          "{data?.compareValue || 'value'}"
        </div>
      </div>
      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position?.Left}
        className="w-3 h-3 bg-muted border-2 border-border hover:border-primary transition-colors"
        style={{ left: -6 }}
      />
      {/* True/False handles */}
      <Handle
        type="source"
        position={Position?.Right}
        id="true"
        className="w-3 h-3 bg-success border-2 border-success-foreground hover:scale-110 transition-transform"
        style={{ right: -6, top: '25%' }}
      />
      <Handle
        type="source"
        position={Position?.Right}
        id="false"
        className="w-3 h-3 bg-error border-2 border-error-foreground hover:scale-110 transition-transform"
        style={{ right: -6, bottom: '25%' }}
      />
      {/* Labels for true/false */}
      <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-between py-4">
        <span className="text-xs text-success font-medium">T</span>
        <span className="text-xs text-error font-medium">F</span>
      </div>
    </div>
  );
};

export default memo(ConditionNode);