
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
        
        Kullanıcının verdiği yanıtı değerlendir. Yanıt doğru mu, yoksa yanlış mı? Eğer doğruysa neden doğru olduğunu, yanlışsa neden yanlış olduğunu açıkla. Yanıtın sadece şekilsel olarak farklı yazılmış ancak matematiksel olarak eşdeğer olma ihtimalini de göz önünde bulundur (örneğin: 2x yerine 2*x yazılması gibi).
        
        Kullanıcıya yanıtının değerlendirmesi hakkında bilgi ver. Açıklamanda, türev alma kurallarını hatırlatarak eğitici bir yaklaşım sergile. Kısa ve öz olarak, matematiksel terimleri herkesin anlayabileceği şekilde açıklayarak yanıtını ver.
        
        Cevabını JSON formatında değil, düz metin olarak ver. Sadece değerlendirme metni döndür.
      `;

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
      
      // Extract text content from Gemini's response
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from Gemini API');
      }
      
      const content = data.candidates[0].content;
      if (!content || !content.parts || content.parts.length === 0) {
        throw new Error('Invalid response format from Gemini API');
      }
      
      const feedbackText = content.parts[0].text;
      
      return new Response(JSON.stringify({ feedback: feedbackText }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Normal simülasyon oluşturma isteği
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    // Gemini için yanıt dilini Türkçe olarak belirten komut ekleme
    const geminiPrompt = `
      Lütfen yanıtını tamamen Türkçe olarak ver.
      
      Şu konu hakkında etkileşimli bir öğrenme simülasyonu oluştur: "${prompt}". 
      
      Yanıtını aşağıdaki yapıda bir JSON nesnesi olarak formatla:
      {
        "title": "Simülasyon için ilgi çekici bir başlık",
        "scenario": "Öğrenciyi konunun merkezine koyan birinci şahıs senaryosu",
        "steps": ["1. adımın açıklaması", "2. adımın açıklaması", ...],
        "explanation": "Konunun net ve özlü bir açıklaması",
        "questions": ["Düşündürücü soru 1", "Düşündürücü soru 2", ...],
        "interactiveElements": [
          {
            "id": "benzersiz-id",
            "type": "slider|button|toggle|input",
            "label": "Kullanıcı dostu etiket",
            "description": "Bu etkileşimli öğenin ne işe yaradığı",
            "min": 0, (isteğe bağlı, kaydırıcılar için)
            "max": 100, (isteğe bağlı, kaydırıcılar için)
            "defaultValue": 50, (isteğe bağlı)
            "options": ["seçenek1", "seçenek2"], (isteğe bağlı, seçim girişleri için)
            "affects": "bu-neyi-değiştirir",
            "feedback": {
              "0": "Minimum değer için geri bildirim",
              "25": "Düşük değer için geri bildirim",
              "50": "Orta değer için geri bildirim",
              "75": "Yüksek değer için geri bildirim",
              "100": "Maksimum değer için geri bildirim"
            }
          }
        ]
      }
      
      Etkileşimli öğelerin kullanıcının kavramı anlamasına gerçekten yardımcı olduğuna emin ol, temel değişkenleri değiştirmelerine ve anında geri bildirim görmelerine izin vererek. En az 2 etkileşimli öğe dahil et. Simülasyon içerisinde kesinlikle sadece Türkçe dil kullan, hiçbir İngilizce kelime veya ifade olmasın.
      
      Eğer konu türev ile ilgiliyse, aşağıdaki konuları simülasyona dahil et:
      - Türevin temel tanımı ve geometrik yorumu
      - Sabit, kuvvet, toplam ve çarpım kuralı
      - Temel fonksiyonların türevleri
      - Pratik türev alma yöntemleri ve adımları
      - En az 3 farklı türev sorusu ve çözümleri
    `;

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
