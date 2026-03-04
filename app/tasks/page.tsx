import { getTasks, getTransactions } from '@/lib/google-sheets';
import Navbar from '@/components/Navbar';
import TaskList from '@/components/TaskList';
import { format, isAfter, isBefore, addDays, parseISO } from 'date-fns';
import { CheckSquare, Clock, AlertCircle, User } from 'lucide-react';

export default async function TasksPage() {
  const tasks = await getTasks();
  const transactions = await getTransactions();
  
  const now = new Date();
  const next7Days = addDays(now, 7);

  const overdue = tasks.filter(t => 
    t.Status !== 'Done' && 
    t.DueDate && 
    isBefore(parseISO(t.DueDate), now)
  );

  const dueSoon = tasks.filter(t => 
    t.Status !== 'Done' && 
    t.DueDate && 
    isAfter(parseISO(t.DueDate), now) && 
    isBefore(parseISO(t.DueDate), next7Days)
  );

  const byOwner = (owner: string) => tasks.filter(t => t.Owner === owner && t.Status !== 'Done');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-8 max-w-5xl mx-auto w-full">
        <header className="mb-10">
          <h1 className="text-4xl font-serif italic tracking-tight text-stone-900 mb-2">Tasks</h1>
          <p className="text-stone-500">Stay on top of your coordination checklist.</p>
        </header>

        <div className="space-y-12">
          {/* Overdue */}
          {overdue.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-red-500 mb-6 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Overdue
              </h2>
              <TaskList initialTasks={overdue} />
            </section>
          )}

          {/* Due Next 7 Days */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-amber-600 mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Due Next 7 Days
            </h2>
            <TaskList initialTasks={dueSoon} />
          </section>

          {/* By Owner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
                <User className="w-4 h-4" /> Assigned to TC
              </h2>
              <TaskList initialTasks={byOwner('TC')} />
            </section>
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
                <User className="w-4 h-4" /> Assigned to Admin
              </h2>
              <TaskList initialTasks={byOwner('Admin')} />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
