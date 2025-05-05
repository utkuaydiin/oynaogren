
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const SimulationPrompt: React.FC<{
  onGenerateSimulation: (prompt: string) => void;
  isGenerating: boolean;
}> = ({ onGenerateSimulation, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (prompt.trim().length < 5) {
      toast({
        title: "Prompt too short",
        description: "Please enter a more detailed learning topic",
        variant: "destructive",
      });
      return;
    }
    
    onGenerateSimulation(prompt);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 rounded-xl bg-white shadow-lg border border-slate-100">
      <h2 className="text-xl font-semibold mb-4">What would you like to learn today?</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Input
            placeholder="E.g., How photosynthesis works, Understanding compound interest, Learning the basics of quantum physics..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-3 text-base"
            disabled={isGenerating}
          />
          <p className="text-xs text-slate-500 mt-1">
            Be specific about what you'd like to understand through simulation
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button 
            type="submit" 
            className="w-full md:w-auto"
            size="lg"
            disabled={isGenerating}
          >
            {isGenerating ? "Generating Simulation..." : "Create Learning Simulation"}
          </Button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          <p className="text-sm text-slate-500 w-full text-center mb-2">Try one of these examples:</p>
          {[
            "How does photosynthesis work?",
            "Explain supply and demand",
            "The water cycle process",
            "How a combustion engine works"
          ].map((example) => (
            <Button
              key={example}
              variant="outline"
              className="text-xs"
              size="sm"
              onClick={() => setPrompt(example)}
              disabled={isGenerating}
            >
              {example}
            </Button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default SimulationPrompt;
