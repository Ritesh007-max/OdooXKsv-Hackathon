import React from 'react';
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';

const data = [
  { name: 'Jan', spending: 4000 },
  { name: 'Feb', spending: 3000 },
  { name: 'Mar', spending: 5000 },
  { name: 'Apr', spending: 2780 },
  { name: 'May', spending: 4890 },
  { name: 'Jun', spending: 2390 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded shadow-md p-2">
        <p className="text-caption font-sans text-gray-500 mb-1">{label}</p>
        <p className="text-body font-mono font-bold text-orange-500">
          ${payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const SpendingChart = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col w-[300px] flex-shrink-0 relative">
      <div className="text-body font-sans font-medium text-gray-500 mb-6 text-center">
        Spending Trends last 6 months
      </div>
      
      <div className="flex gap-4 mb-4">
        {/* Mock bullet points */}
        <div className="space-y-2 flex-1">
          <div className="h-2 bg-gray-200 rounded-full w-full"></div>
          <div className="h-2 bg-gray-200 rounded-full w-4/5"></div>
          <div className="h-2 bg-gray-200 rounded-full w-full"></div>
          <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
        </div>
        {/* Mock Pie Chart */}
        <div className="w-12 h-12 rounded-full border-4 border-[#06B6D4] border-t-green-500 transform rotate-45 shrink-0"></div>
      </div>
      
      <div className="h-24 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Line type="monotone" dataKey="spending" stroke="#EF4444" strokeWidth={2} dot={{ r: 3, fill: '#EF4444', strokeWidth: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-2 mt-4 items-end">
        {/* Mock Bar Chart */}
        <div className="w-6 bg-orange-400 opacity-70 h-8 rounded-t-[2px]"></div>
        <div className="w-6 bg-orange-400 opacity-90 h-12 rounded-t-[2px]"></div>
        <div className="w-6 bg-orange-500 h-16 rounded-t-[2px]"></div>
        <div className="space-y-1.5 flex-1 ml-2 mb-1">
          <div className="h-1.5 bg-gray-200 rounded-full w-full"></div>
          <div className="h-1.5 bg-gray-200 rounded-full w-full"></div>
          <div className="h-1.5 bg-gray-200 rounded-full w-4/5"></div>
        </div>
      </div>
    </div>
  );
};

export default SpendingChart;
