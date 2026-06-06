import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, subtitle, trend }) => {
  const isUp = trend === 'up';
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between shadow-sm min-w-[160px] flex-1">
      <div className="flex items-center gap-2 mb-2">
        {trend && (
          isUp ? <ArrowUpRight size={16} className="text-orange-500" /> : <ArrowDownRight size={16} className="text-red-500" />
        )}
        <span className="text-body font-sans font-medium text-gray-500">{title}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-display font-sans font-bold text-gray-900">{value}</div>
      </div>
      {subtitle && (
        <div className={`text-caption font-sans mt-1 ${isUp ? 'text-green-500' : 'text-red-500'}`}>
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default StatCard;
