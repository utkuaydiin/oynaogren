
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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

// Türev soruları - her türev simülasyonunda gösterilecek
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
  },
  {
    id: "derivative-4",
    question: "e^x fonksiyonunun türevi nedir?",
    answer: "e^x",
    explanation: "e^x fonksiyonu, türevi kendisi olan özel bir fonksiyondur. Bu nedenle, f(x) = e^x için f'(x) = e^x olur."
  },
  {
    id: "derivative-5",
    question: "ln(x) fonksiyonunun türevi nedir?",
    answer: "1/x",
    explanation: "Doğal logaritma fonksiyonu ln(x)'in türevi 1/x'tir. Bu, logaritmik fonksiyonların türev kurallarından gelir."
  },
  {
    id: "derivative-6",
    question: "cos(x) fonksiyonunun türevi nedir?",
    answer: "-sin(x)",
    explanation: "Kosinüs fonksiyonunun türevi, negatif sinüs fonksiyonudur. Yani, f(x) = cos(x) için f'(x) = -sin(x) olur."
  },
  {
    id: "derivative-7",
    question: "2x^3 - 5x^2 + 4x - 7 fonksiyonunun türevi nedir?",
    answer: "6x^2 - 10x + 4",
    explanation: "Polinom fonksiyonlarının türevini almak için her terimin türevini ayrı ayrı hesaplarız. 2x^3'ün türevi 6x^2, -5x^2'nin türevi -10x, 4x'in türevi 4 ve sabit terim -7'nin türevi 0'dır. Sonuç: 6x^2 - 10x + 4"
  },
  {
    id: "derivative-8",
    question: "tan(x) fonksiyonunun türevi nedir?",
    answer: "sec^2(x)",
    explanation: "Tanjant fonksiyonunun türevi, sekant fonksiyonunun karesidir: d/dx(tan(x)) = sec^2(x)"
  },
  {
    id: "derivative-9",
    question: "x * ln(x) fonksiyonunun türevi nedir?",
    answer: "ln(x) + 1",
    explanation: "Bu türevi çarpım kuralı kullanarak hesaplıyoruz. f(x) = x ve g(x) = ln(x) için, (f.g)' = f'.g + f.g' formülünü kullanırız. Burada f' = 1 ve g' = 1/x olduğundan, sonuç 1.ln(x) + x.(1/x) = ln(x) + 1 olur."
  },
  {
    id: "derivative-10",
    question: "e^(3x) fonksiyonunun türevi nedir?",
    answer: "3e^(3x)",
    explanation: "Zincir kuralı kullanarak, içteki fonksiyonun türevini dıştaki fonksiyonun türevi ile çarparız. e^u için türev e^u × u' formülündedir. Burada u = 3x ve u' = 3 olduğundan, sonuç 3e^(3x) olur."
  }
];

// Fizik soruları - fizik ile ilgili simülasyonlarda gösterilecek
const physicsQuestions = [
  {
    id: "physics-1",
    question: "Bir cismin düşme hızı, düşme yüksekliğine nasıl bağlıdır?",
    answer: "v = √(2gh)",
    explanation: "Bir cismin h yüksekliğinden serbest düşmesi durumunda, yerçekimi ivmesi g ile, hızı v = √(2gh) formülü ile hesaplanır. Bu formül, potansiyel enerjinin kinetik enerjiye dönüşümünden elde edilir."
  },
  {
    id: "physics-2",
    question: "Newton'un ikinci hareket yasası nedir?",
    answer: "F = m × a",
    explanation: "Newton'un ikinci yasası, bir cisme uygulanan net kuvvetin (F), cismin kütlesi (m) ile ivmesinin (a) çarpımına eşit olduğunu belirtir. Bu yasa, kuvvet, kütle ve ivme arasındaki temel ilişkiyi tanımlar."
  },
  {
    id: "physics-3",
    question: "Bir elektrik devresinde dirençler seri bağlandığında toplam direnç nasıl hesaplanır?",
    answer: "Rtoplam = R1 + R2 + R3 + ...",
    explanation: "Seri bağlı dirençlerde, toplam direnç tüm dirençlerin toplamına eşittir. Aynı akım tüm dirençlerden geçer ve toplam gerilim her bir direnç üzerindeki gerilimlerin toplamıdır."
  },
  {
    id: "physics-4",
    question: "Işık hızı yaklaşık olarak kaçtır?",
    answer: "3 × 10^8 m/s",
    explanation: "Işık boşlukta saniyede yaklaşık 300.000 km veya 3 × 10^8 metre hızla yayılır. Bu sabit, Albert Einstein'ın görelilik teorisinde çok önemli bir rol oynar ve evrendeki en büyük hız limiti olarak kabul edilir."
  },
  {
    id: "physics-5",
    question: "Kinetik enerji formülü nedir?",
    answer: "Ek = (1/2) × m × v^2",
    explanation: "Kinetik enerji, hareket halindeki bir cismin sahip olduğu enerjidir ve cismin kütlesinin (m) ve hızının karesinin (v²) yarısı olarak hesaplanır. Birim olarak Joule (J) kullanılır."
  }
];

