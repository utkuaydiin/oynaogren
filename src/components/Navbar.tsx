
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary-600">
          LifeSim
        </Link>
        
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-slate-600 hover:text-primary-600 font-medium">
            Home
          </Link>
          <Link to="/how-it-works" className="text-slate-600 hover:text-primary-600 font-medium">
            How It Works
          </Link>
          <Link to="/examples" className="text-slate-600 hover:text-primary-600 font-medium">
            Examples
          </Link>
          <Link to="/saved-simulations" className="text-slate-600 hover:text-primary-600 font-medium">
            My Simulations
          </Link>
          <Button variant="outline">Sign In</Button>
          <Button>Sign Up</Button>
        </div>
        
        <div className="md:hidden">
          <Button variant="ghost" size="sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
