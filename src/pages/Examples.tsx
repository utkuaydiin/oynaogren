
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const exampleSimulations = [
  {
    title: "Fotosentez: Güneş Işığından Şekere",
    description: "Bir fotonun CO2 ve suyu glikoz ve oksijene dönüştürmesine yardımcı olduğu yolculuğu deneyimleyin.",
    category: "Biyoloji",
    difficulty: "Başlangıç",
  },
  {
    title: "Arz ve Talep: Piyasa Güçleri",
    description: "Bir fırın işletin ve fiyatlandırmanın envanterinizi ve kârlarınızı nasıl etkilediğini birebir deneyimleyin.",
    category: "Ekonomi",
    difficulty: "Orta",
  },
  {
    title: "Su Döngüsü: Dünyanın Geri Dönüşüm Sistemi",
    description: "Bir su molekülünün buharlaşma, yoğunlaşma, yağış ve toplanma aşamalarında geçirdiği yolculuğu takip edin.",
    category: "Çevre Bilimi",
    difficulty: "Başlangıç",
  },
  {
    title: "Sinir Ağları: Basit Bir Sınıflandırıcı Oluşturma",
    description: "Sıfırdan bir sinir ağı oluşturun ve desenleri nasıl tanımayı öğrendiğini görün.",
    category: "Bilgisayar Bilimleri",
    difficulty: "İleri",
  },
  {
    title: "Newton'un Hareket Kanunları",
    description: "Kuvvetlerle deney yapın ve çeşitli senaryolarda nesnelerin hareketini nasıl etkilediklerini görün.",
    category: "Fizik",
    difficulty: "Orta",
  },
  {
    title: "DNA Replikasyonu: Hayatın Kopya Makinesi",
    description: "DNA'nın hücre bölünmesi sırasında nasıl açıldığını ve kendisinin tıpatıp kopyalarını oluşturduğuna tanık olun.",
    category: "Moleküler Biyoloji",
    difficulty: "İleri",
  },
];

const Examples = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-6">Örnek Simülasyonlar</h1>
          <p className="text-center text-slate-600 max-w-2xl mx-auto mb-12">
            Çeşitli çalışma alanlarındaki hazır öğrenme simülasyonlarımıza göz atın.
            Bu örnekler, deneyimsel öğrenmenin gücünü göstermektedir.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exampleSimulations.map((sim, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-2 ${index % 3 === 0 ? 'bg-primary' : index % 3 === 1 ? 'bg-secondary' : 'bg-accent'}`}></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{sim.title}</CardTitle>
                    <span className="text-xs px-2 py-1 bg-slate-100 rounded-full">
                      {sim.difficulty}
                    </span>
                  </div>
                  <span className="text-sm text-primary-600">{sim.category}</span>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">{sim.description}</p>
                  <Button 
                    onClick={() => navigate('/')}
                    variant="outline" 
                    className="w-full"
                  >
                    Simülasyonu Görüntüle
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-slate-600 mb-4">
              Aradığınızı bulamıyor musunuz? Özel bir simülasyon oluşturun!
            </p>
            <Button onClick={() => navigate('/')} className="px-6">
              Kendi Simülasyonunuzu Oluşturun
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Examples;
