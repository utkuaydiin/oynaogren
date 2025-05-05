
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Brain, Lightbulb, Play } from 'lucide-react';

const features = [
  {
    title: 'Experiential Learning',
    description: 'Learn by doing through interactive simulations that bring abstract concepts to life.',
    icon: <Play className="h-6 w-6 text-primary" />,
  },
  {
    title: 'Custom Scenarios',
    description: 'Generate personalized learning simulations for any topic you want to understand.',
    icon: <Lightbulb className="h-6 w-6 text-primary" />,
  },
  {
    title: 'Knowledge Retention',
    description: 'Research shows we retain up to 90% of what we experience versus just 10% of what we read.',
    icon: <Brain className="h-6 w-6 text-primary" />,
  },
  {
    title: 'Learning Library',
    description: 'Access a growing collection of pre-built simulations across various subjects.',
    icon: <Book className="h-6 w-6 text-primary" />,
  },
];

const Features = () => {
  return (
    <section className="w-full py-12 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Why Learn Through Simulation?</h2>
            <p className="mt-4 text-lg text-gray-500">
              LifeSim transforms how you learn by creating immersive experiences that make complex topics easy to understand.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-md">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
