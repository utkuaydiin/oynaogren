
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
  
  // Filter to only include questions
  const questions = elements.filter(el => 
    el.type === 'question' || 
    (el.question && el.answer) // Support older format that might have question/answer props directly
  );
  
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
            question={element.question || element.label || ''}
            answer={element.answer || element.correctAnswer || ''}
            explanation={element.explanation || ''}
          />
        ))}
      </div>
    </div>
  );
};

export default InteractiveElements;
