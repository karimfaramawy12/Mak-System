
import React from 'react';
import { 
  X, Calendar, User as UserIcon, Layers, Briefcase, Clock 
} from 'lucide-react';
import { Task, Status, Priority, User, Project, Department } from '../types';
import { Locale, translations } from '../translations';

interface TaskDetailModalProps {
  task: Task;
  users: User[];
  projects: Project[];
  departments: Department[];
  onClose: () => void;
  onUpdateStatus: (id: string, status: Status) => void;
  onUpdatePriority: (id: string, priority: Priority) => void;
  locale: Locale;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ 
  task, 
  users, 
  projects, 
  departments, 
  onClose,
  onUpdateStatus,
  onUpdatePriority,
  locale
}) => {
  const t = translations[locale];
  const assignee = users.find(u => u.id === task.assigneeId);
  const project = projects.find(p => p.id === task.projectId);
  const department = departments.find(d => d.id === task.deptId);

  const getStatusLabel = (s: Status) => {
    switch(s) {
      case Status.TODO: return t.todo;
      case Status.IN_PROGRESS: return t.inProgress;
      case Status.REVIEW: return t.review;
      case Status.COMPLETED: return t.completed;
    }
  };

  const getPriorityLabel = (p: Priority) => {
    switch(p) {
      case Priority.LOW: return t.low;
      case Priority.MEDIUM: return t.medium;
      case Priority.HIGH: return t.high;
      case Priority.URGENT: return t.urgent_p;
    }
  };

  const priorityColors: Record<Priority, string> = {
    [Priority.URGENT]: 'text-red-700 bg-red-50 border-red-100',
    [Priority.HIGH]: 'text-orange-700 bg-orange-50 border-orange-100',
    [Priority.MEDIUM]: 'text-blue-700 bg-blue-50 border-blue-100',
    [Priority.LOW]: 'text-slate-600 bg-slate-50 border-slate-100',
  };

  return (
    <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-md flex items-end sm:items-center justify-center z-[110] p-0 sm:p-4">
      <div className="bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] animate-in slide-in-from-bottom-20 duration-500">
        <div className="px-6 sm:px-8 py-5 border-b border-gray-50 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur">
          <div className="flex items-center space-x-2">
            <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border mx-1 ${priorityColors[task.priority]}`}>{getPriorityLabel(task.priority)}</div>
            <div className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-700 mx-1">{getStatusLabel(task.status)}</div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 transition-all"><X size={24} strokeWidth={3} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-8">{task.title}</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-8 mb-10">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t.owner}</p>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-black border border-blue-200 mx-1">{assignee?.name.charAt(0)}</div>
                <p className="text-xs font-bold text-gray-800">{assignee?.name}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t.deadline}</p>
              <div className="flex items-center space-x-2 text-gray-800">
                <Calendar size={18} className="text-blue-500 mx-1" strokeWidth={2.5} />
                <p className="text-xs font-bold">{task.dueDate}</p>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <section>
              <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <Clock size={16} className="text-blue-600" strokeWidth={3} /> {t.briefing}
              </h4>
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed font-bold">{task.description}</p>
              </div>
            </section>
            <section>
              <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-4">{t.stateControl}</h4>
              <div className="space-y-6">
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">{t.status}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(Status).map(s => (
                      <button key={s} onClick={() => onUpdateStatus(task.id, s)} className={`text-[10px] font-black uppercase tracking-widest py-3 px-4 rounded-xl border transition-all ${task.status === s ? 'bg-blue-600 text-white border-blue-600 shadow-xl' : 'bg-white text-gray-500 border-gray-100'}`}>
                        {getStatusLabel(s)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <div className="px-6 sm:px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between pb-8 sm:pb-5">
          <button onClick={onClose} className="w-full sm:w-auto bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-800 shadow-xl active:scale-95">
            {t.dismiss}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
