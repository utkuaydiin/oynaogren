
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import SimulationPrompt from '@/components/SimulationPrompt';
import SimulationDisplay from '@/components/SimulationDisplay';
import { generateSimulation, SimulationResult } from '@/services/simulationService';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const { toast } = useToast();

  const handleGenerateSimulation = async (prompt: string) => {
    setIsGenerating(true);
    
    try {
      window.scrollTo({
        top: document.getElementById('simulation-section')?.offsetTop ?? 0,
        behavior: 'smooth',
      });
      
      const result = await generateSimulation(prompt);
      setSimulation(result);
      
      toast({
        title: "Simülasyon Oluşturuldu",
        description: "Öğrenme simülasyonunuz hazır!",
      });
    } catch (error) {
      console.error("Simülasyon oluşturulurken hata:", error);
      toast({
        title: "Oluşturma Başarısız",
        description: "Simülasyon oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <section className="py-12 md:py-16 px-4" id="simulation-section">
          <div className="container mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Öğrenme Simülasyonunuzu Oluşturun</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Öğrenmek istediğiniz bir konuyu girin ve daha iyi anlamanıza yardımcı olacak 
                etkileşimli bir simülasyon oluşturalım.
              </p>
            </div>
            
            <SimulationPrompt 
              onGenerateSimulation={handleGenerateSimulation}
              isGenerating={isGenerating}
            />
            
            <SimulationDisplay 
              simulation={simulation} 
              isLoading={isGenerating} 
            />
          </div>
        </section>
        
        <Features />
        
        <section className="py-16 bg-primary-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Öğrenme Şeklinizi Dönüştürmeye Hazır mısınız?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              Konuları sadece okumak yerine simülasyonlar aracılığıyla deneyimleyen binlerce öğrenciye katılın.
            </p>
            <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-md">
              Hemen Başla
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
