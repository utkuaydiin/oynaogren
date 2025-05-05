
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import InteractiveElements from './InteractiveElements';
import InteractiveQuestion from './interactive/InteractiveQuestion';
import { SimulationData } from '@/services/geminiService';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

interface SimulationDisplayProps {
  simulation: SimulationData | null;
  isLoading: boolean;
}

const LoadingSimulation = () => (
  <div className="space-y-6 p-4 animate-pulse">
    <div className="h-8 bg-slate-100 rounded-md w-3/4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-slate-100 rounded-md w-full"></div>
      <div className="h-4 bg-slate-100 rounded-md w-full"></div>
      <div className="h-4 bg-slate-100 rounded-md w-5/6"></div>
    </div>
    <div className="space-y-3">
      <div className="h-6 bg-slate-100 rounded-md w-1/4"></div>
      <div className="h-4 bg-slate-100 rounded-md w-full"></div>
      <div className="h-4 bg-slate-100 rounded-md w-full"></div>
      <div className="h-4 bg-slate-100 rounded-md w-3/4"></div>
    </div>
    <div className="h-10 bg-slate-100 rounded-md w-40"></div>
  </div>
);

// Türev soruları ekleme - bunlar her zaman hazır olacak
const derivativeQuestions = [
  {
    id: "derivative-1",
    question: "3x^2 fonksiyonunun türevi nedir?",
    answer: "6x",
    explanation: "f(x) = 3x^2 fonksiyonunun türevi, kuvvet kuralı kullanılarak n.x^(n-1) formülü ile hesaplanır. Bu durumda 3 × 2 × x^(2-1) = 6x olur."
  },
  {
    id: "derivative-2",
    question: "x^3 + 2x fonksiyonunun türevi nedir?",
    answer: "3x^2 + 2",
    explanation: "Toplam kuralı kullanarak her terimin türevini ayrı ayrı alırız. x^3'ün türevi 3x^2, 2x'in türevi ise 2'dir. Sonuç: 3x^2 + 2"
  },
  {
    id: "derivative-3",
    question: "sin(x) fonksiyonunun türevi nedir?",
    answer: "cos(x)",
    explanation: "Trigonometrik fonksiyonların türev kurallarına göre, sin(x) fonksiyonunun türevi cos(x)'tir."
  }
];

