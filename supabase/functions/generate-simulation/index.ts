
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    const { prompt, promptType, question, userAnswer, correctAnswer } = requestBody;
    
    // Cevap değerlendirmesi isteniyorsa
    if (promptType === 'evaluateAnswer') {
      const geminiPrompt = `
        Lütfen yanıtını tamamen Türkçe olarak ver.
        
        Aşağıda bir matematik (türev) sorusu ve kullanıcının bu soruya verdiği yanıt bulunmaktadır:
        
        Soru: ${question}
        Kullanıcının yanıtı: ${userAnswer}
        Doğru yanıt: ${correctAnswer}
        
        Kullanıcının verdiği yanıtı değerlendir. Bu değerlendirmede "doğru" veya "yanlış" kelimelerini kullanma. Bunun yerine yanıtın nasıl elde edildiğini ve doğru yanıtın nasıl bulunacağını açıkla. Yanıtın sadece şekilsel olarak farklı yazılmış ancak matematiksel olarak eşdeğer olma ihtimalini de göz önünde bulundur (örneğin: 2x yerine 2*x yazılması gibi).
        
        Kullanıcıya yanıtının değerlendirmesi hakkında bilgi ver. Açıklamanda, türev alma kurallarını hatırlatarak eğitici bir yaklaşım sergile. Kısa ve öz olarak, matematiksel terimleri herkesin anlayabileceği şekilde açıklayarak yanıtını ver.
        
        Cevabını JSON formatında değil, düz metin olarak ver. Sadece değerlendirme metni döndür.
      `;

      console.log("Gemini'ye gönderilen istek:", geminiPrompt);

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': geminiApiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: geminiPrompt,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Gemini API yanıt hatası:", response.status, errorBody);
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Gemini API yanıtı:", JSON.stringify(data));
      
      // Extract text content from Gemini's response
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from Gemini API');
      }
      
      const content = data.candidates[0].content;
      if (!content || !content.parts || content.parts.length === 0) {
        throw new Error('Invalid response format from Gemini API');
      }
      
      const feedbackText = content.parts[0].text;
      console.log("Oluşturulan geribildirim:", feedbackText);
      
      return new Response(JSON.stringify({ feedback: feedbackText }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Normal simülasyon oluşturma isteği
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    // Konu tespiti yapıp, ona göre soru seti üretmeye yönelik parametre ekleme
    const topicKeywords = analyzeTopicKeywords(prompt);
    
    // Gemini için yanıt dilini Türkçe olarak belirten komut ekleme
    const geminiPrompt = `
      Lütfen yanıtını tamamen Türkçe olarak ver.
      
      Şu konu hakkında etkileşimli bir öğrenme simülasyonu oluştur: "${prompt}". 
      
      Bu konu ${topicKeywords.join(", ")} alanına giriyor. Simülasyonu ve tüm sorularını bu konu alanına özel olarak tasarla.
      
      Yanıtını aşağıdaki yapıda bir JSON nesnesi olarak formatla:
      {
        "title": "Simülasyon için ilgi çekici bir başlık",
        "scenario": "Öğrenciyi konunun merkezine koyan birinci şahıs senaryosu",
        "steps": ["1. adımın açıklaması", "2. adımın açıklaması", ...],
        "explanation": "Konunun net ve özlü bir açıklaması",
        "questions": ["Düşündürücü soru 1", "Düşündürücü soru 2", ...],
        "interactiveElements": [
          {
            "id": "soru-1",
            "type": "question",
            "question": "Konuyla ilgili soru 1",
            "answer": "Doğru cevap 1",
            "explanation": "Cevabın açıklaması 1" 
          },
          {
            "id": "soru-2",
            "type": "question",
            "question": "Konuyla ilgili soru 2",
            "answer": "Doğru cevap 2",
            "explanation": "Cevabın açıklaması 2"
          },
          // En az 6-8 soru ekle. Sorular konuyla doğrudan ilgili ve öğretici olsun.
          // Özellikle '${prompt}' konusuyla ilgili spesifik kavramlar ve uygulamalar hakkında sorular oluştur.
          // Soruların cevapları doğru ve açıklayıcı olmalı.
        ]
      }
      
      Bu simülasyon '${prompt}' konusuna özel olarak hazırlanmalıdır. Kesinlikle genel sorular değil, bu konuyla doğrudan ilgili, spesifik sorular ve cevaplar oluştur.
      
      Etkileşimli öğelerin kullanıcının kavramı anlamasına yardımcı olmalı. Simülasyon içerisinde kesinlikle sadece Türkçe dil kullan, hiçbir İngilizce kelime veya ifade olmasın.
      
      Tüm içerik '${prompt}' konusuna çok özel olmalı, genel öğrenme ilkeleri veya standart açıklamalar yerine bu konuya özgü detaylar içermeli.
      
      Tam olarak belirtilen JSON formatını kullan, özellikle "interactiveElements" dizisindeki her öğenin "id", "type", "question", "answer" ve "explanation" alanlarını içerdiğinden emin ol.
    `;

    console.log("Gemini'ye gönderilen istek:", geminiPrompt);

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': geminiApiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: geminiPrompt,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("Gemini API yanıtı:", JSON.stringify(data));
    
    // Extract the JSON content from Gemini's response
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }
    
    const content = data.candidates[0].content;
    if (!content || !content.parts || content.parts.length === 0) {
      throw new Error('Invalid response format from Gemini API');
    }
    
    // Try to parse the JSON from Gemini's response
    let simulationData;
    const textContent = content.parts[0].text;
    
    try {
      // Find JSON in the response (it might be wrapped in ```json or just be the response)
      const jsonMatch = textContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                        textContent.match(/```\s*([\s\S]*?)\s*```/) ||
                        [null, textContent];
                        
      const jsonText = jsonMatch[1] || textContent;
      simulationData = JSON.parse(jsonText);
      
      // Interaktif elemanları, sorular için standardize et
      if (simulationData.interactiveElements) {
        simulationData.interactiveElements = simulationData.interactiveElements.map((element, index) => {
          if (element.type === "question" || element.question) {
            return {
              id: element.id || `question-${index}`,
              type: "question",
              question: element.question,
              answer: element.answer || element.correctAnswer,
              explanation: element.explanation || ""
            };
          }
          return element;
        });
      } else {
        // Eğer interactiveElements boşsa veya yoksa, konuyla ilgili varsayılan sorular ekle
        simulationData.interactiveElements = generateDefaultQuestions(prompt, topicKeywords);
      }
      
    } catch (e) {
      console.error("Error parsing Gemini response:", e, textContent);
      // Fallback to default questions if parsing fails
      throw new Error('Failed to parse simulation data from AI response');
    }
    
    return new Response(JSON.stringify(simulationData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-simulation function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Konu analizi yardımcı fonksiyonu
function analyzeTopicKeywords(prompt: string): string[] {
  const lowercasePrompt = prompt.toLowerCase();
  
  const topics: string[] = [];
  
  // Matematik ile ilgili anahtar kelimeler
  if (lowercasePrompt.includes("türev") || 
      lowercasePrompt.includes("integral") || 
      lowercasePrompt.includes("matematik") ||
      lowercasePrompt.includes("fonksiyon") ||
      lowercasePrompt.includes("cebir") ||
      lowercasePrompt.includes("geometri") ||
      lowercasePrompt.includes("sayı") ||
      lowercasePrompt.includes("denklem") ||
      lowercasePrompt.includes("aritmetik") ||
      lowercasePrompt.includes("calculus")) {
    topics.push("matematik");
  }
  
  // Fizik ile ilgili anahtar kelimeler
  if (lowercasePrompt.includes("fizik") || 
      lowercasePrompt.includes("mekanik") || 
      lowercasePrompt.includes("elektrik") ||
      lowercasePrompt.includes("manyetik") ||
      lowercasePrompt.includes("hareket") ||
      lowercasePrompt.includes("kuvvet") ||
      lowercasePrompt.includes("enerji") ||
      lowercasePrompt.includes("dalga") ||
      lowercasePrompt.includes("Newton") ||
      lowercasePrompt.includes("ivme") ||
      lowercasePrompt.includes("optik")) {
    topics.push("fizik");
  }
  
  // Kimya ile ilgili anahtar kelimeler
  if (lowercasePrompt.includes("kimya") || 
      lowercasePrompt.includes("element") || 
      lowercasePrompt.includes("kimyasal") ||
      lowercasePrompt.includes("molekül") ||
      lowercasePrompt.includes("periyodik") ||
      lowercasePrompt.includes("reaksiyon") ||
      lowercasePrompt.includes("asit") ||
      lowercasePrompt.includes("baz") ||
      lowercasePrompt.includes("atom") ||
      lowercasePrompt.includes("bileşik")) {
    topics.push("kimya");
  }
  
  // Biyoloji ile ilgili anahtar kelimeler
  if (lowercasePrompt.includes("biyoloji") || 
      lowercasePrompt.includes("hücre") || 
      lowercasePrompt.includes("canlı") ||
      lowercasePrompt.includes("gen") ||
      lowercasePrompt.includes("dna") ||
      lowercasePrompt.includes("organizma") ||
      lowercasePrompt.includes("evrim") ||
      lowercasePrompt.includes("sistem") ||
      lowercasePrompt.includes("organ") ||
      lowercasePrompt.includes("kalıtım") ||
      lowercasePrompt.includes("fotosentez")) {
    topics.push("biyoloji");
  }
  
  // Tarih ve Coğrafya ile ilgili anahtar kelimeler
  if (lowercasePrompt.includes("tarih") || 
      lowercasePrompt.includes("coğrafya") || 
      lowercasePrompt.includes("ülke") ||
      lowercasePrompt.includes("savaş") ||
      lowercasePrompt.includes("imparatorluk") ||
      lowercasePrompt.includes("devlet") ||
      lowercasePrompt.includes("yeryüzü") ||
      lowercasePrompt.includes("iklim") ||
      lowercasePrompt.includes("kıta") ||
      lowercasePrompt.includes("dağ") ||
      lowercasePrompt.includes("deniz")) {
    topics.push("tarih ve coğrafya");
  }
  
  // Ekonomi ve Finans ile ilgili anahtar kelimeler
  if (lowercasePrompt.includes("ekonomi") || 
      lowercasePrompt.includes("finans") || 
      lowercasePrompt.includes("para") ||
      lowercasePrompt.includes("banka") ||
      lowercasePrompt.includes("borsa") ||
      lowercasePrompt.includes("yatırım") ||
      lowercasePrompt.includes("şirket") ||
      lowercasePrompt.includes("ticaret") ||
      lowercasePrompt.includes("muhasebe") ||
      lowercasePrompt.includes("vergi")) {
    topics.push("ekonomi ve finans");
  }
  
  // Bilgisayar ve Yazılım ile ilgili anahtar kelimeler
  if (lowercasePrompt.includes("bilgisayar") || 
      lowercasePrompt.includes("yazılım") || 
      lowercasePrompt.includes("programlama") ||
      lowercasePrompt.includes("kod") ||
      lowercasePrompt.includes("algoritma") ||
      lowercasePrompt.includes("veri") ||
      lowercasePrompt.includes("internet") ||
      lowercasePrompt.includes("web") ||
      lowercasePrompt.includes("donanım") ||
      lowercasePrompt.includes("bilişim")) {
    topics.push("bilgisayar ve yazılım");
  }
  
  // Eğer hiçbir konu belirlenemezse genel olarak işaretleyelim
  if (topics.length === 0) {
    topics.push("genel");
  }
  
  return topics;
}

// Konu bazlı varsayılan sorular oluşturma fonksiyonu
function generateDefaultQuestions(prompt: string, topicKeywords: string[]): Array<{id: string, type: string, question: string, answer: string, explanation: string}> {
  // Ana konu alanını belirle (eğer birden fazla varsa ilkini al)
  const mainTopic = topicKeywords[0] || "genel";
  
  switch (mainTopic) {
    case "matematik":
      return [
        {
          id: "math-question-1",
          type: "question",
          question: `${prompt} konusunda temel matematiksel kavramlar nelerdir?`,
          answer: "Konuya göre değişen temel matematiksel kavramlar ve formüller",
          explanation: `${prompt} konusunda matematiksel kavramları anlamak için temel tanımlar ve formüller önemlidir.`
        },
        {
          id: "math-question-2",
          type: "question",
          question: `${prompt} konusunu çözerken en sık yapılan matematiksel hatalar nelerdir?`,
          answer: "Formüllerin yanlış uygulanması, işlem hataları ve varsayımların doğru yapılmaması",
          explanation: `${prompt} konusunda matematiksel işlemlerde dikkat edilmesi gereken noktalar vardır.`
        },
        {
          id: "math-question-3",
          type: "question",
          question: `${prompt} konusuyla ilgili günlük hayatta karşılaşılan matematik uygulamaları nelerdir?`,
          answer: "Günlük hayattaki hesaplamalar, ölçümler ve problemler",
          explanation: `${prompt} konusuyla ilgili matematiksel kavramlar günlük hayatta çeşitli şekillerde uygulanır.`
        }
      ];
      
    case "fizik":
      return [
        {
          id: "physics-question-1",
          type: "question",
          question: `${prompt} konusunda temel fizik prensipleri nelerdir?`,
          answer: "Fizik kanunları, temel kavramlar ve ölçüm birimleri",
          explanation: `${prompt} konusundaki fiziksel olayları anlamak için belirli fizik kanunları ve prensipleri önemlidir.`
        },
        {
          id: "physics-question-2",
          type: "question",
          question: `${prompt} konusunda fiziğin uygulamaları nelerdir?`,
          answer: "Mühendislik uygulamaları, teknolojik gelişmeler ve doğal fenomenler",
          explanation: `${prompt} konusundaki fizik prensipleri, çeşitli teknolojik uygulamalarda ve doğal olaylarda gözlemlenebilir.`
        },
        {
          id: "physics-question-3",
          type: "question",
          question: `${prompt} ile ilgili fizik deneyleri nasıl yapılabilir?`,
          answer: "Basit deney kurulumları, ölçüm yöntemleri ve sonuçların analizi",
          explanation: `${prompt} konusundaki fizik ilkelerini deneylerle gözlemlemek, teorik bilgileri pratikte doğrulamak için önemlidir.`
        }
      ];
      
    case "kimya":
      return [
        {
          id: "chemistry-question-1",
          type: "question",
          question: `${prompt} konusunda kimyasal tepkimeler nasıl gerçekleşir?`,
          answer: "Kimyasal bağlar, reaksiyon mekanizmaları ve enerji değişimleri",
          explanation: `${prompt} konusundaki kimyasal süreçleri anlamak için tepkime mekanizmalarını incelemek gerekir.`
        },
        {
          id: "chemistry-question-2",
          type: "question",
          question: `${prompt} ile ilgili kimyasal bileşiklerin özellikleri nelerdir?`,
          answer: "Fiziksel ve kimyasal özellikler, bağ yapıları ve element kompozisyonları",
          explanation: `${prompt} konusundaki kimyasal bileşiklerin yapısı ve özellikleri, davranışlarını belirler.`
        },
        {
          id: "chemistry-question-3",
          type: "question",
          question: `${prompt} konusunun günlük hayattaki kimyasal uygulamaları nelerdir?`,
          answer: "Endüstriyel uygulamalar, ev kimyasalları ve doğal süreçler",
          explanation: `${prompt} konusundaki kimyasal ilkeler, günlük yaşamda ve endüstride çeşitli şekillerde uygulanır.`
        }
      ];
      
    case "biyoloji":
      return [
        {
          id: "biology-question-1",
          type: "question",
          question: `${prompt} konusunda hücresel süreçler nasıl işler?`,
          answer: "Hücre fonksiyonları, metabolik yollar ve biyokimyasal reaksiyonlar",
          explanation: `${prompt} konusunda biyolojik süreçleri anlamak için hücre düzeyindeki işleyişi incelemek önemlidir.`
        },
        {
          id: "biology-question-2",
          type: "question",
          question: `${prompt} konusunun evrimsel gelişimi nasıl olmuştur?`,
          answer: "Adaptasyon süreçleri, genetik değişimler ve çevresel faktörler",
          explanation: `${prompt} konusundaki biyolojik özelliklerin evrimsel süreçte nasıl şekillendiğini anlamak, mevcut yapıları açıklamaya yardımcı olur.`
        },
        {
          id: "biology-question-3",
          type: "question",
          question: `${prompt} konusunun ekolojik önemi nedir?`,
          answer: "Ekosistem içindeki rolleri, diğer canlılarla etkileşimleri ve çevresel etkileri",
          explanation: `${prompt} konusunun doğal çevre içindeki rolünü ve etkileşimlerini anlamak, ekolojik dengenin korunması açısından önemlidir.`
        }
      ];
    
    case "tarih ve coğrafya":
      return [
        {
          id: "history-geo-question-1",
          type: "question",
          question: `${prompt} konusunun tarihsel gelişimi nasıldır?`,
          answer: "Kronolojik olaylar, dönüm noktaları ve tarihsel figürler",
          explanation: `${prompt} konusunun tarihsel gelişimini anlamak, günümüzdeki durumunu ve etkilerini daha iyi kavramaya yardımcı olur.`
        },
        {
          id: "history-geo-question-2",
          type: "question",
          question: `${prompt} konusunun coğrafi özellikleri nelerdir?`,
          answer: "Fiziki özellikler, bölgesel dağılım ve çevresel faktörler",
          explanation: `${prompt} konusunun coğrafi boyutunu anlamak, mekânsal ilişkileri ve çevresel etkileşimleri açıklamaya yardımcı olur.`
        },
        {
          id: "history-geo-question-3",
          type: "question",
          question: `${prompt} konusunun kültürel etkisi nedir?`,
          answer: "Toplumsal yapılar, gelenekler ve kültürel miras",
          explanation: `${prompt} konusunun kültürel bağlamını anlamak, toplumsal etkileri ve değerleri kavramak için önemlidir.`
        }
      ];
      
    case "ekonomi ve finans":
      return [
        {
          id: "econ-finance-question-1",
          type: "question",
          question: `${prompt} konusunun ekonomik temelleri nelerdir?`,
          answer: "Ekonomik modeller, piyasa dinamikleri ve temel kavramlar",
          explanation: `${prompt} konusundaki ekonomik ilkeleri anlamak, finansal kararlar ve piyasa davranışlarını yorumlamak için önemlidir.`
        },
        {
          id: "econ-finance-question-2",
          type: "question",
          question: `${prompt} konusunda finansal analiz nasıl yapılır?`,
          answer: "Finansal göstergeler, analiz yöntemleri ve karar mekanizmaları",
          explanation: `${prompt} konusunda finansal analizin doğru yapılması, sağlıklı ekonomik kararlar almanın temelidir.`
        },
        {
          id: "econ-finance-question-3",
          type: "question",
          question: `${prompt} konusunun küresel ekonomideki yeri nedir?`,
          answer: "Uluslararası ticaret, küresel trendler ve ekonomik etkileşimler",
          explanation: `${prompt} konusunun küresel ekonomi içindeki rolünü anlamak, makroekonomik etkileri ve uluslararası ilişkileri değerlendirmek için önemlidir.`
        }
      ];
      
    case "bilgisayar ve yazılım":
      return [
        {
          id: "comp-software-question-1",
          type: "question",
          question: `${prompt} konusunda programlama yaklaşımları nelerdir?`,
          answer: "Programlama dilleri, algoritma tasarımı ve uygulama geliştirme",
          explanation: `${prompt} konusunda yazılım geliştirme süreçlerini anlamak, etkili çözümler üretmek için gereklidir.`
        },
        {
          id: "comp-software-question-2",
          type: "question",
          question: `${prompt} konusunda veri yapıları ve algoritmaların önemi nedir?`,
          answer: "Veri organizasyonu, işleme yöntemleri ve performans optimizasyonu",
          explanation: `${prompt} konusunda doğru veri yapıları ve algoritmaların seçimi, yazılım performansı ve kaynak kullanımı açısından kritiktir.`
        },
        {
          id: "comp-software-question-3",
          type: "question",
          question: `${prompt} konusunun yazılım endüstrisindeki uygulamaları nelerdir?`,
          answer: "Endüstri standardı çözümler, yazılım projeleri ve teknolojik trendler",
          explanation: `${prompt} konusunun gerçek dünya yazılım uygulamalarını incelemek, teorik bilgilerin pratikte nasıl kullanıldığını anlamak için önemlidir.`
        }
      ];
      
    default: // genel veya tanımlanmamış konular için
      return [
        {
          id: "general-question-1",
          type: "question",
          question: `${prompt} konusunun temel ilkeleri nelerdir?`,
          answer: "Temel kavramlar, prensipler ve metodolojiler",
          explanation: `${prompt} konusunu anlamak için öncelikle temel ilkeleri ve kavramsal çerçeveyi kavramak gerekir.`
        },
        {
          id: "general-question-2",
          type: "question",
          question: `${prompt} konusunda yaygın uygulamalar nelerdir?`,
          answer: "Sektörel uygulamalar, pratik örnekler ve vaka çalışmaları",
          explanation: `${prompt} konusunun uygulamada nasıl kullanıldığını görmek, teorik bilgileri pekiştirmeye yardımcı olur.`
        },
        {
          id: "general-question-3",
          type: "question",
          question: `${prompt} konusunun gelecekteki gelişimi nasıl olabilir?`,
          answer: "Trendler, potansiyel gelişmeler ve yenilikçi yaklaşımlar",
          explanation: `${prompt} konusunun gelecekteki yönelimlerini anlamak, alandaki değişimlere hazırlıklı olmak için önemlidir.`
        }
      ];
  }
}
