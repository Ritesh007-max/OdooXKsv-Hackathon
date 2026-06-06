import React, { useState, useEffect } from 'react';
import RFQForm from './RFQForm';
import RFQLineItems from './RFQLineItems';
import RFQVendors from './RFQVendors';
import RFQAttachments from './RFQAttachments';
import Button from '../ui/Button';
import { fetchApi } from '../../api';
import { useActivity } from '../../ActivityContext';
import { FileText, Plus, Search, ArrowLeft, Edit, Calendar, Users, ShoppingBag } from 'lucide-react';

const RFQsView = ({ initialMode, clearInitialMode }) => {
  const { addActivity } = useActivity();
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'form'
  const [editingRfq, setEditingRfq] = useState(null); // RFQ object being edited
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [formData, setFormData] = useState({ title: '', category: '', deadline: '', description: '' });
  const [lineItems, setLineItems] = useState([]);
  const [assignedVendors, setAssignedVendors] = useState([]);
  const [attachments, setAttachments] = useState([]);

  // Load RFQs from Backend
  const loadRfqs = () => {
    setLoading(true);
    fetchApi('/dashboard/get-rfqs')
      .then((data) => {
        setRfqs(data.rfqs || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load RFQs:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadRfqs();
  }, []);

  // Handle direct navigation from dashboard to creation form
  useEffect(() => {
    if (initialMode === 'create') {
      handleOpenCreateForm();
      if (clearInitialMode) clearInitialMode();
    }
  }, [initialMode]);

  const handleOpenCreateForm = () => {
    setEditingRfq(null);
    setFormData({ title: '', category: '', deadline: '', description: '' });
    setLineItems([
      { id: 1, item: 'Ergonomic chair', qty: '25', unit: 'NOS' },
      { id: 2, item: 'Standing desks', qty: '10', unit: 'NOS' }
    ]);
    setAssignedVendors([]);
    setAttachments([]);
    setViewMode('form');
  };

  // Helper: Parse product string (e.g. "25x Ergonomic chair, 10x Standing desks") back into line items
  const parseProductString = (productStr) => {
    if (!productStr) return [];
    return productStr.split(', ').map((part, idx) => {
      const match = part.match(/^(\d+)x\s*(.+)$/);
      if (match) {
        return {
          id: idx + 1,
          item: match[2],
          qty: match[1],
          unit: 'NOS'
        };
      }
      return {
        id: idx + 1,
        item: part,
        qty: '1',
        unit: 'NOS'
      };
    });
  };

  const handleOpenEditForm = (rfq) => {
    setEditingRfq(rfq);
    
    // Parse deadline to YYYY-MM-DD
    const deadlineDate = rfq.deadline ? new Date(rfq.deadline).toISOString().split('T')[0] : '';
    
    setFormData({
      title: rfq.title || '',
      category: rfq.category || '',
      deadline: deadlineDate,
      description: rfq.description || ''
    });

    // Parse product string back into line items
    setLineItems(parseProductString(rfq.product));

    // Map vendors to frontend shape
    const mappedVendors = (rfq.vendors || []).map(v => ({
      id: v._id || v,
      name: v.name || 'Unknown Vendor'
    }));
    setAssignedVendors(mappedVendors);
    
    setAttachments([]); // Attachments are not stored in DB, start fresh
    setViewMode('form');
  };

  const handleSave = async (status = 'draft') => {
    if (!formData.title) {
      alert('Please fill out the RFQ title.');
      return;
    }
    if (!formData.deadline) {
      alert('Please select a deadline date.');
      return;
    }
    if (lineItems.length === 0) {
      alert('Please add at least one line item.');
      return;
    }

    setSaving(true);

    // Format products string & sum quantities
    const product = lineItems
      .map(item => `${item.qty || 1}x ${item.item || 'Unnamed Item'}`)
      .filter(Boolean)
      .join(', ');

    const quantity = lineItems.reduce((sum, item) => sum + (parseInt(item.qty, 10) || 0), 0) || 1;

    const payload = {
      title: formData.title,
      category: formData.category,
      description: formData.description,
      deadline: formData.deadline,
      product,
      quantity,
      status,
      vendors: assignedVendors.map(v => v.id)
    };

    try {
      if (editingRfq) {
        await fetchApi(`/dashboard/update-rfq/${editingRfq._id}`, {
          method: 'PUT',
          body: payload
        });
        addActivity('rfq', `RFQ updated — ${payload.title}`, 'info');
      } else {
        await fetchApi('/dashboard/add-rfq', {
          method: 'POST',
          body: payload
        });
        addActivity('rfq', `RFQ created — ${payload.title} (${status})`, status === 'open' ? 'success' : 'pending');
      }
      
      setViewMode('list');
      loadRfqs();
    } catch (err) {
      console.error('Error saving RFQ:', err);
      alert('Failed to save RFQ. Please check your inputs and try again.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadgeStyle = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'open':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'closed':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'awarded':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'cancelled':
        return 'bg-orange-50 text-orange-700 border border-orange-200';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  const filteredRfqs = rfqs.filter(rfq => {
    const query = searchQuery.toLowerCase();
    return (
      (rfq.title || '').toLowerCase().includes(query) ||
      (rfq.product || '').toLowerCase().includes(query) ||
      (rfq.category || '').toLowerCase().includes(query)
    );
  });

  if (viewMode === 'list') {
    return (
      <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-[#FAF9F6]">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-display font-sans font-bold mb-2">Request for Quotations</h1>
            <p className="text-body font-sans text-gray-600">
              Manage requests and distribute to active vendors
            </p>
          </div>
          <Button variant="primary" onClick={handleOpenCreateForm} className="flex items-center gap-1.5 shadow-sm">
            <Plus size={16} /> New RFQ
          </Button>
        </div>

        {/* Filter Section */}
        <div className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 w-full max-w-md shadow-sm">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search RFQs by title, category, or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-body font-sans"
          />
        </div>

        {/* List Table */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-20 text-body font-sans text-gray-400">
            Loading RFQs...
          </div>
        ) : filteredRfqs.length > 0 ? (
          <div className="bg-white border border-gray-300 rounded-md overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5 text-caption font-sans font-semibold text-gray-500 uppercase tracking-wider">RFQ Info</th>
                  <th className="px-6 py-3.5 text-caption font-sans font-semibold text-gray-500 uppercase tracking-wider">Line Items Summary</th>
                  <th className="px-6 py-3.5 text-caption font-sans font-semibold text-gray-500 uppercase tracking-wider">Vendors</th>
                  <th className="px-6 py-3.5 text-caption font-sans font-semibold text-gray-500 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-3.5 text-caption font-sans font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-caption font-sans font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRfqs.map((rfq) => (
                  <tr key={rfq._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="font-sans font-semibold text-gray-900">{rfq.title}</div>
                      <div className="text-[12px] font-sans text-gray-500 mt-0.5">Category: {rfq.category || 'General'}</div>
                    </td>
                    <td className="px-6 py-4 max-w-[280px]">
                      <div className="font-sans text-gray-800 text-body truncate" title={rfq.product}>
                        {rfq.product}
                      </div>
                      <div className="text-[12px] font-sans text-gray-500 mt-0.5">Total qty: {rfq.quantity}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Users size={16} className="text-gray-400" />
                        <span className="font-sans text-gray-700 text-body">
                          {rfq.vendors?.length || 0} assigned
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="font-sans text-gray-700 text-body">
                          {rfq.deadline ? new Date(rfq.deadline).toLocaleDateString() : 'No date'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize tracking-wide ${getStatusBadgeStyle(rfq.status)}`}>
                        {rfq.status || 'draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenEditForm(rfq)}
                        className="text-primary hover:text-orange-700 font-sans font-semibold text-body flex items-center gap-1 ml-auto"
                      >
                        <Edit size={14} /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white border border-gray-300 rounded-md p-12 text-center shadow-sm">
            <FileText size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-headline font-sans font-bold text-gray-900 mb-1">No RFQs found</h3>
            <p className="text-body font-sans text-gray-500 mb-4">
              Create a new Request for Quotation to distribute to your suppliers.
            </p>
            <Button variant="primary" onClick={handleOpenCreateForm}>+ Create RFQ</Button>
          </div>
        )}
      </main>
    );
  }

  // Edit/Create Form View
  return (
    <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 bg-[#FAF9F6]">
      {/* Header section */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setViewMode('list')}
          className="p-1.5 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition-colors shadow-sm"
          title="Back to list"
        >
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <div>
          <h1 className="text-display font-sans font-bold mb-0">
            {editingRfq ? 'Edit RFQ' : "Create RFQ's"}
          </h1>
          <p className="text-body font-sans text-gray-600">
            {editingRfq ? `Modify RFQ ID: ${editingRfq._id}` : 'New request for quotation'}
          </p>
        </div>
      </div>

      {/* Stepper (Visual only) */}
      <div className="flex items-center w-full my-1 max-w-xl">
        <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-primary text-primary font-bold bg-white text-xs">1</div>
        <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
        <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-400 text-gray-400 font-bold bg-white text-xs">2</div>
        <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
        <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-400 text-gray-400 font-bold bg-white text-xs">3</div>
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8 border-b border-gray-300 pb-5">
        
        {/* Left Column - Form fields */}
        <div className="flex-1 flex flex-col gap-4 bg-white p-5 border border-gray-300 rounded-md shadow-sm">
          <RFQForm formData={formData} setFormData={setFormData} />
        </div>

        {/* Right Column - Items & Vendors */}
        <div className="flex-1 flex flex-col gap-5 bg-white p-5 border border-gray-300 rounded-md shadow-sm">
          <RFQLineItems items={lineItems} setItems={setLineItems} />
          <RFQVendors assignedVendors={assignedVendors} setAssignedVendors={setAssignedVendors} />
        </div>

      </div>

      {/* Bottom Layout - Buttons & Attachments */}
      <div className="flex flex-col lg:flex-row gap-8 mt-2 pb-8">
        <div className="flex-1 flex flex-row items-center gap-3">
          <Button
            variant="primary"
            onClick={() => handleSave('open')}
            disabled={saving}
            className="flex items-center gap-1.5"
          >
            {saving ? 'Processing...' : 'Save & Send to Vendors'}
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="border-gray-400"
          >
            {saving ? 'Processing...' : 'Save as Draft'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setViewMode('list')}
            disabled={saving}
          >
            Cancel
          </Button>
        </div>
        
        <div className="flex-1 bg-white p-5 border border-gray-300 rounded-md shadow-sm">
          <RFQAttachments attachments={attachments} setAttachments={setAttachments} />
        </div>
      </div>
    </main>
  );
};

export default RFQsView;
