
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface InteractiveInputProps {
  id: string;
  label: string;
  description: string;
  feedback: {[key: string]: string};
  defaultValue?: string;
  onSubmit?: (value: string) => void;
}

const InteractiveInput: React.FC<InteractiveInputProps> = ({
  id,
  label,
  description,
  feedback,
  defaultValue = '',
  onSubmit
}) => {
  const [value, setValue] = useState(defaultValue);
  const [currentFeedback, setCurrentFeedback] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if the input matches any of the feedback keys
    if (feedback[value.toLowerCase()]) {
      setCurrentFeedback(feedback[value.toLowerCase()]);
    } else {
      // Default feedback if no match
      setCurrentFeedback(feedback['default'] || 'Try another answer.');
    }
    
    if (onSubmit) {
      onSubmit(value);
    }
  };
  
  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
      <div className="space-y-1">
        <label htmlFor={id} className="text-base font-medium text-slate-900">
          {label}
        </label>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1"
          placeholder="Enter your answer..."
        />
        <Button type="submit">Submit</Button>
      </form>
      
      {currentFeedback && (
        <div className="mt-3 p-3 bg-white border border-slate-200 rounded text-sm text-slate-700">
          {currentFeedback}
        </div>
      )}
    </div>
  );
};

export default InteractiveInput;
