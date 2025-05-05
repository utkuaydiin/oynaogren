
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
          <h1 className="text-4xl font-bold text-center mb-12">How LifeSim Works</h1>
          
          <div className="max-w-3xl mx-auto space-y-12">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary-700">The Science of Experiential Learning</h2>
              <p className="text-slate-600">
                Research consistently shows that we learn best by doing. When we actively engage 
                with material through experience, we form stronger neural connections that lead 
                to better understanding and retention. LifeSim leverages this principle by creating 
                immersive simulations that let you experience concepts firsthand.
              </p>
            </section>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">1</div>
                  <h3 className="text-xl font-medium mb-2">Enter Your Topic</h3>
                  <p className="text-slate-500">
                    Tell us what you want to learn. Be specific for the best results.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">2</div>
                  <h3 className="text-xl font-medium mb-2">AI Generates Simulation</h3>
                  <p className="text-slate-500">
                    Our AI creates a custom simulation scenario tailored to your learning needs.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">3</div>
                  <h3 className="text-xl font-medium mb-2">Experience & Learn</h3>
                  <p className="text-slate-500">
                    Follow the simulation steps and answer reflection questions to solidify your understanding.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary-700">The Technology Behind LifeSim</h2>
              <p className="text-slate-600">
                LifeSim uses Gemini 2.0 Flash, a state-of-the-art AI model specifically trained to generate 
                educational simulations. This model understands complex topics across various domains and 
                knows how to create scenarios that bring abstract concepts to life.
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
