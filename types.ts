export interface Transaction {
  date: string;
  valueDate?: string;
  description: string;
  referenceId?: string;
  type: 'credit' | 'debit';
  amount: number;
  balanceAfterTxn?: number;
  category: string;
  subCategory?: string;
  notes?: string;
}

export interface CategoryBreakdown {
  category: string;
  totalSpent: number;
  percentageOfExpenses: number;
}

export interface AccountSummary {
  bankName?: string;
  accountName?: string;
  periodStart?: string;
  periodEnd?: string;
  openingBalance?: number;
  closingBalance?: number;
  totalCredits: number;
  totalDebits: number;
  netSavings: number;
}

export interface AnalysisResult {
  overview: string;
  summary: AccountSummary;
  categoryBreakdown: CategoryBreakdown[];
  transactions: Transaction[];
  insights: string[]; // Key insights
  suggestions: string[]; // Actionable suggestions
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}