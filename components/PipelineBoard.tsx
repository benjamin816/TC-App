'use client';

import { Transaction } from '@/lib/google-sheets';
import Link from 'next/link';
import { motion } from 'motion/react';
import { MapPin, User, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';

const STAGES = [
  'DepositsPending',
  'DueDiligence',
  'BuilderActive',
  'Financing',
  'ClearToClose',
  'Closed'
] as const;

const STAGE_LABELS: Record<string, string> = {
  DepositsPending: 'Deposits Pending',
  DueDiligence: 'Due Diligence',
  BuilderActive: 'Builder Active',
  Financing: 'Financing',
  ClearToClose: 'Clear to Close',
  Closed: 'Closed'
};

export default function PipelineBoard({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="flex gap-6 overflow-x-auto pb-8 min-h-[calc(100vh-200px)]">
      {STAGES.map((stage) => {
        const stageTransactions = transactions.filter(t => t.Status === stage);
        
        return (
          <div key={stage} className="flex-shrink-0 w-80">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-serif italic text-lg text-stone-800">{STAGE_LABELS[stage]}</h3>
              <span className="bg-stone-200 text-stone-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {stageTransactions.length}
              </span>
            </div>
            
            <div className="space-y-4">
              {stageTransactions.map((t, index) => (
                <motion.div
                  key={t.TransactionID}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link 
                    href={`/transactions/${t.TransactionID}`}
                    className="block bg-white border border-stone-200 p-4 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={t.TransactionType === 'Resale' ? "text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded" : "text-[10px] font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded"}>
                        {t.TransactionType}
                      </span>
                      <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all" />
                    </div>
                    
                    <h4 className="font-bold text-stone-900 mb-1 line-clamp-1">{t.Address}</h4>
                    <p className="text-sm text-stone-500 mb-4 flex items-center gap-1">
                      <User className="w-3 h-3" /> {t.ClientNames}
                    </p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                      <div className="flex items-center gap-1 text-xs text-stone-400">
                        <CalendarIcon className="w-3 h-3" />
                        <span>Closing: {t.ClosingDate}</span>
                      </div>
                      <div className="text-xs font-bold text-stone-700">
                        ${Number(t.PurchasePrice).toLocaleString()}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
              
              {stageTransactions.length === 0 && (
                <div className="border-2 border-dashed border-stone-200 rounded-xl p-8 text-center">
                  <p className="text-xs text-stone-400 italic">No transactions</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
