
import { supabase } from "@/integrations/supabase/client";

export interface SimulationData {
  title: string;
  scenario: string;
  steps: string[];
  explanation: string;
  questions: string[];
  interactiveElements: InteractiveElement[];
}

export interface InteractiveElement {
  id: string;
  type: 'slider' | 'button' | 'toggle' | 'input' | 'question';
  label?: string;
  description?: string;
  min?: number;
  max?: number;
  defaultValue?: number | string | boolean;
  options?: string[];
  affects?: string;
  feedback?: {[key: string]: string};
  // Özel sorular için alanlar
  question?: string;
  answer?: string;
  correctAnswer?: string;
  explanation?: string;
}

export async function generateSimulationWithGemini(prompt: string): Promise<SimulationData> {
  try {
    // Get the API key from Supabase secrets
    const { data, error } = await supabase.functions.invoke('generate-simulation', {
      body: { prompt }
    });

    if (error) {
      console.error("Error calling Gemini API:", error);
      throw new Error("Failed to generate simulation");
    }

    return data;
  } catch (error) {
    console.error("Error generating simulation:", error);
    // Fallback to mock data if the API call fails
    return getDefaultSimulation(prompt);
  }
}

// Fallback function in case the API call fails
function getDefaultSimulation(prompt: string): SimulationData {
  const lowercasePrompt = prompt.toLowerCase().trim();
  
  if (lowercasePrompt.includes("fotosentez")) {
    return {
      title: "Fotosentez: Güneş Işığından Besine",
      scenario: "Siz bir ışık fotonu olarak Güneş'ten 150 milyon kilometre yol kat ettiniz ve bir akçaağaç yaprağına çarptınız. Yolculuğunuz, karbondioksit ve suyun glikoza ve oksijene dönüşümüne yardımcı olurken başlamak üzere.",
      steps: [
        "Bir foton olarak, bir kloroplasttaki bir klorofil molekülüne çarparak, süreci başlatan bir elektronu enerji ile yüklüyorsunuz.",
        "Enerji yüklü elektron, ATP ve NADPH üretimine yardımcı olan elektron taşıma zinciri boyunca hareket eder.",
        "Bu enerji taşıyıcıları, CO2'yi glikoza dönüştürmeye yardımcı oldukları Calvin döngüsüne geçer.",
        "Oluşturulan her glikoz molekülü için, altı su molekülü parçalanır ve bir yan ürün olarak altı O2 molekülü serbest bırakılır.",
        "Üretilen glikoz, ya bitki tarafından enerji için hemen kullanılır ya da daha sonra kullanılmak üzere nişasta olarak depolanır."
      ],
      explanation: "Fotosentez, bitkilerin ışık enerjisini glikozda depolanan kimyasal enerjiye dönüştürmek için kullandıkları süreçtir. Bu süreç öncelikle yapraklarda bulunan kloroplastlarda gerçekleşir. Genel denklem 6CO2 + 6H2O + ışık enerjisi → C6H12O6 + 6O2 şeklindedir. Sürecin iki ana aşaması vardır: güneş ışığını ATP ve NADPH'ye dönüştüren ışığa bağlı reaksiyonlar ve karbondioksitten glikoz oluşturmak için bu ürünleri kullanan Calvin döngüsü.",
      questions: [
        "Güneş ışığı olmasaydı fotosentez sürecine ne olurdu?",
        "Bitkiler gözümüze neden yeşil görünür?",
        "Artan atmosferik CO2 seviyeleri fotosentez oranlarını nasıl etkileyebilir?",
        "Fotosentez çeşitli bitki türleri arasında nasıl farklılık gösterir?"
      ],
      interactiveElements: [
        {
          id: "fotosentez-soru-1",
          type: "question",
          question: "Fotosentezin gerçekleşmesi için gerekli olan üç temel bileşen nelerdir?",
          answer: "Su, karbondioksit ve güneş ışığı",
          explanation: "Fotosentez için bitkiler su, karbondioksit ve güneş ışığına ihtiyaç duyar. Bu üç bileşen olmadan, fotosentez süreci tamamlanamaz."
        },
        {
          id: "fotosentez-soru-2",
          type: "question",
          question: "Fotosentez hangi organelde gerçekleşir?",
          answer: "Kloroplast",
          explanation: "Fotosentez, bitki hücrelerinde bulunan ve içinde klorofil pigmenti taşıyan kloroplast adlı organellerde gerçekleşir."
        },
        {
          id: "fotosentez-soru-3",
          type: "question",
          question: "Fotosentezin genel denklemi nedir?",
          answer: "6CO2 + 6H2O + ışık enerjisi → C6H12O6 + 6O2",
          explanation: "Bu denklem, fotosentez sürecinde 6 molekül karbondioksit ve 6 molekül suyun, ışık enerjisi yardımıyla 1 molekül glikoz ve 6 molekül oksijene dönüştürüldüğünü gösterir."
        },
        {
          id: "fotosentez-soru-4",
          type: "question",
          question: "Bitkiler neden yeşil görünür?",
          answer: "Klorofil pigmenti yeşil ışığı yansıttığı için",
          explanation: "Bitkiler klorofil adı verilen bir pigment içerir. Bu pigment, güneş spektrumundan kırmızı ve mavi ışığı emer, ancak yeşil ışığı yansıtır. Bu nedenle bitkiler bize yeşil görünür."
        }
      ]
    };
  }
  
  // Default generic simulation
  return {
    title: `${prompt} Konusunu Anlamak`,
    scenario: `${prompt} konusunu interaktif bir simülasyon aracılığıyla keşfetmek ve deneyimlemek üzeresiniz.`,
    steps: [
      "1. Adım: İlk koşulları ve dahil olan bileşenleri gözlemleyin.",
      "2. Adım: Neden-sonuç ilişkilerini görmek için temel unsurlarla etkileşime geçin.",
      "3. Adım: Sonuçları nasıl etkilediklerini görmek için değişkenleri değiştirin.",
      "4. Adım: Gözlemlenen kalıpları altta yatan prensiplerle ilişkilendirin.",
      "5. Adım: Farklı senaryolarda yeni sonuçları tahmin etmek için anlayışınızı uygulayın."
    ],
    explanation: `Bu simülasyon, ${prompt} konusunu soyut kavramlardan ziyade doğrudan deneyim yoluyla anlamanıza yardımcı olur. Süreçle aktif olarak etkileşime girerek, sistemin nasıl çalıştığına dair daha güçlü sinirsel bağlantılar ve sezgisel bir anlayış geliştirirsiniz.`,
    questions: [
      "Bu süreçle ilgili sizi en çok ne şaşırttı?",
      "Bu, halihazırda anladığınız diğer kavramlarla nasıl bağlantılıdır?",
      "Kilit değişkenlerden biri önemli ölçüde değişseydi ne olurdu?",
      "Bu bilgi gerçek dünya durumunda nasıl uygulanabilir?"
    ],
    interactiveElements: [
      {
        id: "genel-soru-1",
        type: "question",
        question: "Öğrenme sürecinde aktif katılımın önemi nedir?",
        answer: "Aktif katılım, bilginin daha iyi hatırlanmasını ve anlaşılmasını sağlar",
        explanation: "Aktif öğrenme, öğrencilerin bilgiyi sadece pasif olarak almak yerine, düşünme, sorgulama ve uygulama süreçlerine dahil olmalarını içerir. Bu, daha derin anlama ve daha uzun süreli hafızaya alınmasını sağlar."
      },
      {
        id: "genel-soru-2",
        type: "question",
        question: "Simülasyonların eğitimdeki rolü nedir?",
        answer: "Gerçek dünya deneyimlerini güvenli ve kontrollü bir ortamda sunmak",
        explanation: "Simülasyonlar, gerçek durumları tekrar tekrar deneyimleme, hata yapma ve bunlardan öğrenme fırsatı sağlar. Tehlikeli, pahalı veya erişilemeyen durumları güvenli bir şekilde deneyimlemeyi mümkün kılar."
      },
      {
        id: "genel-soru-3",
        type: "question",
        question: "Etkileşimli öğrenme ile geleneksel öğrenme arasındaki temel fark nedir?",
        answer: "Öğrencinin pasif alıcı yerine aktif katılımcı olması",
        explanation: "Geleneksel öğrenmede öğrenci genellikle pasif bir bilgi alıcısıdır. Etkileşimli öğrenmede ise öğrenci, kendi öğrenme sürecinde aktif rol alır, sorular sorar, deneyler yapar ve keşifler gerçekleştirir."
      }
    ]
  };
}
