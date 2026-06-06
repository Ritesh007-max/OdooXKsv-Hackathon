import React from 'react';
import Button from '../ui/Button';

const getStatusStyles = (status) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'text-green-600 bg-green-50';
    case 'pending':
      return 'text-orange-600 bg-orange-50';
    case 'blocked':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const getStatusDot = (status) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-500';
    case 'pending':
      return 'bg-orange-500';
    case 'blocked':
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
};

const VendorsTable = ({ vendors, onViewVendor }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex-1 mt-4">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-5 py-3 text-caption font-sans font-semibold text-gray-500 uppercase">Vendor Name</th>
              <th className="px-5 py-3 text-caption font-sans font-semibold text-gray-500 uppercase">Category</th>
              <th className="px-5 py-3 text-caption font-sans font-semibold text-gray-500 uppercase">GST no.</th>
              <th className="px-5 py-3 text-caption font-sans font-semibold text-gray-500 uppercase">contact no.</th>
              <th className="px-5 py-3 text-caption font-sans font-semibold text-gray-500 uppercase text-center">Status</th>
              <th className="px-5 py-3 text-caption font-sans font-semibold text-gray-500 uppercase text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {vendors.length > 0 ? (
              vendors.map((vendor, index) => (
                <tr 
                  key={vendor.id} 
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index === vendors.length - 1 ? 'border-b-0' : ''}`}
                >
                  <td className="px-5 py-3 text-body font-sans text-gray-900 font-medium">{vendor.name}</td>
                  <td className="px-5 py-3 text-body font-sans text-gray-600">{vendor.category}</td>
                  <td className="px-5 py-3 text-body font-mono text-gray-600">{vendor.gst}</td>
                  <td className="px-5 py-3 text-body font-mono text-gray-600">{vendor.contact}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${getStatusDot(vendor.status)}`}></span>
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-sans font-medium ${getStatusStyles(vendor.status)}`}>
                        {vendor.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <Button 
                      variant="secondary" 
                      size="small" 
                      className="!h-7 px-4 rounded-md !text-[12px] border-gray-300"
                      onClick={() => onViewVendor && onViewVendor(vendor)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-5 py-8 text-center text-gray-500 font-sans">
                  No vendors match your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorsTable;
