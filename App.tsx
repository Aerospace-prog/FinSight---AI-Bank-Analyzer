import React, { useState, useRef, useEffect } from 'react';
import { analyzeStatement } from './services/geminiService';
import { AnalysisResult, AppState, Transaction } from './types';
import { MOCK_STATEMENT_TEXT } from './constants';
import { recalculateAnalysis } from './utils/analytics';
import LoadingScreen from './components/LoadingScreen';
import SummaryCards from './components/SummaryCards';
import CategoryChart from './components/CategoryChart';
import TransactionTable from './components/TransactionTable';
import InsightsSection from './components/InsightsSection';
import BudgetOptimizer from './components/BudgetOptimizer';

interface Attachment {
  name: string;
  mimeType: string;
  data: string; // Base64 string
}

const App: React.FC = () => {
  const [textInput, setTextInput] = useState<string>('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleAnalyze = async () => {
    if (!textInput.trim() && !attachment) {
      setErrorMsg("Please enter text or upload a bank statement file.");
      return;
    }
    setAppState(AppState.ANALYZING);
    setErrorMsg(null);
    try {
      const analysis = await analyzeStatement({ 
        text: textInput, 
        fileData: attachment || undefined 
      });
      setResult(analysis);
      setAppState(AppState.SUCCESS);
    } catch (e) {
      console.error(e);
      setErrorMsg("Analysis failed. Please check your API Key or input format.");
      setAppState(AppState.ERROR);
    }
  };

  const handleTransactionUpdate = (updatedTxn: Transaction, index: number) => {
    if (!result) return;
    const newTransactions = [...result.transactions];
    newTransactions[index] = updatedTxn;
    const updatedResult = recalculateAnalysis(result, newTransactions);
    setResult(updatedResult);
  };

  const handleLoadMock = () => {
    setTextInput(MOCK_STATEMENT_TEXT);
    setAttachment(null);
    setErrorMsg(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setErrorMsg(null);

    if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64Data = result.split(',')[1];
        setAttachment({
          name: file.name,
          mimeType: file.type,
          data: base64Data
        });
        if (textInput === MOCK_STATEMENT_TEXT) setTextInput('');
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
           setTextInput(text);
           setAttachment(null); 
        }
      };
      reader.readAsText(file);
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = () => setAttachment(null);

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setResult(null);
    setTextInput('');
    setAttachment(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative transition-colors duration-500 selection:bg-violet-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-200 dark:bg-violet-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen blur-[120px] opacity-40 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen blur-[120px] opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-indigo-200 dark:bg-indigo-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen blur-[120px] opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 w-full glass-card border-b border-white/20 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-2 rounded-lg shadow-lg shadow-violet-500/30">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 tracking-tight">
              FinSight
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all"
              title="Toggle Theme"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
            {appState === AppState.SUCCESS && (
               <button onClick={handleReset} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  New Analysis
               </button>
            )}
          </div>
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-64px)]">
        
        {/* LANDING / INPUT STATE */}
        {(appState === AppState.IDLE || appState === AppState.ERROR) && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] animate-fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase tracking-wide mb-6 border border-violet-200 dark:border-violet-800">
                  <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
                  AI-Powered Finance
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                Understand your money <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500">in seconds.</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Upload your bank statement PDF or image. We'll extract, categorize, and visualize your spending instantly.
              </p>
            </div>

            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-violet-500/10 border border-slate-200 dark:border-slate-800 p-2">
              <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 bg-slate-50/50 dark:bg-slate-950/50 relative">
                 
                 {/* File Drop Visual */}
                 {!attachment && !textInput && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-50">
                        <div className="w-16 h-16 bg-violet-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-violet-500">
                             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        </div>
                    </div>
                 )}

                 {/* Attachment Preview */}
                 {attachment && (
                    <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between bg-white dark:bg-slate-800 border border-violet-200 dark:border-slate-700 p-3 rounded-xl shadow-lg">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg shrink-0">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 14H6v-2h2v2zm0-4H6V8h2v2zm0-4H6V4h2v2zm6 8h-4v-2h4v2zm0-4h-4V8h4v2zm0-4h-4V4h4v2zm5 8h-3v-2h3v2zm0-4h-3V8h3v2zm0-4h-3V4h3v2z"/></svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{attachment.name}</p>
                                <p className="text-xs text-slate-500 uppercase">{attachment.mimeType.split('/')[1]}</p>
                            </div>
                        </div>
                        <button onClick={removeAttachment} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-red-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                 )}

                 <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className={`w-full h-64 bg-transparent outline-none resize-none font-mono text-sm text-slate-700 dark:text-slate-300 relative z-10 ${attachment ? 'pt-20 opacity-50' : ''}`}
                    placeholder="            Drop your statement file here..."
                 />

                 <div className="mt-6 flex flex-col sm:flex-row gap-4 relative z-20">
                    <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} />
                    <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 font-medium text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                        Upload File
                    </button>
                    <button 
                        onClick={handleAnalyze} 
                        disabled={!textInput && !attachment}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold text-white shadow-lg shadow-violet-500/30 transition-all flex items-center justify-center gap-2 ${textInput || attachment ? 'bg-violet-600 hover:bg-violet-700 hover:scale-[1.02]' : 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed shadow-none text-slate-500'}`}
                    >
                        Analyze Now
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </button>
                 </div>
              </div>
            </div>

            {!attachment && (
                 <button onClick={handleLoadMock} className="mt-8 text-sm text-slate-500 hover:text-violet-600 dark:text-slate-500 dark:hover:text-violet-400 transition-colors underline decoration-dotted">
                    Don't have a file? Try with sample data
                 </button>
            )}

            {errorMsg && (
                <div className="mt-6 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-3 animate-fade-in-up">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {errorMsg}
                </div>
            )}
          </div>
        )}

        {appState === AppState.ANALYZING && <LoadingScreen />}

        {/* DASHBOARD STATE */}
        {appState === AppState.SUCCESS && result && (
          <div className="animate-fade-in-up pb-12 space-y-6">
            
            {/* 1. Header & Summary Stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Financial Overview</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        {result.summary.periodStart} — {result.summary.periodEnd} • <span className="text-violet-500 font-medium">{result.summary.bankName || 'Statement'}</span>
                    </p>
                </div>
            </div>

            <SummaryCards summary={result.summary} />

            {/* 2. Main Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[500px]">
                
                {/* Left Col: Chart & Budget (Visuals) */}
                <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 h-full">
                    <div className="md:col-span-2 lg:col-span-1 h-[400px] lg:h-auto">
                        <CategoryChart data={result.categoryBreakdown} isDarkMode={isDarkMode} />
                    </div>
                    <div className="md:col-span-2 lg:col-span-1 h-[400px] lg:h-auto">
                        <BudgetOptimizer data={result.categoryBreakdown} />
                    </div>
                </div>

                {/* Right Col: Insights (Text) */}
                <div className="lg:col-span-5 h-full">
                    <InsightsSection 
                        overview={result.overview} 
                        insights={result.insights} 
                        suggestions={result.suggestions} 
                    />
                </div>
            </div>

            {/* 3. Detailed Table */}
            <div className="pt-4">
                <TransactionTable 
                    transactions={result.transactions} 
                    onUpdateTransaction={handleTransactionUpdate}
                />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;