
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
  
  // Filter to only include elements that have question/description and answer/feedback properties
  const questions = elements.filter(el => {
    // Check if the element has both a question and an answer field
    return (
      (el.question || el.label || el.description) && 
      (el.answer || el.correctAnswer || el.feedback)
    );
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
            question={element.question || element.label || element.description || ''}
            answer={element.answer || element.correctAnswer || element.feedback?.['100'] || element.description || ''}
            explanation={element.explanation || ''}
          />
        ))}
      </div>
    </div>
  );
};

export default InteractiveElements;
