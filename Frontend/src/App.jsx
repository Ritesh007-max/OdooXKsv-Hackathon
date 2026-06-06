import React, { useState, useEffect } from 'react';
import { ActivityProvider } from './ActivityContext';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import DashboardView from './components/dashboard/DashboardView';
import VendorsView from './components/vendors/VendorsView';
import RFQsView from './components/rfqs/RFQsView';
import POInvoicePage from './POInvoicePage';
import ReportsView from './components/dashboard/ReportsView';
import ActivityView from './components/dashboard/ActivityView';
import QuotationsModule from './components/quotations/QuotationsModule';
import ApprovalWorkflowView from './components/approvals/ApprovalWorkflowView';
import LandingPage from './components/landing/LandingPage';

function MainApp() {
  const [currentPath, setCurrentPath] = useState(() => {
    const saved = localStorage.getItem('vendorBridge_currentPath');
    return saved || 'landing';
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

  if (currentPath === 'landing') {
    return <LandingPage onLogin={() => setCurrentPath('dashboard')} />;
  }

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
        {currentPath === 'reports' && <ReportsView />}
        {currentPath === 'activity' && <ActivityView />}
        
        {currentPath !== 'dashboard' && currentPath !== 'vendors' && currentPath !== 'rfqs' && currentPath !== 'invoices' && currentPath !== 'quotations' && currentPath !== 'approvals' && currentPath !== 'reports' && currentPath !== 'activity' && (
          <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
            <h2 className="text-headline text-gray-400">Page under construction</h2>
          </main>
        )}
      </div>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'signup'

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#F9FAFB] flex flex-col items-center justify-center gap-3 select-none font-sans">
        <span className="w-10 h-10 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-600 font-mono text-sm tracking-wider animate-pulse">VERIFYING SESSION...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (authView === 'signup') {
      return <SignupPage onNavigateToLogin={() => setAuthView('login')} />;
    }
    return <LoginPage onNavigateToSignup={() => setAuthView('signup')} />;
  }

  return <MainApp />;
}

function App() {
  return (
    <AuthProvider>
      <ActivityProvider>
        <AppContent />
      </ActivityProvider>
    </AuthProvider>
  );
}

export default App;
