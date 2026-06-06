import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import OrdersTable from './OrdersTable';
import SpendingChart from './SpendingChart';
import Button from '../ui/Button';
import { fetchApi } from '../../api';

const DashboardView = ({ onAddVendor }) => {
  const [stats, setStats] = useState({
    activeRfqs: 0,
    pendingApprovals: 0,
    monthlySpend: 0,
    activeVendors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/dashboard/overview')
      .then((data) => {
        setStats({
          activeRfqs: data.activeRfqs || 0,
          pendingApprovals: data.pendingApprovals || 0,
          monthlySpend: data.monthlySpend || 0,
          activeVendors: data.activeVendors || 0,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch dashboard overview:', err);
        setLoading(false);
      });
  }, []);

  return (
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
        <StatCard value={loading ? "..." : stats.activeRfqs.toString()} title="Active RFQ's" />
        <StatCard value={loading ? "..." : stats.pendingApprovals.toString()} title="Pending Approvals" />
        <StatCard value={loading ? "..." : `$${stats.monthlySpend.toLocaleString()}`} title="PO's this month" />
        <StatCard value={loading ? "..." : stats.activeVendors.toString()} title="Active Vendors" />
      </div>

      {/* Content section */}
      <div className="flex flex-col xl:flex-row gap-6">
        <OrdersTable />
        <SpendingChart />
      </div>

      {/* Footer Action buttons */}
      <div className="flex gap-4 mt-auto pt-6 border-t border-gray-200">
        <Button variant="secondary" size="medium">+ new RFQ</Button>
        <Button variant="secondary" size="medium" onClick={onAddVendor}>Add Vendor</Button>
        <Button variant="secondary" size="medium">view Invoices</Button>
      </div>
    </main>
  );
};

export default DashboardView;