// Kimya soruları - kimya ile ilgili simülasyonlarda gösterilecek
const chemistryQuestions = [
  {
    id: "chemistry-1",
    question: "pH değeri neyi ifade eder?",
    answer: "Bir çözeltideki hidrojen iyonu konsantrasyonunun eksi logaritmasını",
    explanation: "pH = -log[H+] formülü ile hesaplanır. pH değeri 7'den küçük olan çözeltiler asidik, 7'den büyük olanlar bazik, 7 olanlar ise nötrdür."
  },
  {
    id: "chemistry-2",
    question: "Avogadro sayısı nedir?",
    answer: "6.022 × 10^23",
    explanation: "Avogadro sayısı, bir molde bulunan atom veya molekül sayısıdır. Bu sayı, kimyasal hesaplamalarda atom veya molekül sayısını mol cinsinden ifade etmek için kullanılır."
  },
  {
    id: "chemistry-3",
    question: "Suyun kimyasal formülü nedir?",
    answer: "H2O",
    explanation: "Su molekülü, iki hidrojen atomu ve bir oksijen atomundan oluşur. Hidrojen atomları, oksijen atomuna kovalent bağlarla bağlanır ve molekül yaklaşık 104.5 derecelik bir açı yapar."
  },
  {
    id: "chemistry-4",
    question: "Periyodik tabloda en sağda yer alan element grubu hangisidir?",
    answer: "Soy Gazlar",
    explanation: "Soy gazlar (He, Ne, Ar, Kr, Xe, Rn), periyodik tablonun en sağındaki 18. grubu oluşturur. Bu elementler kararlı elektronik yapıya sahiptir ve kimyasal tepkimelere girme eğilimleri çok düşüktür."
  },
  {
    id: "chemistry-5",
    question: "Bir maddenin fiziksel hali (katı, sıvı, gaz) neye bağlıdır?",
    answer: "Sıcaklık ve basınca",
    explanation: "Bir maddenin fiziksel hali, sıcaklık ve basınç koşullarına bağlıdır. Faz diyagramları, belirli sıcaklık ve basınç değerlerinde maddenin hangi fiziksel halde bulunduğunu gösterir."
  }
];

