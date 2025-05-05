
import React from 'react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Learn by <span className="text-primary-600">Living</span> It
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Experience immersive simulations that teach you new concepts 
              faster than traditional learning methods.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <div className="space-y-2 text-center">
              <Button className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 py-3 text-lg font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                Get Started
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                No credit card required. Experience the power of learning through simulation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
