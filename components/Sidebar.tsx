
import React from 'react';
import { LayoutDashboard, CheckSquare, Layers, Settings, Users, BarChart3, Zap } from 'lucide-react';
import { Locale, translations } from '../translations';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  locale: Locale;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, locale }) => {
  const t = translations[locale];
  
  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'tasks', label: t.tasks, icon: CheckSquare },
    { id: 'projects', label: t.projects, icon: Layers },
  ];

  const bottomItems = [
    { id: 'team', label: t.team, icon: Users },
    { id: 'reports', label: t.reports, icon: BarChart3 },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0 shrink-0">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Zap className="text-white fill-white" size={20} strokeWidth={3} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-gray-900 leading-none">MAK</span>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-600 mt-1">Work OS</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${
              activeTab === item.id 
                ? 'bg-blue-50 text-blue-600 font-bold shadow-sm shadow-blue-100/50' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span className="text-sm font-black">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-1">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-blue-50 text-blue-600 font-bold shadow-sm shadow-blue-100/50' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span className="text-sm font-bold">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
