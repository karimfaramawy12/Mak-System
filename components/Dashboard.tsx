
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  CheckCircle2, Clock, AlertCircle, TrendingUp, Calendar, ArrowRight, Check, X
} from 'lucide-react';
import { Task, Project, Department, Priority, Status, User } from '../types';
import { USERS } from '../data/mockData';
import { Locale, translations } from '../translations';

interface DashboardProps {
  stats: any;
  tasks: Task[];
  projects: Project[];
  departments: Department[];
  onUpdateStatus: (id: string, status: Status) => void;
  onNavigate: (statusFilter?: string) => void;
  onViewTask: (id: string) => void;
  locale: Locale;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard: React.FC<DashboardProps> = ({ stats, tasks, projects, departments, onUpdateStatus, onNavigate, onViewTask, locale }) => {
  const [activeKpi, setActiveKpi] = useState<string | null>(null);
  const [pieActiveIndex, setPieActiveIndex] = useState<number | null>(null);
  const t = translations[locale];

  const statusData = [
    { name: t.todo, value: stats.todo },
    { name: t.inProgress, value: stats.inProgress },
    { name: t.review, value: stats.review },
    { name: t.completed, value: stats.completed },
  ];

  const deptData = departments.map(dept => ({
    name: dept.name,
    tasks: tasks.filter(t => t.deptId === dept.id).length
  }));

  const filteredTasksForFeed = useMemo(() => {
    let result = [...tasks];
    const today = new Date().toISOString().split('T')[0];

    if (activeKpi === 'Total') {
      result = result.filter(t => true);
    } else if (activeKpi === 'Completed') {
      result = result.filter(t => t.status === Status.COMPLETED);
    } else if (activeKpi === 'Overdue') {
      result = result.filter(t => t.dueDate < today && t.status !== Status.COMPLETED);
    } else if (activeKpi === 'Priority') {
      result = result.filter(t => t.priority === Priority.URGENT || t.priority === Priority.HIGH);
    }

    if (pieActiveIndex !== null) {
      // In a real app we'd map back translated names to internal enum values
      const statusMap: Record<string, Status> = {
        [t.todo]: Status.TODO,
        [t.inProgress]: Status.IN_PROGRESS,
        [t.review]: Status.REVIEW,
        [t.completed]: Status.COMPLETED,
      };
      const selectedStatus = statusMap[statusData[pieActiveIndex].name];
      result = result.filter(t => t.status === selectedStatus);
    }

    return result
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 10);
  }, [tasks, activeKpi, pieActiveIndex, t]);

  const priorityColor = (p: Priority) => {
    switch(p) {
      case Priority.URGENT: return 'text-red-600 bg-red-50';
      case Priority.HIGH: return 'text-orange-600 bg-orange-50';
      case Priority.MEDIUM: return 'text-blue-600 bg-blue-50';
      case Priority.LOW: return 'text-gray-500 bg-gray-50';
    }
  };

  const getPriorityLabel = (p: Priority) => {
    switch(p) {
      case Priority.URGENT: return t.urgent_p;
      case Priority.HIGH: return t.high;
      case Priority.MEDIUM: return t.medium;
      case Priority.LOW: return t.low;
    }
  };

  const handlePieClick = (_: any, index: number) => {
    setPieActiveIndex(pieActiveIndex === index ? null : index);
    setActiveKpi(null);
  };

