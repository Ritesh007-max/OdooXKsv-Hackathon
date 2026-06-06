import React, { useState, useEffect, useMemo } from 'react';
import { useActivity } from '../../ActivityContext';
import { fetchApi } from '../../api';

// ── Tab config ────────────────────────────────────────────────────────────────
const TABS = [
  { key: 'all',       label: 'All' },
  { key: 'rfq',       label: 'RFQ' },
  { key: 'approval',  label: 'Approvals' },
  { key: 'invoice',   label: 'Invoices' },
  { key: 'vendor',    label: 'Vendors' },
];

// ── Icon helpers ──────────────────────────────────────────────────────────────
const typeIcons = {
  rfq: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  approval: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  invoice: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  vendor: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  po: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
};

const statusColors = {
  success: { bg: 'bg-[#DCFCE7]', text: 'text-[#15803D]', dot: 'bg-[#22C55E]' },
  pending: { bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]', dot: 'bg-[#F59E0B]' },
  info:    { bg: 'bg-[#DBEAFE]', text: 'text-[#1E40AF]', dot: 'bg-[#3B82F6]' },
};

function formatTimeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ActivityView() {
  const { activities, addActivity } = useActivity();
  const [activeTab, setActiveTab] = useState('all');
  const [seeded, setSeeded] = useState(false);

  // Seed initial activities from existing backend data (only once)
  useEffect(() => {
    if (seeded) return;

    async function seedFromBackend() {
      try {
        const [invRes, vendorRes, rfqRes, poRes, quoRes] = await Promise.all([
          fetchApi('/invoices'),
          fetchApi('/vendors'),
          fetchApi('/rfqs'),
          fetchApi('/purchase-orders'),
          fetchApi('/quotations'),
        ]);

        const invoices = invRes?.invoices || [];
        const vendors = vendorRes?.vendors || [];
        const rfqs = rfqRes?.rfqs || [];
        const pos = poRes?.purchaseOrders || [];
        const quotations = quoRes?.quotations || [];

        // Only seed if activity log is empty
        if (activities.length === 0) {
          // Seed from invoices
          invoices.slice(0, 5).forEach(inv => {
            const st = inv.status === 'Paid' ? 'success' : inv.status === 'Overdue' ? 'pending' : 'info';
            addActivity('invoice', `Invoice ${inv.id || inv.invoiceId} — ${inv.status} ($${(inv.total || 0).toLocaleString()})`, st);
          });

          // Seed from vendors
          vendors.slice(0, 3).forEach(v => {
            addActivity('vendor', `Vendor registered — ${v.name} (${v.category || 'General'})`, 'success');
          });

          // Seed from RFQs
          rfqs.slice(0, 3).forEach(r => {
            const st = r.status === 'open' ? 'info' : r.status === 'awarded' ? 'success' : 'pending';
            addActivity('rfq', `RFQ ${r.status} — ${r.title || r.product}`, st);
          });

          // Seed from POs
          pos.slice(0, 3).forEach(po => {
            const st = po.status === 'completed' ? 'success' : po.status === 'draft' ? 'pending' : 'info';
            addActivity('po', `Purchase Order ${po.status} — $${(po.total || 0).toLocaleString()}`, st);
          });

          // Seed from Quotations
          quotations.slice(0, 3).forEach(q => {
            const st = q.status === 'awarded' ? 'success' : q.status === 'pending_approval' ? 'pending' : 'info';
            addActivity('approval', `Quotation ${st} — ${q.vendor?.name || q.vendorName || q.id}`, st === 'success' ? 'success' : 'pending');
          });
        }
      } catch (err) {
        console.error('Failed to seed activities:', err);
      } finally {
        setSeeded(true);
      }
    }

    seedFromBackend();
  }, [seeded, activities.length, addActivity]);

  // Filter
  const filtered = useMemo(() => {
    if (activeTab === 'all') return activities;
    return activities.filter(a => a.type === activeTab);
  }, [activities, activeTab]);

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] overflow-y-auto min-h-0">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#E5E7EB] px-8 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="font-deck-headline text-[#111111] text-[22px] leading-7">
            Activity &amp; Logs
          </h1>
          <p className="font-deck-caption text-[#6B7280] mt-0.5">
            Procurement audit trail
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-deck-code text-xs text-[#6B7280]">
            {activities.length} event{activities.length !== 1 ? 's' : ''}
          </span>
          <span className="inline-block w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" title="Live" />
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 p-8 space-y-6">

        {/* ── Filter Tabs ──────────────────────────────────────────────────── */}
        <section className="flex items-center gap-2">
          {TABS.map(tab => {
            const isActive = activeTab === tab.key;
            const count = tab.key === 'all'
              ? activities.length
              : activities.filter(a => a.type === tab.key).length;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-1.5 rounded-md border text-[13px] font-sans font-medium transition-colors duration-100 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#F59E0B] text-[#111111] border-[#F59E0B] shadow-sm'
                    : 'bg-white text-[#4B5563] border-[#E5E7EB] hover:bg-[#FFFBEB] hover:border-[#F59E0B]'
                }`}
              >
                {tab.label}
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-deck-code ${
                  isActive ? 'bg-[#111111]/10' : 'bg-[#F3F4F6]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </section>

        {/* ── Timeline ─────────────────────────────────────────────────────── */}
        <section className="bg-white border border-[#E5E7EB] rounded-sm dd-shadow-subtle">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg className="w-12 h-12 text-[#D1D5DB] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-deck-body-small text-[#9CA3AF]">No activities yet</p>
              <p className="font-deck-caption text-[#D1D5DB] mt-1">Actions across modules will appear here</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#F3F4F6]">
              {filtered.map((act) => {
                const sc = statusColors[act.status] || statusColors.info;
                const icon = typeIcons[act.type] || typeIcons.rfq;

                return (
                  <li
                    key={act.id}
                    className="flex items-start gap-4 px-6 py-4 hover:bg-[#FAFAFA] transition-colors"
                  >
                    {/* Icon bubble */}
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${sc.bg} ${sc.text}`}>
                      {icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="font-deck-body-small text-[#111111] leading-snug">
                        {act.message}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="font-deck-caption text-[#9CA3AF] text-[11px]">
                          {formatTimeAgo(act.timestamp)}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-deck-code uppercase tracking-wider ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {act.status}
                        </span>
                        <span className="text-[10px] font-deck-code text-[#D1D5DB] uppercase tracking-wider">
                          {act.type}
                        </span>
                      </div>
                    </div>

                    {/* Timestamp full */}
                    <span className="shrink-0 font-deck-code text-[11px] text-[#9CA3AF]">
                      {new Date(act.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

      </main>
    </div>
  );
}
