
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
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Cevabı kontrol et
    if (feedback[value.toLowerCase()]) {
      setCurrentFeedback(feedback[value.toLowerCase()]);
      setIsCorrect(feedback[value.toLowerCase()].includes('Doğru') || 
                   feedback[value.toLowerCase()].includes('doğru') || 
                   !feedback[value.toLowerCase()].includes('Yanlış') && 
                   !feedback[value.toLowerCase()].includes('yanlış'));
    } else {
      // Eşleşme yoksa varsayılan geri bildirim
      setCurrentFeedback(feedback['default'] || 'Başka bir cevap deneyin.');
      setIsCorrect(false);
    }
    
    if (onSubmit) {
      onSubmit(value);
    }
  };

  const showAnswer = () => {
    // Doğru cevabı bul (genellikle "correct" veya "doğru" anahtarıyla saklanır)
    const correctAnswer = Object.entries(feedback).find(([_, value]) => 
      value.includes('Doğru') || value.includes('doğru')
    );
    
    if (correctAnswer) {
      setCurrentFeedback(`Doğru cevap: ${correctAnswer[0]}\n${correctAnswer[1]}`);
    } else {
      setCurrentFeedback('Doğru cevap bulunamadı.');
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
          placeholder="Cevabınızı buraya yazın..."
        />
        <Button type="submit">Gönder</Button>
      </form>
      
      {currentFeedback && (
        <div className={`mt-3 p-3 border rounded text-sm ${
          isCorrect === null ? 'bg-white border-slate-200 text-slate-700' : 
          isCorrect ? 'bg-green-50 border-green-200 text-green-700' : 
          'bg-red-50 border-red-200 text-red-700'
        }`}>
          {currentFeedback}
          
          {!isCorrect && isCorrect !== null && (
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={showAnswer} 
                className="mt-1"
              >
                Cevabı Göster
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InteractiveInput;
