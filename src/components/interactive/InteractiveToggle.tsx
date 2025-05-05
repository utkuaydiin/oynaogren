
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';

interface InteractiveToggleProps {
  id: string;
  label: string;
  description: string;
  defaultValue: boolean;
  feedback: {
    'true': string;
    'false': string;
  };
  onValueChange?: (value: boolean) => void;
}

const InteractiveToggle: React.FC<InteractiveToggleProps> = ({
  id,
  label,
  description,
  defaultValue,
  feedback,
  onValueChange
}) => {
  const [value, setValue] = useState<boolean>(defaultValue);
  
  const handleValueChange = (checked: boolean) => {
    setValue(checked);
    if (onValueChange) {
      onValueChange(checked);
    }
  };
  
  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label htmlFor={id} className="text-base font-medium text-slate-900">
            {label}
          </label>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <Switch
          id={id}
          checked={value}
          onCheckedChange={handleValueChange}
        />
      </div>
      
      <div className="mt-3 p-3 bg-white border border-slate-200 rounded text-sm text-slate-700">
        {value ? feedback['true'] : feedback['false']}
      </div>
    </div>
  );
};

export default InteractiveToggle;
