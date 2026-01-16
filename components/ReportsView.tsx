
import React, { useState } from 'react';
import { Task, Department, Project, Status } from '../types';
import { Locale, translations } from '../translations';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { Sparkles, FileText, Download, Zap, TrendingUp, Loader2, X as LucideX } from 'lucide-react';
import { getAIAssistance } from '../services/geminiService';

interface ReportsViewProps {
  tasks: Task[];
  departments: Department[];
  projects: Project[];
  locale: Locale;
}

const ReportsView: React.FC<ReportsViewProps> = ({ tasks, departments, projects, locale }) => {
  const t = translations[locale];
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  const deptStats = departments.map(d => {
    const dTasks = tasks.filter(t => t.deptId === d.id);
    const completed = dTasks.filter(t => t.status === Status.COMPLETED).length;
    return {
      name: d.name,
      total: dTasks.length,
      completed: completed,
      rate: dTasks.length > 0 ? (completed / dTasks.length) * 100 : 0
    };
  });

  const handleGenerateAIReport = async () => {
    setIsGenerating(true);
    try {
      const prompt = "Generate a comprehensive performance summary of the team. Mention specifically which department is excelling and which projects need intervention.";
      const res = await getAIAssistance(prompt, { tasks, users: [], projects, departments }, locale);
      setAiReport(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{t.reports}</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
            {locale === 'ar' ? 'تحليلات الأداء والنمو' : 'Performance analytics & growth metrics'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-100 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
            <Download size={14} /> {locale === 'ar' ? 'تصدير' : 'Export'}
          </button>
          <button 
            onClick={handleGenerateAIReport}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl disabled:opacity-50"
          >
            {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {locale === 'ar' ? 'تقرير الذكاء الاصطناعي' : 'Generate AI Insight'}
          </button>
        </div>
      </div>

      {aiReport && (
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden animate-in slide-in-from-top-4 duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="flex items-center gap-3 mb-4">
            <Zap className="text-yellow-400 fill-yellow-400" size={24} />
            <h3 className="font-black uppercase tracking-[0.2em] text-sm">{t.aiIntelligence}</h3>
            {/* The X component now correctly receives only size as className is optional */}
            <button onClick={() => setAiReport(null)} className="mr-auto text-white/50 hover:text-white"><X size={18} /></button>
          </div>
          <div className="prose prose-invert prose-sm max-w-none font-bold leading-relaxed">
            {aiReport}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-gray-900 text-lg">{locale === 'ar' ? 'إنتاجية الأقسام' : 'Dept Productivity'}</h3>
            <TrendingUp size={20} className="text-green-500" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptStats} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={9} fontWeight="900" tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis fontSize={9} fontWeight="900" tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip cursor={{fill: '#f8fafc', radius: 12}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="rate" fill="#3b82f6" radius={[10, 10, 10, 10]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-gray-900 text-lg">{locale === 'ar' ? 'زخم المشاريع' : 'Project Momentum'}</h3>
            <Zap size={20} className="text-blue-500" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projects.map(p => ({ name: p.name.split(' ')[0], val: p.progress }))} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={9} fontWeight="900" tickLine={false} axisLine={false} />
                <YAxis fontSize={9} fontWeight="900" tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="val" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;

/* Updated X component to make className optional with a default empty string value */
const X = ({ size, className = "" }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);
