import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import InteractiveElements from '@/components/InteractiveElements';
import InteractiveInput from '@/components/interactive/InteractiveInput';
import InteractiveQuestion from '@/components/interactive/InteractiveQuestion';
import { SimulationData } from '@/services/geminiService';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

interface UserResponse {
  questionIndex: number;
  answer: string;
  feedback: string;
}

const SimulationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [simulation, setSimulation] = useState<SimulationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [practiceQuestions, setPracticeQuestions] = useState<Question[]>([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{[key: string]: string}>({});
  const [userResponses, setUserResponses] = useState<UserResponse[]>([]);

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
        if (simulationData.title.toLowerCase().includes("türev") || 
            simulationData.explanation.toLowerCase().includes("türev")) {
          const derivativeQuestions = generateDerivativeQuestions();
          setQuestions(derivativeQuestions);
          
          const practiceDQuestions = generatePracticeQuestions();
          setPracticeQuestions(practiceDQuestions);
        } else if (simulationData.questions && simulationData.questions.length > 0) {
          // Diğer konular için normal soru üretimi
          const generatedQuestions = simulationData.questions.map((q, index) => ({
            id: `q-${index}`,
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

  // Türev soruları oluşturan fonksiyon
  const generateDerivativeQuestions = (): Question[] => {
    return [
      {
        id: "derivative-1",
        question: "x^2+5 fonksiyonunun türevi nedir?",
        correctAnswer: "2x",
        explanation: "f(x) = x^2+5 fonksiyonunun türevi, x^n türevi için kural olan n.x^(n-1) formülünü kullanarak hesaplanır. Burada n=2 olduğu için, 2.x^(2-1) = 2x olur. Sabit terim olan 5'in türevi 0 olduğu için sonuç 2x'tir."
      },
      {
        id: "derivative-2",
        question: "3x^3-2x+7 fonksiyonunun türevi nedir?",
        correctAnswer: "9x^2-2",
        explanation: "f(x) = 3x^3-2x+7 fonksiyonunun türevi için terim terim türev alırız. 3x^3'ün türevi 3.3x^2 = 9x^2, -2x'in türevi -2, ve sabit terim olan 7'nin türevi 0'dır. Sonuç: 9x^2-2"
      },
      {
        id: "derivative-3",
        question: "sin(x) fonksiyonunun türevi nedir?",
        correctAnswer: "cos(x)",
        explanation: "sin(x) fonksiyonunun türevi cos(x)'tir. Bu, trigonometrik fonksiyonların türev kurallarından gelir."
      },
      {
        id: "derivative-4",
        question: "x.e^x fonksiyonunun türevi nedir?",
        correctAnswer: "e^x+x.e^x",
        explanation: "Bu türevi çarpım kuralı kullanarak hesaplamamız gerekir. f(x)=x ve g(x)=e^x için, (f.g)' = f'.g + f.g' formülünü kullanırız. Burada f'=1 ve g'=e^x olduğundan, sonuç 1.e^x + x.e^x = e^x(1+x) = e^x+x.e^x olur."
      },
      {
        id: "derivative-5",
        question: "ln(x) fonksiyonunun türevi nedir?",
        correctAnswer: "1/x",
        explanation: "Doğal logaritma fonksiyonu ln(x)'in türevi 1/x'tir. Bu önemli bir temel türev kuralıdır."
      },
      {
        id: "derivative-6",
        question: "tan(x) fonksiyonunun türevi nedir?",
        correctAnswer: "sec^2(x)",
        explanation: "Tanjant fonksiyonunun türevi, sekant fonksiyonunun karesidir: d/dx(tan(x)) = sec^2(x)"
      }
    ];
  };
  
  // Uygulama soruları oluşturma
  const generatePracticeQuestions = (): Question[] => {
    return [
      {
        id: "practice-1",
        question: "Sabit bir sayının türevi nedir?",
        correctAnswer: "0",
        explanation: "Herhangi bir sabit sayının türevi her zaman 0'dır. Örneğin, f(x) = 5 fonksiyonunun türevi 0'dır."
      },
      {
        id: "practice-2",
        question: "Türev alma işleminde zincir kuralı ne için kullanılır?",
        correctAnswer: "Bileşik fonksiyonların türevini almak için",
        explanation: "Zincir kuralı, iç içe fonksiyonlardan oluşan bileşik fonksiyonların türevini almayı sağlayan temel bir kuraldır. f(g(x)) şeklindeki bir fonksiyonun türevi, f'(g(x)) × g'(x) olarak hesaplanır."
      },
      {
        id: "practice-3",
        question: "Bir fonksiyonun ikinci türevi ne anlama gelir?",
        correctAnswer: "Değişim oranının değişim oranını",
        explanation: "Bir fonksiyonun ikinci türevi, birinci türevin türevi demektir. Bu, değişim oranının kendisinin nasıl değiştiğini gösterir ve fonksiyonun konkavlığı hakkında bilgi verir."
      },
      {
        id: "practice-4",
        question: "Türev, fizik biliminde neyi temsil eder?",
        correctAnswer: "Anlık hızı veya ivmeyi",
        explanation: "Fizikte, konum fonksiyonunun türevi anlık hızı, hız fonksiyonunun türevi ise ivmeyi verir. Türev, fiziksel büyüklüklerin anlık değişim oranlarını hesaplamak için kullanılır."
      }
    ];
  };

  // Soru için basit bir cevap üretme fonksiyonu (Türkçe)
  const generateAnswer = (question: string) => {
    // Bu kısım gerçek bir uygulamaada daha gelişmiş olmalı
    // Şu an için soruya dayanarak basit bir Türkçe cevap üretiyoruz
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
  
  // Soru için açıklama üreten fonksiyon (Türkçe)
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

  const handleUserAnswer = async (questionIndex: number, answer: string) => {
    // Kullanıcının cevabını kaydet
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: answer
    });
    
    // Cevap için Gemini çağrısı yapılabilir
    // Not: Bu kısım gerçek bir uygulamada Supabase Edge Function üzerinden yapılmalı
    try {
      // Burada gerçekten Gemini'yi çağırmak yerine basit bir değerlendirme yapıyoruz
      const activeQuestion = questions[questionIndex];
      let feedback;
      
      // Cevabı değerlendir
      const isCorrect = answer.toLowerCase().trim() === activeQuestion.correctAnswer.toLowerCase().trim() ||
                        answer.toLowerCase().trim().replace(/\s+/g, '') === activeQuestion.correctAnswer.toLowerCase().trim().replace(/\s+/g, '');
      
      if (isCorrect) {
        feedback = `Tebrikler! Bu yanıt doğru. ${activeQuestion.explanation}`;
      } else {
        feedback = `Bu yanıtınız üzerinde biraz daha düşünmek gerekiyor. Yanıtınızda "${answer}" ifadesini kullandınız, ancak türev işleminde dikkat etmeniz gereken başka noktalar da var. Türev alırken fonksiyonun her terimini ayrı ayrı değerlendirmeli ve kuralları doğru uygulamalısınız.`;
      }
      
      // Kullanıcının cevabını ve değerlendirmeyi kaydet
      setUserResponses(prev => [
        ...prev,
        {
          questionIndex,
          answer,
          feedback
        }
      ]);
      
    } catch (error) {
      console.error("Yanıt değerlendirme hatası:", error);
      toast({
        title: "Hata",
        description: "Yanıtınız değerlendirilirken bir hata oluştu",
        variant: "destructive",
      });
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
  const activeResponse = userResponses.find(r => r.questionIndex === activeQuestionIndex);

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
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">Etkileşimli Öğeler</h4>
                    <p className="text-slate-600 mb-4">
                      Farklı değişkenlerin sonucu nasıl etkilediğini görmek için bu kontrollerle deney yapın.
                    </p>
                    <InteractiveElements elements={simulation.interactiveElements} />
                  </div>
                  <Separator className="my-6" />
                </>
              )}
              
              {practiceQuestions && practiceQuestions.length > 0 && (
                <>
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">Hızlı Soru-Cevap</h4>
                    <p className="text-slate-600 mb-4">
                      Aşağıdaki sorulara yanıt bulmak için düşünün ve cevabı görmek için butona tıklayın.
                    </p>
                    <div className="space-y-4">
                      {practiceQuestions.map((pq) => (
                        <InteractiveQuestion 
                          key={pq.id}
                          id={pq.id}
                          question={pq.question}
                          answer={pq.correctAnswer}
                          explanation={pq.explanation}
                        />
                      ))}
                    </div>
                  </div>
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
              <h4 className="text-lg font-semibold mb-4">Türev Alıştırmaları</h4>
              
              <div className="mb-6">
                <div className="space-y-4">
                  {questions.map((question) => (
                    <InteractiveQuestion 
                      key={question.id}
                      id={question.id}
                      question={question.question}
                      answer={question.correctAnswer}
                      explanation={question.explanation}
                    />
                  ))}
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
