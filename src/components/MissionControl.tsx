import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  Calendar, 
  Database, 
  Shield, 
  Zap, 
  ListChecks, 
  Search, 
  Filter, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  AlertCircle,
  AlertTriangle,
  Lock,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';
import { cn } from '../lib/utils';

interface SubTask {
  id: string;
  name: string;
  status: 'pending' | 'completed';
  dueDate?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  createdAt: string;
  userId: string;
  subtasks?: SubTask[];
  tags?: string[];
  recurring?: 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';
  dependencies?: string[]; // Array of Task IDs this task depends on
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'alert';
}

const LOCAL_USER_ID = 'sovereign_operator_01';

export const MissionControl: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [taskStatus, setTaskStatus] = useState<'pending' | 'completed'>('pending');
  const [tags, setTags] = useState<string>('');
  const [recurring, setRecurring] = useState<'none' | 'daily' | 'weekly' | 'monthly' | 'custom'>('none');
  const [subtasks, setSubtasks] = useState<Omit<SubTask, 'id'>[]>([]);
  const [dependencies, setDependencies] = useState<string[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'creationDate'>('creationDate');
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Extract unique tags for the filter dropdown
  const uniqueTags = useMemo(() => {
    const allTags = new Set<string>();
    tasks.forEach(t => t.tags?.forEach(tag => allTags.add(tag.toUpperCase())));
    return Array.from(allTags);
  }, [tasks]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('niyah_tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  // Save to localStorage
  const saveTasksToLocal = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('niyah_tasks', JSON.stringify(newTasks));
  };

  const addToast = (message: string, type: 'success' | 'alert' = 'success') => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const [showSuccessFlash, setShowSuccessFlash] = useState(false);

  const triggerSuccessFlash = () => {
    setShowSuccessFlash(true);
    setTimeout(() => setShowSuccessFlash(false), 800);
  };

  const handleCreateTask = async () => {
    if (!taskTitle) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      userId: LOCAL_USER_ID,
      title: taskTitle,
      description: taskDesc,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      priority,
      status: 'pending',
      tags: tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      recurring,
      subtasks: subtasks.map(s => ({ ...s, id: crypto.randomUUID() })),
      dependencies,
      createdAt: new Date().toISOString(),
    };
    saveTasksToLocal([newTask, ...tasks]);
    setTaskTitle('');
    setTaskDesc('');
    setDueDate('');
    setTags('');
    setRecurring('none');
    setSubtasks([]);
    setDependencies([]);
    setPriority('medium');
    addToast('DIRECTIVE_AUTHORIZED');
    triggerSuccessFlash();
  };

  const handleUpdateTask = async () => {
    if (!editingTask || !taskTitle) return;
    const updatedTasks = tasks.map(t => t.id === editingTask.id ? {
      ...t,
      title: taskTitle,
      description: taskDesc,
      dueDate: dueDate,
      priority,
      status: taskStatus,
      tags: tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      recurring,
      subtasks: subtasks.map(s => ('id' in s ? s : { ...s, id: crypto.randomUUID() as string }) as SubTask),
      dependencies,
    } : t);
    saveTasksToLocal(updatedTasks);
    setEditingTask(null);
    setTaskTitle('');
    setTaskDesc('');
    setDueDate('');
    setTags('');
    setRecurring('none');
    setSubtasks([]);
    setDependencies([]);
    setPriority('medium');
    setTaskStatus('pending');
    addToast('PROTOCOL_UPDATED');
    triggerSuccessFlash();
  };

  const toggleTaskStatus = async (id: string, currentStatus: 'pending' | 'completed') => {
    const task = tasks.find(t => t.id === id);
    if (task && task.dependencies && task.dependencies.length > 0 && currentStatus === 'pending') {
      const hasPendingDeps = tasks.some(t => task.dependencies!.includes(t.id) && t.status === 'pending');
      if (hasPendingDeps) {
        addToast('DEPENDENCIES_PENDING', 'alert');
        return;
      }
    }

    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    let updatedTasks = tasks.map(t => t.id === id ? { ...t, status: newStatus } : t);
    
    if (newStatus === 'completed' && task?.recurring && task.recurring !== 'none') {
      const nextDate = new Date(task.dueDate);
      if (task.recurring === 'daily') nextDate.setDate(nextDate.getDate() + 1);
      if (task.recurring === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
      if (task.recurring === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
      
      const recurringTask: Task = {
        id: crypto.randomUUID(),
        userId: LOCAL_USER_ID,
        title: task.title,
        description: task.description,
        dueDate: nextDate.toISOString().split('T')[0],
        priority: task.priority,
        status: 'pending',
        tags: task.tags || [],
        recurring: task.recurring,
        subtasks: task.subtasks?.map(s => ({ ...s, status: 'pending' })) || [],
        dependencies: task.dependencies || [],
        createdAt: new Date().toISOString(),
      };
      
      updatedTasks = [recurringTask, ...updatedTasks.map(t => t.id === id ? { ...t, recurring: 'none' as const } : t)];
    }

    saveTasksToLocal(updatedTasks as Task[]);
    addToast(newStatus === 'completed' ? 'OBJECTIVE_SECURED' : 'PROTOCOL_REINSTATED', 'success');
  };

  const toggleSubtask = async (taskId: string, subtaskId: string) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId && t.subtasks) {
        return {
          ...t,
          subtasks: t.subtasks.map(st => st.id === subtaskId ? { ...st, status: (st.status === 'completed' ? 'pending' : 'completed') as 'pending' | 'completed' } : st)
        };
      }
      return t;
    });
    saveTasksToLocal(updatedTasks as Task[]);
  };

  const deleteTask = async (id: string) => {
    saveTasksToLocal(tasks.filter(t => t.id !== id));
    setTaskToDelete(null);
    addToast('DIRECTIVE_PURGED', 'alert');
  };

  const startEditing = (task: Task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDesc(task.description);
    setDueDate(task.dueDate);
    setPriority(task.priority);
    setTaskStatus(task.status);
    setTags(task.tags?.join(', ') || '');
    setRecurring(task.recurring || 'none');
    setDependencies(task.dependencies || []);
    setSubtasks(task.subtasks?.map(s => ({ name: s.name, status: s.status || (s as any).completed ? 'completed' : 'pending', dueDate: s.dueDate })) || []);
  };

  const CalendarView = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
    const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    return (
      <div className="flex flex-col gap-4 animate-in fade-in duration-500 overflow-hidden h-full">
        <div className="flex items-center justify-between px-2">
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            <button 
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(d => (
            <div key={d} className="text-center text-[7px] font-black text-slate-700 pb-1">{d}</div>
          ))}
          {calendarDays.map((day, i) => {
            const dayTasks = tasks.filter(t => isSameDay(new Date(t.dueDate), day));
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, monthStart);

            return (
              <button 
                key={i} 
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "aspect-square rounded-lg border p-1 flex flex-col gap-1 transition-all relative overflow-hidden text-left",
                  !isCurrentMonth ? "opacity-10 border-transparent pointer-events-none" : "border-white/5 bg-white/[0.02] hover:border-white/20",
                  isToday && "border-[#00ffc8]/30 bg-[#00ffc8]/5",
                  isSelected && "border-[#00ffc8] bg-[#00ffc8]/10"
                )}
              >
                <span className={cn(
                  "text-[8px] font-mono",
                  isToday ? "text-[#00ffc8] font-bold" : isSelected ? "text-[#00ffc8]" : "text-white/40"
                )}>
                  {format(day, 'd')}
                </span>
                
                <div className="flex flex-col gap-0.5 mt-auto">
                  {dayTasks.slice(0, 3).map(task => (
                    <div 
                      key={task.id}
                      className={cn(
                        "h-0.5 rounded-full",
                        task.status === 'completed' ? "bg-slate-700" :
                        task.priority === 'high' ? "bg-rose-500" :
                        task.priority === 'medium' ? "bg-amber-500" : "bg-blue-500"
                      )}
                    />
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-[5px] font-black text-white/20 text-center">+{dayTasks.length - 3}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="space-y-3 pt-4 border-t border-white/5 overflow-y-auto custom-scrollbar flex-1">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-[9px] font-black text-white/40 uppercase tracking-widest pl-1">
              Directives: {format(selectedDate, 'MMM d')}
            </h4>
            <span className="text-[7px] font-mono text-white/20 uppercase">Local Ledger View</span>
          </div>
          <div className="space-y-2">
            {tasks
              .filter(t => isSameDay(new Date(t.dueDate), selectedDate))
              .map(task => (
                <div key={task.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-white/80">{task.title}</span>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[7px] font-black uppercase",
                          task.priority === 'high' ? "text-rose-500" : "text-slate-500"
                        )}>{task.priority}</span>
                        {task.recurring !== 'none' && (
                          <span className="text-[7px] text-blue-400 capitalize flex items-center gap-1">
                            <RefreshCw size={8} /> {task.recurring}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      task.status === 'completed' ? "bg-emerald-500" : "bg-rose-500 animate-pulse"
                    )} />
                  </div>
                  
                  {/* Calendar View Blockers Indicator */}
                  {task.dependencies && task.dependencies.length > 0 && (
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex items-center gap-1.5 p-1.5 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                        <AlertTriangle size={8} className="text-orange-500 animate-pulse" />
                        <span className="text-[7px] font-black uppercase text-orange-500/80">
                          Critical Blockers Locked
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 pl-2">
                        {task.dependencies.map(depId => {
                          const depTask = tasks.find(t => t.id === depId);
                          return depTask ? (
                            <div 
                              key={depId} 
                              className={cn(
                                "px-1.5 py-0.5 rounded text-[6px] font-black uppercase flex items-center gap-1",
                                depTask.status === 'completed' ? "bg-emerald-500/10 text-emerald-500/50" : "bg-orange-500/10 text-orange-400"
                              )}
                            >
                               {depTask.status === 'completed' ? <CheckCircle2 size={6} /> : <Lock size={6} />}
                               {depTask.title}
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  {task.subtasks && task.subtasks.length > 0 && (
                    <div className="flex gap-1 overflow-x-auto pb-1 mt-1 no-scrollbar">
                      {task.subtasks.map(st => (
                        <div 
                          key={st.id} 
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[6px] font-black uppercase whitespace-nowrap",
                            (st.status === 'completed' || (st as any).completed) ? "bg-emerald-500/10 text-emerald-500 line-through" : "bg-white/5 text-white/40"
                          )}
                        >
                          {st.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            }
            {tasks.filter(t => isSameDay(new Date(t.dueDate), selectedDate)).length === 0 && (
              <p className="text-center text-[9px] text-white/10 uppercase tracking-widest py-4">No Directives Assigned</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            task.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesTag = tagFilter === 'all' || task.tags?.map(t => t.toUpperCase()).includes(tagFilter);
      
      return matchesSearch && matchesStatus && matchesPriority && matchesTag;
    }).sort((a, b) => {
      if (sortBy === 'priority') {
        const pMap = { high: 0, medium: 1, low: 2 };
        return pMap[a.priority] - pMap[b.priority];
      }
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, tagFilter, sortBy]);

  return (
    <div className="w-full h-full bg-slate-50 dark:bg-[#050505] p-6 flex flex-col gap-6 border-slate-200 dark:border-[#00ffc8]/20 z-10 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase flex items-center gap-3">
            <Zap className="text-blue-600 dark:text-[#00ffc8]" size={20} />
            Tactical Logistics
          </h2>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">Operational Task Deployment</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-[#0a0a0a] rounded-lg p-0.5 border border-slate-200 dark:border-white/5">
          <button 
            onClick={() => setView('list')}
            className={cn(
              "px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-md transition-all",
              view === 'list' ? "bg-[#00ffc8]/10 text-[#00ffc8]" : "text-slate-600 hover:text-white"
            )}
          >
            LIST
          </button>
          <button 
            onClick={() => setView('calendar')}
            className={cn(
              "px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-md transition-all",
              view === 'calendar' ? "bg-[#00ffc8]/10 text-[#00ffc8]" : "text-slate-600 hover:text-white"
            )}
          >
            CALENDAR
          </button>
        </div>
      </div>
      
      {/* Task Creation / Editing Form */}
      <div className="flex flex-col gap-4 bg-white dark:bg-[#0a0a0a]/50 p-4 rounded-xl border border-slate-200 dark:border-white/5 relative overflow-hidden shrink-0 max-h-[50%] overflow-y-auto custom-scrollbar shadow-lg">
        <AnimatePresence>
          {showSuccessFlash && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-blue-600/10 dark:bg-[#00ffc8]/10 backdrop-blur-[1px] flex items-center justify-center z-20 pointer-events-none"
            >
              <div className="flex flex-col items-center gap-2">
                <CheckCircle2 className="text-blue-600 dark:text-[#00ffc8] animate-bounce" size={24} />
                <span className="text-[10px] font-black text-blue-600 dark:text-[#00ffc8] uppercase tracking-widest">Authorized</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div 
            key={editingTask ? 'edit' : 'create'}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-4"
          >
            <div className="grid gap-3">
              <div className="space-y-1">
                <label className="text-[8px] font-black text-blue-600 dark:text-[#00ffc8]/60 uppercase tracking-widest pl-1">
                  {editingTask ? 'Edit Objective' : 'Objective'}
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-[#00ffc8]/30 p-2 text-xs focus:outline-none focus:border-blue-500 dark:focus:border-[#00ffc8] text-slate-900 dark:text-white font-mono placeholder-slate-300 dark:placeholder-slate-800 rounded-lg transition-all"
                  placeholder="Objective Title..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-blue-600 dark:text-[#00ffc8]/60 uppercase tracking-widest pl-1">Description</label>
                <textarea
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-[#00ffc8]/30 p-2 text-xs focus:outline-none focus:border-blue-500 dark:focus:border-[#00ffc8] text-slate-900 dark:text-white font-mono placeholder-slate-300 dark:placeholder-slate-800 rounded-lg transition-all min-h-[60px] resize-none"
                  placeholder="Directives details..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 space-y-1">
                <label className="text-[8px] font-black text-[#00ffc8]/60 uppercase tracking-widest pl-1">Tags (Comma Sep)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#00ffc8]/30 p-2 text-xs focus:outline-none focus:border-[#00ffc8] text-white font-mono placeholder-slate-800 rounded-lg transition-all"
                  placeholder="UI, Sec, API..."
                />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-[8px] font-black text-[#00ffc8]/60 uppercase tracking-widest pl-1">Recurring</label>
                <select
                  value={recurring}
                  onChange={(e) => setRecurring(e.target.value as any)}
                  className="w-full bg-[#0a0a0a] border border-[#00ffc8]/30 p-2 text-xs focus:outline-none focus:border-[#00ffc8] text-[#00ffc8] font-black uppercase rounded-lg cursor-pointer"
                >
                  <option value="none">NONE</option>
                  <option value="daily">DAILY</option>
                  <option value="weekly">WEEKLY</option>
                  <option value="monthly">MONTHLY</option>
                  <option value="custom">CUSTOM</option>
                </select>
              </div>
            </div>

            {/* Subtasks Builder */}
            <div className="space-y-2 border border-white/5 bg-black/20 p-2 rounded-xl">
              <div className="flex items-center justify-between pl-1">
                <label className="text-[8px] font-black text-[#00ffc8]/60 uppercase tracking-widest leading-none">Sub-Directives</label>
                <button 
                  onClick={() => setSubtasks(prev => [...prev, { name: '', status: 'pending', dueDate: '' }])}
                  className="text-[#00ffc8] hover:text-white transition-colors"
                >
                  <Plus size={10} />
                </button>
              </div>
              <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
                {subtasks.map((st, i) => (
                  <div key={i} className="flex flex-col gap-1 p-2 bg-white/5 border border-white/5 rounded-lg">
                    <div className="flex gap-2">
                       <input
                        type="text"
                        value={st.name}
                        onChange={(e) => {
                          const next = [...subtasks];
                          next[i].name = e.target.value;
                          setSubtasks(next);
                        }}
                        className="flex-1 bg-black/40 border border-white/5 rounded-md p-1.5 text-[10px] text-white/70 focus:border-[#00ffc8]/40 focus:outline-none"
                        placeholder="Sub-task title..."
                      />
                      <button 
                        onClick={() => setSubtasks(prev => prev.filter((_, idx) => idx !== i))}
                        className="text-slate-700 hover:text-rose-500 transition-colors px-1"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  </div>
                ))}
                {subtasks.length === 0 && (
                  <p className="text-[7px] text-slate-800 uppercase text-center py-2 font-black tracking-widest border border-dashed border-white/5 rounded-lg">Zero Child Nodes</p>
                )}
              </div>
            </div>

            {/* Task Dependencies */}
            <div className="space-y-1">
                <label className="text-[8px] font-black text-[#00ffc8]/60 uppercase tracking-widest pl-1">Dependencies (Blockers)</label>
                <div className="grid grid-cols-1 gap-1 max-h-24 overflow-y-auto custom-scrollbar">
                   {tasks.filter(t => t.id !== editingTask?.id && t.status !== 'completed').map(task => (
                     <label key={task.id} className="flex items-center gap-2 text-[9px] text-slate-400 hover:text-white cursor-pointer bg-white/5 p-1.5 rounded-md">
                       <input 
                         type="checkbox" 
                         className="accent-[#00ffc8]"
                         checked={dependencies.includes(task.id)}
                         onChange={(e) => {
                           if (e.target.checked) setDependencies(prev => [...prev, task.id]);
                           else setDependencies(prev => prev.filter(id => id !== task.id));
                         }}
                       />
                       <span className="truncate">{task.title}</span>
                     </label>
                   ))}
                   {tasks.filter(t => t.id !== editingTask?.id && t.status !== 'completed').length === 0 && (
                      <p className="text-[7px] text-slate-800 uppercase text-center py-2 font-black tracking-widest border border-dashed border-white/5 rounded-lg">No open blocks</p>
                   )}
                </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 space-y-1">
                <label className="text-[8px] font-black text-blue-600 dark:text-[#00ffc8]/60 uppercase tracking-widest pl-1">Deadline Date</label>
                <div className="relative group">
                  <Calendar size={12} className="absolute left-2.5 top-2.5 text-blue-600 dark:text-[#00ffc8] pointer-events-none group-focus-within:animate-pulse" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-[#00ffc8]/30 p-2 pl-9 text-xs focus:outline-none focus:border-blue-500 dark:focus:border-[#00ffc8] text-slate-900 dark:text-white font-mono rounded-lg transition-all [&::-webkit-calendar-picker-indicator]:filter-[invert(1)_sepia(1)_saturate(5)_hue-rotate(200deg)] dark:[&::-webkit-calendar-picker-indicator]:filter-[invert(1)_sepia(1)_saturate(5)_hue-rotate(100deg)] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-[8px] font-black text-blue-600 dark:text-[#00ffc8]/60 uppercase tracking-widest pl-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-[#00ffc8]/30 p-2 text-xs focus:outline-none focus:border-blue-500 dark:focus:border-[#00ffc8] text-blue-600 dark:text-[#00ffc8] font-black uppercase rounded-lg cursor-pointer"
                >
                  <option value="low">LOW</option>
                  <option value="medium">MEDIUM</option>
                  <option value="high">HIGH</option>
                </select>
              </div>
              {editingTask && (
                <div className="flex-1 space-y-1">
                  <label className="text-[8px] font-black text-blue-600 dark:text-[#00ffc8]/60 uppercase tracking-widest pl-1">Status</label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-[#00ffc8]/30 p-2 text-xs focus:outline-none focus:border-blue-500 dark:focus:border-[#00ffc8] text-blue-600 dark:text-[#00ffc8] font-black uppercase rounded-lg cursor-pointer"
                  >
                    <option value="pending">PENDING</option>
                    <option value="completed">COMPLETED</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {editingTask ? (
                <>
                  <button
                    onClick={handleUpdateTask}
                    className="flex-1 bg-[#00ffc8]/10 hover:bg-[#00ffc8]/20 border border-[#00ffc8] text-[#00ffc8] py-2.5 font-black uppercase text-[9px] tracking-[0.3em] rounded-lg transition-all"
                  >
                    [ UPDATE_PROTO ]
                  </button>
                  <button
                    onClick={() => {
                      setEditingTask(null);
                      setTaskTitle('');
                      setTaskDesc('');
                      setDueDate('');
                      setPriority('medium');
                      setDependencies([]);
                    }}
                    className="px-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/50 text-rose-500 font-black uppercase text-[9px] rounded-lg transition-all"
                  >
                    CANCEL
                  </button>
                </>
              ) : (
                <button
                  onClick={handleCreateTask}
                  className="w-full bg-[#00ffc8]/10 hover:bg-[#00ffc8]/20 border border-[#00ffc8] text-[#00ffc8] py-2.5 font-black uppercase text-[9px] tracking-[0.3em] rounded-lg transition-all"
                >
                  [ AUTHORIZE DIRECTIVE ]
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Task Explorer */}
      <div className="space-y-3 shrink-0">
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 px-3 py-2 rounded-xl focus-within:border-blue-500 dark:focus-within:border-[#00ffc8]/40 transition-all">
          <Search size={14} className="text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-slate-900 dark:text-white text-xs font-mono w-full placeholder-slate-300 dark:placeholder-slate-700"
            placeholder="Search Directives..."
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex gap-1.5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="flex-1 bg-[#0a0a0a] border border-white/10 p-1.5 text-[8px] font-black uppercase text-slate-400 rounded-lg focus:border-[#00ffc8]/50"
            >
              <option value="all">ALL_STATUS</option>
              <option value="pending">PENDING</option>
              <option value="completed">COMPLETED</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="flex-1 bg-[#0a0a0a] border border-white/10 p-1.5 text-[8px] font-black uppercase text-slate-400 rounded-lg focus:border-[#00ffc8]/50"
            >
              <option value="all">ALL_PRIORITY</option>
              <option value="low">LOW</option>
              <option value="medium">MEDIUM</option>
              <option value="high">HIGH</option>
            </select>
            <select
               value={tagFilter}
               onChange={(e) => setTagFilter(e.target.value)}
               className="flex-1 bg-[#0a0a0a] border border-white/10 p-1.5 text-[8px] font-black uppercase text-slate-400 rounded-lg focus:border-[#00ffc8]/50 overflow-hidden text-ellipsis"
            >
               <option value="all">ALL_TAGS</option>
               {uniqueTags.map(tag => (
                 <option key={tag} value={tag}>{tag}</option>
               ))}
            </select>
          </div>
          <div className="flex items-center gap-2 px-1">
            <label className="text-[7px] font-black text-slate-600 uppercase tracking-widest">Sort By:</label>
            <div className="flex gap-2 flex-1">
              {[
                { id: 'creationDate', label: 'MODIFIED' },
                { id: 'dueDate', label: 'DEADLINE' },
                { id: 'priority', label: 'THREAT_LVL' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id as any)}
                  className={cn(
                    "text-[7px] font-black uppercase tracking-tighter px-2 py-1 rounded border transition-all",
                    sortBy === opt.id ? "bg-[#00ffc8]/20 border-[#00ffc8] text-[#00ffc8]" : "bg-white/5 border-white/10 text-slate-500 hover:border-white/20"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real Task List / Calendar View */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
        {view === 'calendar' ? (
          <CalendarView />
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredTasks.length === 0 ? (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  className="text-center text-[10px] font-black uppercase tracking-widest mt-10"
                >
                  [ No Matches Found ]
                </motion.p>
              ) : (
                filteredTasks.map(task => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={cn(
                      "p-4 rounded-xl border border-white/5 bg-[#0a0a0a] group relative transition-all overflow-hidden",
                      task.status === 'completed' && "opacity-60 border-[#00ffc8]/20",
                      task.priority === 'high' && "border-l-2 border-l-red-500/50 hover:shadow-[0_0_20px_-5px_rgba(239,68,68,0.15)]",
                      task.priority === 'medium' && "border-l-2 border-l-amber-500/50 hover:shadow-[0_0_20px_-5px_rgba(245,158,11,0.15)]",
                      task.priority === 'low' && "border-l-2 border-l-blue-500/50 hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.15)]"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3 relative z-10">
                      <button 
                        onClick={() => toggleTaskStatus(task.id, task.status)}
                        className="mt-1 transition-transform active:scale-75"
                      >
                        {task.status === 'completed' ? (
                          <motion.div 
                            initial={{ scale: 0, rotate: -45 }} 
                            animate={{ scale: 1.2, rotate: 0 }}
                            className="bg-[#00ffc8]/10 rounded-full p-0.5"
                          >
                            <CheckCircle2 className="w-5 h-5 text-[#00ffc8]" />
                          </motion.div>
                        ) : (
                          <Circle className="w-5 h-5 text-slate-700 hover:text-[#00ffc8] transition-colors" />
                        )}
                      </button>
                      
                      <div className="flex-1 space-y-1 relative">
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest transition-all duration-500 relative",
                            task.status === 'completed' ? "text-slate-600" : "text-white"
                          )}>
                            <div className="flex items-center gap-2">
                              {task.title}
                              {task.recurring !== 'none' && (
                                <span className="px-1 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[6px] flex items-center gap-1 font-black">
                                  <RefreshCw size={8} /> {task.recurring.toUpperCase()}
                                </span>
                              )}
                            </div>
                            {/* Animated Strikethrough Line */}
                            {task.status === 'completed' && (
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                className="absolute top-1/2 left-0 h-[1.5px] bg-[#00ffc8]/60 shadow-[0_0_8px_#00ffc8]"
                                transition={{ duration: 0.3 }}
                              />
                            )}
                          </span>
                          <span className={cn(
                            "text-[7px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider flex items-center gap-1",
                            task.priority === 'high' ? "text-red-500 border-red-500/30 bg-red-500/10" :
                            task.priority === 'medium' ? "text-amber-500 border-amber-500/30 bg-amber-500/10" :
                            "text-blue-500 border-blue-500/30 bg-blue-500/10"
                          )}>
                            {task.priority === 'high' && <AlertCircle size={8} />}
                            {task.priority === 'medium' && <Zap size={8} />}
                            {task.priority === 'low' && <Shield size={8} />}
                            {task.priority}
                          </span>
                        </div>
                        <p className={cn(
                          "text-[9px] text-slate-500 leading-tight transition-all",
                          task.status === 'completed' && "opacity-50"
                        )}>
                          {task.description}
                        </p>
                        
                        {/* Tags */}
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {task.tags.map(tag => (
                              <span key={tag} className="text-[6px] font-black bg-white/5 border border-white/10 px-1 py-0.5 rounded uppercase text-slate-500">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Subtasks Progress */}
                        {task.subtasks && task.subtasks.length > 0 && (
                          <div className="mt-2 space-y-1.5">
                            <div className="flex justify-between items-center text-[7px] font-black uppercase text-slate-600">
                              <span>Chain Integrity</span>
                              <span>{task.subtasks.filter(s => s.status === 'completed' || (s as any).completed).length}/{task.subtasks.length}</span>
                            </div>
                            <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500/40 transition-all duration-500"
                                style={{ width: `${(task.subtasks.filter(s => s.status === 'completed' || (s as any).completed).length / task.subtasks.length) * 100}%` }}
                              />
                            </div>
                            {/* Detailed Subtasks List */}
                            <div className="pl-3 border-l border-white/5 space-y-1 mt-2">
                              {task.subtasks.map(st => (
                                <button 
                                  key={st.id}
                                  onClick={() => toggleSubtask(task.id, st.id)}
                                  className="flex items-center justify-between group/st w-full text-left"
                                >
                                  <div className="flex items-center gap-2">
                                    {st.status === 'completed' || (st as any).completed ? (
                                      <CheckCircle2 size={10} className="text-[#00ffc8] shrink-0" />
                                    ) : (
                                      <Circle size={10} className="text-slate-700 group-hover/st:text-white transition-colors shrink-0" />
                                    )}
                                    <span className={cn(
                                      "text-[8px] font-mono transition-all",
                                      st.status === 'completed' || (st as any).completed ? "text-slate-600 line-through" : "text-white/40 group-hover/st:text-white/60"
                                    )}>
                                      {st.name}
                                    </span>
                                  </div>
                                  {st.dueDate && (
                                    <span className="text-[6px] text-slate-600 font-mono ml-2 shrink-0">
                                      {new Date(st.dueDate).toLocaleDateString()}
                                    </span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Task Dependencies */}
                        {task.dependencies && task.dependencies.length > 0 && (
                          <div className="flex flex-col gap-1 mt-2 p-1.5 rounded-lg bg-orange-500/5 border border-orange-500/10">
                            <span className="text-[6px] font-black uppercase text-orange-500/70">Blockers</span>
                            <div className="flex flex-wrap gap-1">
                              {task.dependencies.map(depId => {
                                const depTask = tasks.find(t => t.id === depId);
                                if (!depTask) return null;
                                return (
                                  <span key={depId} className={cn(
                                    "text-[6px] font-black px-1 py-0.5 rounded uppercase flex items-center gap-1",
                                    depTask.status === 'completed' ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/20 text-orange-400"
                                  )}>
                                    {depTask.status === 'completed' ? <CheckCircle2 size={8} /> : <AlertCircle size={8} />}
                                    {depTask.title.substring(0, 15)}...
                                  </span>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-3 pt-2 text-[7px] font-mono text-slate-600 uppercase">
                          <span className="flex items-center gap-1">
                            <Calendar size={10} />
                            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          {task.recurring && task.recurring !== 'none' && (
                            <span className="flex items-center gap-1 text-[#00ffc8]/60">
                              <RefreshCw size={10} />
                              {task.recurring}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => startEditing(task)}
                          className="p-1.5 hover:bg-[#00ffc8]/20 hover:text-[#00ffc8] rounded-lg transition-all"
                        >
                          <Target size={14} />
                        </button>
                        <button 
                          onClick={() => setTaskToDelete(task.id)}
                          className="p-1.5 hover:bg-rose-500/20 hover:text-rose-500 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Confirmation Dialog Overlay */}
      <AnimatePresence>
        {taskToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-xs w-full bg-[#0a0a0a] border border-rose-500/50 p-6 rounded-2xl shadow-2xl relative overflow-hidden"
            >
              {/* Caution Pattern */}
              <div 
                className="absolute top-0 left-0 w-full h-1 opacity-20"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f43f5e, #f43f5e 10px, transparent 10px, transparent 20px)' }}
              />
              
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-rose-500/20 rounded-xl">
                  <AlertCircle className="text-rose-500" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Conflicting_Protocol</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Destructive Operation Detected</p>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 font-mono tracking-tight leading-relaxed mb-6">
                Are you sure you want to permanently purge this directive from the local ledger? This action cannot be reversed within current epoch.
              </p>

              <div className="flex gap-3">
                <button 
                  onClick={() => setTaskToDelete(null)}
                  className="flex-1 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all bg-white/5 rounded-xl border border-white/5"
                >
                  [ ABORT ]
                </button>
                <button 
                  onClick={() => deleteTask(taskToDelete!)}
                  className="flex-1 py-3 text-[9px] font-black uppercase tracking-[0.3em] bg-rose-600 text-white rounded-xl shadow-lg shadow-rose-600/20"
                >
                  [ PURGE ]
                </button>
              </div>

              <button 
                onClick={() => setTaskToDelete(null)}
                className="absolute top-4 right-4 text-slate-700 hover:text-white"
              >
                <X size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification Mesh */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={cn(
                "px-4 py-2 rounded-xl border font-black uppercase text-[10px] tracking-widest shadow-2xl backdrop-blur-md flex items-center gap-3",
                toast.type === 'success' ? "bg-[#00ffc8]/10 border-[#00ffc8] text-[#00ffc8]" : "bg-rose-500/10 border-rose-500 text-rose-500"
              )}
            >
              <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", toast.type === 'success' ? "bg-[#00ffc8]" : "bg-rose-500")} />
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="pt-4 border-t border-white/5 space-y-3">
        <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <ListChecks size={12} /> Global Analytics
        </h3>
        
        {/* Progress Bar */}
        <div className="space-y-1.5 px-1">
          <div className="flex justify-between items-center text-[7px] font-black uppercase tracking-widest text-slate-600">
            <span>Mission Readiness</span>
            <span className="text-[#00ffc8]">
              {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0}%
            </span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 : 0}%` }}
              className="h-full bg-gradient-to-r from-[#00ffc8]/40 to-[#00ffc8] shadow-[0_0_8px_#00ffc8]"
            />
          </div>
        </div>

        <div className="flex justify-between items-center px-2">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Efficiency</span>
            <span className="text-xs font-mono text-emerald-500">92.4%</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Active_Nodes</span>
            <span className="text-xs font-mono text-blue-500">388/402</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionControl;