const SimulationDisplay: React.FC<SimulationDisplayProps> = ({ simulation, isLoading }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userFeedback, setUserFeedback] = useState<{[key: string]: string}>({});
  const [isEvaluating, setIsEvaluating] = useState<{[key: string]: boolean}>({});

  const saveSimulation = async () => {
    if (!user) {
      toast({
        title: "Giriş yapmanız gerekiyor",
        description: "Simülasyonları kaydetmek için giriş yapın",
        variant: "destructive",
      });
      return;
    }

    if (!simulation) return;

    try {
      // SimulationData'yı Json olarak işlem görecek şekilde dönüştür
      const simulationJson = JSON.parse(JSON.stringify(simulation)) as Json;
      
      const { data, error } = await supabase.from('simulations').insert({
        title: simulation.title,
        description: simulation.scenario,
        content: simulationJson,
        user_id: user.id
      });

      if (error) throw error;

      toast({
        title: "Simülasyon Kaydedildi",
        description: "Simülasyon başarıyla kaydedildi",
      });
    } catch (error: any) {
      toast({
        title: "Hata",
        description: "Simülasyon kaydedilirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const handleUserAnswer = async (id: string, question: string, userAnswer: string) => {
    setIsEvaluating({...isEvaluating, [id]: true});
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-simulation', {
        body: { 
          promptType: 'evaluateAnswer',
          question: question,
          userAnswer: userAnswer,
          correctAnswer: derivativeQuestions.find(q => q.id === id)?.answer || ""
        }
      });

      if (error) throw error;
      
      if (data && data.feedback) {
        setUserFeedback({...userFeedback, [id]: data.feedback});
      }
    } catch (error) {
      console.error("Yanıt değerlendirme hatası:", error);
      toast({
        title: "Hata",
        description: "Yanıtınız değerlendirilirken bir sorun oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsEvaluating({...isEvaluating, [id]: false});
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8 overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-primary-50 to-accent p-6 border-b border-slate-100">
            <h3 className="text-xl font-bold">Öğrenme simülasyonunuz oluşturuluyor...</h3>
            <p className="text-slate-500">İsteğinize özel bir deneyim hazırlanıyor</p>
          </div>
          <LoadingSimulation />
        </CardContent>
      </Card>
    );
  }

  // Eğer sorgu "türev" ile ilgiliyse ya da simulation null ise, türev özel içeriğini göster
  if (!simulation || (simulation.title && simulation.title.toLowerCase().includes("türev"))) {
    const derivativeSimulation = simulation || {
      title: "Türev Hesaplama: Değişim Oranını Anlamak",
      scenario: "Bir matematik öğrencisi olarak, türev kavramının derinliklerine iniyorsunuz. Önünüzde bir grafik var ve bu grafiğin her noktasındaki değişim oranını bulmak istiyorsunuz. İşte türevi anlamak ve hesaplamak için interaktif bir rehber.",
      steps: [
        "Türevin temel tanımını anlayın: Bir fonksiyonun türevi, o fonksiyonun her noktadaki değişim oranını verir.",
        "Temel türev kurallarını öğrenin: Sabit kural, kuvvet kuralı, toplam kuralı ve çarpım kuralı.",
        "Basit fonksiyonların türevlerini hesaplayın: x^n fonksiyonunun türevi n.x^(n-1) formülüyle bulunur.",
        "Türev hesaplamalarında toplam kuralını uygulayın: [f(x) + g(x)]' = f'(x) + g'(x)",
        "Çarpım kuralını öğrenin: [f(x) × g(x)]' = f'(x) × g(x) + f(x) × g'(x)"
      ],
      explanation: "Türev, bir fonksiyonun anlık değişim oranını ölçen matematiksel bir kavramdır. Geometrik olarak, bir eğrinin herhangi bir noktasındaki teğet doğrusunun eğimini verir. Türev hesaplamada kullanılan temel kurallar: Sabit fonksiyonların türevi sıfırdır. x^n fonksiyonunun türevi n.x^(n-1)'dir. Toplam kuralı, her terimin türevinin toplanmasını gerektirir. Çarpım kuralı ise iki fonksiyonun çarpımının türevini hesaplamak için kullanılır.",
      questions: [
        "Bir fonksiyonun maksimum ve minimum noktalarını bulmak için türev nasıl kullanılır?",
        "İkinci türev ne anlama gelir ve ne için kullanılır?",
        "Günlük hayatta türevin uygulamaları nelerdir?"
      ],
      interactiveElements: [
        {
          id: "power-rule",
          type: "slider",
          label: "Kuvvet Değeri (n)",
          description: "x^n fonksiyonunun türevinin nasıl değiştiğini görün",
          min: 1,
          max: 10,
          defaultValue: 2,
          affects: "derivative-result",
          feedback: {
            "1": "f(x) = x için türev: 1 · x^0 = 1",
            "2": "f(x) = x^2 için türev: 2 · x^1 = 2x",
            "3": "f(x) = x^3 için türev: 3 · x^2 = 3x^2",
            "4": "f(x) = x^4 için türev: 4 · x^3 = 4x^3",
            "5": "f(x) = x^5 için türev: 5 · x^4 = 5x^4",
            "6": "f(x) = x^6 için türev: 6 · x^5 = 6x^5",
            "7": "f(x) = x^7 için türev: 7 · x^6 = 7x^6",
            "8": "f(x) = x^8 için türev: 8 · x^7 = 8x^7",
            "9": "f(x) = x^9 için türev: 9 · x^8 = 9x^8",
            "10": "f(x) = x^10 için türev: 10 · x^9 = 10x^9"
          }
        },
        {
          id: "constant-multiplier",
          type: "slider",
          label: "Sabit Çarpan (a)",
          description: "a·x^2 fonksiyonunun türevinin sabit çarpana göre değişimini görün",
          min: 1,
          max: 10,
          defaultValue: 3,
          affects: "derivative-constant",
          feedback: {
            "1": "f(x) = 1·x^2 için türev: 1 · 2x = 2x",
            "2": "f(x) = 2·x^2 için türev: 2 · 2x = 4x",
            "3": "f(x) = 3·x^2 için türev: 3 · 2x = 6x",
            "4": "f(x) = 4·x^2 için türev: 4 · 2x = 8x",
            "5": "f(x) = 5·x^2 için türev: 5 · 2x = 10x",
            "6": "f(x) = 6·x^2 için türev: 6 · 2x = 12x",
            "7": "f(x) = 7·x^2 için türev: 7 · 2x = 14x",
            "8": "f(x) = 8·x^2 için türev: 8 · 2x = 16x",
            "9": "f(x) = 9·x^2 için türev: 9 · 2x = 18x",
            "10": "f(x) = 10·x^2 için türev: 10 · 2x = 20x"
          }
        }
      ]
    };

    return (
      <Card className="w-full max-w-3xl mx-auto mt-8 overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-primary-50 to-accent p-6 border-b border-slate-100">
            <h3 className="text-2xl font-bold">{derivativeSimulation.title}</h3>
            <p className="text-slate-600 mt-2">Etkileşimli öğrenme simülasyonu</p>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2">Senaryo</h4>
              <p className="text-slate-600">{derivativeSimulation.scenario}</p>
            </div>
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Türevi Anlamanın Adımları</h4>
              <ol className="list-decimal list-inside space-y-3">
                {derivativeSimulation.steps.map((step, index) => (
                  <li key={index} className="text-slate-600">{step}</li>
                ))}
              </ol>
            </div>
            
            <Separator className="my-6" />
            
            {derivativeSimulation.interactiveElements && derivativeSimulation.interactiveElements.length > 0 && (
              <>
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3">Türev Kavramını Keşfedin</h4>
                  <p className="text-slate-600 mb-4">
                    Aşağıdaki kontrolleri kullanarak farklı fonksiyonların türevlerini inceleyin ve kuralları gözlemleyin.
                  </p>
                  <InteractiveElements elements={derivativeSimulation.interactiveElements} />
                </div>
                <Separator className="my-6" />
              </>
            )}
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Türev Alıştırmaları</h4>
              <p className="text-slate-600 mb-4">
                Aşağıdaki soruları yanıtlayarak türev bilginizi test edin. Cevabınızı yazıp değerlendirilmesini isteyin veya doğrudan yanıtı görün.
              </p>
              
              <div className="space-y-4">
                {derivativeQuestions.map((question) => (
                  <InteractiveQuestion 
                    key={question.id}
                    id={question.id}
                    question={question.question}
                    answer={question.answer}
                    explanation={question.explanation}
                    onUserAnswer={
                      (questionText, userAnswer) => handleUserAnswer(question.id, questionText, userAnswer)
                    }
                  />
                ))}
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2">Türev Kavramının Açıklaması</h4>
              <p className="text-slate-600">{derivativeSimulation.explanation}</p>
            </div>
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Düşündürücü Sorular</h4>
              <ul className="list-disc list-inside space-y-2">
                {derivativeSimulation.questions.map((question, index) => (
                  <li key={index} className="text-slate-600">{question}</li>
                ))}
              </ul>
            </div>
            
            {simulation && (
              <div className="flex justify-center mt-8">
                <Button className="mr-3" onClick={saveSimulation}>Simülasyonu Kaydet</Button>
                <Button variant="outline">Paylaş</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Normal simülasyon gösterimi
  return (
    <Card className="w-full max-w-3xl mx-auto mt-8 overflow-hidden">
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
          
          <Separator className="my-6" />
          
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3">Düşündürücü Sorular</h4>
            <ul className="list-disc list-inside space-y-2">
              {simulation.questions.map((question, index) => (
                <li key={index} className="text-slate-600">{question}</li>
              ))}
            </ul>
          </div>
          
          <div className="flex justify-center mt-8">
            <Button className="mr-3" onClick={saveSimulation}>Simülasyonu Kaydet</Button>
            <Button variant="outline">Paylaş</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationDisplay;
