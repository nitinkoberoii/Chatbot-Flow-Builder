import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import { Checkbox } from './Checkbox';

const PanelCoordinator = ({ 
  selectedNode = null, 
  onNodeSelect = () => {}, 
  onNodeUpdate = () => {},
  onNodeAdd = () => {},
  isCollapsed = false,
  onToggleCollapse = () => {}
}) => {
  const [panelMode, setPanelMode] = useState('nodes');
  const [nodeSettings, setNodeSettings] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Available node types for the flow builder
  const availableNodes = [
    {
      type: 'text',
      label: 'Text Message',
      icon: 'MessageSquare',
      description: 'Send a text message to the user',
      category: 'Messages'
    },
    {
      type: 'question',
      label: 'Question',
      icon: 'HelpCircle',
      description: 'Ask a question and wait for user input',
      category: 'Input'
    },
    {
      type: 'condition',
      label: 'Condition',
      icon: 'GitBranch',
      description: 'Branch the conversation based on conditions',
      category: 'Logic'
    },
    {
      type: 'action',
      label: 'Action',
      icon: 'Zap',
      description: 'Perform an action or API call',
      category: 'Actions'
    },
    {
      type: 'delay',
      label: 'Delay',
      icon: 'Clock',
      description: 'Add a delay before the next message',
      category: 'Timing'
    },
    {
      type: 'webhook',
      label: 'Webhook',
      icon: 'Link',
      description: 'Send data to an external service',
      category: 'Integration'
    },
    {
      type: 'variable',
      label: 'Set Variable',
      icon: 'Database',
      description: 'Store or update a variable value',
      category: 'Data'
    },
    {
      type: 'end',
      label: 'End Conversation',
      icon: 'Square',
      description: 'End the conversation flow',
      category: 'Flow Control'
    }
  ];

  // Switch to settings panel when a node is selected
  useEffect(() => {
    if (selectedNode) {
      setPanelMode('settings');
      setNodeSettings(selectedNode?.data || {});
    } else {
      setPanelMode('nodes');
    }
  }, [selectedNode]);

  // Filter nodes based on search term
  const filteredNodes = availableNodes?.filter(node =>
    node?.label?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    node?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    node?.category?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  // Group nodes by category
  const nodesByCategory = filteredNodes?.reduce((acc, node) => {
    if (!acc?.[node?.category]) {
      acc[node.category] = [];
    }
    acc?.[node?.category]?.push(node);
    return acc;
  }, {});

  const handleNodeDragStart = (event, nodeType) => {
    event?.dataTransfer?.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleSettingChange = (key, value) => {
    const updatedSettings = { ...nodeSettings, [key]: value };
    setNodeSettings(updatedSettings);
    onNodeUpdate(selectedNode?.id, updatedSettings);
  };

  const renderNodeSettings = () => {
    if (!selectedNode) return null;

    const nodeType = selectedNode?.type;
    const settings = nodeSettings;

    const commonSettings = (
      <div className="space-y-4">
        <Input
          label="Node Label"
          type="text"
          value={settings?.label || ''}
          onChange={(e) => handleSettingChange('label', e?.target?.value)}
          placeholder="Enter node label"
        />
        
        <Input
          label="Description"
          type="text"
          value={settings?.description || ''}
          onChange={(e) => handleSettingChange('description', e?.target?.value)}
          placeholder="Optional description"
        />
      </div>
    );

    const typeSpecificSettings = () => {
      switch (nodeType) {
        case 'text':
          return (
            <div className="space-y-4">
              <Input
                label="Message Text"
                type="text"
                value={settings?.message || ''}
                onChange={(e) => handleSettingChange('message', e?.target?.value)}
                placeholder="Enter your message"
                required
              />
              <Checkbox
                id="showTyping"
                name="showTyping"
                label="Enable typing indicator"
                description=""
                value={settings?.showTyping || false}
                checked={settings?.showTyping || false}
                onChange={(e) => handleSettingChange('showTyping', e?.target?.checked)}
                error=""
              />
            </div>
          );

        case 'question':
          return (
            <div className="space-y-4">
              <Input
                label="Question Text"
                type="text"
                value={settings?.question || ''}
                onChange={(e) => handleSettingChange('question', e?.target?.value)}
                placeholder="What would you like to ask?"
                required
              />
              <Select
                id="inputType"
                name="inputType"
                label="Input Type"
                description=""
                options={[
                  { value: 'text', label: 'Text Input' },
                  { value: 'number', label: 'Number Input' },
                  { value: 'email', label: 'Email Input' },
                  { value: 'choice', label: 'Multiple Choice' }
                ]}
                value={settings?.inputType || 'text'}
                onChange={(value) => handleSettingChange('inputType', value)}
                error=""
              />
              <Input
                label="Variable Name"
                type="text"
                value={settings?.variableName || ''}
                onChange={(e) => handleSettingChange('variableName', e?.target?.value)}
                placeholder="user_response"
              />
            </div>
          );

        case 'condition':
          return (
            <div className="space-y-4">
              <Select
                id="conditionType"
                name="conditionType"
                label="Condition Type"
                description=""
                options={[
                  { value: 'equals', label: 'Equals' },
                  { value: 'contains', label: 'Contains' },
                  { value: 'greater', label: 'Greater Than' },
                  { value: 'less', label: 'Less Than' }
                ]}
                value={settings?.conditionType || 'equals'}
                onChange={(value) => handleSettingChange('conditionType', value)}
                error=""
              />
              <Input
                label="Variable to Check"
                type="text"
                value={settings?.variable || ''}
                onChange={(e) => handleSettingChange('variable', e?.target?.value)}
                placeholder="variable_name"
              />
              <Input
                label="Value to Compare"
                type="text"
                value={settings?.compareValue || ''}
                onChange={(e) => handleSettingChange('compareValue', e?.target?.value)}
                placeholder="comparison value"
              />
            </div>
          );

        case 'delay':
          return (
            <div className="space-y-4">
              <Input
                label="Delay Duration (seconds)"
                type="number"
                value={settings?.duration || 1}
                onChange={(e) => handleSettingChange('duration', parseInt(e?.target?.value))}
                min="1"
                max="300"
              />
              <Checkbox
                id="showTypingDelay"
                name="showTypingDelay"
                label="Show typing indicator during delay"
                description=""
                value={settings?.showTyping || false}
                checked={settings?.showTyping || false}
                onChange={(e) => handleSettingChange('showTyping', e?.target?.checked)}
                error=""
              />
            </div>
          );

        case 'webhook':
          return (
            <div className="space-y-4">
              <Input
                label="Webhook URL"
                type="url"
                value={settings?.url || ''}
                onChange={(e) => handleSettingChange('url', e?.target?.value)}
                placeholder="https://api.example.com/webhook"
                required
              />
              <Select
                id="httpMethod"
                name="httpMethod"
                label="HTTP Method"
                description=""
                options={[
                  { value: 'POST', label: 'POST' },
                  { value: 'GET', label: 'GET' },
                  { value: 'PUT', label: 'PUT' },
                  { value: 'PATCH', label: 'PATCH' }
                ]}
                value={settings?.method || 'POST'}
                onChange={(value) => handleSettingChange('method', value)}
                error=""
              />
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div className="space-y-6">
        {commonSettings}
        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-medium text-foreground mb-4">
            {nodeType?.charAt(0)?.toUpperCase() + nodeType?.slice(1)} Settings
          </h4>
          {typeSpecificSettings()}
        </div>
      </div>
    );
  };

  if (isCollapsed) {
    return (
      <div className="fixed left-0 bottom-0 z-panel bg-card border-r border-border w-12 flex flex-col items-center py-4" style={{ top: '60px' }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="mb-4"
        >
          <Icon name="ChevronRight" size={20} />
        </Button>
        <div className="flex flex-col space-y-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Layers" size={16} color="var(--color-primary)" />
          </div>
          <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
            <Icon name="Settings" size={16} color="var(--color-muted-foreground)" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed left-0 bottom-0 z-panel bg-card border-r border-panel-border panel-width flex flex-col" style={{ top: '60px' }}>
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon 
            name={panelMode === 'nodes' ? 'Layers' : 'Settings'} 
            size={20} 
            color="var(--color-primary)" 
          />
          <h2 className="text-lg font-semibold text-foreground">
            {panelMode === 'nodes' ? 'Node Library' : 'Node Settings'}
          </h2>
        </div>
        <div className="flex items-center space-x-1">
          {selectedNode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onNodeSelect(null);
                setPanelMode('nodes');
              }}
              iconName="X"
              iconSize={16}
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            iconName="ChevronLeft"
            iconSize={16}
          />
        </div>
      </div>
      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto">
        {panelMode === 'nodes' ? (
          <div className="p-4">
            {/* Search */}
            <div className="mb-4">
              <Input
                type="search"
                placeholder="Search nodes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="w-full"
              />
            </div>

            {/* Node Categories */}
            <div className="space-y-4">
              {Object.entries(nodesByCategory)?.map(([category, nodes]) => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {nodes?.map((node) => (
                      <div
                        key={node?.type}
                        draggable
                        onDragStart={(e) => handleNodeDragStart(e, node?.type)}
                        onClick={() => onNodeAdd(node?.type)}
                        className="p-3 bg-muted/50 hover:bg-muted border border-border rounded-lg cursor-grab active:cursor-grabbing transition-colors duration-micro micro-scale"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon name={node?.icon} size={16} color="var(--color-primary)" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-foreground">
                              {node?.label}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {node?.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4">
            {selectedNode ? (
              <div>
                <div className="flex items-center space-x-3 mb-6 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon 
                      name={availableNodes?.find(n => n?.type === selectedNode?.type)?.icon || 'Square'} 
                      size={20} 
                      color="var(--color-primary)" 
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {availableNodes?.find(n => n?.type === selectedNode?.type)?.label || 'Unknown Node'}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      ID: {selectedNode?.id}
                    </p>
                  </div>
                </div>
                {renderNodeSettings()}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="MousePointer" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
                <h3 className="text-sm font-medium text-foreground mb-2">
                  No Node Selected
                </h3>
                <p className="text-xs text-muted-foreground">
                  Select a node on the canvas to edit its settings
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PanelCoordinator;