
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold text-primary-600">LifeSim</Link>
            <p className="mt-2 text-slate-500">
              Experience the power of learning through simulation. 
              Transform understanding into experience.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-3">Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-slate-500 hover:text-primary-600">Home</Link></li>
              <li><Link to="/how-it-works" className="text-slate-500 hover:text-primary-600">How It Works</Link></li>
              <li><Link to="/examples" className="text-slate-500 hover:text-primary-600">Example Simulations</Link></li>
              <li><Link to="/pricing" className="text-slate-500 hover:text-primary-600">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-3">Contact</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-500 hover:text-primary-600">Support</a></li>
              <li><a href="#" className="text-slate-500 hover:text-primary-600">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} LifeSim. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
