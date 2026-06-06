import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import QuotationCard from './QuotationCard';
import ConfirmationModal from './ConfirmationModal';
import { rfqDetails, quotationsMock } from '../../mock/quotationData';

const QuotationComparisonView = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedQuotationId, setSelectedQuotationId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Check if we already have a pending approval from a previous visit
  useEffect(() => {
    const savedApproval = localStorage.getItem('vendorBridge_pendingApproval');
    if (savedApproval) {
      const parsed = JSON.parse(savedApproval);
      if (parsed.rfqId === rfqDetails.id) {
        setIsSubmitted(true);
        setSelectedQuotationId(parsed.selectedQuotationId);
      }
    }
    
    // Simulate network delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleConfirm = () => {
    setIsModalOpen(false);
    setIsLoading(true);
    
    // Simulate API submission delay
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      
      // Save to localStorage for future Screen 8 integration
      localStorage.setItem('vendorBridge_pendingApproval', JSON.stringify({
        rfqId: rfqDetails.id,
        selectedQuotationId: selectedQuotationId,
        status: 'pending_approval',
        timestamp: Date.now()
      }));
      
    }, 600);
  };

  if (isLoading) {
    return (
      <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="font-deck-body text-gray-500">Loading quotations...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-lg max-w-lg text-center">
          <h3 className="font-deck-headline mb-2 text-red-900">Unable to load data</h3>
          <p className="font-deck-body mb-4">{error}</p>
          <Button variant="destructive" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </main>
    );
  }

  // Submitted State (Success)
  if (isSubmitted) {
    const selectedQuote = quotationsMock.find(q => q.id === selectedQuotationId);
    return (
      <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
        <div className="dd-card-elevated max-w-lg w-full p-8 text-center border-t-4 border-t-green-500">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-3xl">
            ✓
          </div>
          <h2 className="font-deck-headline text-gray-900 mb-2">Sent for Approval</h2>
          <p className="font-deck-body text-gray-600 mb-6">
            The quotation from <strong>{selectedQuote?.vendorName}</strong> has been successfully selected and sent to the manager for final approval.
          </p>
          
          <div className="bg-gray-50 rounded p-4 mb-6 text-left border border-gray-200">
            <div className="flex justify-between mb-2">
              <span className="font-deck-caption text-gray-500">RFQ:</span>
              <span className="font-deck-body-small font-medium text-gray-900">{rfqDetails.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-deck-caption text-gray-500">Total Amount:</span>
              <span className="font-deck-mono font-bold text-gray-900">${selectedQuote?.grandTotal.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button variant="secondary" onClick={() => onNavigate && onNavigate('dashboard')}>Back to Dashboard</Button>
            <Button variant="primary" onClick={() => onNavigate && onNavigate('approvals')}>View in Approvals</Button>
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-100">
            <Button 
              variant="ghost" 
              size="small" 
              className="text-gray-400 hover:text-red-600 text-xs"
              onClick={() => {
                localStorage.removeItem('vendorBridge_pendingApproval');
                setIsSubmitted(false);
                setSelectedQuotationId(null);
              }}
            >
              [Dev] Reset Screen
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // Calculate lowest price for highlighting
  const lowestTotal = Math.min(...quotationsMock.map(q => q.grandTotal));
  const selectedQuotationData = quotationsMock.find(q => q.id === selectedQuotationId);

  return (
    <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 relative">
      {/* Header section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-display font-sans font-bold mb-2">Quotation Comparison</h1>
          <p className="text-body-large font-sans text-gray-600 flex items-center gap-2">
            <span>RFQ: {rfqDetails.name}</span>
            <span className="text-gray-300">|</span>
            <span className="font-deck-mono text-sm">{rfqDetails.id}</span>
            <span className="text-gray-300">|</span>
            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-sm font-medium">
              {quotationsMock.length} Received
            </span>
          </p>
        </div>
        <Button 
          variant="primary" 
          size="medium"
          disabled={!selectedQuotationId}
          onClick={() => setIsModalOpen(true)}
          className="shadow-md"
        >
          Select & Send for Approval
        </Button>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-2">
        {quotationsMock.length > 0 ? (
          quotationsMock.map(quotation => (
            <QuotationCard 
              key={quotation.id}
              quotation={quotation}
              isSelected={selectedQuotationId === quotation.id}
              isLowest={quotation.grandTotal === lowestTotal}
              onSelect={() => setSelectedQuotationId(quotation.id)}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-12 bg-gray-50 border border-gray-200 rounded-lg border-dashed">
            <p className="font-deck-body text-gray-500">No quotations received yet for this RFQ.</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        quotation={selectedQuotationData}
      />
    </main>
  );
};

export default QuotationComparisonView;
