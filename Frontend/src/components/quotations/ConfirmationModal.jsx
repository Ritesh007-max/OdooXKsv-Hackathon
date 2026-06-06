import React from 'react';
import Button from '../ui/Button';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, quotation }) => {
  if (!isOpen || !quotation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="relative dd-card-elevated dd-shadow-overlay max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        <h3 className="font-deck-headline text-gray-900 mb-2">Confirm Selection</h3>
        
        <p className="font-deck-body text-gray-600 mb-4">
          You are about to select the quotation from <strong className="text-gray-900">{quotation.vendorName}</strong>. 
          This will initiate the approval workflow for a total of <strong className="font-deck-mono text-gray-900">${quotation.grandTotal.toLocaleString()}</strong>.
        </p>
        
        <div className="bg-orange-50 border border-orange-200 p-3 rounded mb-6 font-deck-caption text-orange-800">
          Note: This action is final. Once confirmed, this comparison screen will be locked and sent to the manager for approval.
        </div>
        
        <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 pt-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onConfirm}>Confirm & Initiate</Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
