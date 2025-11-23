import React from 'react';
import { AccountSummary } from '../types';

interface Props {
  summary: AccountSummary;
}

const SummaryCards: React.FC<Props> = ({ summary }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      label: 'Income',
      amount: summary.totalCredits,
      color: 'emerald',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      ),
      subtext: 'Total credited'
    },
    {
      label: 'Expenses',
      amount: summary.totalDebits,
      color: 'rose',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
        </svg>
      ),
      subtext: 'Total debited'
    },
    {
      label: 'Net Savings',
      amount: summary.netSavings,
      color: summary.netSavings >= 0 ? 'violet' : 'orange',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      subtext: 'Income - Expenses'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className="relative group bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400`}>
              {card.label}
            </span>
            <div className={`p-2 rounded-xl bg-${card.color}-50 dark:bg-${card.color}-900/20 text-${card.color}-600 dark:text-${card.color}-400`}>
              {card.icon}
            </div>
          </div>
          
          <div className="flex items-baseline gap-1">
             <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {formatCurrency(card.amount)}
             </h3>
          </div>
          
          <div className="mt-2 text-xs font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
             <div className={`w-1.5 h-1.5 rounded-full bg-${card.color}-500`}></div>
             {card.subtext}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;