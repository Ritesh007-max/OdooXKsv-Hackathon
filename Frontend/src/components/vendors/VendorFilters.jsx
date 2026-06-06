import React from 'react';
import { Search } from 'lucide-react';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'pending', label: 'Pending' },
  { id: 'blocked', label: 'Blocked' },
];

const VendorFilters = ({ searchQuery, setSearchQuery, activeFilter, setActiveFilter, counts }) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Search Bar */}
      <div className="bg-white border border-gray-200 rounded-md p-2 flex items-center shadow-sm w-full">
        <Search size={20} className="text-gray-400 ml-2 mr-3" />
        <input
          type="text"
          placeholder="Search bar ...... search by name, gst number, category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400 font-sans text-[14px]"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-1.5 rounded-md border text-[13px] font-sans font-medium transition-colors duration-100 ${
              activeFilter === filter.id
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {filter.label} ({counts[filter.id] || 0})
          </button>
        ))}
      </div>
    </div>
  );
};

export default VendorFilters;
