
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
    const { prompt } = await req.json();
    
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    // Construct the prompt for Gemini - now in Turkish
    const geminiPrompt = `
      Şu konu hakkında etkileşimli bir öğrenme simülasyonu oluştur: "${prompt}". 
      
      Yanıtını aşağıdaki yapıda bir JSON nesnesi olarak formatla:
      {
        "title": "Simülasyon için ilgi çekici bir başlık",
        "scenario": "Öğrenciyi kavramın içine sokan birinci şahıs bir senaryo",
        "steps": ["Adım 1 açıklaması", "Adım 2 açıklaması", ...],
        "explanation": "Kavramın net ve özlü bir açıklaması",
        "questions": ["Düşündürücü soru 1", "Düşündürücü soru 2", ...],
        "interactiveElements": [
          {
            "id": "benzersiz-id",
            "type": "slider|button|toggle|input",
            "label": "Kullanıcı dostu etiket",
            "description": "Bu etkileşimli öğenin ne yaptığı",
            "min": 0, (isteğe bağlı, sürgüler için)
            "max": 100, (isteğe bağlı, sürgüler için)
            "defaultValue": 50, (isteğe bağlı)
            "options": ["seçenek1", "seçenek2"], (isteğe bağlı, seçim girişleri için)
            "affects": "bunun-neyi-değiştirdiği",
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
      
      Etkileşimli öğelerin, kullanıcının anahtar değişkenleri manipüle etmesine ve anında geri bildirim görmesine olanak tanıyarak kavramı anlamasına gerçekten yardımcı olduğundan emin ol. En az 2 etkileşimli öğe dahil et.
      
      TÜM ÇIKTIYI TÜRKÇE OLARAK SAĞLA. Başlık, açıklamalar, sorular ve tüm metin Türkçe olmalıdır.
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
      throw new Error('Gemini API\'den yanıt alınamadı');
    }
    
    const content = data.candidates[0].content;
    if (!content || !content.parts || content.parts.length === 0) {
      throw new Error('Gemini API\'den geçersiz yanıt formatı');
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
      console.error("Gemini yanıtını ayrıştırma hatası:", e, textContent);
      throw new Error('Yapay zeka yanıtından simülasyon verisi ayrıştırılamadı');
    }
    
    return new Response(JSON.stringify(simulationData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('generate-simulation fonksiyonunda hata:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
