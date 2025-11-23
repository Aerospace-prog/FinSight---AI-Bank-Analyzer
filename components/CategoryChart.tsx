import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CategoryBreakdown } from '../types';

interface Props {
  data: CategoryBreakdown[];
  isDarkMode: boolean;
}

const COLORS = [
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#6366f1', // Indigo
  '#14b8a6', // Teal
];

const CategoryChart: React.FC<Props> = ({ data, isDarkMode }) => {
  const chartData = data
    .filter(item => item.totalSpent > 0)
    .sort((a, b) => b.totalSpent - a.totalSpent);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full transition-colors duration-300">
      <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Spending Breakdown
          </h3>
      </div>
      
      {chartData.length > 0 ? (
        <div className="flex-grow flex flex-col sm:flex-row items-center gap-8">
            {/* Chart */}
            <div className="w-full sm:w-1/2 h-64 relative">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData as any}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="totalSpent"
                    nameKey="category"
                    cornerRadius={4}
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']}
                    contentStyle={{ 
                      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: isDarkMode ? '#f1f5f9' : '#1f2937'
                    }}
                    itemStyle={{ color: isDarkMode ? '#cbd5e1' : '#4b5563' }}
                    separator=''
                  />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="text-center opacity-30 dark:opacity-20">
                    <svg className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                 </div>
              </div>
            </div>

            {/* Legend */}
            <div className="w-full sm:w-1/2 flex flex-col justify-center h-64">
              <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar max-h-full">
                {chartData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-default">
                    <div className="flex items-center gap-3 min-w-0">
                      <div 
                        className="w-2 h-2 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-right pl-2">
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                            {Math.round(item.percentageOfExpenses)}%
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
            <span className="text-sm font-medium">No expenses</span>
        </div>
      )}
    </div>
  );
};

export default CategoryChart;