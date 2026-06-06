import React, { useState } from 'react';
import Button from '../ui/Button';
import { rfqDetails } from '../../mock/quotationData';

const SubmitQuotationView = ({ onSubmit, onSaveDraft, initialData }) => {
  const [formData, setFormData] = useState(() => {
    if (initialData && initialData._rawFormData) {
      return initialData._rawFormData;
    }
    return {
      vendorName: initialData?.vendorName || '',
      quantity: '',
      unitPrice: '',
      gstPercent: initialData?.gstPercent?.toString() || '18',
      deliveryTime: initialData?.deliveryTime?.replace(/\D/g,'') || '',
      paymentTerms: initialData?.paymentTerms || 'Net 30',
      notes: ''
    };
  });

  const [isDraftSaved, setIsDraftSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (isDraftSaved) setIsDraftSaved(false);
  };

  const handleSaveDraft = () => {
    setIsDraftSaved(true);
    
    const newDraft = {
      id: initialData?.id || `Q-${Math.floor(Math.random() * 1000) + 200}`,
      vendorName: formData.vendorName || "Untitled Draft",
      grandTotal: calculateTotal(),
      gstPercent: parseFloat(formData.gstPercent) || 0,
      deliveryTime: (formData.deliveryTime || "0") + " Days",
      vendorRating: initialData?.vendorRating || 0,
      paymentTerms: formData.paymentTerms,
      status: "Draft",
      _rawFormData: formData
    };

    if (onSaveDraft) {
      onSaveDraft(newDraft);
    }

    setTimeout(() => setIsDraftSaved(false), 3000);
  };

  const calculateTotal = () => {
    const qty = parseFloat(formData.quantity) || 0;
    const price = parseFloat(formData.unitPrice) || 0;
    const gst = parseFloat(formData.gstPercent) || 0;
    
    const subtotal = qty * price;
    const gstAmount = subtotal * (gst / 100);
    return subtotal + gstAmount;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newQuotation = {
      id: initialData?.id || `Q-${Math.floor(Math.random() * 1000) + 200}`,
      vendorName: formData.vendorName,
      grandTotal: calculateTotal(),
      gstPercent: parseFloat(formData.gstPercent),
      deliveryTime: formData.deliveryTime + " Days",
      vendorRating: initialData?.vendorRating || 4.0,
      paymentTerms: formData.paymentTerms,
      status: "Submitted",
      _rawFormData: formData
    };

    onSubmit(newQuotation);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-display font-sans font-bold mb-2">
          {initialData?.status === 'Draft' ? 'Edit Draft Quotation' : 'Submit Quotation'}
        </h1>
        <p className="text-body-large font-sans text-gray-600 flex items-center gap-2">
          <span>RFQ: {rfqDetails.name}</span>
          <span className="text-gray-300">|</span>
          <span className="font-mono text-sm">{rfqDetails.id}</span>
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden max-w-4xl">
        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-body-large font-sans font-bold text-gray-900">Quotation Details</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-caption font-sans font-semibold text-gray-700 mb-1">Vendor Name <span className="text-red-500">*</span></label>
              <input required name="vendorName" type="text" value={formData.vendorName} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-body font-sans focus:ring-1 focus:ring-primary focus:border-primary outline-none" placeholder="e.g. Acme Corp" />
            </div>
            
            <div>
              <label className="block text-caption font-sans font-semibold text-gray-700 mb-1">Delivery Time (Days) <span className="text-red-500">*</span></label>
              <input required name="deliveryTime" type="number" min="1" value={formData.deliveryTime} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-body font-sans focus:ring-1 focus:ring-primary focus:border-primary outline-none" placeholder="e.g. 14" />
            </div>

            <div>
              <label className="block text-caption font-sans font-semibold text-gray-700 mb-1">Payment Terms <span className="text-red-500">*</span></label>
              <select required name="paymentTerms" value={formData.paymentTerms} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-body font-sans focus:ring-1 focus:ring-primary focus:border-primary outline-none bg-white">
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 60">Net 60</option>
                <option value="50% Advance">50% Advance</option>
              </select>
            </div>
            
            <div>
              <label className="block text-caption font-sans font-semibold text-gray-700 mb-1">GST (%) <span className="text-red-500">*</span></label>
              <select required name="gstPercent" value={formData.gstPercent} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-body font-sans focus:ring-1 focus:ring-primary focus:border-primary outline-none bg-white">
                <option value="0">0%</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-2">
            <h4 className="text-body font-sans font-bold text-gray-900 mb-4">Item Pricing</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-caption font-sans font-semibold text-gray-700 mb-1">Quantity <span className="text-red-500">*</span></label>
                <input required name="quantity" type="number" min="1" value={formData.quantity} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-body font-sans focus:ring-1 focus:ring-primary focus:border-primary outline-none" placeholder="Total Items" />
              </div>
              <div>
                <label className="block text-caption font-sans font-semibold text-gray-700 mb-1">Unit Price (₹) <span className="text-red-500">*</span></label>
                <input required name="unitPrice" type="number" min="1" value={formData.unitPrice} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-body font-sans focus:ring-1 focus:ring-primary focus:border-primary outline-none" placeholder="Price per item" />
              </div>
              <div className="bg-gray-50 rounded p-4 flex flex-col justify-center border border-gray-200">
                <span className="text-caption font-sans text-gray-500">Calculated Grand Total</span>
                <span className="text-display font-mono font-bold text-green-600">₹{calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-2">
            <label className="block text-caption font-sans font-semibold text-gray-700 mb-1">Additional Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-body font-sans focus:ring-1 focus:ring-primary focus:border-primary outline-none min-h-[100px] resize-none" placeholder="Any special terms or notes..." />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={handleSaveDraft} className={isDraftSaved ? "text-green-600" : ""}>
              {isDraftSaved ? 'Draft Saved ✓' : (initialData?.status === 'Draft' ? 'Update Draft' : 'Save Draft')}
            </Button>
            <Button type="submit" variant="primary">Submit Quotation</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitQuotationView;
