import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import DashboardView from './components/dashboard/DashboardView';
import VendorsView from './components/vendors/VendorsView';
import RFQsView from './components/rfqs/RFQsView';
import POInvoicePage from './POInvoicePage';
import QuotationsModule from './components/quotations/QuotationsModule';
import ApprovalWorkflowView from './components/approvals/ApprovalWorkflowView';

function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    const saved = localStorage.getItem('vendorBridge_currentPath');
    return saved || 'dashboard';
  });
  const [openVendorModal, setOpenVendorModal] = useState(false);
  const [rfqInitialMode, setRfqInitialMode] = useState(null);
  
  // Hoist Quotations state to app-level to survive route unmounts without localStorage
  const [globalQuotations, setGlobalQuotations] = useState([]);
  const [quotationStep, setQuotationStep] = useState(1);
  const [selectedApprovalQuotation, setSelectedApprovalQuotation] = useState(null);

  useEffect(() => {
    // Lazy load mock data on mount to avoid unused import warnings if not needed immediately
    import('./mock/quotationData').then(module => {
      setGlobalQuotations(module.quotationsMock);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('vendorBridge_currentPath', currentPath);
  }, [currentPath]);

  const navigateToVendorsWithAdd = () => {
    setOpenVendorModal(true);
    setCurrentPath('vendors');
  };

  const navigateToRfqsWithCreate = () => {
    setRfqInitialMode('create');
    setCurrentPath('rfqs');
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background text-gray-900 font-sans overflow-hidden">
      <TopBar className="no-print" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar className="no-print" currentPath={currentPath} onNavigate={(path) => {
          setCurrentPath(path);
          if (path !== 'vendors') setOpenVendorModal(false);
          if (path !== 'rfqs') setRfqInitialMode(null);
        }} />
        
        {currentPath === 'dashboard' && (
          <DashboardView 
            onAddVendor={navigateToVendorsWithAdd} 
            onNewRfq={navigateToRfqsWithCreate}
            onViewInvoices={() => setCurrentPath('invoices')}
          />
        )}
        {currentPath === 'vendors' && <VendorsView openVendorModal={openVendorModal} setOpenVendorModal={setOpenVendorModal} />}
        {currentPath === 'rfqs' && <RFQsView initialMode={rfqInitialMode} clearInitialMode={() => setRfqInitialMode(null)} />}
        {currentPath === 'invoices' && <POInvoicePage />}
        {currentPath === 'quotations' && (
          <QuotationsModule 
            onNavigate={setCurrentPath} 
            quotations={globalQuotations}
            setQuotations={setGlobalQuotations}
            currentStep={quotationStep}
            setCurrentStep={setQuotationStep}
            setSelectedApprovalQuotation={setSelectedApprovalQuotation}
          />
        )}
        {currentPath === 'approvals' && (
          <ApprovalWorkflowView selectedQuotation={selectedApprovalQuotation} />
        )}
        
        {currentPath !== 'dashboard' && currentPath !== 'vendors' && currentPath !== 'rfqs' && currentPath !== 'invoices' && currentPath !== 'quotations' && currentPath !== 'approvals' && (
          <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
            <h2 className="text-headline text-gray-400">Page under construction</h2>
          </main>
        )}
      </div>
    </div>
  );
}

export default App;
