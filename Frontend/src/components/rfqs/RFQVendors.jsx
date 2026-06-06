import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { fetchApi } from '../../api';

const RFQVendors = ({ assignedVendors, setAssignedVendors }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allVendors, setAllVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      setLoading(true);
      fetchApi('/vendors')
        .then((data) => {
          const mapped = (data.vendors || []).map((v) => ({
            id: v._id,
            name: v.name,
            category: v.category,
            status: v.status || 'Active'
          }));
          setAllVendors(mapped);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to fetch vendors:', err);
          setLoading(false);
        });
    }
  }, [isModalOpen]);

  const handleAddVendor = (vendor) => {
    if (!assignedVendors.find(v => v.id === vendor.id)) {
      setAssignedVendors([...assignedVendors, vendor]);
    }
    setIsModalOpen(false);
  };

  const handleRemoveVendor = (id) => {
    setAssignedVendors(assignedVendors.filter(v => v.id !== id));
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="block text-caption font-sans font-semibold text-gray-700 uppercase">Assign Vendors</label>
      
      <div className="bg-white border border-gray-300 rounded-md overflow-hidden flex flex-col">
        {assignedVendors.map((vendor, idx) => (
          <div key={vendor.id} className={`flex justify-between items-center px-4 py-2.5 ${idx < assignedVendors.length - 1 ? 'border-b border-gray-200' : ''}`}>
            <span className="text-body font-sans text-gray-900">{vendor.name}</span>
            <button onClick={() => handleRemoveVendor(vendor.id)} className="text-gray-400 hover:text-red-500 font-bold">×</button>
          </div>
        ))}

        <div className={`p-2 ${assignedVendors.length > 0 ? 'border-t border-gray-300 bg-gray-50' : ''}`}>
          <button onClick={() => setIsModalOpen(true)} className="text-body font-sans font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1 w-full text-left px-2 py-1">
            + add vendor
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[400px] p-6">
            <h2 className="text-headline font-sans font-bold mb-4">Select Vendor</h2>
            <div className="max-h-[300px] overflow-y-auto flex flex-col gap-2">
              {loading ? (
                <div className="text-gray-500 font-sans text-center py-4">Loading vendors...</div>
              ) : allVendors.length > 0 ? (
                allVendors.map(vendor => (
                  <button 
                    key={vendor.id}
                    onClick={() => handleAddVendor(vendor)}
                    className="text-left w-full p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-sans font-medium text-gray-900">{vendor.name}</div>
                    <div className="font-sans text-[12px] text-gray-500">{vendor.category} - {vendor.status}</div>
                  </button>
                ))
              ) : (
                <div className="text-gray-500 font-sans text-center py-4">No vendors found. Please add vendors in the Vendors page first.</div>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RFQVendors;
