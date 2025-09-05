import React from 'react';
import Icon from '../AppIcon';

const Checkbox = ({
  checked = false,
  onChange,
  label,
  description,
  error,
  disabled = false,
  required = false,
  indeterminate = false,
  size = 'default',
  className = '',
  id,
  name,
  value,
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconSizes = {
    sm: 12,
    default: 14,
    lg: 16
  };

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={`flex items-start space-x-3 ${className}`}>
      <div className="flex items-center">
        <div className="relative">
          <input
            type="checkbox"
            id={id}
            name={name}
            value={value}
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            className="sr-only"
            {...props}
          />
          
          <label
            htmlFor={id}
            className={`
              ${sizeClasses?.[size]} border-2 rounded flex items-center justify-center cursor-pointer
              transition-all duration-200 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-ring/50'}
              ${error ? 'border-error' : 'border-border'}
              ${checked || indeterminate ? 'bg-primary border-primary text-primary-foreground' : 'bg-input'}
            `}
          >
            {indeterminate ? (
              <Icon name="Minus" size={iconSizes?.[size]} />
            ) : checked ? (
              <Icon name="Check" size={iconSizes?.[size]} />
            ) : null}
          </label>
        </div>
      </div>
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <label 
              htmlFor={id}
              className={`
                block text-sm font-medium cursor-pointer
                ${disabled ? 'text-muted-foreground' : 'text-foreground'}
                ${error ? 'text-error' : ''}
              `}
            >
              {label}
              {required && <span className="text-error ml-1">*</span>}
            </label>
          )}
          
          {description && (
            <p className={`
              mt-1 text-sm
              ${disabled ? 'text-muted-foreground/70' : 'text-muted-foreground'}
            `}>
              {description}
            </p>
          )}
          
          {error && (
            <p className="mt-1 text-sm text-error flex items-center space-x-1">
              <Icon name="AlertCircle" size={12} />
              <span>{error}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const CheckboxGroup = ({ 
  label, 
  description, 
  error, 
  children, 
  className = '',
  required = false 
}) => {
  return (
    <fieldset className={`space-y-3 ${className}`}>
      {label && (
        <legend className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </legend>
      )}
      
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      
      <div className="space-y-2">
        {children}
      </div>
      
      {error && (
        <p className="text-sm text-error flex items-center space-x-1">
          <Icon name="AlertCircle" size={14} />
          <span>{error}</span>
        </p>
      )}
    </fieldset>
  );
};

export { Checkbox, CheckboxGroup };