
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

    // Construct the prompt for Gemini
    const geminiPrompt = `
      Create an interactive learning simulation about: "${prompt}". 
      
      Format your response as a JSON object with the following structure:
      {
        "title": "An engaging title for the simulation",
        "scenario": "A first-person scenario that puts the learner in the middle of the concept",
        "steps": ["Step 1 description", "Step 2 description", ...],
        "explanation": "A clear, concise explanation of the concept",
        "questions": ["Reflection question 1", "Reflection question 2", ...],
        "interactiveElements": [
          {
            "id": "unique-id",
            "type": "slider|button|toggle|input",
            "label": "User-friendly label",
            "description": "What this interactive element does",
            "min": 0, (optional, for sliders)
            "max": 100, (optional, for sliders)
            "defaultValue": 50, (optional)
            "options": ["option1", "option2"], (optional, for select inputs)
            "affects": "what-this-changes",
            "feedback": {
              "0": "Feedback for minimum value",
              "25": "Feedback for low value",
              "50": "Feedback for medium value",
              "75": "Feedback for high value",
              "100": "Feedback for maximum value"
            }
          }
        ]
      }
      
      Make sure the interactive elements truly help the user understand the concept by allowing them to manipulate key variables and see immediate feedback. Include at least 2 interactive elements.
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
