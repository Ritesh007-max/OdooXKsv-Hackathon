import React, { useState } from 'react';
import SubmitQuotationView from './SubmitQuotationView';
import QuotationComparisonView from './QuotationComparisonView';
import { quotationsMock } from '../../mock/quotationData';

const QuotationsModule = ({ onNavigate, quotations, setQuotations, currentStep, setCurrentStep, setSelectedApprovalQuotation }) => {
  const [editingDraft, setEditingDraft] = useState(null);

  const saveOrUpdate = (newQuotation) => {
    setQuotations(prev => {
      const exists = prev.some(q => q.id === newQuotation.id);
      if (exists) {
        return prev.map(q => q.id === newQuotation.id ? newQuotation : q);
      }
      return [...prev, newQuotation];
    });
  };

  const handleQuotationSubmit = (newQuotation) => {
    saveOrUpdate(newQuotation);
    setEditingDraft(null);
    setCurrentStep(2); // Move to comparison view
  };

  const handleDraftSubmit = (newDraft) => {
    saveOrUpdate(newDraft);
    setEditingDraft(null);
    setCurrentStep(2); // Move to comparison view after saving draft
  };

  const handleEditDraft = (draft) => {
    setEditingDraft(draft);
    setCurrentStep(1);
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 relative bg-gray-50">
      
      {/* Progress Steps Header */}
      <div className="flex items-center gap-4 mb-2">
        <div 
          className={`flex items-center gap-2 cursor-pointer transition-colors ${currentStep === 1 ? 'text-orange-600 font-bold' : 'text-gray-500 hover:text-orange-500'}`}
          onClick={() => setCurrentStep(1)}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white transition-colors ${currentStep === 1 ? 'bg-orange-600' : 'bg-gray-400'}`}>1</div>
          <span className="font-sans text-sm uppercase tracking-wide">Submit Quotation</span>
        </div>
        <div className="w-12 h-px bg-gray-300"></div>
        <div 
          className={`flex items-center gap-2 cursor-pointer transition-colors ${currentStep === 2 ? 'text-orange-600 font-bold' : 'text-gray-500 hover:text-orange-500'}`}
          onClick={() => {
            setEditingDraft(null); // Clear draft editing if they just jump to comparison
            setCurrentStep(2);
          }}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white transition-colors ${currentStep === 2 ? 'bg-orange-600' : 'bg-gray-400'}`}>2</div>
          <span className="font-sans text-sm uppercase tracking-wide">Compare Quotations</span>
        </div>
      </div>

      {currentStep === 1 ? (
        <SubmitQuotationView 
          onSubmit={handleQuotationSubmit} 
          onSaveDraft={handleDraftSubmit} 
          initialData={editingDraft}
        />
      ) : (
        <QuotationComparisonView 
          quotations={quotations} 
          onNavigate={onNavigate} 
          onBack={() => {
            setEditingDraft(null);
            setCurrentStep(1);
          }}
          onEditDraft={handleEditDraft}
          setSelectedApprovalQuotation={setSelectedApprovalQuotation}
        />
      )}
    </main>
  );
};

export default QuotationsModule;
