import { getTransactions } from '@/lib/google-sheets';
import PipelineBoard from '@/components/PipelineBoard';
import Navbar from '@/components/Navbar';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { LayoutDashboard, Filter, Search } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto">
              <LayoutDashboard className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-serif italic tracking-tight text-stone-900">Welcome to RE-Sync</h1>
              <p className="text-stone-500">Please sign in with your Google account to access your transaction pipeline.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  let transactions = [];
  let error = null;

  try {
    transactions = await getTransactions();
  } catch (e: any) {
    console.error(e);
    error = e.message;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-8 max-w-[1600px] mx-auto w-full">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif italic tracking-tight text-stone-900">Pipeline</h1>
            <p className="text-stone-500 text-sm">Manage your active real estate transactions.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input 
                type="text" 
                placeholder="Search address or client..." 
                className="pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </header>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl">
            <h2 className="font-bold mb-2">Error connecting to Google Sheets</h2>
            <p className="text-sm">{error}</p>
            <p className="text-sm mt-4">Make sure you have set the <code className="bg-red-100 px-1 rounded">GOOGLE_SHEET_ID</code> environment variable and that your account has access to the sheet.</p>
          </div>
        ) : (
          <PipelineBoard transactions={transactions} />
        )}
      </main>
    </div>
  );
}
