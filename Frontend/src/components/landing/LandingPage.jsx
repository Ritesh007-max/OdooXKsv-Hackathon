import React from 'react';
import Button from '../ui/Button';

const LandingPage = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 selection:bg-orange-100">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="VendorBridge Logo" className="w-8 h-8 rounded-md object-contain" />
          <span className="text-xl font-display font-bold text-gray-900 tracking-tight">VendorBridge</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onLogin} className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
            Sign In
          </button>
          <Button variant="primary" onClick={onLogin}>
            Access VendorBridge
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-6 py-20 lg:py-32 max-w-7xl mx-auto w-full text-center flex flex-col items-center">
        <h1 className="text-5xl lg:text-7xl font-display font-bold text-gray-900 mb-6 tracking-tight max-w-4xl">
          Procurement workflow, <br/><span className="text-orange-600">redefined for ERP.</span>
        </h1>
        <p className="text-lg lg:text-xl text-gray-600 mb-10 max-w-2xl">
          VendorBridge gives procurement teams a unified space to create RFQs, collect vendor quotations, compare offers, and manage approvals—all with full visibility to every step.
        </p>
        <div className="flex items-center justify-center gap-4 mb-16">
          <Button variant="primary" size="large" onClick={onLogin} className="px-8 py-3 text-lg bg-orange-600 hover:bg-orange-700 text-white">
            Begin Procurement Workflow
          </Button>
        </div>
        
        {/* Visual Workflow Stage representation */}
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl border border-gray-200 p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {[
            { id: 1, title: 'RFQ Creation', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
            { id: 2, title: 'Vendor Bids', icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z' },
            { id: 3, title: 'Comparison', icon: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
            { id: 4, title: 'Approval', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
          ].map((stage, idx) => (
            <React.Fragment key={stage.id}>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stage.icon} /></svg>
                </div>
                <div className="font-semibold text-gray-900">{stage.title}</div>
              </div>
              {idx < 3 && (
                <div className="hidden md:block w-8 border-t-2 border-dashed border-gray-300"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* Workflow Section */}
      <section className="bg-white border-y border-gray-200 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">End-to-End Procurement Workflow</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">VendorBridge manages every step of the sourcing lifecycle with clear structure and traceability.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'RFQ Creation', desc: 'Draft RFQs with structured line items, attach specifications, and assign approved vendors for bidding.' },
              { step: '02', title: 'Vendor Quotations', desc: 'Centralize vendor bids securely. Filter, view, and validate incoming offers against your requirements.' },
              { step: '03', title: 'Quotation Comparison', desc: 'Evaluate total landed cost and qualification criteria with clear side-by-side metric comparisons.' },
              { step: '04', title: 'Approval Workflow', desc: 'Route chosen quotations through multi-tier approval steps mapped to specific ERP organizational roles.' },
              { step: '05', title: 'Purchase Orders', desc: 'Convert approved quotations directly into confirmed purchase orders that sync to downstream systems.' },
              { step: '06', title: 'Invoices', desc: 'Reconcile vendor invoices against active POs and receipts with built-in exception handling flags.' }
            ].map((item) => (
              <div key={item.step} className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="text-3xl font-display font-bold text-orange-200 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="mb-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Core Platform Features</h2>
          <p className="text-lg text-gray-600">Built for scale, transparency, and seamless integration.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {[
            { title: 'Vendor Management', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', desc: 'Maintain an approved roster of vendors with complete historical performance data.' },
            { title: 'RFQ Management', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', desc: 'Track all requests across the organization to prevent duplicate purchasing efforts.' },
            { title: 'Quotation Comparison', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', desc: 'Automatically highlight the lowest landed cost and most favorable vendor terms.' },
            { title: 'Approval Tracking', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', desc: 'Maintain a perfect audit log of who approved what, and precisely when.' },
            { title: 'Purchase Orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', desc: 'Generate canonical PO records ready to be instantly pushed to financial systems.' },
            { title: 'Invoice Tracking', icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z', desc: 'Ensure accurate 3-way matching between POs, receipts, and final invoices.' }
          ].map((feature, idx) => (
            <div key={idx} className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center shrink-0 shadow-sm text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon} /></svg>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">{feature.title}</h4>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Role Benefits Section */}
      <section className="bg-gray-100 border-y border-gray-200 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">Empowering Every Role</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">VendorBridge provides tailored benefits for the entire procurement ecosystem.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { role: 'Procurement Officer', benefit: 'Eliminate manual data entry. Create RFQs instantly, receive bids uniformly, and make data-driven comparisons without ever opening a spreadsheet.', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
              { role: 'Manager', benefit: 'Gain total visibility into the sourcing pipeline. Approve requests on-the-go with full context, ensuring compliance while unblocking your team.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
              { role: 'Vendor', benefit: 'Experience a frictionless bidding process. Submit standardized quotations reliably, track status updates, and get paid faster with clear POs.', icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' }
            ].map((role, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gray-50 text-gray-700 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={role.icon} /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{role.role}</h3>
                <p className="text-gray-600">{role.benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-display font-bold mb-6">Ready to gain control of your procurement?</h2>
          <p className="text-xl text-gray-400 mb-10">Deploy VendorBridge to connect your vendors, automate approvals, and maintain full ERP traceability.</p>
          <Button variant="primary" size="large" onClick={onLogin} className="px-10 py-4 text-lg bg-orange-500 hover:bg-orange-600 border-transparent text-white">
            Access VendorBridge
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="VendorBridge Logo" className="w-6 h-6 rounded object-contain grayscale opacity-80" />
            <span className="text-lg font-display font-bold text-gray-900">VendorBridge</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500 font-sans">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Documentation</a>
          </div>
          <div className="text-sm text-gray-400 font-sans">
            &copy; {new Date().getFullYear()} VendorBridge Procurement. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
