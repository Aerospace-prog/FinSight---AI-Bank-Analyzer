import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 animate-fade-in-up">
      <div className="relative w-28 h-28 mb-8">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-violet-100 dark:border-slate-700"></div>
        {/* Spinning Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-violet-600 dark:border-violet-500 border-t-transparent animate-spin"></div>
        {/* Inner Pulse */}
        <div className="absolute inset-4 rounded-full bg-violet-50 dark:bg-slate-800 animate-pulse flex items-center justify-center">
            <svg className="w-8 h-8 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        </div>
      </div>
      
      <div className="text-center space-y-3 max-w-md">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
            Analyzing Your Finances
        </h3>
        <p className="text-gray-500 dark:text-gray-400">Our AI is reading your statement, fixing OCR errors, and categorizing transactions...</p>
        
        <div className="pt-4 flex gap-3 justify-center text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
            <span className="animate-pulse delay-75">Reading</span>
            <span>•</span>
            <span className="animate-pulse delay-150">Categorizing</span>
            <span>•</span>
            <span className="animate-pulse delay-300">Summarizing</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;