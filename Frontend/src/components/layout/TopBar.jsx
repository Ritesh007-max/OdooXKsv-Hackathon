import React from 'react';
import { UserCircle } from 'lucide-react';

const TopBar = () => {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
      <div className="flex items-center gap-2">
        <span className="font-sans font-bold text-[18px] text-gray-900">VendorBridge</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-gray-500 hover:text-gray-900 transition-colors focus:outline-none">
          <UserCircle size={24} />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
