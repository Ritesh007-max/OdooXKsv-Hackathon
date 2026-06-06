import React from 'react';

const QuotationSummary = ({ data }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200">
        <h3 className="text-body-large font-sans font-bold text-gray-900">Quotation Details</h3>
      </div>
      <div className="p-5 grid grid-cols-2 gap-y-4 gap-x-6">
        <div>
          <p className="text-caption font-sans text-gray-500">Vendor</p>
          <p className="text-body font-sans font-semibold text-gray-900 mt-1">{data.vendorName}</p>
        </div>
        <div>
          <p className="text-caption font-sans text-gray-500">Total Amount</p>
          <p className="text-body-large font-mono font-bold text-green-600 mt-1">
            ₹{data.totalAmount.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-caption font-sans text-gray-500">GST</p>
          <p className="text-body font-sans text-gray-900 mt-1">{data.gst}</p>
        </div>
        <div>
          <p className="text-caption font-sans text-gray-500">Delivery Timeline</p>
          <p className="text-body font-sans text-gray-900 mt-1">{data.deliveryTimeline}</p>
        </div>
        <div>
          <p className="text-caption font-sans text-gray-500">Payment Terms</p>
          <p className="text-body font-sans text-gray-900 mt-1">{data.paymentTerms}</p>
        </div>
        <div>
          <p className="text-caption font-sans text-gray-500">Vendor Rating</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-orange-500">★</span>
            <span className="text-body font-sans font-bold text-gray-900">{data.vendorRating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationSummary;
