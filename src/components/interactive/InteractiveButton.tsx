
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface InteractiveButtonProps {
  id: string;
  label: string;
  description: string;
  feedback: string;
  onClick?: () => void;
}

const InteractiveButton: React.FC<InteractiveButtonProps> = ({
  id,
  label,
  description,
  feedback,
  onClick
}) => {
  const [showFeedback, setShowFeedback] = useState(false);
  
  const handleClick = () => {
    setShowFeedback(true);
    if (onClick) {
      onClick();
    }
    
    // Hide feedback after 5 seconds
    setTimeout(() => {
      setShowFeedback(false);
    }, 5000);
  };
  
  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
      <div className="space-y-1">
        <p className="text-base font-medium text-slate-900">{label}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      
      <Button id={id} onClick={handleClick} className="w-full">
        {label}
      </Button>
      
      {showFeedback && (
        <div className="mt-3 p-3 bg-white border border-slate-200 rounded text-sm text-slate-700 animate-fade-in">
          {feedback}
        </div>
      )}
    </div>
  );
};

export default InteractiveButton;
