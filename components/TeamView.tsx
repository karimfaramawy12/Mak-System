
import React, { useState } from 'react';
import { User, Department, Task, Priority, Role } from '../types';
import { Locale, translations } from '../translations';
import { Sparkles, Users as UsersIcon, Shield, Plus, X, Mail, UserPlus } from 'lucide-react';

interface TeamViewProps {
  users: User[];
  departments: Department[];
  tasks: Task[];
  locale: Locale;
  onAddMember: (member: User) => void;
}

const TeamView: React.FC<TeamViewProps> = ({ users, departments, tasks, locale, onAddMember }) => {
  const t = translations[locale];
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: Role.EMPLOYEE,
    deptId: departments[0]?.id || ''
  });

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.endsWith('@gmail.com') && !formData.email.includes('@mak.')) {
      // In a real app we'd show validation
    }
    
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: formData.name,
      role: formData.role,
      deptId: formData.deptId,
      // In a real scenario, this would trigger an OAuth invite email
    };
    
    onAddMember(newUser);
    setShowAddModal(false);
    setFormData({ name: '', email: '', role: Role.EMPLOYEE, deptId: departments[0]?.id || '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{t.team}</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
            {locale === 'ar' ? 'إدارة القوى العاملة والذكاء' : 'Workforce management & intelligence'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
          >
            <UserPlus size={16} strokeWidth={3} />
            {t.addTeamMember}
          </button>
          
          <div className="hidden lg:flex bg-white p-3 rounded-2xl border border-gray-100 items-center gap-4 text-gray-400">
            <Sparkles className="text-blue-200" size={20} />
            <p className="text-[10px] font-black uppercase tracking-widest">
              {locale === 'ar' ? 'تم رصد ضغط عمل عالٍ' : 'Workload detection active'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => {
          const userTasks = tasks.filter(tk => tk.assigneeId === user.id);
          const urgentTasks = userTasks.filter(tk => tk.priority === Priority.URGENT).length;
          const dept = departments.find(d => d.id === user.deptId);

          return (
            <div key={user.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:scale-[1.02] group relative">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 shadow-inner group-hover:rotate-6 transition-transform">
                    <span className="text-xl font-black">{user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900">{user.name}</h4>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{user.role}</p>
                  </div>
                </div>
                {user.role === Role.ADMIN && <Shield size={18} className="text-blue-500 opacity-40" />}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{locale === 'ar' ? 'القسم' : 'Department'}</span>
                  <span className="text-[10px] font-black text-gray-700">{dept?.name}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-2xl">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.total}</p>
                    <p className="text-xl font-black text-gray-900">{userTasks.length}</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-2xl">
                    <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">{t.urgent}</p>
                    <p className="text-xl font-black text-red-600">{urgentTasks}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{locale === 'ar' ? 'السعة الحالية' : 'Current Capacity'}</span>
                    <span className={`text-[10px] font-black ${userTasks.length > 5 ? 'text-red-500' : 'text-green-500'}`}>
                      {userTasks.length * 20}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${userTasks.length > 5 ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(userTasks.length * 20, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">{t.addTeamMember}</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-gray-400 hover:text-red-500 transition-all"><X size={20} strokeWidth={3} /></button>
            </div>
            <form onSubmit={handleAddMemberSubmit} className="p-8 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t.fullName}</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Ahmed Ali" 
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:border-blue-500 outline-none font-bold" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t.enterEmail}</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="email" 
                    required 
                    placeholder="user@gmail.com" 
                    className="w-full pl-12 pr-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:border-blue-500 outline-none font-bold" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t.selectDept}</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-bold appearance-none" 
                    value={formData.deptId} 
                    onChange={(e) => setFormData({...formData, deptId: e.target.value})}
                  >
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t.selectRole}</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-bold appearance-none" 
                    value={formData.role} 
                    onChange={(e) => setFormData({...formData, role: e.target.value as Role})}
                  >
                    {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="pt-6 flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 rounded-2xl transition-colors">{t.discard}</button>
                <button type="submit" className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-xl transition-all">{t.addTeamMember}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamView;
