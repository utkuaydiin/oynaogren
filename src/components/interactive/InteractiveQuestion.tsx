
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InteractiveQuestionProps {
  id: string;
  question: string;
  answer?: string;
  explanation?: string;
  onUserAnswer?: (question: string, answer: string) => Promise<void>;
}

const InteractiveQuestion: React.FC<InteractiveQuestionProps> = ({
  id,
  question,
  answer,
  explanation,
  onUserAnswer
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast({
        title: "Lütfen bir yanıt girin",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback("Değerlendiriliyor...");

    try {
      // Eğer onUserAnswer prop'u geçilmişse, onu çağır
      if (onUserAnswer) {
        await onUserAnswer(question, userAnswer);
      } else {
        // Değilse Gemini API'yi doğrudan çağır
        const { data, error } = await supabase.functions.invoke('generate-simulation', {
          body: { 
            promptType: 'evaluateAnswer',
            question: question,
            userAnswer: userAnswer,
            correctAnswer: answer
          }
        });

        if (error) throw error;
        
        if (data && data.feedback) {
          setFeedback(data.feedback);
        } else {
          throw new Error("Yanıt değerlendirmesi alınamadı");
        }
      }
    } catch (error) {
      console.error("Yanıt değerlendirme hatası:", error);
      setFeedback("Yanıtınız değerlendirilirken bir sorun oluştu. Lütfen tekrar deneyin.");
      toast({
        title: "Hata",
        description: "Yanıtınız değerlendirilirken bir sorun oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full bg-slate-50 border border-slate-200 mb-4">
      <CardContent className="p-4">
        <div className="space-y-3">
          <p className="text-base font-medium text-slate-900">{question}</p>
          
          {!showAnswer && !feedback ? (
            <div className="space-y-3">
              <div className="space-y-2">
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Yanıtınızı buraya yazın..."
                  className="w-full"
                />
                <Button 
                  onClick={handleSubmitAnswer}
                  disabled={isSubmitting}
                  className="mt-2"
                >
                  {isSubmitting ? "Değerlendiriliyor..." : "Yanıtı Gönder"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleShowAnswer}
                  className="mt-2 ml-2"
                >
                  Doğru Yanıtı Göster
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-3 p-3 bg-white border border-slate-200 rounded-md">
              {feedback ? (
                <>
                  <p className="font-medium text-slate-900">Yanıtınızın Değerlendirmesi:</p>
                  <p className="text-slate-700 whitespace-pre-line">{feedback}</p>
                  {!showAnswer && (
                    <Button 
                      variant="outline" 
                      onClick={handleShowAnswer}
                      className="mt-2"
                    >
                      Doğru Yanıtı Göster
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <p className="font-medium text-slate-900">Yanıt:</p>
                  <p className="text-slate-700">{answer}</p>
                  
                  {explanation && (
                    <>
                      <p className="font-medium text-slate-900 mt-2">Açıklama:</p>
                      <p className="text-slate-700">{explanation}</p>
                    </>
                  )}
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
