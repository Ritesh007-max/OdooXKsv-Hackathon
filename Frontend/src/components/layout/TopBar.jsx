import React, { useState, useRef, useEffect } from 'react';
import { UserCircle, LogOut, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../../AuthContext';

const TopBar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'officer':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'manager':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'vendor':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatRole = (role) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'officer':
        return 'Procurement Officer';
      case 'manager':
        return 'Manager / Approver';
      case 'vendor':
        return 'Vendor';
      default:
        return role || 'User';
    }
  };

  return (
    <header className="no-print h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-50">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded bg-[#F59E0B] flex items-center justify-center">
          <span className="font-mono font-bold text-sm text-[#111111]">VB</span>
        </div>
        <span className="font-sans font-bold text-[18px] text-gray-900 tracking-tight">VendorBridge</span>
      </div>

      {user && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 py-1.5 px-3 rounded-lg hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200 cursor-pointer focus:outline-none"
          >
            {/* User Avatar Circle */}
            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-[#F59E0B]/20 to-[#D97706]/20 border border-[#F59E0B]/30 flex items-center justify-center">
              <span className="text-[#D97706] font-bold text-xs font-mono">
                {getInitials(user.name)}
              </span>
            </div>

            {/* User Name & Chevron */}
            <div className="hidden md:flex flex-col items-start text-left leading-none">
              <span className="text-sm font-semibold text-gray-800 font-sans">{user.name}</span>
              <span className="text-[10px] text-gray-400 font-sans mt-0.5">{formatRole(user.role)}</span>
            </div>

            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Premium Dropdown Modal */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden py-1 animate-fadeIn origin-top-right">
              {/* Header Info */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex flex-col gap-1 select-none">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Logged In As</span>
                <span className="text-sm font-bold text-gray-800 truncate">{user.name}</span>
                <span className="text-xs text-gray-500 truncate">{user.email}</span>
                
                {/* Role Badge */}
                <div className="mt-1.5 flex">
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 border rounded-full ${getRoleBadgeColor(user.role)}`}>
                    {formatRole(user.role)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg cursor-pointer transition-colors text-left focus:outline-none"
                >
                  <LogOut size={16} />
                  <span>Log Out Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default TopBar;
