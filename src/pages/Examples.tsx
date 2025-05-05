
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const exampleSimulations = [
  {
    title: "Photosynthesis: From Sunlight to Sugar",
    description: "Experience the journey of a photon as it helps transform CO2 and water into glucose and oxygen.",
    category: "Biology",
    difficulty: "Beginner",
  },
  {
    title: "Supply and Demand: Market Forces in Action",
    description: "Run a bakery and experience firsthand how pricing affects your inventory and profits.",
    category: "Economics",
    difficulty: "Intermediate",
  },
  {
    title: "The Water Cycle: Earth's Recycling System",
    description: "Follow a water molecule's journey through evaporation, condensation, precipitation and collection.",
    category: "Environmental Science",
    difficulty: "Beginner",
  },
  {
    title: "Neural Networks: Building a Simple Classifier",
    description: "Create a neural network from scratch and see how it learns to recognize patterns.",
    category: "Computer Science",
    difficulty: "Advanced",
  },
  {
    title: "Newton's Laws of Motion in Action",
    description: "Experiment with forces and see how they affect the motion of objects in various scenarios.",
    category: "Physics",
    difficulty: "Intermediate",
  },
  {
    title: "DNA Replication: The Copy Machine of Life",
    description: "Witness how DNA unzips and creates exact copies of itself during cell division.",
    category: "Molecular Biology",
    difficulty: "Advanced",
  },
];

const Examples = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-6">Example Simulations</h1>
          <p className="text-center text-slate-600 max-w-2xl mx-auto mb-12">
            Browse our library of pre-built learning simulations across various fields of study. 
            These examples show the power of experiential learning.
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
                    View Simulation
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-slate-600 mb-4">
              Don't see what you're looking for? Create a custom simulation!
            </p>
            <Button onClick={() => navigate('/')} className="px-6">
              Create Your Own
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Examples;
