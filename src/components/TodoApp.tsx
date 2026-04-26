import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Clock,
  ChevronDown,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';

interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  dueDate?: string | null;
  createdAt: string;
}

type SortOption = 'dueDate' | 'priority' | 'createdAt';
type FilterStatus = 'all' | 'pending' | 'completed';
type FilterPriority = 'all' | 'low' | 'medium' | 'high';

const LOCAL_USER_ID = 'sovereign_operator_01';

export default function MissionControl() {
  const { language } = useStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newDueDate, setNewDueDate] = useState('');

  // Filter/Sort State
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('niyah_todo_tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('niyah_todo_tasks', JSON.stringify(newTasks));
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      userId: LOCAL_USER_ID,
      title: newTitle,
      description: newDesc,
      priority: newPriority,
      status: 'pending',
      dueDate: newDueDate || null,
      createdAt: new Date().toISOString()
    };
    
    saveTasks([newTask, ...tasks]);
    setNewTitle('');
    setNewDesc('');
    setNewPriority('medium');
    setNewDueDate('');
    setShowAddForm(false);
  };

  const toggleTaskStatus = (task: Task) => {
    const newTasks = tasks.map(t => t.id === task.id ? {
      ...t,
      status: (t.status === 'completed' ? 'pending' : 'completed') as 'pending' | 'completed'
    } : t);
    saveTasks(newTasks);
  };

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id));
  };

  const priorityOrder = { high: 3, medium: 2, low: 1 };

  const filteredAndSortedTasks = tasks
    .filter(task => {
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (task.description?.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesPriority && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            {language === 'ar' ? 'غرفة العمليات' : 'Mission Control'}
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            {language === 'ar' ? 'إدارة المهام السيادية والأهداف الميدانية' : 'Manage sovereign tasks and field objectives.'}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20"
        >
          <Plus size={20} />
          <span>{language === 'ar' ? 'مهمة جديدة' : 'New Objective'}</span>
        </button>
      </div>

      {/* Add Task Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={addTask} className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                    {language === 'ar' ? 'عنوان المهمة' : 'Objective Title'}
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: فحص سيرفرات apiboli' : 'e.g., Audit apiboli servers'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                    {language === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date'}
                  </label>
                  <input
                    type="datetime-local"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                  {language === 'ar' ? 'التفاصيل' : 'Intelligence Brief'}
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل تفاصيل المهمة هنا...' : 'Enter intelligence details here...'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all min-h-[100px] resize-none"
                />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest mr-2">
                    {language === 'ar' ? 'الأولوية:' : 'Priority:'}
                  </span>
                  {(['low', 'medium', 'high'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all border",
                        newPriority === p 
                          ? getPriorityColor(p)
                          : "text-slate-500 border-slate-800 hover:border-slate-700"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 md:flex-none px-6 py-3 text-slate-400 font-bold hover:text-white transition-colors"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Abort'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 md:flex-none px-8 py-3 bg-white text-slate-950 rounded-2xl font-black hover:bg-slate-200 transition-all"
                  >
                    {language === 'ar' ? 'تأكيد المهمة' : 'Deploy Objective'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'البحث في المهام...' : 'Search objectives...'}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
          />
        </div>
        
        <div className="lg:col-span-7 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-2xl px-3 py-1.5">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="bg-transparent text-xs font-bold text-slate-300 outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-2xl px-3 py-1.5">
            <AlertCircle className="w-4 h-4 text-slate-500" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as FilterPriority)}
              className="bg-transparent text-xs font-bold text-slate-300 outline-none cursor-pointer"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-2xl px-3 py-1.5">
            <ArrowUpDown className="w-4 h-4 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-xs font-bold text-slate-300 outline-none cursor-pointer"
            >
              <option value="createdAt">Created Date</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Synchronizing Intelligence...</p>
          </div>
        ) : filteredAndSortedTasks.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-[3rem]">
            <CheckCircle2 className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No active objectives found.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {filteredAndSortedTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn(
                    "group relative p-6 bg-slate-900/40 border border-slate-800 rounded-[2rem] transition-all hover:bg-slate-900/60 hover:border-slate-700",
                    task.status === 'completed' && "opacity-60"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleTaskStatus(task)}
                      className={cn(
                        "mt-1 transition-all transform hover:scale-110",
                        task.status === 'completed' ? "text-blue-500" : "text-slate-600 hover:text-slate-400"
                      )}
                    >
                      <motion.div
                        initial={false}
                        animate={{ scale: task.status === 'completed' ? [1, 1.2, 1] : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {task.status === 'completed' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                      </motion.div>
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={cn(
                          "text-lg font-bold text-white truncate transition-all",
                          task.status === 'completed' && "line-through text-slate-500 decoration-blue-500/50 decoration-2"
                        )}>
                          {task.title}
                        </h3>
                        <span className={cn(
                          "flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border",
                          getPriorityColor(task.priority)
                        )}>
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            task.priority === 'high' ? "bg-rose-500 animate-pulse" :
                            task.priority === 'medium' ? "bg-amber-500" : "bg-blue-500"
                          )} />
                          {task.priority}
                        </span>
                      </div>
                      
                      {task.description && (
                        <p className={cn(
                          "text-sm text-slate-400 line-clamp-2 mb-4",
                          task.status === 'completed' && "line-through opacity-50"
                        )}>
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          <Clock size={12} />
                          <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                        {task.dueDate && (
                          <div className={cn(
                            "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest",
                            new Date(task.dueDate).getTime() < Date.now() && task.status === 'pending' 
                              ? "text-rose-500" 
                              : "text-slate-500"
                          )}>
                            <Calendar size={12} />
                            <span>{new Date(task.dueDate).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
