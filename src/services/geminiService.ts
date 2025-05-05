
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
  type: 'slider' | 'button' | 'toggle' | 'input';
  label: string;
  description: string;
  min?: number;
  max?: number;
  defaultValue?: number | string | boolean;
  options?: string[];
  affects?: string;
  feedback?: {[key: string]: string};
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
  
  if (lowercasePrompt.includes("photosynthesis")) {
    return {
      title: "Photosynthesis: From Sunlight to Sugar",
      scenario: "You're a photon of light that has just traveled 93 million miles from the sun and hit a leaf on a maple tree. Your journey is about to begin as you help transform carbon dioxide and water into glucose and oxygen.",
      steps: [
        "As a photon, you strike a chlorophyll molecule in a chloroplast, energizing an electron that starts the process.",
        "The energized electron moves through the electron transport chain, helping to produce ATP and NADPH.",
        "These energy carriers move to the Calvin cycle where they help convert CO2 into glucose.",
        "For each glucose molecule created, six molecules of water are split, releasing six O2 molecules as a byproduct.",
        "The glucose produced is either used immediately by the plant for energy or stored as starch for later use."
      ],
      explanation: "Photosynthesis is the process plants use to convert light energy into chemical energy stored in glucose. This process occurs in the chloroplasts, primarily in the leaves. The overall equation is 6CO2 + 6H2O + light energy → C6H12O6 + 6O2. The process has two main stages: light-dependent reactions that convert sunlight to ATP and NADPH, and the Calvin cycle that uses these products to create glucose from carbon dioxide.",
      questions: [
        "What would happen to the photosynthesis process if there was no sunlight available?",
        "Why do plants appear green to our eyes?",
        "How might increasing atmospheric CO2 levels affect photosynthesis rates?",
        "How does photosynthesis differ between various types of plants?"
      ],
      interactiveElements: [
        {
          id: "light-intensity",
          type: "slider",
          label: "Light Intensity",
          description: "Adjust the amount of sunlight reaching the leaf",
          min: 0,
          max: 100,
          defaultValue: 50,
          affects: "photosynthesis-rate",
          feedback: {
            "0": "Without light, photosynthesis stops completely. The plant cannot produce glucose.",
            "25": "With low light, photosynthesis occurs at a reduced rate. Many plants can still survive but growth is limited.",
            "50": "Moderate light allows photosynthesis to occur at a steady rate.",
            "75": "Bright light increases the rate of photosynthesis, assuming other factors aren't limiting.",
            "100": "Maximum sunlight. If water and CO2 are available, photosynthesis reaches its peak rate."
          }
        },
        {
          id: "co2-level",
          type: "slider",
          label: "CO2 Concentration",
          description: "Change the concentration of carbon dioxide available",
          min: 0,
          max: 100,
          defaultValue: 40,
          affects: "photosynthesis-rate",
          feedback: {
            "0": "Without CO2, photosynthesis cannot proceed regardless of light availability.",
            "20": "Low CO2 levels limit the rate of photosynthesis even if light is abundant.",
            "40": "Current atmospheric CO2 levels (approximately 400ppm).",
            "70": "Elevated CO2 levels can increase photosynthesis rates in many plants.",
            "100": "Very high CO2 concentrations. Some plants benefit while others may not show additional gains."
          }
        }
      ]
    };
  }
  
  // Default generic simulation
  return {
    title: `Understanding ${prompt}`,
    scenario: `You're about to explore and experience ${prompt} through an interactive simulation.`,
    steps: [
      "Step 1: Observe the initial conditions and components involved.",
      "Step 2: Interact with the key elements to see cause and effect relationships.",
      "Step 3: Manipulate variables to see how they influence outcomes.",
      "Step 4: Connect the observed patterns to the underlying principles.",
      "Step 5: Apply your understanding to predict new outcomes in different scenarios."
    ],
    explanation: `This simulation helps you understand ${prompt} through direct experience rather than abstract concepts. By engaging with the process actively, you form stronger neural connections and develop intuitive understanding of how the system works.`,
    questions: [
      "What surprised you most about this process?",
      "How does this connect to other concepts you already understand?",
      "What would happen if one of the key variables changed significantly?",
      "How might this knowledge be applied in a real-world situation?"
    ],
    interactiveElements: [
      {
        id: "variable-1",
        type: "slider",
        label: "Primary Variable",
        description: "Adjust the main variable to see how it affects the outcome",
        min: 0,
        max: 100,
        defaultValue: 50,
        affects: "result-1",
        feedback: {
          "0": "At minimum levels, the system behaves differently because...",
          "25": "At low levels, you can observe that...",
          "50": "At medium levels, the balance creates...",
          "75": "At high levels, the system starts to...",
          "100": "At maximum levels, you'll notice that..."
        }
      }
    ]
  };
}
