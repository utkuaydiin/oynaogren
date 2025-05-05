
import React from 'react';
import InteractiveQuestion from './interactive/InteractiveQuestion';
import { InteractiveElement } from '@/services/geminiService';

interface InteractiveElementsProps {
  elements: InteractiveElement[];
}

const InteractiveElements: React.FC<InteractiveElementsProps> = ({ elements }) => {
  if (!elements || elements.length === 0) {
    return null;
  }
  
  // Filter to only include questions - now properly handling type checking
  const questions = elements.filter(el => {
    // Only include elements that have both question/label and answer/correctAnswer properties
    return (el.label || el.description) && (el.feedback || el.description);
  });
  
  // If no questions after filtering, show nothing
  if (questions.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {questions.map((element) => (
          <InteractiveQuestion
            key={element.id}
            id={element.id}
            question={element.label || element.description || ''}
            answer={element.feedback?.['100'] || element.feedback?.['50'] || element.description || ''}
            explanation={element.description || ''}
          />
        ))}
      </div>
    </div>
  );
};

export default InteractiveElements;
