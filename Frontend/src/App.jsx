import React from 'react';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import StatCard from './components/dashboard/StatCard';
import OrdersTable from './components/dashboard/OrdersTable';
import SpendingChart from './components/dashboard/SpendingChart';
import Button from './components/ui/Button';

function App() {
  return (
    <div className="h-screen w-full flex flex-col bg-background text-gray-900 font-sans overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Header section */}
          <div>
            <h1 className="text-display font-sans font-bold mb-2">Dashboard</h1>
            <p className="text-body font-sans text-gray-500">
              Welcome back, Procurement Officer - Today's Overview
            </p>
          </div>

          {/* Stats section */}
          <div className="flex gap-4 overflow-x-auto pb-2">
            <StatCard value="12" title="Active RFQ's" />
            <StatCard value="5" title="Pending Approvals" />
            <StatCard value="$ 2.3L" title="PO's this month" />
            <StatCard value="3" title="overdue invoices" />
          </div>

          {/* Content section */}
          <div className="flex flex-col xl:flex-row gap-6">
            <OrdersTable />
            <SpendingChart />
          </div>

          {/* Footer Action buttons */}
          <div className="flex gap-4 mt-auto pt-6 border-t border-gray-200">
            <Button variant="secondary" size="medium">+ new RFQ</Button>
            <Button variant="secondary" size="medium">Add Vendor</Button>
            <Button variant="secondary" size="medium">view Invoices</Button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
