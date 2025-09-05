import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  label,
  description,
  error,
  disabled = false,
  required = false,
  loading = false,
  multiple = false,
  searchable = false,
  clearable = false,
  className = "",
  id,
  name
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef(null);
  const searchInputRef = useRef(null);
  const optionsRef = useRef([]);

  // Filter options based on search term
  const filteredOptions = searchable 
    ? options?.filter(option => 
        option?.label?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
    : options;

  // Get display value
  const getDisplayValue = () => {
    if (multiple) {
      if (!value || value?.length === 0) return placeholder;
      if (value?.length === 1) {
        const option = options?.find(opt => opt?.value === value?.[0]);
        return option ? option?.label : placeholder;
      }
      return `${value?.length} selected`;
    } else {
      const option = options?.find(opt => opt?.value === value);
      return option ? option?.label : placeholder;
    }
  };

  // Handle option selection
  const handleOptionSelect = (optionValue) => {
    if (multiple) {
      const newValue = value || [];
      if (newValue?.includes(optionValue)) {
        onChange(newValue?.filter(v => v !== optionValue));
      } else {
        onChange([...newValue, optionValue]);
      }
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  // Handle clear
  const handleClear = (e) => {
    e?.stopPropagation();
    onChange(multiple ? [] : '');
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e?.key === 'Enter' || e?.key === ' ' || e?.key === 'ArrowDown') {
        e?.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    switch (e?.key) {
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      case 'ArrowDown':
        e?.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredOptions?.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e?.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions?.length - 1
        );
        break;
      case 'Enter':
        e?.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions?.length) {
          handleOptionSelect(filteredOptions?.[focusedIndex]?.value);
        }
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef?.current && !selectRef?.current?.contains(event?.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef?.current) {
      searchInputRef?.current?.focus();
    }
  }, [isOpen, searchable]);

  // Scroll focused option into view
  useEffect(() => {
    if (focusedIndex >= 0 && optionsRef?.current?.[focusedIndex]) {
      optionsRef?.current?.[focusedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [focusedIndex]);

  const hasValue = multiple ? value && value?.length > 0 : value;

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-foreground mb-1"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      {/* Select Button */}
      <button
        type="button"
        id={id}
        name={name}
        onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled || loading}
        className={`
          relative w-full bg-input border border-border rounded-md px-3 py-2 text-left
          focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
          transition-colors duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-ring/50'}
          ${error ? 'border-error focus:ring-error' : ''}
          ${isOpen ? 'ring-2 ring-ring ring-offset-2' : ''}
        `}
      >
        <div className="flex items-center justify-between">
          <span className={`block truncate ${
            hasValue ? 'text-foreground' : 'text-muted-foreground'
          }`}>
            {getDisplayValue()}
          </span>
          
          <div className="flex items-center space-x-1">
            {loading && (
              <Icon name="Loader2" size={16} className="animate-spin text-muted-foreground" />
            )}
            
            {clearable && hasValue && !disabled && !loading && (
              <button
                type="button"
                onClick={handleClear}
                className="p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={14} />
              </button>
            )}
            
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`text-muted-foreground transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`} 
            />
          </div>
        </div>
      </button>
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Icon 
                  name="Search" 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-input border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions?.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                {searchable && searchTerm ? 'No options found' : 'No options available'}
              </div>
            ) : (
              filteredOptions?.map((option, index) => {
                const isSelected = multiple 
                  ? value && value?.includes(option?.value)
                  : value === option?.value;
                const isFocused = index === focusedIndex;

                return (
                  <button
                    key={option?.value}
                    ref={el => optionsRef.current[index] = el}
                    type="button"
                    onClick={() => handleOptionSelect(option?.value)}
                    disabled={option?.disabled}
                    className={`
                      w-full px-3 py-2 text-left text-sm transition-colors duration-150
                      ${isFocused ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'}
                      ${isSelected ? 'bg-primary/10 text-primary font-medium' : ''}
                      ${option?.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent hover:text-accent-foreground cursor-pointer'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{option?.label}</div>
                        {option?.description && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {option?.description}
                          </div>
                        )}
                      </div>
                      
                      {multiple && isSelected && (
                        <Icon name="Check" size={16} className="text-primary" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
      {/* Description */}
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-error flex items-center space-x-1">
          <Icon name="AlertCircle" size={14} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default Select;