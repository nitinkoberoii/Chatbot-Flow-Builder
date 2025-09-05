import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FlowValidation = ({ 
  validationState, 
  onSave, 
  onValidate, 
  isSaving = false 
}) => {
  const { isValid, errors } = validationState;

  return (
    <div className="fixed top-20 right-6 z-50">
      <div className="bg-card border border-border rounded-lg shadow-lg p-4 max-w-sm">
        {/* Validation Status */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center space-x-2">
            <Icon 
              name={isValid ? "CheckCircle" : "AlertCircle"} 
              size={20} 
              color={isValid ? "var(--color-success)" : "var(--color-error)"} 
            />
            <span className={`text-sm font-medium ${
              isValid ? 'text-success' : 'text-error'
            }`}>
              {isValid ? 'Flow Valid' : `${errors?.length} Issue${errors?.length !== 1 ? 's' : ''}`}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onValidate}
            iconName="RefreshCw"
            iconSize={14}
            title="Revalidate Flow"
          />
        </div>

        {/* Error Details */}
        {!isValid && errors?.length > 0 && (
          <div className="mb-4">
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {errors?.map((error, index) => (
                <div key={index} className="flex items-start space-x-2 text-xs p-2 bg-error/5 rounded border border-error/20">
                  <Icon 
                    name="AlertTriangle" 
                    size={12} 
                    color="var(--color-warning)" 
                    className="flex-shrink-0 mt-0.5" 
                  />
                  <div className="flex-1">
                    <p className="text-foreground font-medium">{error?.message}</p>
                    {error?.nodeId && (
                      <p className="text-muted-foreground font-mono mt-1">
                        Node: {error?.nodeId}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex space-x-2">
          <Button
            variant={isValid ? "default" : "destructive"}
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            loading={isSaving}
            iconName={isValid ? "Save" : "AlertCircle"}
            iconPosition="left"
            iconSize={16}
            fullWidth
            className={!isValid ? 'save-pulse' : ''}
          >
            {isSaving ? 'Saving...' : isValid ? 'Save Flow' : 'Fix & Save'}
          </Button>
        </div>

        {/* Flow Stats */}
        <div className="mt-3 pt-3 border-t border-border">
          <div className="text-xs text-muted-foreground">
            Last validated: {new Date()?.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowValidation;