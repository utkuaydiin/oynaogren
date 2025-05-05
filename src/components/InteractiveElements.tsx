
import React from 'react';
import InteractiveSlider from './interactive/InteractiveSlider';
import InteractiveToggle from './interactive/InteractiveToggle';
import InteractiveButton from './interactive/InteractiveButton';
import InteractiveInput from './interactive/InteractiveInput';
import { InteractiveElement } from '@/services/geminiService';

interface InteractiveElementsProps {
  elements: InteractiveElement[];
}

const InteractiveElements: React.FC<InteractiveElementsProps> = ({ elements }) => {
  if (!elements || elements.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Interactive Elements</h3>
      <p className="text-slate-600 mb-4">
        Experiment with these controls to see how different variables affect the outcome.
      </p>
      
      <div className="space-y-4">
        {elements.map((element) => {
          switch (element.type) {
            case 'slider':
              return (
                <InteractiveSlider
                  key={element.id}
                  id={element.id}
                  label={element.label}
                  description={element.description}
                  min={element.min || 0}
                  max={element.max || 100}
                  defaultValue={Number(element.defaultValue) || 50}
                  feedback={element.feedback || {}}
                />
              );
            case 'toggle':
              return (
                <InteractiveToggle
                  key={element.id}
                  id={element.id}
                  label={element.label}
                  description={element.description}
                  defaultValue={Boolean(element.defaultValue)}
                  feedback={element.feedback as { 'true': string, 'false': string } || { 'true': 'On', 'false': 'Off' }}
                />
              );
            case 'button':
              return (
                <InteractiveButton
                  key={element.id}
                  id={element.id}
                  label={element.label}
                  description={element.description}
                  feedback={element.feedback ? Object.values(element.feedback)[0] : ''}
                />
              );
            case 'input':
              return (
                <InteractiveInput
                  key={element.id}
                  id={element.id}
                  label={element.label}
                  description={element.description}
                  feedback={element.feedback || {}}
                  defaultValue={String(element.defaultValue || '')}
                />
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export default InteractiveElements;
