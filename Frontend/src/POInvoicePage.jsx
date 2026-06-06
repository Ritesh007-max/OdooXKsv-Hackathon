import React, { useState, useMemo, useEffect } from 'react';
import { fetchApi } from './api';
import { useActivity } from './ActivityContext';

const navIcons = {
  Dashboard: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Vendors: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  RFQs: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Quotations: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 001.414 0l2.414-2.414a1 1 0 01.707-.293H20" />
    </svg>
  ),
  Approvals: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  "Purchase Orders": (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  Invoices: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Reports: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
    </svg>
  ),
  Activity: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  )
};

export default function POInvoicePage() {
  // Application Roles
  const roles = ["Procurement Officer", "Vendor", "Manager / Approver", "Admin"];
  const [currentRole, setCurrentRole] = useState("Admin");
  const { addActivity } = useActivity();

  // Invoices Master State — loaded from backend API
  const [invoices, setInvoices] = useState([]);
  const [activeInvoiceId, setActiveInvoiceId] = useState('');

  // Load invoices on component mount
  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const data = await fetchApi('/invoices');
        const invoicesArray = data && data.invoices ? data.invoices : [];
        setInvoices(invoicesArray);
        if (invoicesArray.length > 0) {
          setActiveInvoiceId(invoicesArray[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch invoices:', err);
      }
    };
    loadInvoices();
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // No localStorage persistence needed; data is managed via backend API

  // Active invoice ID is managed by state loaded from API

  // Edit State
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedInvoice, setEditedInvoice] = useState(null);

  // UI Button Loading States
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // New Log Entry Input
  const [customLog, setCustomLog] = useState("");

  // Select Active Invoice Details
  const activeInvoice = useMemo(() => {
    return invoices.find(inv => inv.id === activeInvoiceId) || invoices[0];
  }, [invoices, activeInvoiceId]);

  // Derived Calculations for current Active Invoice (or Edited Invoice if in Edit Mode)
  const currentInvoiceData = isEditMode && editedInvoice ? editedInvoice : activeInvoice;

  const calculations = useMemo(() => {
    if (!currentInvoiceData) return { subtotal: 0, taxTotal: 0, grandTotal: 0 };

    let subtotal = 0;
    let taxTotal = 0;

    currentInvoiceData.items.forEach(item => {
      const qty = Math.max(0, item.qty || 0);
      const price = Math.max(0, item.unitPrice || 0);
      const taxRate = Math.max(0, item.tax || 0);
      const itemSubtotal = qty * price;

      subtotal += itemSubtotal;
      taxTotal += itemSubtotal * (taxRate / 100);
    });

    const discount = Math.max(0, currentInvoiceData.discount || 0);
    const grandTotal = Math.max(0, subtotal + taxTotal - discount);

    return {
      subtotal,
      taxTotal,
      grandTotal
    };
  }, [currentInvoiceData]);

  // Filter Invoices for the Sidebar explorer
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch =
        inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.poId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.vendor.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "All" || inv.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  // Role Permissions Helpers
  const canEdit = currentRole === "Procurement Officer" || currentRole === "Admin";
  const canApprove = currentRole === "Manager / Approver" || currentRole === "Admin";

  const showAddInvoiceBtn = currentRole === "Procurement Officer" || currentRole === "Admin" || currentRole === "Vendor";
  const showAddPoBtn = currentRole === "Procurement Officer" || currentRole === "Admin" || currentRole === "Manager / Approver";

  const handleCreateInvoice = async () => {
    if (isEditMode) {
      if (!confirm("Discard unsaved changes?")) return;
    }
    const newInv = {
      poId: "Draft PO",
      vendor: {
        name: currentRole === "Vendor" ? "Vendor Self-Service" : "New Vendor Corp",
        address: "Enter Vendor Address Here",
      },
      items: [
        { id: Date.now(), name: "New Line Item", qty: 1, unitPrice: 1000, tax: 18 }
      ],
      status: "Draft",
      dates: {
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date().toISOString().split('T')[0],
        paymentTerms: "Net 30"
      },
      discount: 0,
      logs: []
    };
    try {
      const created = await fetchApi('/invoices', { method: 'POST', body: newInv });
      const invoice = created.invoice || created;
      setInvoices(prev => [invoice, ...prev]);
      setActiveInvoiceId(invoice.id);
      setIsEditMode(true);
      setEditedInvoice(JSON.parse(JSON.stringify(invoice)));
      addActivity('invoice', `Invoice created — ${invoice.id || 'Draft'} generated`, 'info');
    } catch (err) {
      alert('Failed to create invoice: ' + err.message);
    }
  };

  const handleCreatePO = async () => {
    if (isEditMode) {
      if (!confirm("Discard unsaved changes?")) return;
    }
    const newId = `INV-2026-00${invoices.length + 1}`;
    const newPoId = `PO-2026-00${invoices.length + 1}`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const dateStr = timestamp.split(' ')[0];

    const newInv = {
      id: newId,
      poId: newPoId,
      vendor: {
        name: "New Vendor Corp",
        address: "Enter Vendor Address Here",
      },
      items: [
        { id: Date.now(), name: "Standard Equipment Purchase", qty: 1, unitPrice: 5000, tax: 18 }
      ],
      status: "Pending",
      dates: {
        invoiceDate: dateStr,
        dueDate: dateStr,
        paymentTerms: "Net 30"
      },
      discount: 0,
      logs: [
        {
          timestamp,
          level: "INFO",
          user: currentRole,
          message: `Created Purchase Order ${newPoId} and associated Invoice ${newId}`
        }
      ]
    };

    try {
      const created = await fetchApi('/dashboard/add-invoice', { method: 'POST', body: newInv });
      const invoice = created.invoice || created;
      
      setInvoices(prev => [invoice, ...prev]);
      setActiveInvoiceId(invoice.id);
      setIsEditMode(true);
      setEditedInvoice(JSON.parse(JSON.stringify(invoice)));
      addActivity('po', `PO generated — ${newPoId} created with invoice ${invoice.id}`, 'info');
    } catch (err) {
      alert('Failed to create PO/Invoice: ' + err.message);
    }
  };

  // Handlers
  const handleSelectInvoice = (id) => {
    if (isEditMode) {
      if (!confirm("Discard unsaved changes?")) return;
      setIsEditMode(false);
      setEditedInvoice(null);
    }
    setActiveInvoiceId(id);
  };

  const handleStartEdit = () => {
    setIsEditMode(true);
    setEditedInvoice(JSON.parse(JSON.stringify(activeInvoice)));
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedInvoice(null);
  };

  const handleSaveEdit = async () => {
    const hasNegativeValues = editedInvoice.items.some(item => item.qty < 0 || item.unitPrice < 0 || item.tax < 0);
    if (hasNegativeValues) {
      alert("Error: Quantity, price, or tax cannot be negative.");
      return;
    }
    if (editedInvoice.discount < 0) {
      alert("Error: Discount cannot be negative.");
      return;
    }
    try {
      const updatedResponse = await fetchApi(`/invoices/${editedInvoice.id}`, { method: 'PUT', body: editedInvoice });
      const updated = updatedResponse.invoice || updatedResponse;
      setInvoices(prev => prev.map(inv => inv.id === updated.id ? updated : inv));
      setIsEditMode(false);
      setEditedInvoice(null);
      addActivity('invoice', `Invoice updated — ${updated.id || 'Invoice'} modified`, 'info');
    } catch (err) {
      alert('Failed to save invoice: ' + err.message);
    }
  };

  // Field updates in edit mode
  const handleVendorFieldChange = (field, value) => {
    setEditedInvoice(prev => ({
      ...prev,
      vendor: {
        ...prev.vendor,
        [field]: value
      }
    }));
  };

  const handleInvoiceDateFieldChange = (field, value) => {
    setEditedInvoice(prev => ({
      ...prev,
      dates: {
        ...prev.dates,
        [field]: value
      }
    }));
  };

  const handleDiscountChange = (val) => {
    const num = parseFloat(val) || 0;
    setEditedInvoice(prev => ({
      ...prev,
      discount: num
    }));
  };

  const handleItemChange = (index, field, value) => {
    setEditedInvoice(prev => {
      const newItems = [...prev.items];
      if (field === 'name') {
        newItems[index][field] = value;
      } else {
        const num = parseFloat(value) || 0;
        newItems[index][field] = num;
      }
      return {
        ...prev,
        items: newItems
      };
    });
  };

  const handleAddItem = () => {
    setEditedInvoice(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { id: Date.now(), name: "New Item Description", qty: 1, unitPrice: 0, tax: 18 }
      ]
    }));
  };

  const handleDeleteItem = (index) => {
    if (editedInvoice.items.length <= 1) {
      alert("An invoice must contain at least one line item.");
      return;
    }
    setEditedInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index)
    }));
  };

  const handleStatusChange = async (newStatus) => {
    setIsActionLoading(true);
    try {
      const activeInv = invoices.find(inv => inv.id === activeInvoiceId);
      if (!activeInv) throw new Error('Active invoice not found');
      const updatedResponse = await fetchApi(`/invoices/${activeInvoiceId}`, {
        method: 'PUT',
        body: { ...activeInv, status: newStatus }
      });
      const updated = updatedResponse.invoice || updatedResponse;
      setInvoices(prev => prev.map(inv => inv.id === updated.id ? updated : inv));
      
      const stColor = newStatus === 'Paid' ? 'success' : newStatus === 'Overdue' ? 'pending' : 'info';
      addActivity('invoice', `Invoice status — ${activeInv.id || 'Invoice'} marked as ${newStatus}`, stColor);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    setIsPdfLoading(true);
    setTimeout(() => {
      setIsPdfLoading(false);
      window.print();
    }, 1200);
  };

  const handleSendEmail = () => {
    setIsEmailLoading(true);
    setTimeout(() => {
      setIsEmailLoading(false);
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      setInvoices(prev => prev.map(inv => {
        if (inv.id === activeInvoiceId) {
          return {
            ...inv,
            logs: [
              ...inv.logs,
              {
                timestamp,
                level: "INFO",
                user: "System",
                message: `Invoice emailed successfully to vendor contact`
              }
            ]
          };
        }
        return inv;
      }));
      alert(`Invoice ${activeInvoiceId} successfully sent via email.`);
    }, 1500);
  };

  const handleAddCustomLog = (e) => {
    e.preventDefault();
    if (!customLog.trim()) return;

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const logEntry = {
      timestamp,
      level: "DEBUG",
      user: currentRole,
      message: customLog
    };

    setInvoices(prev => prev.map(inv => {
      if (inv.id === activeInvoiceId) {
        return {
          ...inv,
          logs: [...inv.logs, logEntry]
        };
      }
      return inv;
    }));

    setCustomLog("");
  };

  // Severity indicator styling helpers (DebugDeck guidelines)
  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return {
          badge: "dd-chip-status bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0] glow-green",
          dot: "bg-[#22C55E]",
          leftBorder: "border-l-4 border-l-[#22C55E]",
          text: "text-[#15803D]"
        };
      case "Pending":
        return {
          badge: "dd-chip-status dd-chip-status-warning",
          dot: "bg-[#F59E0B]",
          leftBorder: "border-l-4 border-l-[#F59E0B]",
          text: "text-[#B45309]"
        };
      case "Overdue":
        return {
          badge: "dd-chip-status dd-chip-status-critical",
          dot: "bg-[#DC2626]",
          leftBorder: "border-l-4 border-l-[#DC2626]",
          text: "text-[#B91C1C]"
        };
      default: // Draft
        return {
          badge: "dd-chip-status dd-chip-status-debug",
          dot: "bg-[#06B6D4]",
          leftBorder: "border-l-4 border-l-[#06B6D4]",
          text: "text-[#0369A1]"
        };
    }
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case "SUCCESS": return "text-[#15803D]";
      case "ERROR": return "text-[#DC2626] font-semibold";
      case "WARNING": return "text-[#B45309]";
      case "DEBUG": return "text-[#0369A1]";
      default: return "text-[#4B5563]";
    }
  };

  const currentStatusStyle = getStatusStyle(currentInvoiceData?.status || "Draft");

  return (
    <div className="flex-1 bg-white text-[#111111] flex flex-col font-deck-body select-none overflow-hidden">

        {/* Role Bar & Utility Header (no-print) */}
        <header className="h-12 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6 text-xs no-print">
          <div className="flex items-center gap-2">
            <span className="text-[#6B7280] font-deck-caption">USER SESSION:</span>
            <span className="font-deck-code text-[#F59E0B]">Procurement_Officer_GSSoC</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="role-select" className="dd-label !mb-0 font-deck-caption">
                Simulate Role:
              </label>
              <select
                id="role-select"
                value={currentRole}
                onChange={(e) => {
                  setCurrentRole(e.target.value);
                  if (isEditMode) handleCancelEdit();
                }}
                className="dd-input font-deck-code !py-0.5"
              >
                {roles.map((r, idx) => (
                  <option key={idx} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="h-4 w-[1px] bg-[#E5E7EB]" />
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-[11px] text-[#4B5563] font-deck-code">Connected</span>
            </div>
          </div>
        </header>

        {/* Dashboard Area */}
        <main className="flex-1 flex min-h-0">

          {/* 2. Middle Panel: Invoice Explorer (no-print) */}
          <section className="w-84 bg-white border-r border-[#E5E7EB] flex flex-col no-print shrink-0">
            {/* Search and Filters */}
            <div className="p-4 border-b border-[#E5E7EB] space-y-3">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search invoice, PO, vendor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="dd-input w-full !pl-10"
                />
                <svg className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div>
                <label className="dd-label">
                  Filter by Status
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["All", "Draft", "Pending", "Paid", "Overdue"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`dd-chip-filter ${statusFilter === status ? 'dd-chip-filter-active' : ''}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Create Actions based on simulated role */}
            {(showAddInvoiceBtn || showAddPoBtn) && (
              <div className="px-4 py-3 border-b border-[#E5E7EB] flex gap-2">
                {showAddInvoiceBtn && (
                  <button
                    onClick={handleCreateInvoice}
                    className="flex-1 dd-btn dd-btn-primary dd-btn-sm flex items-center justify-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>{currentRole === "Vendor" ? "Submit Invoice" : "Add Invoice"}</span>
                  </button>
                )}
                {showAddPoBtn && (
                  <button
                    onClick={handleCreatePO}
                    className="flex-1 dd-btn dd-btn-secondary dd-btn-sm flex items-center justify-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add PO</span>
                  </button>
                )}
              </div>
            )}

            {/* Invoices List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <div className="font-deck-overline text-[#6B7280] px-2 py-2">
                Documents ({filteredInvoices.length})
              </div>

              {filteredInvoices.length === 0 ? (
                <div className="p-4 text-center font-deck-code text-xs text-[#888888]">
                  No records found
                </div>
              ) : (
                filteredInvoices.map((inv) => {
                  const style = getStatusStyle(inv.status);
                  const isActive = inv.id === activeInvoiceId;

                  return (
                    <div
                      key={inv.id}
                      onClick={() => handleSelectInvoice(inv.id)}
                      className={`p-4 rounded-sm border cursor-pointer transition-all duration-100 flex flex-col gap-2 ${isActive
                          ? 'bg-[#F9FAFB] border-[#F59E0B] glow-amber'
                          : 'bg-white border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB]'
                        }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-deck-code text-xs font-bold text-[#111111]">{inv.id}</span>
                        <span className={style.badge}>
                          {inv.status}
                        </span>
                      </div>

                      <div className="font-deck-body-small text-[#4B5563] truncate w-full">{inv.vendor.name}</div>

                      <div className="flex items-center justify-between w-full text-[10px] font-deck-code text-[#6B7280] mt-1 border-t border-[#E5E7EB] pt-1">
                        <span>{inv.poId}</span>
                        <span>{inv.dates.invoiceDate}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* 3. Right Panel: Active PO & Invoice Sheet */}
          <section className="flex-1 min-w-0 overflow-y-auto bg-white p-6 md:p-8 print-invoice-sheet">

            {/* Top breadcrumb & metadata (no-print) */}
            <div className="flex items-center justify-between text-xs text-[#6B7280] mb-4 no-print font-deck-code">
              <div>
                <span>VendorBridge</span>
                <span className="mx-1.5">/</span>
                <span>Invoices</span>
                <span className="mx-1.5">/</span>
                <span className="text-[#111111] font-semibold">{currentInvoiceData?.id}</span>
              </div>

              <div className="flex items-center gap-1">
                <span>Active Role:</span>
                <span className="text-[#F59E0B] font-bold">{currentRole}</span>
              </div>
            </div>

            {/* Core Header Card (White paper background style) */}
            <div className="bg-white text-[#111111] border border-[#E5E7EB] rounded-sm p-6 mb-5 relative dd-shadow-medium print-invoice-sheet">
              {/* Top border indicating status severity */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${currentStatusStyle.dot}`} />

              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                {/* Title and ID */}
                <div>
                  <h1 className="font-deck-headline text-[#111111] uppercase">
                    Purchase Order & Invoice
                  </h1>
                  <p className="font-deck-code text-xs text-[#666666] mt-1">
                    PO ID: <span className="text-[#F59E0B] font-semibold">{currentInvoiceData?.poId}</span> (Auto-generated after approval)
                  </p>
                </div>

                {/* Actions Box (no-print) */}
                <div className="flex flex-wrap items-center gap-2 no-print self-end md:self-auto">

                  {/* Download PDF Button */}
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isPdfLoading || isEditMode}
                    className="dd-btn dd-btn-secondary dd-btn-sm flex items-center gap-1.5"
                  >
                    {isPdfLoading ? (
                      <span className="w-3 h-3 border-2 border-t-transparent border-[#4B5563] rounded-full animate-spin" />
                    ) : (
                      <svg className="w-3.5 h-3.5 text-[#4B5563]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    )}
                    <span>Download</span>
                  </button>

                  {/* Print Button */}
                  <button
                    onClick={handlePrint}
                    disabled={isEditMode}
                    className="dd-btn dd-btn-secondary dd-btn-sm flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5 text-[#4B5563]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    <span>Print</span>
                  </button>

                  {/* Send Email Button */}
                  <button
                    onClick={handleSendEmail}
                    disabled={isEmailLoading || isEditMode}
                    className="dd-btn dd-btn-secondary dd-btn-sm text-[#06B6D4] flex items-center gap-1.5"
                  >
                    {isEmailLoading ? (
                      <span className="w-3 h-3 border-2 border-t-transparent border-[#06B6D4] rounded-full animate-spin" />
                    ) : (
                      <svg className="w-3.5 h-3.5 text-[#06B6D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                    <span>Send Email</span>
                  </button>

                  {/* Edit/Save Actions (Procurement Officer / Admin only) */}
                  {canEdit && (
                    <div className="flex items-center gap-1.5 ml-2 border-l border-[#E5E7EB] pl-3">
                      {isEditMode ? (
                        <>
                          <button
                            onClick={handleSaveEdit}
                            className="dd-btn dd-btn-primary dd-btn-sm bg-[#22C55E] hover:bg-[#16a34a] text-[#111111] flex items-center gap-1.5"
                          >
                            <svg className="w-3.5 h-3.5 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            <span>Save</span>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="dd-btn dd-btn-destructive dd-btn-sm flex items-center gap-1.5"
                          >
                            <svg className="w-3.5 h-3.5 text-[#DC2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Cancel</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleStartEdit}
                          className="dd-btn dd-btn-primary dd-btn-sm flex items-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          <span>Edit</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Mark as Paid / Change Status Dropdown (Manager / Admin only) */}
                  {canApprove && !isEditMode && (
                    <div className="relative ml-2 border-l border-[#E5E7EB] pl-3">
                      <select
                        value={currentInvoiceData?.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={isActionLoading}
                        className="dd-input !bg-white !text-[#F59E0B] border-[#F59E0B]/50 hover:border-[#F59E0B] font-deck-code !py-0.5"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Vendor & Invoice Metadata Grid — 3 columns */}
              <div className="grid grid-cols-3 gap-6 mt-6 pt-5 border-t border-[#E5E7EB]">

                {/* Left Column (Vendor & Doc Identifiers) */}
                <div className="space-y-4">
                  <div>
                    <label className="dd-label !text-[#666666]">
                      Vendor Name
                    </label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={editedInvoice.vendor.name}
                        onChange={(e) => handleVendorFieldChange('name', e.target.value)}
                        className="dd-input !bg-white !text-[#111111] !border-[#CCCCCC] focus:!border-[#F59E0B] w-full font-deck-code"
                      />
                    ) : (
                      <div className="font-deck-code text-xs font-bold text-[#111111]">
                        {currentInvoiceData?.vendor.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="dd-label !text-[#666666]">
                      Vendor Address
                    </label>
                    {isEditMode ? (
                      <textarea
                        rows={2}
                        value={editedInvoice.vendor.address}
                        onChange={(e) => handleVendorFieldChange('address', e.target.value)}
                        className="dd-input !bg-white !text-[#111111] !border-[#CCCCCC] focus:!border-[#F59E0B] w-full font-deck-code resize-none"
                      />
                    ) : (
                      <div className="font-deck-code text-xs text-[#444444] leading-relaxed">
                        {currentInvoiceData?.vendor.address}
                      </div>
                    )}
                  </div>

                </div>

                {/* Col 2 — Dates & Terms */}
                <div className="space-y-4">
                  <div>
                    <label className="dd-label !text-[#666666]">Invoice Date</label>
                    {isEditMode ? (
                      <input
                        type="date"
                        value={editedInvoice.dates.invoiceDate}
                        onChange={(e) => handleInvoiceDateFieldChange('invoiceDate', e.target.value)}
                        className="dd-input !bg-white !text-[#111111] !border-[#CCCCCC] focus:!border-[#F59E0B] w-full font-deck-code !py-0.5"
                      />
                    ) : (
                      <div className="font-deck-code text-xs text-[#111111]">
                        {currentInvoiceData?.dates.invoiceDate}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="dd-label !text-[#666666]">Due Date</label>
                    {isEditMode ? (
                      <input
                        type="date"
                        value={editedInvoice.dates.dueDate}
                        onChange={(e) => handleInvoiceDateFieldChange('dueDate', e.target.value)}
                        className="dd-input !bg-white !text-[#111111] !border-[#CCCCCC] focus:!border-[#F59E0B] w-full font-deck-code !py-0.5"
                      />
                    ) : (
                      <div className="font-deck-code text-xs text-[#111111]">
                        {currentInvoiceData?.dates.dueDate}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="dd-label !text-[#666666]">Payment Terms</label>
                    {isEditMode ? (
                      <select
                        value={editedInvoice.dates.paymentTerms}
                        onChange={(e) => handleInvoiceDateFieldChange('paymentTerms', e.target.value)}
                        className="dd-input !bg-white !text-[#111111] !border-[#CCCCCC] focus:!border-[#F59E0B] w-full font-deck-code"
                      >
                        <option value="Immediate Payment">Immediate Payment</option>
                        <option value="Net 15">Net 15</option>
                        <option value="Net 30">Net 30</option>
                        <option value="Net 60">Net 60</option>
                      </select>
                    ) : (
                      <div className="font-deck-code text-xs text-[#111111]">
                        {currentInvoiceData?.dates.paymentTerms}
                      </div>
                    )}
                  </div>
                </div>

                {/* Col 3 — IDs & Status */}
                <div className="space-y-4">
                  <div>
                    <label className="dd-label !text-[#666666]">Invoice Number</label>
                    <div className="font-deck-code text-xs text-[#111111] font-bold">
                      {currentInvoiceData?.id}
                    </div>
                  </div>

                  <div>
                    <label className="dd-label !text-[#666666]">Purchase Order ID</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={editedInvoice.poId}
                        onChange={(e) => setEditedInvoice(prev => ({ ...prev, poId: e.target.value }))}
                        className="dd-input !bg-white !text-[#111111] !border-[#CCCCCC] focus:!border-[#F59E0B] w-full font-deck-code !py-0.5"
                      />
                    ) : (
                      <div className="font-deck-code text-xs text-[#111111]">
                        {currentInvoiceData?.poId}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="dd-label !text-[#666666]">Status</label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={currentStatusStyle.badge}>
                        {currentInvoiceData?.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* 4. Invoice Items Table */}
            <div className="bg-white border border-[#E5E7EB] rounded-sm p-0 overflow-hidden mb-4 print-invoice-sheet">
              <table className="w-full text-left border-collapse font-deck-code text-xs">
                <thead>
                  <tr className="bg-[#F3F4F6] border-b border-[#E5E7EB] text-[#4B5563]">
                    <th className="p-2.5 font-bold uppercase text-[12px]">#</th>
                    <th className="p-2.5 font-bold uppercase text-[12px] w-2/5">Item Name / Description</th>
                    <th className="p-2.5 font-bold uppercase text-[12px] text-right">Quantity</th>
                    <th className="p-2.5 font-bold uppercase text-[12px] text-right">Unit Price</th>
                    <th className="p-2.5 font-bold uppercase text-[12px] text-right">Tax %</th>
                    <th className="p-2.5 font-bold uppercase text-[12px] text-right">Line Total</th>
                    {isEditMode && <th className="p-2.5 font-bold uppercase text-[12px] text-center no-print-element">Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {currentInvoiceData?.items.map((item, idx) => {
                    const lineSubtotal = (item.qty || 0) * (item.unitPrice || 0);
                    const lineTax = lineSubtotal * ((item.tax || 0) / 100);
                    const lineTotal = lineSubtotal + lineTax;

                    return (
                      <tr
                        key={item.id}
                        className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors"
                      >
                        <td className="p-2.5 text-[#888888] font-semibold">{idx + 1}</td>
                        <td className="p-2.5 text-[#111111] font-deck-body">
                          {isEditMode ? (
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                              className="dd-input !bg-white !text-[#111111] !border-[#CCCCCC] focus:!border-[#F59E0B] w-full font-deck-body !py-0.5"
                            />
                          ) : (
                            item.name
                          )}
                        </td>
                        <td className="p-2.5 text-right font-deck-code text-[#111111]">
                          {isEditMode ? (
                            <input
                              type="number"
                              min="0"
                              value={item.qty}
                              onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                              className="dd-input !bg-white !text-[#111111] !border-[#CCCCCC] focus:!border-[#F59E0B] w-20 text-right font-deck-code !py-0.5"
                            />
                          ) : (
                            item.qty
                          )}
                        </td>
                        <td className="p-2.5 text-right font-deck-code text-[#111111]">
                          {isEditMode ? (
                            <input
                              type="number"
                              min="0"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                              className="dd-input !bg-white !text-[#111111] !border-[#CCCCCC] focus:!border-[#F59E0B] w-24 text-right font-deck-code !py-0.5"
                            />
                          ) : (
                            `$${(item.unitPrice || 0).toLocaleString()}`
                          )}
                        </td>
                        <td className="p-2.5 text-right font-deck-code text-[#4B5563]">
                          {isEditMode ? (
                            <select
                              value={item.tax}
                              onChange={(e) => handleItemChange(idx, 'tax', e.target.value)}
                              className="dd-input !bg-white !text-[#111111] !border-[#CCCCCC] focus:!border-[#F59E0B] font-deck-code text-right !py-0.5"
                            >
                              <option value="0">0%</option>
                              <option value="5">5%</option>
                              <option value="10">10%</option>
                              <option value="12">12%</option>
                              <option value="18">18%</option>
                            </select>
                          ) : (
                            `${item.tax}%`
                          )}
                        </td>
                        <td className="p-2.5 text-right font-deck-code text-[#111111] font-bold">
                          ${lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        {isEditMode && (
                          <td className="p-2.5 text-center no-print-element">
                            <button
                              onClick={() => handleDeleteItem(idx)}
                              className="text-[#DC2626] hover:text-[#B91C1C] font-bold text-sm inline-flex items-center justify-center w-full"
                              title="Delete row"
                            >
                              <svg className="w-4 h-4 text-[#DC2626] hover:text-[#B91C1C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Add Item Actions (no-print) */}
              {isEditMode && (
                <div className="p-2.5 bg-[#F9FAFB] border-t border-[#E5E7EB] no-print">
                  <button
                    onClick={handleAddItem}
                    className="dd-btn dd-btn-secondary dd-btn-sm text-[#F59E0B] !bg-white !border-[#CCCCCC] hover:!bg-[#F3F4F6] flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Item</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Section: Totals Panel & ERP Activity Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start print-invoice-sheet">

              {/* Left Details / Comments or Log (no-print) */}
              <div className="lg:col-span-7 no-print">

                {/* Dense activity log panel (DebugDeck styling) */}
                <div className="dd-card !p-3 flex flex-col h-[280px] bg-white border border-[#E5E7EB]">
                  <div className="font-deck-overline mb-2 border-b border-[#E5E7EB] pb-1.5 flex items-center justify-between text-[#374151]">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-[#6B7280] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>ERP ACTIVITY AUDIT LOG</span>
                    </div>
                    <span className="text-[#06B6D4] font-deck-code">INTEGRITY CHECK: OK</span>
                  </div>

                  {/* Log list */}
                  <div className="flex-1 overflow-y-auto space-y-1 font-deck-code text-[12px] leading-tight pr-1">
                    {activeInvoice?.logs.map((log, index) => (
                      <div key={index} className="flex items-start gap-1.5 py-0.5 hover:bg-[#F3F4F6] px-1 rounded-[2px]">
                        <span className="text-[#888888] shrink-0 font-light">{log.timestamp.split(' ')[1]}</span>
                        <span className={`px-1 text-[10px] font-bold uppercase rounded-[2px] bg-[#E5E7EB] shrink-0 ${getLogLevelColor(log.level)}`}>
                          {log.level}
                        </span>
                        <span className="text-[#6B7280] shrink-0">[{log.user}]</span>
                        <span className="text-[#111111] break-all">{log.message}</span>
                      </div>
                    ))}
                  </div>

                  {/* Add log message input */}
                  <form onSubmit={handleAddCustomLog} className="mt-3 pt-2.5 border-t border-[#E5E7EB] flex gap-2">
                    <input
                      type="text"
                      placeholder="Log comment..."
                      value={customLog}
                      onChange={(e) => setCustomLog(e.target.value)}
                      className="dd-input flex-1 font-deck-code"
                    />
                    <button
                      type="submit"
                      className="dd-btn dd-btn-secondary dd-btn-sm text-[#F59E0B]"
                    >
                      Log
                    </button>
                  </form>
                </div>
              </div>

              {/* 5. Sticky Totals Panel */}
              <div className="lg:col-span-5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-sm p-4 font-deck-code flex flex-col gap-2.5 self-stretch justify-between text-[#111111]">
                <div>
                  <div className="font-deck-overline mb-2 border-b border-[#E5E7EB] pb-1 text-[#666666]">
                    Financial totals
                  </div>

                  {/* Subtotal */}
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#666666]">Subtotal</span>
                    <span className="text-[#111111] font-bold">
                      ${calculations.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Tax Total */}
                  <div className="flex justify-between items-center py-1 border-b border-[#E5E7EB]/50">
                    <span className="text-[#666666]">Tax total</span>
                    <span className="text-[#111111] font-bold">
                      +${calculations.taxTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Discount */}
                  <div className="flex justify-between items-center py-1.5 border-b border-[#E5E7EB]">
                    <span className="text-[#666666]">Discount</span>
                    {isEditMode ? (
                      <div className="flex items-center gap-1">
                        <span className="text-[#666666]">$</span>
                        <input
                          type="number"
                          min="0"
                          value={editedInvoice.discount}
                          onChange={(e) => handleDiscountChange(e.target.value)}
                          className="dd-input !bg-white !text-[#111111] !border-[#CCCCCC] focus:!border-[#F59E0B] w-20 text-right font-deck-code !py-0.5"
                        />
                      </div>
                    ) : (
                      <span className="text-[#DC2626] font-bold">
                        -${(currentInvoiceData?.discount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Grand Total */}
                <div className={`p-2.5 rounded-sm border mt-2 flex justify-between items-center transition-all font-bold font-deck-subhead ${currentInvoiceData?.status === "Paid" ? "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0] glow-green" :
                    currentInvoiceData?.status === "Pending" ? "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A] glow-amber" :
                      currentInvoiceData?.status === "Overdue" ? "bg-[#FEE2E2] text-[#B91C1C] border-[#FCA5A5] glow-red" :
                        "bg-[#ECFEFF] text-[#0369A1] border-[#A5F3FC] glow-cyan"
                  }`}>
                  <span className="uppercase tracking-wider font-deck-overline">Grand Total</span>
                  <span>
                    ${calculations.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

              </div>
            </div>

          </section>

        </main>

    </div>
  );
}
