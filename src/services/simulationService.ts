
// This is a mock service that simulates API calls to a generative AI model
// In a real implementation, this would connect to the Gemini 2.0 Flash API

export interface SimulationResult {
  title: string;
  scenario: string;
  steps: string[];
  explanation: string;
  questions: string[];
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock examples for common topics
const simulationExamples: Record<string, SimulationResult> = {
  "How does photosynthesis work?": {
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
    ]
  },
  "Explain supply and demand": {
    title: "Supply and Demand: Market Forces in Action",
    scenario: "You're the manager of a small bakery that sells fresh bread daily. When you price your bread too high, you end up with unsold inventory. When you price it too low, you sell out quickly but miss profit opportunities.",
    steps: [
      "You start by setting your bread price at $5 and notice you sell 100 loaves daily with 20 left unsold.",
      "You lower the price to $4 and now sell all 120 loaves, plus have customers asking for more.",
      "You increase production to 150 loaves but keep the $4 price, selling all inventory and maximizing profits.",
      "A wheat shortage occurs, increasing your costs. You must raise prices to $5 again.",
      "At $5, you now sell only 90 loaves because customers have alternatives."
    ],
    explanation: "Supply and demand is the economic model describing how prices are determined in a market. The law of demand states that, if all other factors remain equal, as the price of a good increases, consumer demand for the good decreases. The law of supply states that as the price of a good increases, the quantity supplied also increases. The equilibrium price is where these two curves intersect - where the quantity demanded equals the quantity supplied.",
    questions: [
      "What happens to the market if the government imposes a price ceiling below the equilibrium price?",
      "How might a technological innovation that reduces production costs affect the supply curve?",
      "What factors might cause both supply and demand to change simultaneously?",
      "How do supply and demand principles apply to the labor market?"
    ]
  },
  "The water cycle process": {
    title: "The Water Cycle: Earth's Recycling System",
    scenario: "You are a water molecule that has been on Earth for billions of years, constantly moving through the water cycle. Your journey never ends as you transform from liquid to vapor to solid and back again.",
    steps: [
      "You begin as a water molecule in the ocean, absorbing energy from the sun until you evaporate into water vapor.",
      "Rising into the atmosphere, the air temperature cools, causing you to condense into a tiny droplet in a cloud (condensation).",
      "As the cloud grows heavier with water droplets, you fall as precipitation - either rain, snow, or hail.",
      "Landing on a mountaintop as snow, you remain frozen until spring when you melt and flow downhill in a stream (runoff).",
      "Some water molecules seep into the ground (infiltration), while you continue downstream into rivers and eventually back to the ocean."
    ],
    explanation: "The water cycle, also known as the hydrologic cycle, describes the continuous movement of water on, above, and below the Earth's surface. It is a complex system that includes many different processes: evaporation, transpiration, condensation, precipitation, infiltration, runoff, and groundwater flow. This cycle is powered by solar energy and gravity. It purifies water, replenishes the land with freshwater, and transports minerals across the globe.",
    questions: [
      "How might climate change affect different stages of the water cycle?",
      "Why do some regions of Earth receive more precipitation than others?",
      "What role do plants play in the water cycle?",
      "How do human activities like dam building and urbanization affect the natural water cycle?"
    ]
  }
};

export const generateSimulation = async (prompt: string): Promise<SimulationResult> => {
  // Simulate API delay
  await delay(3000);
  
  // Check if we have a pre-made example for this prompt
  const lowercasePrompt = prompt.toLowerCase().trim();
  
  for (const [key, simulation] of Object.entries(simulationExamples)) {
    if (lowercasePrompt.includes(key.toLowerCase())) {
      return simulation;
    }
  }
  
  // If no exact match, generate a generic simulation
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
    ]
  };
};
