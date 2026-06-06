import React, { useState, useEffect } from 'react';
import VendorFilters from './VendorFilters';
import VendorsTable from './VendorsTable';
import Button from '../ui/Button';

// Initial Mock data
const initialVendors = [
  { id: 1, name: 'Infra Supplies Pvt Ltd', category: 'Constructions', gst: '27AABCS1429Bz0', contact: 'XYZ Number', status: 'Active' },
  { id: 2, name: 'Tech Core LTD', category: 'IT', gst: '27AABCS1429Bz0', contact: 'XYZ Number', status: 'Active' },
  { id: 3, name: 'FastLog Transport', category: 'logistics', gst: '27AABCS1429Bz0', contact: 'XYZ Number', status: 'Blocked' },
];

const VendorsView = ({ openVendorModal, setOpenVendorModal }) => {
  // Lazy init from localStorage
  const [vendors, setVendors] = useState(() => {
    const saved = localStorage.getItem('vendorBridge_vendors');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return initialVendors; }
    }
    return initialVendors;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null); // Used for Edit modal
  
  useEffect(() => {
    localStorage.setItem('vendorBridge_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    if (openVendorModal) {
      setIsAddModalOpen(true);
      setOpenVendorModal(false);
    }
  }, [openVendorModal, setOpenVendorModal]);
  
  const [newVendor, setNewVendor] = useState({
    name: '', category: '', gst: '', contact: '', status: 'Active'
  });

  const handleAddVendor = (e) => {
    e.preventDefault();
    if (!newVendor.name) return;
    
    setVendors([...vendors, { ...newVendor, id: Date.now() }]);
    setIsAddModalOpen(false);
    setNewVendor({ name: '', category: '', gst: '', contact: '', status: 'Active' });
  };

  const handleUpdateVendor = (e) => {
    e.preventDefault();
    if (!selectedVendor || !selectedVendor.name) return;

    setVendors(vendors.map(v => v.id === selectedVendor.id ? selectedVendor : v));
    setSelectedVendor(null);
  };

  const handleRemoveVendor = () => {
    if (!selectedVendor) return;
    setVendors(vendors.filter(v => v.id !== selectedVendor.id));
    setSelectedVendor(null);
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = 
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.gst.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeFilter === 'all' || vendor.status.toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesTab;
  });

  const counts = {
    all: vendors.length,
    active: vendors.filter(v => v.status.toLowerCase() === 'active').length,
    pending: vendors.filter(v => v.status.toLowerCase() === 'pending').length,
    blocked: vendors.filter(v => v.status.toLowerCase() === 'blocked').length,
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 relative">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-display font-sans font-bold mb-2">Vendors</h1>
          <p className="text-body-large font-sans text-gray-600">
            Manage supplier profiles and registrations
          </p>
        </div>
        <Button variant="secondary" onClick={() => setIsAddModalOpen(true)} className="border-gray-300">
          + Add Vendor
        </Button>
      </div>

      <VendorFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        counts={counts}
      />

      <VendorsTable vendors={filteredVendors} onViewVendor={(v) => setSelectedVendor(v)} />

      {/* Add Vendor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[400px] p-6">
            <h2 className="text-headline font-sans font-bold mb-4">Add New Vendor</h2>
            <form onSubmit={handleAddVendor} className="flex flex-col gap-4">
              <div>
                <label className="block text-caption font-sans font-semibold text-gray-700 mb-1">Vendor Name</label>
                <input required type="text" value={newVendor.name} onChange={e => setNewVendor({...newVendor, name: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-body font-sans" />
              </div>
              <div>
                <label className="block text-caption font-sans font-semibold text-gray-700 mb-1">Category</label>
                <input required type="text" value={newVendor.category} onChange={e => setNewVendor({...newVendor, category: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-body font-sans" />
              </div>
              <div>
                <label className="block text-caption font-sans font-semibold text-gray-700 mb-1">GST no.</label>
                <input required type="text" value={newVendor.gst} onChange={e => setNewVendor({...newVendor, gst: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-body font-mono" />
              </div>
              <div>
                <label className="block text-caption font-sans font-semibold text-gray-700 mb-1">Contact no.</label>
                <input required type="text" value={newVendor.contact} onChange={e => setNewVendor({...newVendor, contact: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-body font-mono" />
              </div>
              <div>
                <label className="block text-caption font-sans font-semibold text-gray-700 mb-1">Status</label>
                <select value={newVendor.status} onChange={e => setNewVendor({...newVendor, status: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-body font-sans bg-white">
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Add Vendor</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View/Edit Vendor Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[400px] p-6">
            <h2 className="text-headline font-sans font-bold mb-4">Edit Vendor</h2>
            <form onSubmit={handleUpdateVendor} className="flex flex-col gap-4">
              <div>
                <label className="block text-caption font-sans font-semibold text-gray-700 mb-1">Vendor Name</label>
                <input required type="text" value={selectedVendor.name} onChange={e => setSelectedVendor({...selectedVendor, name: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-body font-sans" />
              </div>
              <div>
                <label className="block text-caption font-sans font-semibold text-gray-700 mb-1">Category</label>
                <input required type="text" value={selectedVendor.category} onChange={e => setSelectedVendor({...selectedVendor, category: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-body font-sans" />
              </div>
              <div>
                <label className="block text-caption font-sans font-semibold text-gray-700 mb-1">GST no.</label>
                <input required type="text" value={selectedVendor.gst} onChange={e => setSelectedVendor({...selectedVendor, gst: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-body font-mono" />
              </div>
              <div>
                <label className="block text-caption font-sans font-semibold text-gray-700 mb-1">Contact no.</label>
                <input required type="text" value={selectedVendor.contact} onChange={e => setSelectedVendor({...selectedVendor, contact: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-body font-mono" />
              </div>
              <div>
                <label className="block text-caption font-sans font-semibold text-gray-700 mb-1">Status</label>
                <select value={selectedVendor.status} onChange={e => setSelectedVendor({...selectedVendor, status: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-body font-sans bg-white">
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <Button type="button" variant="destructive" onClick={handleRemoveVendor}>Remove</Button>
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" onClick={() => setSelectedVendor(null)}>Cancel</Button>
                  <Button type="submit" variant="primary">Send</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
};

export default VendorsView;
