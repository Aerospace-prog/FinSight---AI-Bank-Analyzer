
import { Transaction, AccountSummary, CategoryBreakdown, AnalysisResult } from '../types';

export const recalculateAnalysis = (
  originalResult: AnalysisResult, 
  updatedTransactions: Transaction[]
): AnalysisResult => {
  
  // 1. Recalculate Summary
  let totalCredits = 0;
  let totalDebits = 0;

  updatedTransactions.forEach(t => {
    if (t.type === 'credit') totalCredits += t.amount;
    else totalDebits += t.amount;
  });

  const summary: AccountSummary = {
    ...originalResult.summary,
    totalCredits,
    totalDebits,
    netSavings: totalCredits - totalDebits,
    closingBalance: (originalResult.summary.openingBalance || 0) + (totalCredits - totalDebits) // Approx update
  };

  // 2. Recalculate Category Breakdown
  const categoryMap = new Map<string, number>();
  
  updatedTransactions.forEach(t => {
    if (t.type === 'debit') {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    }
  });

  const categoryBreakdown: CategoryBreakdown[] = Array.from(categoryMap.entries()).map(([category, totalSpent]) => ({
    category,
    totalSpent,
    percentageOfExpenses: totalDebits > 0 ? Number(((totalSpent / totalDebits) * 100).toFixed(2)) : 0
  }));

  // Sort by spend
  categoryBreakdown.sort((a, b) => b.totalSpent - a.totalSpent);

  return {
    ...originalResult,
    transactions: updatedTransactions,
    summary,
    categoryBreakdown
  };
};
