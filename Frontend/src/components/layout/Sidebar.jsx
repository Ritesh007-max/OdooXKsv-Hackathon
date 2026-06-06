import React from 'react';
import { LayoutDashboard, Users, FileText, CheckSquare, ShoppingCart, FileSpreadsheet, BarChart2, Activity } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, active: true },
  { name: 'Vendors', icon: Users, active: false },
  { name: 'RFQ\'s', icon: FileText, active: false },
  { name: 'Quotations', icon: FileSpreadsheet, active: false },
  { name: 'Approvals', icon: CheckSquare, active: false },
  { name: 'Purchase orders', icon: ShoppingCart, active: false },
  { name: 'Invoices', icon: FileText, active: false },
  { name: 'Reports', icon: BarChart2, active: false },
  { name: 'Activity', icon: Activity, active: false },
];

const Sidebar = () => {
  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto">
      <div className="py-4 flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <a
                href="#"
                className={`flex items-center gap-3 px-4 py-2 font-sans text-[14px] font-medium transition-colors duration-100 ${
                  item.active
                    ? 'bg-orange-50 text-primary border-l-4 border-primary'
                    : 'text-gray-600 border-l-4 border-transparent hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
