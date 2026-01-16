
import React from 'react';
import { LayoutDashboard, CheckSquare, Layers } from 'lucide-react';
import { Locale, translations } from '../translations';

interface MobileBottomNavProps {
  activeTab: 'dashboard' | 'tasks' | 'projects';
  setActiveTab: (tab: 'dashboard' | 'tasks' | 'projects') => void;
  locale: Locale;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab, locale }) => {
  const t = translations[locale];
  
  const navItems = [
    { id: 'dashboard', label: locale === 'ar' ? 'الرئيسية' : 'Home', icon: LayoutDashboard },
    { id: 'tasks', label: t.tasks, icon: CheckSquare },
    { id: 'projects', label: t.projects, icon: Layers },
  ];

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around h-20 px-4 pb-4 pt-2 z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] backdrop-blur-md bg-white/90 ${locale === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id as any)}
          className={`flex flex-col items-center justify-center flex-1 space-y-1 transition-all ${
            activeTab === item.id ? 'text-blue-600 scale-110' : 'text-gray-400'
          }`}
        >
          <div className={`p-2 rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-50' : ''}`}>
            <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
          </div>
          <span className={`text-[9px] font-black uppercase tracking-widest ${activeTab === item.id ? 'opacity-100' : 'opacity-60'}`}>
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default MobileBottomNav;
