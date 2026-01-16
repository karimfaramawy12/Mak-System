
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Priority, 
  Status, 
  Role, 
  User, 
  Department, 
  Project, 
  Task,
  Notification
} from './types';
import { Locale, translations } from './translations';
import { 
  db, auth, 
  onSnapshot, collection, doc, setDoc, updateDoc, addDoc, query, orderBy, where 
} from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import AIAssistant from './components/AIAssistant';
import TaskDetailModal from './components/TaskDetailModal';
import MobileBottomNav from './components/MobileBottomNav';
import LoginView from './components/LoginView';

import TeamView from './components/TeamView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';

type TabType = 'dashboard' | 'tasks' | 'projects' | 'team' | 'reports' | 'settings';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>('en');
  
  const t = translations[locale];

  // 1. Authentication Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Real-time Data Sync
  useEffect(() => {
    if (!user) return;

    // Sync Tasks
    const tasksUnsub = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      const taskData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      setTasks(taskData);
    });

    // Sync Users
    const usersUnsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const userData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setUsers(userData);
    });

    // Sync Depts
    const deptsUnsub = onSnapshot(collection(db, 'departments'), (snapshot) => {
      const deptData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Department));
      setDepartments(deptData);
    });

    // Sync Projects
    const projsUnsub = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const projData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setProjects(projData);
    });

    // Sync Notifications for current user
    const qNotif = query(collection(db, 'notifications'), where('userId', '==', user.uid), orderBy('timestamp', 'desc'));
    const notifUnsub = onSnapshot(qNotif, (snapshot) => {
      const notifData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
      setNotifications(notifData);
    });

    return () => {
      tasksUnsub();
      usersUnsub();
      deptsUnsub();
      projsUnsub();
      notifUnsub();
    };
  }, [user]);

  const currentUser = useMemo(() => {
    if (!user) return null;
    return users.find(u => u.id === user.uid) || { 
      id: user.uid, 
      name: user.displayName || 'MAK User', 
      role: Role.EMPLOYEE, 
      deptId: 'dept-1' 
    };
  }, [user, users]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === Status.TODO).length,
      inProgress: tasks.filter(t => t.status === Status.IN_PROGRESS).length,
      review: tasks.filter(t => t.status === Status.REVIEW).length,
      completed: tasks.filter(t => t.status === Status.COMPLETED).length,
      urgent: tasks.filter(t => t.priority === Priority.URGENT).length,
      dueToday: tasks.filter(t => t.dueDate === today).length,
      overdue: tasks.filter(t => t.dueDate < today && t.status !== Status.COMPLETED).length,
      unreadNotifications: notifications.filter(n => !n.read).length
    };
  }, [tasks, notifications]);

  // Firestore Update Handlers
  const handleUpdateTaskStatus = async (taskId: string, newStatus: Status) => {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, { status: newStatus });
    
    if (newStatus === Status.COMPLETED) {
      await addNotification({
        userId: user.uid,
        title: locale === 'ar' ? 'مهمة مكتملة' : 'Task Completed',
        message: `Task updated to completed by ${user.displayName}`,
        type: 'status',
        taskId: taskId
      });
    }
  };

  const handleUpdateTaskAssignee = async (taskId: string, newAssigneeId: string) => {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, { assigneeId: newAssigneeId });
    await addNotification({
      userId: newAssigneeId,
      title: t.assignedToYou,
      message: `New task assigned to you by ${user.displayName}`,
      type: 'assignment',
      taskId: taskId
    });
  };

  const handleAddTask = async (newTask: Omit<Task, 'id'>) => {
    await addDoc(collection(db, 'tasks'), newTask);
  };

  const handleAddTeamMember = async (newMember: User) => {
    await setDoc(doc(db, 'users', newMember.id), newMember);
  };

  const addNotification = async (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    await addDoc(collection(db, 'notifications'), {
      ...notif,
      timestamp: new Date().toISOString(),
      read: false
    });
  };

  const markAllNotificationsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    for (const n of unread) {
      await updateDoc(doc(db, 'notifications', n.id), { read: true });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
    </div>
  );

  if (!user) {
    return <LoginView locale={locale} setLocale={setLocale} />;
  }

  return (
    <div 
      className="flex min-h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} locale={locale} />

      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
        <TopBar 
          user={currentUser as User} 
          stats={stats} 
          locale={locale}
          setLocale={setLocale}
          notifications={notifications}
          onMarkRead={markAllNotificationsRead}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto w-full h-full">
            {activeTab === 'dashboard' && (
              <Dashboard 
                stats={stats} 
                tasks={tasks} 
                projects={projects} 
                departments={departments}
                onUpdateStatus={handleUpdateTaskStatus}
                onNavigate={() => setActiveTab('tasks')}
                onViewTask={setSelectedTaskId}
                locale={locale}
              />
            )}

            {activeTab === 'tasks' && (
              <TaskList 
                tasks={tasks} 
                onUpdateStatus={handleUpdateTaskStatus}
                onUpdateAssignee={handleUpdateTaskAssignee}
                onAddTask={handleAddTask as any}
                onViewTask={setSelectedTaskId}
                departments={departments}
                projects={projects}
                users={users}
                locale={locale}
                filters={{ dept: 'all', proj: 'all', status: 'all' }}
                setFilters={{ dept: () => {}, proj: () => {}, status: () => {} }}
              />
            )}

            {activeTab === 'projects' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-gray-900">{t.projects}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map(p => (
                    <div key={p.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-lg text-gray-900">{p.name}</h3>
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-blue-50 text-blue-600 rounded-lg">
                          {departments.find(d => d.id === p.deptId)?.name}
                        </span>
                      </div>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                            {locale === 'ar' ? 'التقدم' : 'Progress'}
                          </span>
                          <span className="text-[10px] font-black text-blue-600">{p.progress}%</span>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-blue-100">
                          <div style={{ width: `${p.progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <TeamView 
                users={users} 
                departments={departments} 
                tasks={tasks} 
                locale={locale} 
                onAddMember={handleAddTeamMember}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsView tasks={tasks} departments={departments} projects={projects} locale={locale} />
            )}

            {activeTab === 'settings' && (
              <SettingsView user={currentUser as User} locale={locale} setLocale={setLocale} />
            )}
          </div>
        </main>

        <AIAssistant 
          locale={locale}
          context={{ 
            tasks, 
            users, 
            projects, 
            departments 
          }} 
        />

        <MobileBottomNav 
          activeTab={activeTab as any} 
          setActiveTab={setActiveTab as any} 
          locale={locale}
        />

        {selectedTaskId && tasks.find(t => t.id === selectedTaskId) && (
          <TaskDetailModal 
            task={tasks.find(t => t.id === selectedTaskId)!}
            users={users}
            projects={projects}
            departments={departments}
            onClose={() => setSelectedTaskId(null)}
            onUpdateStatus={handleUpdateTaskStatus}
            onUpdatePriority={async (id, p) => {
              await updateDoc(doc(db, 'tasks', id), { priority: p });
            }}
            locale={locale}
          />
        )}
      </div>
    </div>
  );
};

export default App;
