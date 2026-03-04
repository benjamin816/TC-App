import { getTransactionById, getTasksByTransactionId } from '@/lib/google-sheets';
import Navbar from '@/components/Navbar';
import TaskList from '@/components/TaskList';
import { notFound } from 'next/navigation';
import { 
  Home, 
  MapPin, 
  User, 
  DollarSign, 
  Calendar, 
  ExternalLink, 
  FolderOpen, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default async function TransactionDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const transaction = await getTransactionById(id);
  
  if (!transaction) {
    notFound();
  }

  const tasks = await getTasksByTransactionId(id);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className={transaction.TransactionType === 'Resale' ? "text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded" : "text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-2 py-1 rounded"}>
                {transaction.TransactionType}
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                {transaction.Status}
              </span>
            </div>
            <h1 className="text-4xl font-serif italic tracking-tight text-stone-900">{transaction.Address}</h1>
            <div className="flex flex-wrap items-center gap-6 text-stone-500">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{transaction.ClientNames}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Closing: {transaction.ClosingDate}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href={transaction.DriveFolderLink || '#'} 
              target="_blank"
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <FolderOpen className="w-4 h-4 text-amber-500" />
              Drive Folder
            </a>
            <a 
              href={transaction.eXpComplianceLink || '#'} 
              target="_blank"
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Compliance
            </a>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Financial Overview */}
            <section className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Financial Overview
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <p className="text-xs text-stone-400 uppercase font-bold tracking-wider mb-1">Purchase Price</p>
                  <p className="text-2xl font-bold text-stone-900">${Number(transaction.PurchasePrice).toLocaleString()}</p>
                </div>
                {transaction.TransactionType === 'Resale' ? (
                  <>
                    <div>
                      <p className="text-xs text-stone-400 uppercase font-bold tracking-wider mb-1">DD Amount</p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold text-stone-900">${Number(transaction.DDAmount).toLocaleString()}</p>
                        {transaction.DDReceived === 'Yes' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-amber-500" />}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400 uppercase font-bold tracking-wider mb-1">EM Amount</p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold text-stone-900">${Number(transaction.EMAmount).toLocaleString()}</p>
                        {transaction.EMReceived === 'Yes' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-amber-500" />}
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="text-xs text-stone-400 uppercase font-bold tracking-wider mb-1">Builder Deposit</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-stone-900">${Number(transaction.BuilderDepositAmount).toLocaleString()}</p>
                      {transaction.BuilderDepositPaid === 'Yes' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-amber-500" />}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Task List */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Transaction Tasks
                </h2>
                <span className="text-xs text-stone-400">
                  {tasks.filter(t => t.Status === 'Done').length} / {tasks.length} Completed
                </span>
              </div>
              <TaskList initialTasks={tasks} />
            </section>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-8">
            <section className="bg-stone-900 text-white p-8 rounded-2xl shadow-xl">
              <h3 className="font-serif italic text-xl mb-6">Quick Info</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-1">Effective Date</p>
                  <p className="font-medium">{transaction.EffectiveDate}</p>
                </div>
                {transaction.DDDeadlineDate && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-1">DD Deadline</p>
                    <p className="font-medium">{transaction.DDDeadlineDate}</p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-1">Closing Date</p>
                  <p className="font-medium">{transaction.ClosingDate}</p>
                </div>
                <div className="pt-6 border-t border-stone-800">
                  <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-1">EM Holder</p>
                  <p className="font-medium">{transaction.EMHolder || 'Not Specified'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-1">Assigned To</p>
                  <p className="font-medium">{transaction.AssignedTo}</p>
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-4">Notes</h3>
              <p className="text-sm text-stone-600 leading-relaxed italic">
                {transaction.Notes || 'No notes added yet.'}
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
