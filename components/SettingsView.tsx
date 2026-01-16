
import React from 'react';
import { User, Role } from '../types';
import { Locale, translations } from '../translations';
import { 
  User as UserIcon, Bell, Shield, Globe, Cpu, Moon, 
  Trash2, LogOut, ChevronRight, Check
} from 'lucide-react';

interface SettingsViewProps {
  user: User;
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, locale, setLocale }) => {
  const t = translations[locale];

  const SettingItem = ({ icon: Icon, label, value, action }: any) => (
    <div className="flex items-center justify-between p-4 sm:p-6 bg-white border border-gray-100 rounded-3xl transition-all hover:bg-gray-50 group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
          <p className="text-sm font-bold text-gray-900">{value}</p>
        </div>
      </div>
      <div className="text-gray-300 group-hover:text-blue-600 transition-colors">
        {action || <ChevronRight size={20} />}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">{t.settings}</h2>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">{locale === 'ar' ? 'تكوين مساحة العمل الخاصة بك' : 'Configure your workspace environment'}</p>
      </div>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] ml-2">{locale === 'ar' ? 'الحساب' : 'Account'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingItem icon={UserIcon} label={locale === 'ar' ? 'الاسم' : 'Profile Name'} value={user.name} />
          <SettingItem icon={Shield} label={locale === 'ar' ? 'الدور' : 'System Role'} value={user.role} />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] ml-2">{locale === 'ar' ? 'التفضيلات' : 'Preferences'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
            className="flex items-center justify-between p-4 sm:p-6 bg-blue-600 text-white rounded-3xl shadow-xl shadow-blue-200 cursor-pointer hover:scale-[1.02] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <Globe size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{locale === 'ar' ? 'اللغة' : 'Language'}</p>
                <p className="text-sm font-black">{locale === 'en' ? 'English (Global)' : 'العربية (محلي)'}</p>
              </div>
            </div>
            <div className="bg-white/20 p-2 rounded-xl"><Check size={16} /></div>
          </div>
          <SettingItem icon={Bell} label={locale === 'ar' ? 'التنبيهات' : 'Notifications'} value={locale === 'ar' ? 'مفعل' : 'Enabled'} />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] ml-2">{locale === 'ar' ? 'نظام الذكاء الاصطناعي' : 'AI Engine Config'}</h3>
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-inner">
                  <Cpu size={24} />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-lg">{locale === 'ar' ? 'MAK Brain v3.0' : 'MAK Brain v3.0'}</h4>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{locale === 'ar' ? 'مستوى الإبداع: متوازن' : 'Creativity Level: Balanced'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl">
                <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-white rounded-xl shadow-sm text-gray-900 border border-gray-100">Safe</button>
                <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500">Creative</button>
              </div>
           </div>
           
           <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="text-gray-400 italic">Connected to Gemini-3-Flash-Preview</span>
              <button className="text-blue-600 hover:underline">Re-Sync</button>
           </div>
        </div>
      </section>

      <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button className="w-full sm:w-auto px-10 py-4 rounded-2xl text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2">
          <LogOut size={16} /> {locale === 'ar' ? 'تسجيل الخروج' : 'Log Out'}
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
