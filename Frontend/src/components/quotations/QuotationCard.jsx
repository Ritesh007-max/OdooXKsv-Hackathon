import React from 'react';
import StatusBadge from '../ui/StatusBadge';

const QuotationCard = ({ quotation, isSelected, isLowest, onSelect }) => {
  return (
    <div 
      className={`relative dd-card transition-all duration-200 cursor-pointer flex flex-col ${
        isSelected 
          ? 'border-primary ring-2 ring-primary/20 bg-orange-50/30' 
          : 'hover:border-gray-400'
      }`}
      onClick={onSelect}
    >
      {/* Lowest Price Indicator */}
      {isLowest && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-100 text-green-800 border border-green-200 text-xs font-bold px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
          ★ Lowest Price
        </div>
      )}

      {/* Card Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-deck-subhead text-gray-900 mb-1">{quotation.vendorName}</h3>
          <p className="font-deck-caption text-gray-500">ID: {quotation.id}</p>
        </div>
        <div className="pt-1">
          <div className="dd-radio pointer-events-none" style={{ 
            borderColor: isSelected ? 'var(--color-primary)' : '#D1D5DB',
            borderWidth: isSelected ? '2px' : '1px'
          }}>
            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-primary m-auto mt-[3px]"></div>}
          </div>
        </div>
      </div>

      <hr className="border-gray-100 mb-4" />

      {/* Content Grid */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-4 flex-1">
        <div>
          <span className="dd-label">Grand Total</span>
          <span className="font-deck-mono text-xl font-bold text-gray-900">
            ${quotation.grandTotal.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="dd-label">GST</span>
          <span className="font-deck-body text-gray-700">{quotation.gstPercent}% Included</span>
        </div>

        <div>
          <span className="dd-label">Delivery</span>
          <span className="font-deck-body text-gray-700">{quotation.deliveryTime}</span>
        </div>
        <div>
          <span className="dd-label">Payment Terms</span>
          <span className="font-deck-body text-gray-700">{quotation.paymentTerms}</span>
        </div>

        <div>
          <span className="dd-label">Vendor Rating</span>
          <span className="font-deck-body text-gray-700 flex items-center gap-1">
            <span className="text-amber-500">★</span> {quotation.vendorRating}/5.0
          </span>
        </div>
        <div>
          <span className="dd-label">Status</span>
          <StatusBadge status={quotation.status} className="mt-1" />
        </div>
      </div>

    </div>
  );
};

export default QuotationCard;
