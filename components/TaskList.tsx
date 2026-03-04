'use client';

import { Task } from '@/lib/google-sheets';
import { useState } from 'react';
import { CheckCircle2, Circle, Clock, Loader2 } from 'lucide-react';
import { updateTaskStatusAction } from '@/app/actions/transactions';

export default function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleToggle(taskId: string, currentStatus: Task['Status']) {
    const newStatus = currentStatus === 'Done' ? 'NotStarted' : 'Done';
    setLoadingId(taskId);
    
    try {
      await updateTaskStatusAction(taskId, newStatus);
      setTasks(tasks.map(t => t.TaskID === taskId ? { ...t, Status: newStatus } : t));
    } catch (e) {
      console.error(e);
      alert('Failed to update task');
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div 
          key={task.TaskID}
          className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
            task.Status === 'Done' 
              ? 'bg-stone-50 border-stone-100 opacity-60' 
              : 'bg-white border-stone-200 hover:border-emerald-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-4">
            <button 
              disabled={loadingId === task.TaskID}
              onClick={() => handleToggle(task.TaskID, task.Status)}
              className={`transition-colors ${task.Status === 'Done' ? 'text-emerald-500' : 'text-stone-300 hover:text-emerald-500'}`}
            >
              {loadingId === task.TaskID ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : task.Status === 'Done' ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </button>
            
            <div>
              <h4 className={`font-medium ${task.Status === 'Done' ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                {task.TaskName}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-stone-100 text-stone-500">
                  {task.Owner}
                </span>
                {task.DueDate && (
                  <span className="text-[10px] text-stone-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Due: {task.DueDate}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-xs font-medium text-stone-400">
            {task.Status === 'Done' ? 'Completed' : 'Pending'}
          </div>
        </div>
      ))}
      
      {tasks.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-stone-100 rounded-2xl">
          <p className="text-stone-400 italic">No tasks assigned to this transaction.</p>
        </div>
      )}
    </div>
  );
}
