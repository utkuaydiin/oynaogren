
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SavedSimulation {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

const SavedSimulations = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchSavedSimulations = async () => {
      if (!user && !loading) {
        navigate('/auth');
        return;
      }
      
      if (user) {
        try {
          const { data, error } = await supabase
            .from('simulations')
            .select('id, title, description, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          
          setSavedSimulations(data || []);
        } catch (error: any) {
          toast({
            title: "Hata",
            description: "Simülasyonlar yüklenirken bir hata oluştu",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchSavedSimulations();
  }, [user, loading, navigate, toast]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('simulations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setSavedSimulations(savedSimulations.filter(sim => sim.id !== id));
      
      toast({
        title: "Simülasyon Silindi",
        description: "Simülasyon başarıyla silindi",
      });
    } catch (error: any) {
      toast({
        title: "Hata",
        description: "Simülasyon silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  if (loading || (isLoading && user)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <p className="text-lg">Yükleniyor...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4">Kaydedilen Simülasyonlarınız</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Daha önce oluşturduğunuz tüm öğrenme simülasyonları burada kaydedilir.
          </p>
        </div>
        
        {savedSimulations.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-slate-600 mb-6">Henüz kaydedilmiş simülasyonunuz bulunmamaktadır.</p>
            <Button size="lg" onClick={() => navigate('/')}>
              Yeni Simülasyon Oluştur
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {savedSimulations.map(simulation => (
              <Card key={simulation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{simulation.title}</h3>
                  <p className="text-sm text-slate-500 mb-4">Oluşturulma: {formatDate(simulation.created_at)}</p>
                  <p className="text-slate-600 mb-6">{simulation.description}</p>
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mr-2" 
                      onClick={() => handleDelete(simulation.id)}
                    >
                      Sil
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => navigate(`/simulation/${simulation.id}`)}
                    >
                      Görüntüle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <div className="flex justify-center mt-10">
          <Button size="lg" onClick={() => navigate('/')}>
            Yeni Simülasyon Oluştur
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SavedSimulations;
