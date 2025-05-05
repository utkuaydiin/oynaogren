
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12">OynaÖğren Nasıl Çalışır?</h1>
          
          <div className="max-w-3xl mx-auto space-y-12">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary-700">Deneyimsel Öğrenmenin Bilimi</h2>
              <p className="text-slate-600">
                Araştırmalar, en iyi yaparak öğrendiğimizi tutarlı bir şekilde göstermektedir. Materyal ile 
                deneyim yoluyla aktif olarak etkileşime girdiğimizde, daha iyi anlama ve akılda tutmaya yol açan 
                daha güçlü sinirsel bağlantılar oluşturuyoruz. OynaÖğren, kavramları ilk elden deneyimlemenizi 
                sağlayan etkileyici simülasyonlar oluşturarak bu ilkeden yararlanır.
              </p>
            </section>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">1</div>
                  <h3 className="text-xl font-medium mb-2">Konunuzu Girin</h3>
                  <p className="text-slate-500">
                    Bize ne öğrenmek istediğinizi söyleyin. En iyi sonuçlar için spesifik olun.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">2</div>
                  <h3 className="text-xl font-medium mb-2">Yapay Zeka Simülasyon Üretir</h3>
                  <p className="text-slate-500">
                    Yapay zekamız, öğrenme ihtiyaçlarınıza göre özelleştirilmiş bir simülasyon senaryosu oluşturur.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">3</div>
                  <h3 className="text-xl font-medium mb-2">Deneyimleyin ve Öğrenin</h3>
                  <p className="text-slate-500">
                    Simülasyon adımlarını takip edin ve anlayışınızı pekiştirmek için yansıtma sorularını yanıtlayın.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary-700">OynaÖğren'in Arkasındaki Teknoloji</h2>
              <p className="text-slate-600">
                OynaÖğren, özellikle eğitim simülasyonları üretmek için eğitilmiş en gelişmiş yapay zeka modelini kullanır. 
                Bu model, çeşitli alanlardaki karmaşık konuları anlar ve soyut kavramları hayata geçiren senaryolar 
                oluşturmayı bilir.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;
