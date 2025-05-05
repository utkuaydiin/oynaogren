
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">OynaÖğren</h3>
            <p className="text-slate-300">
              Etkileşimli öğrenme deneyimleri ile karmaşık konuları kolayca anlayın.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Hızlı Bağlantılar</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-300 hover:text-white">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-slate-300 hover:text-white">
                  Nasıl Çalışır
                </Link>
              </li>
              <li>
                <Link to="/examples" className="text-slate-300 hover:text-white">
                  Örnekler
                </Link>
              </li>
              <li>
                <Link to="/saved-simulations" className="text-slate-300 hover:text-white">
                  Simülasyonlarım
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">İletişim</h4>
            <p className="text-slate-300">
              Sorularınız mı var? Bize ulaşın!
            </p>
            <p className="text-slate-300 mt-2">
              info@oynagren.com
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-700 text-center">
          <p className="text-slate-400">
            &copy; {new Date().getFullYear()} OynaÖğren. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
