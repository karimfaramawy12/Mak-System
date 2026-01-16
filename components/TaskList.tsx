
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Filter, MoreVertical, Calendar, User as UserIcon, X, ArrowRight, ArrowLeft, UserPlus, Trash2 } from 'lucide-react';
import { Task, Status, Priority, Department, Project, User } from '../types';
import { Locale, translations } from '../translations';

interface TaskListProps {
  tasks: Task[];
  onUpdateStatus: (id: string, status: Status) => void;
  onUpdateAssignee: (id: string, userId: string) => void;
  onAddTask: (task: Task) => void;
  onViewTask: (id: string) => void;
  departments: Department[];
  projects: Project[];
  users: User[];
  locale: Locale;
  filters: any;
  setFilters: any;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onUpdateStatus, 
  onUpdateAssignee,
  onAddTask,
  onViewTask,
  departments,
  projects,
  users,
  locale,
  filters,
  setFilters
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeMenuTaskId, setActiveMenuTaskId] = useState<string | null>(null);
  const [activeAssigneeTaskId, setActiveAssigneeTaskId] = useState<string | null>(null);
  const t = translations[locale];
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: Priority.MEDIUM,
    assigneeId: users[0]?.id || '',
    deptId: departments[0]?.id || '',
    projectId: projects[0]?.id || '',
    dueDate: new Date().toISOString().split('T')[0]
  });

  const priorityColors: Record<Priority, string> = {
    [Priority.URGENT]: 'bg-red-500',
    [Priority.HIGH]: 'bg-orange-500',
    [Priority.MEDIUM]: 'bg-blue-500',
    [Priority.LOW]: 'bg-slate-300',
  };

  const statusColors: Record<Status, string> = {
    [Status.TODO]: 'bg-slate-400',
    [Status.IN_PROGRESS]: 'bg-blue-500',
    [Status.REVIEW]: 'bg-purple-500',
    [Status.COMPLETED]: 'bg-green-500',
  };

  const statusFlow = [Status.TODO, Status.IN_PROGRESS, Status.REVIEW, Status.COMPLETED];

  const getStatusLabel = (s: Status) => {
    switch(s) {
      case Status.TODO: return t.todo;
      case Status.IN_PROGRESS: return t.inProgress;
      case Status.REVIEW: return t.review;
      case Status.COMPLETED: return t.completed;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    const newTask: Task = {
      id: `t-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      status: Status.TODO,
      dueDate: formData.dueDate,
      assigneeId: formData.assigneeId,
      projectId: formData.projectId,
      deptId: formData.deptId,
      createdAt: new Date().toISOString().split('T')[0],
      tags: [],
    };
    onAddTask(newTask);
    setShowAddModal(false);
    setFormData({
      title: '',
      description: '',
      priority: Priority.MEDIUM,
      assigneeId: users[0]?.id || '',
      deptId: departments[0]?.id || '',
      projectId: projects[0]?.id || '',
      dueDate: new Date().toISOString().split('T')[0]
    });
  };

  const renderTaskCard = (task: Task) => {
    const assignee = users.find(u => u.id === task.assigneeId);
    const project = projects.find(p => p.id === task.projectId);
    const currentIndex = statusFlow.indexOf(task.status);
    const hasNext = currentIndex < statusFlow.length - 1;
    const hasPrev = currentIndex > 0;

    return (
      <div 
        key={task.id} 
        onClick={() => onViewTask(task.id)}
        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all group mb-4 relative overflow-visible cursor-pointer active:scale-[0.98]"
      >
        <div className={`absolute top-0 bottom-0 w-1 ${locale === 'ar' ? 'right-0' : 'left-0'} ${priorityColors[task.priority]}`} />
        
        <div className="flex justify-between items-start mb-2 px-1">
          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest truncate max-w-[120px]">{project?.name}</span>
          
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveMenuTaskId(activeMenuTaskId === task.id ? null : task.id); setActiveAssigneeTaskId(null); }}
              className="p-1 hover:bg-gray-100 rounded-lg text-gray-300 hover:text-gray-600 transition-colors"
            >
              <MoreVertical size={14} />
            </button>
            
            {activeMenuTaskId === task.id && (
              <div className={`absolute top-full mt-1 ${locale === 'ar' ? 'left-0' : 'right-0'} w-40 bg-white shadow-2xl rounded-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95`}>
                <p className="px-3 py-1 text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 border-b border-gray-50">{locale === 'ar' ? 'تغيير الحالة' : 'Move to'}</p>
                {statusFlow.map(s => (
                  <button 
                    key={s}
                    onClick={(e) => { e.stopPropagation(); onUpdateStatus(task.id, s); setActiveMenuTaskId(null); }}
                    className={`w-full text-left ${locale === 'ar' ? 'text-right' : 'text-left'} px-3 py-2 text-[10px] font-bold hover:bg-blue-50 transition-colors flex items-center justify-between ${task.status === s ? 'text-blue-600 bg-blue-50/50' : 'text-gray-600'}`}
                  >
                    {getStatusLabel(s)}
                    <div className={`w-2 h-2 rounded-full ${statusColors[s]}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <h4 className="font-bold text-gray-900 text-sm mb-4 px-1 leading-snug group-hover:text-blue-600 transition-colors">{task.title}</h4>
        
        <div className="flex items-center justify-between px-1">
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveAssigneeTaskId(activeAssigneeTaskId === task.id ? null : task.id); setActiveMenuTaskId(null); }}
              className="flex items-center -space-x-1 group/assign"
            >
              <div className="w-7 h-7 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 border-2 border-white text-[9px] font-black group-hover/assign:border-blue-200 transition-all">
                {assignee?.name.charAt(0) || <UserIcon size={12} />}
              </div>
              <div className="w-7 h-7 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 border-2 border-white opacity-0 group-hover/assign:opacity-100 transition-all">
                <UserPlus size={10} />
              </div>
            </button>

            {activeAssigneeTaskId === task.id && (
              <div className={`absolute bottom-full mb-2 ${locale === 'ar' ? 'right-0' : 'left-0'} w-48 bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-bottom-2`}>
                <div className="p-3 bg-gray-50 border-b border-gray-100">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{locale === 'ar' ? 'تعيين إلى' : 'Assign to'}</p>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {users.map(u => (
                    <button 
                      key={u.id}
                      onClick={(e) => { e.stopPropagation(); onUpdateAssignee(task.id, u.id); setActiveAssigneeTaskId(null); }}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 text-[10px] font-bold hover:bg-blue-50 transition-colors ${task.assigneeId === u.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                    >
                      <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-[8px] font-black">{u.name.charAt(0)}</div>
                      <span className="truncate">{u.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasPrev && (
              <button 
                onClick={(e) => { e.stopPropagation(); onUpdateStatus(task.id, statusFlow[currentIndex - 1]); }}
                className="w-7 h-7 rounded-lg border border-gray-100 text-gray-400 hover:text-blue-500 hover:bg-blue-50 flex items-center justify-center transition-all active:scale-90"
              >
                {locale === 'ar' ? <ArrowRight size={12} /> : <ArrowLeft size={12} />}
              </button>
            )}
            {hasNext && (
              <button 
                onClick={(e) => { e.stopPropagation(); onUpdateStatus(task.id, statusFlow[currentIndex + 1]); }}
                className="w-7 h-7 rounded-lg border border-gray-100 text-gray-400 hover:text-blue-500 hover:bg-blue-50 flex items-center justify-center transition-all active:scale-90"
              >
                {locale === 'ar' ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
              </button>
            )}
            <div className="flex items-center text-[9px] text-gray-400 font-black uppercase tracking-tighter bg-gray-50 px-2 py-1 rounded-lg border border-gray-100/50">
              <Calendar size={10} className={locale === 'ar' ? 'ml-1' : 'mr-1'} />
              {task.dueDate.split('-').slice(1).join('/')}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{t.kanban}</h2>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-0.5">{t.workflowVis}</p>
        </div>
        <div className="flex items-center space-x-2">
           <div className="bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center mx-1">
            <Filter size={12} className="text-gray-400 mx-2" />
            <select value={filters.dept} onChange={(e) => setFilters.dept(e.target.value)} className="bg-transparent border-none text-[9px] font-black uppercase tracking-widest py-0.5 focus:ring-0 outline-none cursor-pointer">
              <option value="all">{t.allDept}</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <button onClick={() => setShowAddModal(true)} className="flex items-center justify-center h-10 px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 font-black text-[10px] uppercase tracking-widest active:scale-95">
            <Plus size={16} strokeWidth={3} className={locale === 'ar' ? 'ml-2' : 'mr-2'} />
            <span>{t.new}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide">
        <div className={`flex gap-4 md:gap-8 min-w-[1000px] md:min-w-full h-full items-start ${locale === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          {statusFlow.map((status) => {
            const statusTasks = tasks.filter(t_obj => t_obj.status === status);
            return (
              <div key={status} className="flex-1 min-w-[300px] bg-gray-100/30 rounded-[2.5rem] flex flex-col border border-gray-200/40 p-1">
                <div className="p-5 flex items-center justify-between sticky top-0 z-10">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3.5 h-3.5 rounded-full ${statusColors[status]} border-2 border-white shadow-sm shadow-black/5`} />
                    <h3 className="font-black text-gray-900 text-[11px] uppercase tracking-widest">{getStatusLabel(status)}</h3>
                    <span className="bg-white text-gray-400 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-gray-100 shadow-sm">{statusTasks.length}</span>
                  </div>
                </div>
                <div className="flex-1 px-4 pb-4 custom-scrollbar overflow-y-auto max-h-[calc(100vh-320px)] min-h-[400px]">
                  {statusTasks.length > 0 ? (
                    statusTasks.map(renderTaskCard)
                  ) : (
                    <div className="h-32 border-2 border-dashed border-gray-200/50 rounded-3xl flex items-center justify-center mb-4">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{locale === 'ar' ? 'لا توجد مهام' : 'Empty column'}</p>
                    </div>
                  )}
                  <button onClick={() => setShowAddModal(true)} className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:text-blue-500 hover:border-blue-300 hover:bg-blue-50/30 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 group">
                    <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
                    <span>{locale === 'ar' ? 'إضافة مهمة' : 'New Task'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">{t.newAssignment}</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-gray-400 hover:text-red-500 transition-all"><X size={20} strokeWidth={3} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{locale === 'ar' ? 'عنوان المهمة' : 'Task Title'}</label>
                <input type="text" required placeholder="What needs to be done?" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold transition-all" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t.priority}</label>
                  <select className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold appearance-none cursor-pointer" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value as Priority})}>
                    {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t.deadline}</label>
                  <input type="date" required className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold cursor-pointer" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{locale === 'ar' ? 'المسؤول' : 'Assign to'}</label>
                <select className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold appearance-none cursor-pointer" value={formData.assigneeId} onChange={(e) => setFormData({...formData, assigneeId: e.target.value})}>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>

              <div className="pt-6 flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 rounded-2xl transition-all">{t.discard}</button>
                <button type="submit" className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95">{t.confirmTask}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
