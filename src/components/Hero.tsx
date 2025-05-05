
import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-primary-600">
            Öğrenmeyi <span className="text-primary-600">Oyunlaştırın</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto mb-10">
            OynaÖğren ile karmaşık kavramları etkileşimli simülasyonlar aracılığıyla keşfedin ve anlamlandırın.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link to="#simulation-section">
              <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-md transform transition-all duration-200 hover:scale-105">
                Hemen Başla
              </button>
            </Link>
            <Link to="/examples">
              <button className="bg-white hover:bg-primary-50 text-primary-600 border border-primary-600 font-medium py-3 px-8 rounded-md transform transition-all duration-200 hover:scale-105">
                Örneklere Bak
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
