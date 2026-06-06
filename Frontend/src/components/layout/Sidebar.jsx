import React from 'react';
import { LayoutDashboard, Users, FileText, CheckSquare, ShoppingCart, FileSpreadsheet, BarChart2, Activity } from 'lucide-react';

const navItems = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'vendors', name: 'Vendors', icon: Users },
  { id: 'rfqs', name: 'RFQ\'s', icon: FileText },
  { id: 'quotations', name: 'Quotations', icon: FileSpreadsheet },
  { id: 'approvals', name: 'Approvals', icon: CheckSquare },
  { id: 'purchase_orders', name: 'Purchase orders', icon: ShoppingCart },
  { id: 'invoices', name: 'Invoices', icon: FileText },
  { id: 'reports', name: 'Reports', icon: BarChart2 },
  { id: 'activity', name: 'Activity', icon: Activity },
];

const Sidebar = ({ currentPath, onNavigate }) => {
  return (
    <aside className="no-print w-56 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto shrink-0">
      <div className="py-4 flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2 font-sans text-[14px] font-medium transition-colors duration-100 ${
                    isActive
                      ? 'bg-orange-50 text-primary border-l-4 border-primary'
                      : 'text-gray-600 border-l-4 border-transparent hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
