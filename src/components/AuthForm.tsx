
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AuthFormProps {
  mode: 'login' | 'register';
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName
            }
          }
        });

        if (error) throw error;
        
        toast({
          title: 'Kayıt Başarılı',
          description: 'Hesabınız oluşturuldu. Lütfen e-postanızı kontrol edin.',
        });

      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: 'Giriş Başarılı',
          description: 'Hesabınıza giriş yaptınız.',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Hata',
        description: error.message || 'Bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                  Ad
                </label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                  Soyad
                </label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              E-posta
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Şifre
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? 'İşleniyor...'
              : mode === 'login'
              ? 'Giriş Yap'
              : 'Kayıt Ol'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
