import React, { useState } from 'react';
import { CategoryBreakdown } from '../types';

interface Props {
  data: CategoryBreakdown[];
}

const BudgetOptimizer: React.FC<Props> = ({ data }) => {
  const [budgets, setBudgets] = useState<{ [key: string]: number }>({});
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [tempLimit, setTempLimit] = useState<string>('');

  const categories = data.filter(d => d.totalSpent > 0);

  const handleEdit = (category: string, currentLimit: number) => {
    setEditingCategory(category);
    setTempLimit(currentLimit ? currentLimit.toString() : '');
  };

  const handleSave = (category: string) => {
    const limit = parseFloat(tempLimit);
    if (!isNaN(limit) && limit > 0) {
      setBudgets(prev => ({ ...prev, [category]: limit }));
    } else {
        const newBudgets = { ...budgets };
        delete newBudgets[category];
        setBudgets(newBudgets);
    }
    setEditingCategory(null);
  };

  const getProgressColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return 'bg-rose-500';
    if (percentage >= 85) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col transition-colors duration-300">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Budget Watchdog</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Monitor spending against your goals.</p>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-4 max-h-[300px]">
        {categories.map((item, idx) => {
           const limit = budgets[item.category] || 0;
           const hasLimit = limit > 0;
           const percentage = hasLimit ? Math.min((item.totalSpent / limit) * 100, 100) : 0;
           const isOverBudget = hasLimit && item.totalSpent > limit;

           return (
             <div key={idx} className="group p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <div className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{item.category}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            ₹{item.totalSpent.toLocaleString('en-IN')}
                            {hasLimit && <span className="text-slate-400 dark:text-slate-600"> / ₹{limit.toLocaleString()}</span>}
                        </div>
                    </div>
                    
                    {editingCategory === item.category ? (
                        <div className="flex items-center gap-2">
                            <input 
                                type="number" 
                                autoFocus
                                value={tempLimit}
                                onChange={(e) => setTempLimit(e.target.value)}
                                className="w-20 px-2 py-1 text-xs border border-violet-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                            />
                            <button onClick={() => handleSave(item.category)} className="text-emerald-500 hover:text-emerald-600">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => handleEdit(item.category, limit)}
                            className={`text-xs font-medium px-2 py-1 rounded transition-colors ${hasLimit ? 'text-slate-400 hover:text-violet-500' : 'text-violet-600 bg-violet-100 hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-300'}`}
                        >
                            {hasLimit ? 'Edit' : '+ Set Limit'}
                        </button>
                    )}
                </div>

                {/* Progress Bar */}
                {hasLimit && (
                    <div className="mt-2">
                         <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(item.totalSpent, limit)}`} 
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                        {isOverBudget && (
                            <div className="mt-1 text-[10px] font-bold text-rose-500 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                Exceeded by ₹{(item.totalSpent - limit).toLocaleString()}
                            </div>
                        )}
                    </div>
                )}
             </div>
           );
        })}
      </div>
    </div>
  );
};

export default BudgetOptimizer;