import React, { useState, useEffect } from 'react';
import VendorFilters from './VendorFilters';
import VendorsTable from './VendorsTable';
import Button from '../ui/Button';
import { fetchApi } from '../../api';
import { useActivity } from '../../ActivityContext';

const VendorsView = ({ openVendorModal, setOpenVendorModal }) => {
  const { addActivity } = useActivity();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null); // Used for Edit modal

  const loadVendors = () => {
    setLoading(true);
    fetchApi('/dashboard/get-vendors')
      .then((data) => {
        const mapped = (data.vendors || []).map((v) => ({
          id: v._id,
          name: v.name,
          category: v.category,
          gst: v.gst,
          contact: v.contact,
          status: v.status || 'Active',
        }));
        setVendors(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch vendors:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadVendors();
  }, []);

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
    
    fetchApi('/dashboard/add-vendor', {
      method: 'POST',
      body: newVendor
    })
      .then(() => {
        addActivity('vendor', `Vendor added — ${newVendor.name} registered`, 'success');
        setIsAddModalOpen(false);
        setNewVendor({ name: '', category: '', gst: '', contact: '', status: 'Active' });
        loadVendors();
      })
      .catch((err) => {
        console.error('Failed to add vendor:', err);
        alert('Failed to add vendor. GST number must be unique.');
      });
  };

  const handleUpdateVendor = (e) => {
    e.preventDefault();
    if (!selectedVendor || !selectedVendor.name) return;

    fetchApi(`/dashboard/update-vendor/${selectedVendor.id}`, {
      method: 'PUT',
      body: selectedVendor
    })
      .then(() => {
        addActivity('vendor', `Vendor updated — ${selectedVendor.name} profile modified`, 'info');
        setSelectedVendor(null);
        loadVendors();
      })
      .catch((err) => {
        console.error('Failed to update vendor:', err);
        alert('Failed to update vendor.');
      });
  };

  const handleRemoveVendor = () => {
    if (!selectedVendor) return;

    fetchApi(`/dashboard/delete-vendor/${selectedVendor.id}`, {
      method: 'DELETE'
    })
      .then(() => {
        addActivity('vendor', `Vendor removed — Profile deleted`, 'pending');
        setSelectedVendor(null);
        loadVendors();
      })
      .catch((err) => {
        console.error('Failed to delete vendor:', err);
        alert('Failed to delete vendor.');
      });
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = 
      (vendor.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vendor.gst || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vendor.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeFilter === 'all' || (vendor.status || '').toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesTab;
  });

  const counts = {
    all: vendors.length,
    active: vendors.filter(v => (v.status || '').toLowerCase() === 'active').length,
    pending: vendors.filter(v => (v.status || '').toLowerCase() === 'pending').length,
    blocked: vendors.filter(v => (v.status || '').toLowerCase() === 'blocked').length,
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

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-20 text-body font-sans text-gray-400">
          Loading vendors...
        </div>
      ) : (
        <VendorsTable vendors={filteredVendors} onViewVendor={(v) => setSelectedVendor(v)} />
      )}

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
