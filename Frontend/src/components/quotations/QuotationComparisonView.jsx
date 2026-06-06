import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import QuotationCard from './QuotationCard';
import ConfirmationModal from './ConfirmationModal';
import { rfqDetails } from '../../mock/quotationData';
import { useActivity } from '../../ActivityContext';

const QuotationComparisonView = ({ quotations, onNavigate, onBack, onEditDraft, setSelectedApprovalQuotation }) => {
  const { addActivity } = useActivity();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuotationId, setSelectedQuotationId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Simulate network delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const selectedQuotationData = quotations.find(q => q.id === selectedQuotationId);

  const handleConfirm = () => {
    setIsModalOpen(false);
    setIsLoading(true);
    
    // Simulate API submission delay
    setTimeout(() => {
      setIsLoading(false);
      if (setSelectedApprovalQuotation && selectedQuotationData) {
        setSelectedApprovalQuotation(selectedQuotationData);
      }
      setIsSuccess(true);
      
      // Save to localStorage for future Screen 8 integration
      localStorage.setItem('vendorBridge_pendingApproval', JSON.stringify({
        rfqId: rfqDetails.id,
        selectedQuotationId: selectedQuotationId,
        status: 'pending_approval',
        timestamp: Date.now()
      }));

      addActivity('approval', `Quotation selected — ${selectedQuotationData?.vendorName} sent for approval`, 'success');
    }, 600);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin mb-4"></div>
        <p className="text-body font-sans text-gray-500">Loading comparisons...</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-lg shadow-sm mt-4">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-display font-sans font-bold text-gray-900 mb-2">Sent for Approval</h2>
        <p className="text-body-large font-sans text-gray-600 mb-8 max-w-md text-center">
          Quotation from <strong>{selectedQuotationData?.vendorName}</strong> has been successfully forwarded to the approval workflow.
        </p>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => onNavigate('dashboard')}>
            Go to Dashboard
          </Button>
          <Button variant="primary" onClick={() => onNavigate('approvals')}>
            Go to Approval List
          </Button>
        </div>
      </div>
    );
  }

  const validQuotations = quotations.filter(q => q.status !== 'Draft');
  const lowestTotal = validQuotations.length > 0 
    ? Math.min(...validQuotations.map(q => q.grandTotal)) 
    : Infinity;

  return (
    <div className="flex flex-col gap-6">
      {/* Header section */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {onBack && (
              <button 
                onClick={onBack} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors shadow-sm"
                title="Back to Submission"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </button>
            )}
            <h1 className="text-display font-sans font-bold">Quotation Comparison</h1>
          </div>
          <p className="text-body-large font-sans text-gray-600 flex items-center gap-2">
            <span>RFQ: {rfqDetails.name}</span>
            <span className="text-gray-300">|</span>
            <span className="font-mono text-sm">{rfqDetails.id}</span>
            <span className="text-gray-300">|</span>
            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-sm font-medium">
              {quotations.length} Received
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
        {quotations.length > 0 ? (
          quotations.map(quotation => (
            <QuotationCard 
              key={quotation.id}
              quotation={quotation}
              isSelected={selectedQuotationId === quotation.id}
              isLowest={quotation.grandTotal === lowestTotal}
              onSelect={() => {
                if (quotation.status !== 'Draft') {
                  setSelectedQuotationId(quotation.id);
                } else if (onEditDraft) {
                  onEditDraft(quotation);
                }
              }}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-12 bg-gray-50 border border-gray-200 rounded-lg border-dashed">
            <p className="text-body font-sans text-gray-500">No quotations received yet for this RFQ.</p>
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
    </div>
  );
};

export default QuotationComparisonView;
