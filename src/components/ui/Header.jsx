import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ 
  flowTitle = "Untitled Flow", 
  saveStatus = "saved", 
  validationErrors = [], 
  onSave = () => {}, 
  onExport = () => {},
  onSettings = () => {},
  onTitleChange = () => {}
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(flowTitle);

  const hasValidationErrors = validationErrors?.length > 0;
  const isSaving = saveStatus === 'saving';
  const hasUnsavedChanges = saveStatus === 'unsaved';

  const handleSave = () => {
    if (!isSaving) {
      onSave();
    }
  };

  const handleExport = (format) => {
    onExport(format);
    setShowExportMenu(false);
  };

  const handleKeyDown = (e) => {
    if (e?.ctrlKey && e?.key === 's') {
      e?.preventDefault();
      handleSave();
    }
  };

  // Update edited title when flowTitle prop changes
  React.useEffect(() => {
    setEditedTitle(flowTitle);
  }, [flowTitle]);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
    setEditedTitle(flowTitle);
  };

  const handleTitleSave = () => {
    const trimmedTitle = editedTitle.trim();
    if (trimmedTitle && trimmedTitle !== flowTitle) {
      onTitleChange(trimmedTitle);
    } else if (!trimmedTitle) {
      setEditedTitle(flowTitle); // Reset to original if empty
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setEditedTitle(flowTitle);
      setIsEditingTitle(false);
    }
  };

  const handleTitleBlur = () => {
    handleTitleSave();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-header bg-card border-b border-border" style={{ height: '60px' }}>
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
              <img 
                src="/logo.jpeg" 
                alt="Chatbot Flow Builder Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                Chatbot Flow Builder
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block">
                Visual Flow Designer
              </span>
            </div>
          </div>
        </div>

        {/* Flow Title and Status */}
        <div className="flex-1 flex items-center justify-center max-w-md mx-8">
          <div className="flex items-center space-x-3 bg-muted/50 rounded-lg px-4 py-2 min-w-0">
            <Icon 
              name="FileText" 
              size={16} 
              color={hasValidationErrors ? "var(--color-error)" : "var(--color-muted-foreground)"} 
            />
            <div className="flex flex-col min-w-0">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={handleTitleKeyDown}
                  onBlur={handleTitleBlur}
                  className="text-sm font-medium text-foreground bg-transparent border-none outline-none focus:ring-0 p-0 m-0 w-full min-w-0"
                  style={{ background: 'transparent' }}
                  autoFocus
                  maxLength={50}
                />
              ) : (
                <span 
                  className="text-sm font-medium text-foreground truncate cursor-pointer hover:text-primary transition-colors"
                  onClick={handleTitleClick}
                  title="Click to edit title"
                >
                  {flowTitle}
                </span>
              )}
              <div className="flex items-center space-x-2">
                <span className={`text-xs ${
                  hasValidationErrors ? 'text-error' : hasUnsavedChanges ?'text-warning': 'text-success'
                }`}>
                  {hasValidationErrors ? `${validationErrors?.length} errors` :
                   hasUnsavedChanges ? 'Unsaved changes' : isSaving ?'Saving...' : 'All changes saved'}
                </span>
                {hasValidationErrors && (
                  <Icon name="AlertCircle" size={12} color="var(--color-error)" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Save Button */}
          <Button
            variant={hasValidationErrors ? "destructive" : hasUnsavedChanges ? "default" : "outline"}
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            loading={isSaving}
            iconName={hasValidationErrors ? "AlertCircle" : "Save"}
            iconPosition="left"
            iconSize={16}
            className={`${hasValidationErrors ? 'save-pulse' : ''} transition-all duration-micro`}
          >
            <span className="hidden sm:inline">
              {isSaving ? 'Saving...' : hasValidationErrors ? 'Fix & Save' : 'Save'}
            </span>
            <span className="sm:hidden">Save</span>
          </Button>

          {/* Export Menu */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportMenu(!showExportMenu)}
              iconName="Download"
              iconPosition="left"
              iconSize={16}
            >
              <span className="hidden sm:inline">Export</span>
            </Button>
            
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-md z-header-dropdown">
                <div className="py-2">
                  <button
                    onClick={() => handleExport('json')}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center space-x-2"
                  >
                    <Icon name="FileCode" size={16} />
                    <span>Export as JSON</span>
                  </button>
                  <button
                    onClick={() => handleExport('image')}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center space-x-2"
                  >
                    <Icon name="Image" size={16} />
                    <span>Export as Image</span>
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center space-x-2"
                  >
                    <Icon name="FileText" size={16} />
                    <span>Export as PDF</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings Menu
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              iconName="Settings"
              iconSize={16}
            >
            </Button>
            
            {showSettingsMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-md z-header-dropdown">
                <div className="py-2">
                  <button
                    onClick={() => {
                      onSettings('preferences');
                      setShowSettingsMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center space-x-2"
                  >
                    <Icon name="User" size={16} />
                    <span>Preferences</span>
                  </button>
                  <button
                    onClick={() => {
                      onSettings('canvas');
                      setShowSettingsMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center space-x-2"
                  >
                    <Icon name="Layout" size={16} />
                    <span>Canvas Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      onSettings('shortcuts');
                      setShowSettingsMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center space-x-2"
                  >
                    <Icon name="Keyboard" size={16} />
                    <span>Keyboard Shortcuts</span>
                  </button>
                  <div className="border-t border-border my-1"></div>
                  <button
                    onClick={() => {
                      onSettings('help');
                      setShowSettingsMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center space-x-2"
                  >
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </button>
                </div>
              </div>
            )}
          </div> */}
        </div>
      </div>
      {/* Click outside handlers */}
      {(showExportMenu || showSettingsMenu) && (
        <div 
          className="fixed inset-0 z-[999]" 
          onClick={() => {
            setShowExportMenu(false);
            setShowSettingsMenu(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;