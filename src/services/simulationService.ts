
import { generateSimulationWithGemini, SimulationData } from './geminiService';

export interface SimulationResult extends SimulationData {}

export const generateSimulation = async (prompt: string): Promise<SimulationResult> => {
  try {
    const result = await generateSimulationWithGemini(prompt);
    return result;
  } catch (error) {
    console.error("Error generating simulation:", error);
    throw error;
  }
};
