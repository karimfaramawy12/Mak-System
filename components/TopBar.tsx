
import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User as UserIcon, Zap, Languages, Check, Clock } from 'lucide-react';
import { User, Notification } from '../types';
import { Locale, translations } from '../translations';

interface TopBarProps {
  user: User;
  stats: any;
  locale: Locale;
  setLocale: (l: Locale) => void;
  notifications: Notification[];
  onMarkRead: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ user, stats, locale, setLocale, notifications, onMarkRead }) => {
  const t = translations[locale];
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 shrink-0">
      {/* Mobile Logo */}
      <div className="flex md:hidden items-center space-x-3 mr-4">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
          <Zap className="text-white fill-white" size={18} strokeWidth={3} />
        </div>
        <span className="text-lg font-black tracking-tighter text-gray-900 uppercase">MAK</span>
      </div>

      <div className="flex items-center flex-1 max-w-xs sm:max-w-md">
        <div className="relative w-full group">
          <Search className={`${locale === 'ar' ? 'right-3' : 'left-3'} absolute top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors`} size={18} />
          <input 
            type="text" 
            placeholder={t.search} 
            className={`w-full ${locale === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-sm font-medium`}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Language Switcher */}
        <button 
          onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all text-xs font-black uppercase tracking-widest text-gray-600"
        >
          <Languages size={14} className="text-blue-600" />
          <span className="hidden sm:inline">{locale === 'en' ? 'Arabic' : 'English'}</span>
          <span className="sm:hidden">{locale === 'en' ? 'AR' : 'EN'}</span>
        </button>

        <div className="hidden lg:flex items-center space-x-4 px-2">
          <div className="text-right">
            <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black">{t.overdue}</p>
            <p className={`text-sm font-black ${stats.overdue > 0 ? 'text-red-500' : 'text-gray-900'}`}>{stats.overdue}</p>
          </div>
          <div className="h-8 w-px bg-gray-100 mx-2"></div>
          <div className="text-right">
            <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black">{t.today}</p>
            <p className="text-sm font-black text-gray-900">{stats.dueToday}</p>
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all ${stats.unreadNotifications > 0 ? 'animate-pulse' : ''}`}
          >
            <Bell size={20} />
            {stats.unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">
                {stats.unreadNotifications}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className={`absolute top-full mt-2 ${locale === 'ar' ? 'left-0' : 'right-0'} w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[100]`}>
              <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">{t.notifications}</h3>
                <button onClick={onMarkRead} className="text-[9px] font-black text-blue-600 hover:underline uppercase tracking-tighter">{t.markAllRead}</button>
              </div>
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-10 text-center">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{t.noNotifications}</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`p-4 border-b border-gray-50 hover:bg-blue-50/30 transition-colors relative ${!n.read ? 'bg-blue-50/10' : ''}`}>
                      {!n.read && <div className={`absolute top-5 ${locale === 'ar' ? 'right-2' : 'left-2'} w-1.5 h-1.5 bg-blue-600 rounded-full`} />}
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          n.type === 'assignment' ? 'bg-blue-100 text-blue-600' : 
                          n.type === 'status' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          <Zap size={14} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] font-black text-gray-900 leading-tight">{n.title}</p>
                          <p className="text-[10px] text-gray-500 font-bold mt-1 leading-snug">{n.message}</p>
                          <div className="flex items-center gap-1 mt-2 text-gray-400">
                            <Clock size={10} />
                            <span className="text-[9px] font-black uppercase tracking-tighter">{formatTime(n.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className={`flex items-center space-x-3 ${locale === 'ar' ? 'border-r pr-4' : 'border-l pl-4'} border-gray-100`}>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-gray-900 leading-tight">{user.name}</p>
            <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">{user.role}</p>
          </div>
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
            <UserIcon size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
