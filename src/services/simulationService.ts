
import { generateSimulationWithGemini, SimulationData } from './geminiService';
import { supabase } from '@/integrations/supabase/client';

export interface SimulationResult extends SimulationData {}

export const generateSimulation = async (prompt: string): Promise<SimulationResult> => {
  try {
    const result = await generateSimulationWithGemini(prompt);
    return result;
  } catch (error) {
    console.error("Simülasyon oluşturulurken hata:", error);
    throw error;
  }
};

export const saveSimulation = async (simulation: SimulationData, userId: string) => {
  try {
    const { data, error } = await supabase.from('simulations').insert({
      title: simulation.title,
      description: simulation.scenario,
      content: simulation,
      user_id: userId
    });

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Simülasyon kaydedilirken hata:", error);
    throw error;
  }
};

export const getSavedSimulations = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('simulations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Kaydedilen simülasyonlar alınırken hata:", error);
    throw error;
  }
};

export const getSimulationById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('simulations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Simülasyon alınırken hata:", error);
    throw error;
  }
};

export const deleteSimulation = async (id: string) => {
  try {
    const { error } = await supabase
      .from('simulations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Simülasyon silinirken hata:", error);
    throw error;
  }
};
