import React from 'react';
import StatusBadge from '../ui/StatusBadge';

const QuotationCard = ({ quotation, isSelected, isLowest, onSelect }) => {
  const isDraft = quotation.status === 'Draft';

  return (
    <div 
      className={`relative bg-white border rounded-lg shadow-sm p-5 transition-all duration-200 flex flex-col ${
        isSelected 
          ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/30' 
          : isDraft ? 'border-gray-300 opacity-80 border-dashed hover:opacity-100 hover:border-gray-400 cursor-pointer' : 'border-gray-200 hover:border-gray-400 cursor-pointer'
      }`}
      onClick={onSelect}
      title={isDraft ? "Click to edit draft" : ""}
    >
      {/* Lowest Price Indicator */}
      {isLowest && !isDraft && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-100 text-green-800 border border-green-200 text-xs font-bold px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
          ★ Lowest Price
        </div>
      )}

      {/* Draft Indicator */}
      {isDraft && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-100 text-gray-600 border border-gray-300 text-xs font-bold px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
          Draft
        </div>
      )}

      {/* Card Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-body-large font-sans font-bold text-gray-900 mb-1">{quotation.vendorName}</h3>
          <p className="text-caption font-sans text-gray-500">ID: {quotation.id}</p>
        </div>
        <div className="pt-1">
          <div className="w-5 h-5 rounded-full border flex items-center justify-center transition-colors" style={{ 
            borderColor: isSelected ? '#ea580c' : isDraft ? '#E5E7EB' : '#D1D5DB',
            borderWidth: isSelected ? '2px' : '1px',
            backgroundColor: isDraft ? '#F9FAFB' : 'transparent'
          }}>
            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-orange-600"></div>}
          </div>
        </div>
      </div>

      <hr className="border-gray-100 mb-4" />

      {/* Content Grid */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-4 flex-1">
        <div className="min-w-0">
          <span className="block text-caption font-sans font-semibold text-gray-500 uppercase tracking-wider mb-1">Grand Total</span>
          <span 
            className="block font-mono text-xl font-bold text-gray-900 truncate"
            title={`$${quotation.grandTotal.toLocaleString()}`}
          >
            ${quotation.grandTotal.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="block text-caption font-sans font-semibold text-gray-500 uppercase tracking-wider mb-1">GST</span>
          <span className="text-body font-sans text-gray-700">{quotation.gstPercent}% Included</span>
        </div>

        <div>
          <span className="block text-caption font-sans font-semibold text-gray-500 uppercase tracking-wider mb-1">Delivery</span>
          <span className="text-body font-sans text-gray-700">{quotation.deliveryTime}</span>
        </div>
        <div>
          <span className="block text-caption font-sans font-semibold text-gray-500 uppercase tracking-wider mb-1">Payment Terms</span>
          <span className="text-body font-sans text-gray-700">{quotation.paymentTerms}</span>
        </div>

        <div>
          <span className="block text-caption font-sans font-semibold text-gray-500 uppercase tracking-wider mb-1">Vendor Rating</span>
          <span className="text-body font-sans text-gray-700 flex items-center gap-1">
            <span className="text-amber-500">★</span> {quotation.vendorRating}/5.0
          </span>
        </div>
        <div>
          <span className="block text-caption font-sans font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</span>
          <StatusBadge status={quotation.status} className="mt-1" />
        </div>
      </div>

      {isDraft && (
        <div className="mt-auto pt-3 border-t border-gray-100 flex justify-end">
          <span className="text-sm font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded transition-colors inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            Edit Draft
          </span>
        </div>
      )}
    </div>
  );
};

export default QuotationCard;
