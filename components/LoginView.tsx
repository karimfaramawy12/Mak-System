
import React, { useState } from 'react';
import { Zap, Loader2 } from 'lucide-react';
import { Locale, translations } from '../translations';
import { auth, googleProvider, signInWithPopup } from '../services/firebase';

interface LoginViewProps {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ locale, setLocale }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = translations[locale];

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error(err);
      setError(locale === 'ar' ? 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.' : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-blue-100/50 border border-gray-100 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-700">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-200 mb-8">
          <Zap className="text-white fill-white" size={32} strokeWidth={3} />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">MAK</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-8">Work OS</p>
        
        <div className="space-y-4 w-full">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800">{t.welcomeBack}</h2>
            <p className="text-xs text-gray-400 font-medium mt-1">Access your enterprise workflow dashboard</p>
          </div>

          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 bg-white border-2 border-gray-100 py-4 rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all font-bold text-gray-700 shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin text-blue-600" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.712s.102-1.172.282-1.712V4.956H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.044l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.443 2.048.957 4.956l3.007 2.332C4.672 5.164 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
            )}
            <span className="text-sm">{t.signInWithGoogle}</span>
          </button>
          
          {error && <p className="text-red-500 text-[10px] font-bold mt-2">{error}</p>}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-50 w-full flex flex-col items-center">
          <button 
            onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
            className="text-[9px] font-black uppercase tracking-widest text-blue-600 hover:underline"
          >
            {locale === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
          </button>
          <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-6">&copy; 2025 MAK Enterprises</p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
