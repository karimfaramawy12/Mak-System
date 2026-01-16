
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Minimize2, Sparkles, Loader2 } from 'lucide-react';
import { getAIAssistance } from '../services/geminiService';
import { Task, User, Project, Department } from '../types';
import { Locale, translations } from '../translations';

interface AIAssistantProps {
  context: {
    tasks: Task[];
    users: User[];
    projects: Project[];
    departments: Department[];
  };
  locale: Locale;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ context, locale }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const t = translations[locale];
  
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      { role: 'ai', text: locale === 'ar' ? 'مرحباً! أنا مساعد MAK الخاص بك. كيف يمكنني مساعدتك اليوم؟' : "Hello! I'm your MAK Work OS assistant. How can I help with your productivity today?" }
    ]);
  }, [locale]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const response = await getAIAssistance(userText, context, locale);
      setMessages(prev => [...prev, { role: 'ai', text: response || (locale === 'ar' ? 'عذراً، لم أستطع معالجة ذلك.' : 'Sorry, I couldn\'t process that.') }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: locale === 'ar' ? 'خطأ في الاتصال بالذكاء الاصطناعي.' : 'Error connecting to the AI brain.' }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    t.quickPrompts.focus,
    t.quickPrompts.marketing,
    t.quickPrompts.overdue,
    t.quickPrompts.suggest
  ];

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 ${locale === 'ar' ? 'left-6' : 'right-6'} w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 z-50 group`}
      >
        <Bot size={28} />
        <span className={`absolute ${locale === 'ar' ? 'left-16' : 'right-16'} bg-white text-gray-900 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>
          {t.askAi}
        </span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 ${locale === 'ar' ? 'left-6' : 'right-6'} w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden flex flex-col transition-all ${isMinimized ? 'h-14' : 'h-[600px] max-h-[80vh]'}`}>
      <div className="bg-blue-600 p-4 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <Sparkles size={18} className="text-blue-200" />
          <span className="font-black text-xs uppercase tracking-widest">{t.aiIntelligence}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-blue-500 rounded-lg transition-colors"><Minimize2 size={16} /></button>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-blue-500 rounded-lg transition-colors"><X size={16} /></button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-xs font-bold leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-100 text-gray-800 shadow-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 p-3 rounded-2xl shadow-sm flex items-center space-x-2">
                  <Loader2 className="animate-spin text-blue-600" size={14} />
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{t.aiThinking}</span>
                </div>
              </div>
            )}
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-2">
            {quickPrompts.map(p => (
              <button key={p} onClick={() => setInput(p)} className="text-[9px] bg-white border border-gray-100 hover:border-blue-400 px-3 py-1.5 rounded-full text-gray-600 font-black transition-colors uppercase tracking-widest">
                {p}
              </button>
            ))}
          </div>
          <form onSubmit={handleSend} className="p-4 border-t border-gray-100 flex items-center space-x-2 shrink-0">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="..." className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2.5 text-xs font-bold outline-none focus:border-blue-500 transition-all" />
            <button type="submit" disabled={loading} className="bg-blue-600 text-white p-2.5 rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-50"><Send size={18} className={locale === 'ar' ? 'rotate-180' : ''} /></button>
          </form>
        </>
      )}
    </div>
  );
};

export default AIAssistant;
