
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 px-4 md:px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-300 to-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">LS</span>
          </div>
          <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary">
            LifeSim
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-slate-700 hover:text-primary-600 transition-colors">
            Home
          </Link>
          <Link to="/how-it-works" className="text-slate-700 hover:text-primary-600 transition-colors">
            How It Works
          </Link>
          <Link to="/examples" className="text-slate-700 hover:text-primary-600 transition-colors">
            Examples
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden md:flex">
            Sign In
          </Button>
          <Button className="bg-primary-600 hover:bg-primary-700">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
