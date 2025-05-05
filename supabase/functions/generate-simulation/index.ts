
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
          // En az 5-6 soru ekle
        ]
      }
      
      Etkileşimli öğelerin kullanıcının kavramı anlamasına yardımcı olmalı. Simülasyon içerisinde kesinlikle sadece Türkçe dil kullan, hiçbir İngilizce kelime veya ifade olmasın.
      
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
      }
      
    } catch (e) {
      console.error("Error parsing Gemini response:", e, textContent);
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
  
  // Eğer hiçbir konu belirlenemezse genel olarak işaretleyelim
  if (topics.length === 0) {
    topics.push("genel");
  }
  
  return topics;
}
