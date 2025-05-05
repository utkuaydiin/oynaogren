
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import InteractiveElements from '@/components/InteractiveElements';
import { SimulationData } from '@/services/geminiService';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SimulationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [simulation, setSimulation] = useState<SimulationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSimulation = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('simulations')
          .select('content')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Simülasyon bulunamadı");

        setSimulation(data.content);
      } catch (error: any) {
        toast({
          title: "Hata",
          description: "Simülasyon yüklenirken bir hata oluştu",
          variant: "destructive",
        });
        navigate('/saved-simulations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimulation();
  }, [id, navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <p className="text-lg">Simülasyon yükleniyor...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!simulation) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Simülasyon Bulunamadı</h2>
            <Button onClick={() => navigate('/saved-simulations')}>
              Simülasyonlarıma Dön
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <Button 
          variant="outline" 
          onClick={() => navigate('/saved-simulations')}
          className="mb-6"
        >
          &larr; Simülasyonlarıma Dön
        </Button>
        
        <Card className="w-full max-w-3xl mx-auto overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-primary-50 to-accent p-6 border-b border-slate-100">
              <h3 className="text-2xl font-bold">{simulation.title}</h3>
              <p className="text-slate-600 mt-2">Etkileşimli öğrenme simülasyonu</p>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">Senaryo</h4>
                <p className="text-slate-600">{simulation.scenario}</p>
              </div>
              
              <Separator className="my-6" />
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">Simülasyon Adımları</h4>
                <ol className="list-decimal list-inside space-y-3">
                  {simulation.steps.map((step, index) => (
                    <li key={index} className="text-slate-600">{step}</li>
                  ))}
                </ol>
              </div>
              
              <Separator className="my-6" />
              
              {simulation.interactiveElements && simulation.interactiveElements.length > 0 && (
                <>
                  <InteractiveElements elements={simulation.interactiveElements} />
                  <Separator className="my-6" />
                </>
              )}
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">Açıklama</h4>
                <p className="text-slate-600">{simulation.explanation}</p>
              </div>
              
              <Separator className="my-6" />
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">Düşündürücü Sorular</h4>
                <ul className="list-disc list-inside space-y-2">
                  {simulation.questions.map((question, index) => (
                    <li key={index} className="text-slate-600">{question}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default SimulationDetail;
