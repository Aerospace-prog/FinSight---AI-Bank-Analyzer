import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
  onUpdateTransaction: (updatedTxn: Transaction, index: number) => void;
}

const TransactionTable: React.FC<Props> = ({ transactions, onUpdateTransaction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortOption, setSortOption] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [editForm, setEditForm] = useState<Partial<Transaction>>({});

  const itemsPerPage = 10;

  const allCategories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    ['Food & Dining', 'Groceries', 'Utilities', 'Rent', 'Shopping', 'Travel', 'Medical', 'Investment', 'Transfer'].forEach(c => cats.add(c));
    return Array.from(cats).sort();
  }, [transactions]);

  const categoriesForFilter = ['All', ...allCategories];

  const processedTransactions = useMemo(() => {
    let indexed = transactions.map((t, i) => ({ ...t, originalIndex: i }));

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      indexed = indexed.filter(t => 
        t.description.toLowerCase().includes(lowerSearch) ||
        t.category.toLowerCase().includes(lowerSearch) ||
        (t.referenceId && t.referenceId.toLowerCase().includes(lowerSearch))
      );
    }

    if (categoryFilter !== 'All') {
      indexed = indexed.filter(t => t.category === categoryFilter);
    }

    indexed.sort((a, b) => {
      if (sortOption === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortOption === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortOption === 'amount-desc') return b.amount - a.amount;
      if (sortOption === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

    return indexed;
  }, [transactions, searchTerm, categoryFilter, sortOption]);

  const totalPages = Math.ceil(processedTransactions.length / itemsPerPage);
  const paginatedTransactions = processedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startEdit = (txn: Transaction, index: number) => {
    setEditingId(index);
    setEditForm({ ...txn });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = (originalIndex: number) => {
    if (editForm && editingId !== null) {
      const updated = { ...transactions[originalIndex], ...editForm } as Transaction;
      onUpdateTransaction(updated, originalIndex);
      setEditingId(null);
    }
  };

  const handleExportCSV = () => {
    if (!transactions || transactions.length === 0) return;
    const headers = ['Date', 'Description', 'Reference', 'Category', 'Type', 'Amount', 'Balance', 'Notes'];
    const csvRows = transactions.map(txn => {
      return [
        txn.date,
        `"${txn.description.replace(/"/g, '""')}"`,
        txn.referenceId || '',
        txn.category,
        txn.type,
        txn.amount,
        txn.balanceAfterTxn || '',
        `"${(txn.notes || '').replace(/"/g, '""')}"`
      ].join(',');
    });
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `transaction_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Unknown';
    try {
       if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          const [year, month, day] = dateStr.split('-').map(Number);
          return new Date(year, month - 1, day).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
      }
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
    } catch (e) { return dateStr; }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full transition-colors duration-300">
      
      {/* Header & Controls */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Transaction History</h3>
            <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/30 rounded-lg transition-colors border border-violet-100 dark:border-violet-900/50"
            >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
            </button>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="pl-9 block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-violet-500 focus:border-violet-500 text-sm py-2 transition-all hover:bg-white dark:hover:bg-slate-800"
                />
            </div>
            
            <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                className="block w-full md:w-40 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-violet-500 focus:border-violet-500 text-sm py-2"
            >
                {categoriesForFilter.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
            </select>

            <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="block w-full md:w-40 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-violet-500 focus:border-violet-500 text-sm py-2"
            >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Amount: High</option>
                <option value="amount-asc">Amount: Low</option>
            </select>
        </div>
      </div>

      <div className="overflow-x-auto flex-grow custom-scrollbar">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50/90 dark:bg-slate-800/90 text-slate-400 dark:text-slate-500 uppercase text-[11px] font-bold tracking-wider sticky top-0 z-10 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3 text-right">Amount (₹)</th>
              <th className="px-6 py-3 text-center w-16">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((txn) => {
                  const isEditing = editingId === txn.originalIndex;
                  return (
                    <tr key={txn.originalIndex} className={`group transition-colors ${isEditing ? 'bg-violet-50 dark:bg-violet-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                        
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900 dark:text-slate-200 text-xs">
                           {formatDate(txn.date)}
                        </td>

                        <td className="px-6 py-4">
                           {isEditing ? (
                              <div className="space-y-2">
                                  <input 
                                    type="text" 
                                    value={editForm.description || ''}
                                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                    className="w-full text-sm p-1.5 rounded border border-violet-300 dark:border-violet-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                  />
                                  <input 
                                    type="text" 
                                    placeholder="Add notes..."
                                    value={editForm.notes || ''}
                                    onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                                    className="w-full text-xs p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-violet-500"
                                  />
                              </div>
                           ) : (
                              <>
                                <div className="max-w-xs lg:max-w-sm truncate text-slate-800 dark:text-slate-200 font-medium text-sm" title={txn.description}>
                                    {txn.description}
                                </div>
                                {txn.notes && (
                                    <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded w-fit">
                                      <span>📝 {txn.notes}</span>
                                    </div>
                                )}
                              </>
                           )}
                        </td>

                        <td className="px-6 py-4">
                           {isEditing ? (
                             <select
                                value={editForm.category || txn.category}
                                onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                                className="text-sm p-1.5 rounded border border-violet-300 dark:border-violet-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
                             >
                                {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                             </select>
                           ) : (
                             <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                {txn.category}
                             </span>
                           )}
                        </td>

                        <td className={`px-6 py-4 text-right font-mono text-sm font-bold ${txn.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-200'}`}>
                            {txn.type === 'credit' ? '+' : ''}{formatCurrency(txn.amount)}
                        </td>

                        <td className="px-6 py-4 text-center">
                           {isEditing ? (
                             <div className="flex items-center justify-center gap-2">
                                <button onClick={() => saveEdit(txn.originalIndex)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Save">
                                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </button>
                                <button onClick={cancelEdit} className="p-1 text-rose-600 hover:bg-rose-50 rounded transition-colors" title="Cancel">
                                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                             </div>
                           ) : (
                             <button onClick={() => startEdit(txn, txn.originalIndex)} className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-slate-700 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100" title="Edit">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                             </button>
                           )}
                        </td>
                    </tr>
                  );
                })
            ) : (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No transactions found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-white dark:hover:bg-slate-800 transition-colors">Previous</button>
            <span className="text-xs text-slate-500 dark:text-slate-400 pt-1.5">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-white dark:hover:bg-slate-800 transition-colors">Next</button>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;