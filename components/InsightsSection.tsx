import React from 'react';

interface Props {
  overview: string;
  insights: string[];
  suggestions: string[];
}

const InsightsSection: React.FC<Props> = ({ overview, insights, suggestions }) => {
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Overview Card */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 dark:from-violet-800 dark:to-indigo-900 rounded-2xl p-8 text-white shadow-lg shadow-indigo-200 dark:shadow-none relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-purple-400 opacity-20 rounded-full blur-xl"></div>
        
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2 relative z-10">
          <span className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
             <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          Analysis Overview
        </h3>
        <p className="text-indigo-50 dark:text-indigo-100 leading-relaxed opacity-95 text-[15px] font-light relative z-10">
          {overview}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
        {/* Insights */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
                <svg className="w-5 h-5 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            </span>
            Key Observations
          </h3>
          <ul className="space-y-4 flex-grow">
            {insights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50/80 dark:bg-slate-700/30 border border-gray-100 dark:border-slate-600 hover:border-amber-200 dark:hover:border-amber-700 hover:bg-amber-50/40 dark:hover:bg-amber-900/10 transition-all group">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 shadow-sm shadow-amber-200 dark:shadow-none group-hover:scale-110 transition-transform"></span>
                <span className="text-gray-700 dark:text-gray-300 leading-7 text-[15px] font-medium">{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggestions */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
                <svg className="w-5 h-5 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </span>
            Actionable Advice
          </h3>
          <ul className="space-y-4 flex-grow">
            {suggestions.map((suggestion, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50/80 dark:bg-slate-700/30 border border-gray-100 dark:border-slate-600 hover:border-emerald-200 dark:hover:border-emerald-700 hover:bg-emerald-50/40 dark:hover:bg-emerald-900/10 transition-all group">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 shadow-sm shadow-emerald-200 dark:shadow-none group-hover:scale-110 transition-transform"></span>
                <span className="text-gray-700 dark:text-gray-300 leading-7 text-[15px] font-medium">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InsightsSection;