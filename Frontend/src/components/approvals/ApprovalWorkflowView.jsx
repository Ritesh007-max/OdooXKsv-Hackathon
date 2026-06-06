import React, { useState } from 'react';
import WorkflowProgress from './WorkflowProgress';
import QuotationSummary from './QuotationSummary';
import ApprovalChain from './ApprovalChain';
import ApprovalTimeline from './ApprovalTimeline';
import Button from '../ui/Button';
import { rfqDetails, quotationsMock } from '../../mock/quotationData';

const fallbackQuotationData = {
  rfqName: "Office Furniture Procurement Q2",
  vendorName: "Furniture Plus",
  totalAmount: 132000,
  gst: "18%",
  deliveryTimeline: "21 Days",
  vendorRating: "4.2/5",
  paymentTerms: "Net 15"
};

const initialReviewers = [
  { id: 1, name: "Arjun Mehta", role: "Procurement Officer", status: "Approved" },
  { id: 2, name: "Priya Sharma", role: "Manager", status: "Pending" }
];

const initialTimeline = [
  { time: "2026-06-05 14:30", event: "Quotation submitted for approval by Arjun Mehta" },
  { time: "2026-06-05 09:15", event: "Quotation received from Furniture Plus" },
  { time: "2026-06-01 10:00", event: "RFQ Published: Office Furniture Procurement Q2" }
];

const ApprovalWorkflowView = ({ selectedQuotation }) => {
  const [currentStage, setCurrentStage] = useState(1); // 1 = Review
  const [reviewers, setReviewers] = useState(initialReviewers);
  const [timelineEvents, setTimelineEvents] = useState(initialTimeline);
  const [remarks, setRemarks] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [activeDevQuotation, setActiveDevQuotation] = useState(null);

  const activeQuotation = selectedQuotation || activeDevQuotation;
  const hasSelectedQuotation = !!activeQuotation;

  const handleAction = (isApprove) => {
    if (!remarks.trim() && !isApprove) {
      alert("Remarks are required for rejection.");
      return;
    }

    setActionLoading(true);

    // Simulate network request
    setTimeout(() => {
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16).replace('T', ' ');
      
      setReviewers(prev => prev.map(r => 
        r.id === 2 ? { ...r, status: isApprove ? "Approved" : "Rejected" } : r
      ));
      
      setCurrentStage(isApprove ? 2 : 1); // 2 = Approved, stays at 1 if rejected
      
      setTimelineEvents(prev => [
        { 
          time: timestamp, 
          event: `Quotation ${isApprove ? 'Approved' : 'Rejected'} by Priya Sharma${remarks ? ` - Remarks: "${remarks}"` : ''}` 
        },
        ...initialTimeline
      ]);
      
      setActionLoading(false);
      setRemarks("");
    }, 600);
  };

  const isPending = reviewers.find(r => r.id === 2)?.status === "Pending";

  if (!hasSelectedQuotation) {
    return (
      <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-10 flex flex-col items-center text-center max-w-md w-full">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 border border-blue-100">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-headline font-sans font-bold text-gray-900 mb-2">No Quotation Selected</h2>
          <p className="text-body font-sans text-gray-500 mb-6">
            Please select a quotation from the Quotation Comparison screen to initiate the approval workflow.
          </p>
          <Button variant="primary" onClick={() => {
            setActiveDevQuotation(quotationsMock[1]);
          }}>
            [Dev] Load Mock Quotation
          </Button>
        </div>
      </main>
    );
  }

  const displayData = activeQuotation ? {
    rfqName: rfqDetails.name,
    vendorName: activeQuotation.vendorName,
    totalAmount: activeQuotation.grandTotal,
    gst: activeQuotation.gstPercent + "%",
    deliveryTimeline: activeQuotation.deliveryTime,
    vendorRating: activeQuotation.vendorRating + "/5",
    paymentTerms: activeQuotation.paymentTerms
  } : fallbackQuotationData;

  return (
    <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 font-sans">
      
      {/* Header section matching DashboardView */}
      <div>
        <h1 className="text-display font-sans font-bold mb-2">Approval Workflow</h1>
        <p className="text-body font-sans text-gray-500">
          RFQ: <span className="font-bold text-gray-900">{displayData.rfqName}</span>
        </p>
      </div>

      {/* Progress */}
      <WorkflowProgress currentStage={currentStage} />

      {/* Split Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column (Summary & Chain) */}
        <div className="xl:col-span-2 space-y-6">
          <QuotationSummary data={displayData} />
          <ApprovalChain reviewers={reviewers} />
        </div>
        
        {/* Right Column (Actions) */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden sticky top-6">
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="text-body-large font-sans font-bold text-gray-900">Approval Decision</h3>
            </div>
            
            <div className="p-5">
              <div className="mb-6">
                <label className="block text-caption font-sans font-semibold text-gray-700 mb-1">Remarks / Comments</label>
                <textarea 
                  className="w-full border border-gray-300 rounded p-2 text-body font-sans min-h-[120px] resize-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" 
                  placeholder="Enter your remarks here..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  disabled={!isPending || actionLoading}
                />
              </div>
              
              {isPending ? (
                <div className="flex gap-3">
                  <Button 
                    variant="primary"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white border-transparent"
                    onClick={() => handleAction(true)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Processing...' : 'Approve'}
                  </Button>
                  <Button 
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleAction(false)}
                    disabled={actionLoading}
                  >
                    Reject
                  </Button>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-center">
                  <p className="text-body font-sans font-medium text-gray-600">Decision recorded</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <ApprovalTimeline events={timelineEvents} />

    </main>
  );
};

export default ApprovalWorkflowView;