  const handleKpiClick = (type: string) => {
    setActiveKpi(activeKpi === type ? null : type);
    setPieActiveIndex(null);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight">{locale === 'ar' ? 'مرحباً، كريم' : 'Welcome, Karim'}</h1>
          <p className="text-gray-400 text-[10px] mt-1 font-black uppercase tracking-widest">{locale === 'ar' ? 'نظام تشغيل MAK' : 'MAK Work OS Engine'}</p>
        </div>
        <div className="inline-flex items-center space-x-2 text-[10px] bg-green-50 text-green-700 px-3 py-1.5 rounded-full font-black border border-green-100 uppercase tracking-wider self-start sm:self-auto">
          <TrendingUp size={12} strokeWidth={3} className={locale === 'ar' ? 'ml-1' : 'mr-1'} />
          <span>{t.growth} +12.4%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <button onClick={() => handleKpiClick('Total')} className={`bg-white p-4 md:p-6 rounded-3xl shadow-sm border text-left transition-all hover:scale-[1.02] active:scale-95 ${activeKpi === 'Total' ? 'border-blue-500 ring-4 ring-blue-50' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl hidden md:block">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{t.total}</p>
              <p className="text-2xl font-black">{stats.total}</p>
            </div>
          </div>
        </button>
        <button onClick={() => handleKpiClick('Completed')} className={`bg-white p-4 md:p-6 rounded-3xl shadow-sm border text-left transition-all hover:scale-[1.02] active:scale-95 ${activeKpi === 'Completed' ? 'border-green-500 ring-4 ring-green-50' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-xl hidden md:block">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{t.done}</p>
              <p className="text-2xl font-black">{stats.completed}</p>
            </div>
          </div>
        </button>
        <button onClick={() => handleKpiClick('Overdue')} className={`bg-white p-4 md:p-6 rounded-3xl shadow-sm border text-left transition-all hover:scale-[1.02] active:scale-95 ${activeKpi === 'Overdue' ? 'border-red-500 ring-4 ring-red-50' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-xl hidden md:block">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{t.alerts}</p>
              <p className="text-2xl font-black text-red-600">{stats.overdue}</p>
            </div>
          </div>
        </button>
        <button onClick={() => handleKpiClick('Priority')} className={`bg-white p-4 md:p-6 rounded-3xl shadow-sm border text-left transition-all hover:scale-[1.02] active:scale-95 ${activeKpi === 'Priority' ? 'border-purple-500 ring-4 ring-purple-50' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl hidden md:block">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{t.urgent}</p>
              <p className="text-2xl font-black">{stats.urgent}</p>
            </div>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        <div className="xl:col-span-2 flex flex-col space-y-4">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-1">
            <div className="p-5 md:p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <h3 className="font-black text-base md:text-lg text-gray-900">
                  {activeKpi ? t[activeKpi.toLowerCase() as keyof typeof t] + " " + t.tasks : pieActiveIndex !== null ? `${statusData[pieActiveIndex].name}` : t.priorityFeed}
                </h3>
                {(activeKpi || pieActiveIndex !== null) && (
                  <button onClick={() => { setActiveKpi(null); setPieActiveIndex(null); }} className="text-[9px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg text-gray-600 flex items-center gap-1 font-black uppercase tracking-wider">
                    <X size={10} strokeWidth={3} /> {t.reset}
                  </button>
                )}
              </div>
              <button onClick={() => onNavigate()} className="text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:underline group">
                {t.board} <ArrowRight size={14} strokeWidth={3} className={`group-hover:translate-x-1 transition-transform ${locale === 'ar' ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <div className="divide-y divide-gray-50 flex-1 min-h-[350px]">
              {filteredTasksForFeed.map(t_obj => (
                <div key={t_obj.id} onClick={() => onViewTask(t_obj.id)} className="p-4 md:p-5 flex items-center justify-between hover:bg-blue-50/50 transition-all group relative cursor-pointer active:scale-[0.99]">
                  <div className="flex items-center space-x-4 overflow-hidden">
                    <div className={`w-1.5 h-10 rounded-full shrink-0 ${locale === 'ar' ? 'ml-4' : 'mr-4'} ${t_obj.priority === Priority.URGENT ? 'bg-red-500' : t_obj.priority === Priority.HIGH ? 'bg-orange-500' : 'bg-blue-500'}`} />
                    <div className="truncate">
                      <p className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors truncate">{t_obj.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] text-gray-400 font-bold flex items-center gap-1"><Calendar size={10} /> {t_obj.dueDate}</span>
                        <span className="text-[8px] font-black text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">{projects.find(p => p.id === t_obj.projectId)?.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="hidden sm:flex flex-col items-end mx-2">
                       <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest mb-1 ${priorityColor(t_obj.priority)}`}>{getPriorityLabel(t_obj.priority)}</span>
                    </div>
                    {t_obj.status !== Status.COMPLETED ? (
                      <button onClick={(e) => { e.stopPropagation(); onUpdateStatus(t_obj.id, Status.COMPLETED); }} className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-300 hover:bg-green-500 hover:text-white transition-all active:scale-90"><Check size={18} strokeWidth={3} /></button>
                    ) : (
                       <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100"><Check size={18} strokeWidth={4} /></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 min-h-[400px]">
            <h3 className="font-black text-base text-gray-900 mb-6">{t.distribution}</h3>
            <div className="h-64 md:h-80 w-full" style={{ minHeight: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value" onClick={handlePieClick} stroke="none">
                    {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="cursor-pointer outline-none transition-all duration-300" />)}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: '900', fontSize: '9px', textTransform: 'uppercase' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-blue-600 p-6 rounded-3xl shadow-2xl text-white relative overflow-hidden group">
            <h4 className="font-black text-[10px] mb-3 flex items-center gap-2 relative uppercase tracking-[0.2em]"><TrendingUp size={14} strokeWidth={3} /> {t.aiIntelligence}</h4>
            <p className="text-xs text-blue-100 leading-relaxed relative font-bold">
              {locale === 'ar' ? 'تم رصد زيادة في ضغط العمل في قسم اللوجستيات. يرجى مراجعة المهام المتأخرة لتجنب أي تعطل في سير العمل.' : 'Spike detected in Logistics workload. Review overdue tasks to prevent chain disruption.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