// Biyoloji soruları - biyoloji ile ilgili simülasyonlarda gösterilecek
const biologyQuestions = [
  {
    id: "biology-1",
    question: "DNA'nın açılımı nedir?",
    answer: "Deoksiribo Nükleik Asit",
    explanation: "DNA, canlıların genetik bilgisini taşıyan bir nükleik asit türüdür. İkili sarmal yapıda olan DNA, adenin, guanin, sitozin ve timin bazlarını içerir."
  },
  {
    id: "biology-2",
    question: "Fotosentez denklemi nedir?",
    answer: "6CO2 + 6H2O + ışık enerjisi → C6H12O6 + 6O2",
    explanation: "Fotosentez, bitkilerin güneş ışığını kullanarak karbondioksit ve sudan glikoz ürettiği süreçtir. Bu süreçte oksijen açığa çıkar ve dünya üzerindeki yaşam için hayati öneme sahiptir."
  },
  {
    id: "biology-3",
    question: "İnsan vücudunda kaç kromozom bulunur?",
    answer: "46 (23 çift)",
    explanation: "İnsan hücreleri normalde 46 kromozom içerir, bunlar 23 çift halinde düzenlenmiştir. 23. çift cinsiyet kromozomlarıdır (XX: kadın, XY: erkek)."
  },
  {
    id: "biology-4",
    question: "Hücre zarının temel yapısı nedir?",
    answer: "Fosfolipid çift tabaka",
    explanation: "Hücre zarı, fosfolipid çift tabakadan oluşur ve içine çeşitli proteinler, glikoproteinler ve kolesterol molekülleri gömülüdür. Bu yapı, yarı geçirgen özellikte olup hücre içi ve dışı arasındaki madde alışverişini kontrol eder."
  },
  {
    id: "biology-5",
    question: "Mitokondrinin temel görevi nedir?",
    answer: "Hücresel solunum ve ATP üretimi",
    explanation: "Mitokondri, 'hücrenin enerji santrali' olarak adlandırılır. Oksijenli solunum yoluyla glikoz gibi besin maddelerinden ATP (adenozin trifosfat) üretir, bu da hücrelerin kullandığı temel enerji molekülüdür."
  }
];

const SimulationDisplay: React.FC<SimulationDisplayProps> = ({ simulation, isLoading }) => {
  const { user } = useAuth();
  const { toast } = useToast();

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

  // Konuya göre ilgili soruları seçme işlevi
  const getQuestionsByTopic = (topicTitle: string): Array<{id: string, question: string, answer: string, explanation: string}> => {
    const lowerTitle = topicTitle.toLowerCase();
    
    if (lowerTitle.includes("türev") || lowerTitle.includes("calculus") || lowerTitle.includes("matematik")) {
      return derivativeQuestions;
    } else if (lowerTitle.includes("fizik") || lowerTitle.includes("mekanik") || lowerTitle.includes("elektrik")) {
      return physicsQuestions;
    } else if (lowerTitle.includes("kimya") || lowerTitle.includes("element") || lowerTitle.includes("kimyasal")) {
      return chemistryQuestions;
    } else if (lowerTitle.includes("biyoloji") || lowerTitle.includes("hücre") || lowerTitle.includes("canlı")) {
      return biologyQuestions;
    }
    
    // Varsayılan olarak türev sorularını döndür
    return derivativeQuestions.slice(0, 5); // Varsayılan olarak ilk 5 türev sorusunu göster
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

  // Eğer simülasyon yoksa, türev özel içeriğini göster
  if (!simulation) {
    const derivativeSimulation = {
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
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Türev Alıştırmaları</h4>
              <p className="text-slate-600 mb-4">
                Aşağıdaki soruların yanıtlarını görebilmek için "Doğru Yanıtı Göster" butonuna tıklayın.
              </p>
              
              <div className="space-y-4">
                {derivativeQuestions.map((question) => (
                  <InteractiveQuestion 
                    key={question.id}
                    id={question.id}
                    question={question.question}
                    answer={question.answer}
                    explanation={question.explanation}
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
          </div>
        </CardContent>
      </Card>
    );
  }

  // Simülasyon başlık ve konusuna göre uygun soruları seç
  const topicQuestions = getQuestionsByTopic(simulation.title);

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
          
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3">Konuyla İlgili Alıştırmalar</h4>
            <p className="text-slate-600 mb-4">
              Aşağıdaki soruların yanıtlarını görebilmek için "Doğru Yanıtı Göster" butonuna tıklayın.
            </p>
            
            <div className="space-y-4">
              {topicQuestions.map((question) => (
                <InteractiveQuestion 
                  key={question.id}
                  id={question.id}
                  question={question.question}
                  answer={question.answer}
                  explanation={question.explanation}
                />
              ))}
            </div>
          </div>
          
          <Separator className="my-6" />
          
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
