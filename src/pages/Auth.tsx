
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4">OynaÖğren'e Hoş Geldiniz</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Etkileşimli öğrenme simülasyonlarıyla bilgiyi keşfedin.
          </p>
        </div>
        
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <Button 
              variant={mode === 'login' ? 'default' : 'outline'} 
              onClick={() => setMode('login')}
              className="rounded-l-md rounded-r-none"
            >
              Giriş Yap
            </Button>
            <Button 
              variant={mode === 'register' ? 'default' : 'outline'} 
              onClick={() => setMode('register')}
              className="rounded-l-none rounded-r-md"
            >
              Kayıt Ol
            </Button>
          </div>
        </div>
        
        <AuthForm mode={mode} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;
