
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import InteractiveElements from './InteractiveElements';
import { SimulationData } from '@/services/geminiService';

interface SimulationDisplayProps {
  simulation: SimulationData | null;
  isLoading: boolean;
}

const LoadingSimulation = () => (
  <div className="space-y-6 p-4 animate-pulse">
    <div className="h-8 bg-slate-100 rounded-md w-3/4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-slate-100 rounded-md w-full"></div>
      <div className="h-4 bg-slate-100 rounded-md w-full"></div>
      <div className="h-4 bg-slate-100 rounded-md w-5/6"></div>
    </div>
    <div className="space-y-3">
      <div className="h-6 bg-slate-100 rounded-md w-1/4"></div>
      <div className="h-4 bg-slate-100 rounded-md w-full"></div>
      <div className="h-4 bg-slate-100 rounded-md w-full"></div>
      <div className="h-4 bg-slate-100 rounded-md w-3/4"></div>
    </div>
    <div className="h-10 bg-slate-100 rounded-md w-40"></div>
  </div>
);

const SimulationDisplay: React.FC<SimulationDisplayProps> = ({ simulation, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8 overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-primary-50 to-accent p-6 border-b border-slate-100">
            <h3 className="text-xl font-bold">Generating your learning simulation...</h3>
            <p className="text-slate-500">Creating an immersive experience tailored to your request</p>
          </div>
          <LoadingSimulation />
        </CardContent>
      </Card>
    );
  }

  if (!simulation) {
    return null;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8 overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-primary-50 to-accent p-6 border-b border-slate-100">
          <h3 className="text-2xl font-bold">{simulation.title}</h3>
          <p className="text-slate-600 mt-2">Interactive learning simulation</p>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2">Scenario</h4>
            <p className="text-slate-600">{simulation.scenario}</p>
          </div>
          
          <Separator className="my-6" />
          
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3">Simulation Steps</h4>
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
            <h4 className="text-lg font-semibold mb-2">Explanation</h4>
            <p className="text-slate-600">{simulation.explanation}</p>
          </div>
          
          <Separator className="my-6" />
          
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3">Reflection Questions</h4>
            <ul className="list-disc list-inside space-y-2">
              {simulation.questions.map((question, index) => (
                <li key={index} className="text-slate-600">{question}</li>
              ))}
            </ul>
          </div>
          
          <div className="flex justify-center mt-8">
            <Button className="mr-3">Save Simulation</Button>
            <Button variant="outline">Share</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationDisplay;
