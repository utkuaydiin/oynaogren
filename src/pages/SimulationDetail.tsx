
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import InteractiveElements from '@/components/InteractiveElements';
import InteractiveInput from '@/components/interactive/InteractiveInput';
import { SimulationData } from '@/services/geminiService';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Question {
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

const SimulationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [simulation, setSimulation] = useState<SimulationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchSimulation = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('simulations')
          .select('content')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Simülasyon bulunamadı");

        // Veritabanından gelen JSON verisini SimulationData tipine dönüştür
        const simulationData = data.content as unknown as SimulationData;
        setSimulation(simulationData);
        
        // Soruları oluştur
        if (simulationData.questions && simulationData.questions.length > 0) {
          const generatedQuestions = simulationData.questions.map(q => ({
            question: q,
            correctAnswer: generateAnswer(q),
            explanation: generateExplanation(q, simulationData.explanation)
          }));
          setQuestions(generatedQuestions);
        }
      } catch (error: any) {
        toast({
          title: "Hata",
          description: "Simülasyon yüklenirken bir hata oluştu",
          variant: "destructive",
        });
        navigate('/saved-simulations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimulation();
  }, [id, navigate, toast]);

  // Soru için basit bir cevap üretme fonksiyonu
  const generateAnswer = (question: string) => {
    // Bu kısım gerçek bir uygulamada daha gelişmiş olmalı
    // Şu an için soruya dayanarak basit bir cevap üretiyoruz
    if (question.includes("neden") || question.includes("niçin")) {
      return "Bilimsel prensiplere göre";
    } else if (question.includes("nasıl")) {
      return "Adım adım ilerleyerek";
    } else if (question.includes("ne")) {
      return "Temel kavramları inceleyerek";
    } else {
      return "Konuyla ilgili derinlemesine araştırma yaparak";
    }
  };
  
  // Soru için açıklama üreten fonksiyon
  const generateExplanation = (question: string, simExplanation: string) => {
    // Simülasyon açıklamasından bir özet çıkarmaya çalışalım
    const sentences = simExplanation.split('. ');
    // Soruyla en alakalı cümleyi seçmeye çalışalım
    const relevantSentence = sentences.find(s => 
      question.split(' ').some(word => 
        word.length > 3 && s.toLowerCase().includes(word.toLowerCase())
      )
    ) || sentences[0];
    
    return `${relevantSentence}. Bu sorunun cevabı simülasyondaki temel kavramları anlamakla ilgilidir.`;
  };

  const nextQuestion = () => {
    if (activeQuestionIndex < questions.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(activeQuestionIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <p className="text-lg">Simülasyon yükleniyor...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!simulation) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Simülasyon Bulunamadı</h2>
            <Button onClick={() => navigate('/saved-simulations')}>
              Simülasyonlarıma Dön
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const activeQuestion = questions[activeQuestionIndex];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <Button 
          variant="outline" 
          onClick={() => navigate('/saved-simulations')}
          className="mb-6"
        >
          &larr; Simülasyonlarıma Dön
        </Button>
        
        <Card className="w-full max-w-3xl mx-auto overflow-hidden mb-6">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-primary-50 to-accent p-6 border-b border-slate-100">
              <h3 className="text-2xl font-bold">{simulation.title}</h3>
              <p className="text-slate-600 mt-2">Etkileşimli öğrenme simülasyonu</p>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">Senaryo</h4>
                <p className="text-slate-600">{simulation.scenario}</p>
              </div>
              
              <Separator className="my-6" />
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">Simülasyon Adımları</h4>
                <ol className="list-decimal list-inside space-y-3">
                  {simulation.steps.map((step, index) => (
                    <li key={index} className="text-slate-600">{step}</li>
                  ))}
                </ol>
              </div>
              
              <Separator className="my-6" />
              
              {simulation.interactiveElements && simulation.interactiveElements.length > 0 && (
                <>
                  <InteractiveElements elements={simulation.interactiveElements} />
                  <Separator className="my-6" />
                </>
              )}
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">Açıklama</h4>
                <p className="text-slate-600">{simulation.explanation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {questions.length > 0 && (
          <Card className="w-full max-w-3xl mx-auto overflow-hidden">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold mb-4">Soru {activeQuestionIndex + 1}/{questions.length}</h4>
              
              <div className="mb-6">
                <p className="text-slate-800 text-lg mb-4">{activeQuestion.question}</p>
                
                <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                  <div className="space-y-1">
                    <label className="text-base font-medium text-slate-900">
                      Cevabınız
                    </label>
                    <p className="text-sm text-slate-500">
                      Yukarıdaki soruya cevabınızı yazın ve gönderin
                    </p>
                  </div>
                  
                  <InteractiveInput
                    id={`question-${activeQuestionIndex}`}
                    label=""
                    description=""
                    feedback={{
                      [activeQuestion.correctAnswer.toLowerCase()]: "Doğru! " + activeQuestion.explanation,
                      'default': "Yanlış cevap. Tekrar deneyin veya cevabı görüntülemek için aşağıdaki düğmeye tıklayın."
                    }}
                  />
                  
                  <div className="flex justify-between mt-4">
                    <Button 
                      variant="outline" 
                      onClick={previousQuestion}
                      disabled={activeQuestionIndex === 0}
                    >
                      Önceki Soru
                    </Button>
                    
                    <Button 
                      onClick={nextQuestion}
                      disabled={activeQuestionIndex === questions.length - 1}
                    >
                      Sonraki Soru
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default SimulationDetail;
