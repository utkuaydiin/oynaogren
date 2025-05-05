
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface InteractiveQuestionProps {
  id: string;
  question: string;
  answer?: string;
  explanation?: string;
}

const InteractiveQuestion: React.FC<InteractiveQuestionProps> = ({
  id,
  question,
  answer,
  explanation
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  
  const handleShowAnswer = () => {
    setShowAnswer(true);
  };
  
  return (
    <Card className="w-full bg-slate-50 border border-slate-200 mb-4">
      <CardContent className="p-4">
        <div className="space-y-3">
          <p className="text-base font-medium text-slate-900">{question}</p>
          
          {!showAnswer ? (
            <div className="mt-3">
              <Button 
                variant="outline" 
                onClick={handleShowAnswer}
                className="mt-2"
              >
                Doğru Yanıtı Göster
              </Button>
            </div>
          ) : (
            <div className="mt-3 p-3 bg-white border border-slate-200 rounded-md">
              <p className="font-medium text-slate-900">Yanıt:</p>
              <p className="text-slate-700">{answer}</p>
              
              {explanation && (
                <>
                  <p className="font-medium text-slate-900 mt-2">Açıklama:</p>
                  <p className="text-slate-700">{explanation}</p>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveQuestion;
