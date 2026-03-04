'use client';

import { createTransaction } from '@/app/actions/transactions';
import Navbar from '@/components/Navbar';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Home, User, DollarSign, Calendar, FileText, ArrowRight, Loader2 } from 'lucide-react';

export default function NewTransactionPage() {
  const [type, setType] = useState<'Resale' | 'NewConstruction'>('Resale');
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      await createTransaction(formData);
    } catch (e) {
      console.error(e);
      alert('Failed to create transaction. Check console for details.');
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-8 max-w-4xl mx-auto w-full">
        <header className="mb-10">
          <h1 className="text-4xl font-serif italic tracking-tight text-stone-900 mb-2">New Intake</h1>
          <p className="text-stone-500">Enter transaction details to start the coordination process.</p>
        </header>

        <form action={handleSubmit} className="space-y-8">
          {/* Transaction Type Selection */}
          <section className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Transaction Type
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setType('Resale')}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  type === 'Resale' 
                    ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-500/10' 
                    : 'border-stone-100 bg-stone-50 hover:border-stone-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${type === 'Resale' ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-500'}`}>
                  <Home className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-stone-900">Resale</h3>
                <p className="text-sm text-stone-500">Standard residential resale transaction.</p>
                <input type="radio" name="TransactionType" value="Resale" checked={type === 'Resale'} className="hidden" readOnly />
              </button>
              
              <button
                type="button"
                onClick={() => setType('NewConstruction')}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  type === 'NewConstruction' 
                    ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-500/10' 
                    : 'border-stone-100 bg-stone-50 hover:border-stone-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${type === 'NewConstruction' ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-500'}`}>
                  <Loader2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-stone-900">New Construction</h3>
                <p className="text-sm text-stone-500">Builder-led new construction project.</p>
                <input type="radio" name="TransactionType" value="NewConstruction" checked={type === 'NewConstruction'} className="hidden" readOnly />
              </button>
            </div>
          </section>

          {/* Basic Info */}
          <section className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" /> Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Client Names</label>
                <input required name="ClientNames" type="text" placeholder="John & Jane Doe" className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Property Address</label>
                <input required name="Address" type="text" placeholder="123 Main St, Raleigh, NC" className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Purchase Price</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input required name="PurchasePrice" type="number" placeholder="450000" className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Assigned To</label>
                <select name="AssignedTo" className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all">
                  <option value="TC">TC (Transaction Coordinator)</option>
                  <option value="Admin">Admin (Agent)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Dates & Deposits */}
          <section className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Dates & Deposits
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Effective Date</label>
                <input required name="EffectiveDate" type="date" className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
              </div>
              {type === 'Resale' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">DD Deadline</label>
                  <input required name="DDDeadlineDate" type="date" className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Closing Date</label>
                <input required name="ClosingDate" type="date" className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100">
              {type === 'Resale' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">DD Amount</label>
                    <input name="DDAmount" type="number" placeholder="2000" className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">EM Amount</label>
                    <input name="EMAmount" type="number" placeholder="5000" className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
                  </div>
                </>
              ) : (
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-stone-700">Builder Deposit Amount</label>
                  <input name="BuilderDepositAmount" type="number" placeholder="10000" className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
                </div>
              )}
            </div>
          </section>

          <footer className="flex items-center justify-end gap-4">
            <button 
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-3 text-stone-500 font-medium hover:text-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              disabled={isPending}
              type="submit"
              className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:translate-y-0"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create Transaction
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </footer>
        </form>
      </main>
    </div>
  );
}
