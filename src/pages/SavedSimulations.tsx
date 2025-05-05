
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const SavedSimulations = () => {
  const navigate = useNavigate();
  
  // Mock saved simulations
  const savedSimulations = [
    { 
      id: '1', 
      title: 'How Photosynthesis Works', 
      date: '2024-05-03',
      description: 'Understanding the process of converting light energy to chemical energy in plants.'
    },
    { 
      id: '2', 
      title: 'The Water Cycle Process', 
      date: '2024-05-01',
      description: 'Exploring how water moves through the Earth's systems in a continuous cycle.'
    },
    { 
      id: '3', 
      title: 'Supply and Demand Economics', 
      date: '2024-04-28',
      description: 'Learning the fundamental economic principles that drive market behaviors.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4">Your Saved Simulations</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            All of your previously generated learning simulations are saved here for you to revisit.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {savedSimulations.map(simulation => (
            <Card key={simulation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{simulation.title}</h3>
                <p className="text-sm text-slate-500 mb-4">Created on {simulation.date}</p>
                <p className="text-slate-600 mb-6">{simulation.description}</p>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" className="mr-2">Delete</Button>
                  <Button size="sm" onClick={() => navigate(`/simulation/${simulation.id}`)}>View</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center mt-10">
          <Button size="lg" onClick={() => navigate('/')}>
            Create New Simulation
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SavedSimulations;
