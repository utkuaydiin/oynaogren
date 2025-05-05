
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary-600">
          OynaÖğren
        </Link>
        
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-slate-600 hover:text-primary-600 font-medium">
            Ana Sayfa
          </Link>
          <Link to="/how-it-works" className="text-slate-600 hover:text-primary-600 font-medium">
            Nasıl Çalışır
          </Link>
          <Link to="/examples" className="text-slate-600 hover:text-primary-600 font-medium">
            Örnekler
          </Link>
          {user ? (
            <>
              <Link to="/saved-simulations" className="text-slate-600 hover:text-primary-600 font-medium">
                Simülasyonlarım
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" /> Hesabım
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="h-4 w-4 mr-2" /> Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline">Giriş Yap</Button>
              </Link>
              <Link to="/auth">
                <Button>Kayıt Ol</Button>
              </Link>
            </>
          )}
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
