import React, { useState } from 'react';
import RFQForm from './RFQForm';
import RFQLineItems from './RFQLineItems';
import RFQVendors from './RFQVendors';
import RFQAttachments from './RFQAttachments';
import Button from '../ui/Button';

const RFQsView = () => {
  const [formData, setFormData] = useState({ title: '', category: '', deadline: '', description: '' });
  const [lineItems, setLineItems] = useState([
    { id: 1, item: 'Ergonomic chair', qty: '25', unit: 'NOS' },
    { id: 2, item: 'Standing desks', qty: '10', unit: 'NOS' }
  ]);
  const [assignedVendors, setAssignedVendors] = useState([
    { id: 'mock1', name: 'Infra Supplies Pvt Ltd' },
    { id: 'mock2', name: 'Tech Core LTD' }
  ]);
  const [attachments, setAttachments] = useState([]);

  const handleSaveAndSend = () => {
    alert(`Sending RFQ to ${assignedVendors.length} vendors!\nTitle: ${formData.title}\nItems: ${lineItems.length}`);
  };

  const handleSaveDraft = () => {
    alert(`Draft saved locally!\nTitle: ${formData.title}`);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
      {/* Header section */}
      <div>
        <h1 className="text-display font-sans font-bold mb-0">Create RFQ's</h1>
        <p className="text-body font-sans text-gray-600">
          new request for quotation
        </p>
      </div>

      {/* Stepper (Visual only as requested) */}
      <div className="flex items-center w-full my-1">
        <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-primary text-primary font-bold bg-white text-xs">1</div>
        <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
        <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-400 text-gray-400 font-bold bg-white text-xs">2</div>
        <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
        <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-400 text-gray-400 font-bold bg-white text-xs">3</div>
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8 border-b border-gray-300 pb-4">
        
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-4">
          <RFQForm formData={formData} setFormData={setFormData} />
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col gap-4">
          <RFQLineItems items={lineItems} setItems={setLineItems} />
          <RFQVendors assignedVendors={assignedVendors} setAssignedVendors={setAssignedVendors} />
        </div>

      </div>

      {/* Bottom Layout */}
      <div className="flex flex-col lg:flex-row gap-8 mt-1">
        <div className="flex-1 flex flex-col justify-center gap-3">
          <Button variant="primary" onClick={handleSaveAndSend} className="w-fit">Save & Send to Vendors</Button>
          <Button variant="secondary" onClick={handleSaveDraft} className="w-fit border-gray-400">Save as Draft</Button>
        </div>
        
        <div className="flex-1">
          <RFQAttachments attachments={attachments} setAttachments={setAttachments} />
        </div>
      </div>

    </main>
  );
};

export default RFQsView;
