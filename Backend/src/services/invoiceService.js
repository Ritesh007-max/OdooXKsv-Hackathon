const mongoose = require('mongoose');
const { Invoice } = require("../models");

function mapLegacyInvoice(inv) {
  if (!inv) return inv;
  
  const createdAtStr = inv.createdAt ? new Date(inv.createdAt).toISOString().replace('T', ' ').substring(0, 19) : "2026-06-06 12:00:00";
  const dateStr = createdAtStr.split(' ')[0];
  
  let vendorName = "Apex Solutions Ltd.";
  let vendorAddress = "45 Technology Park, Sector 4, Bangalore 560066";
  if (inv.poId && typeof inv.poId === 'object' && inv.poId.vendorId) {
    vendorName = inv.poId.vendorId.name || vendorName;
    vendorAddress = inv.poId.vendorId.address || `${inv.poId.vendorId.name || 'Vendor'} Office`;
  }
  
  const poIdStr = (inv.poId && typeof inv.poId === 'object') ? (inv.poId._id ? `PO-${inv.poId._id.toString().substring(0, 8).toUpperCase()}` : "PO-UNKNOWN") : String(inv.poId || "PO-UNKNOWN");

  return {
    _id: inv._id,
    id: inv.invoiceId || `INV-${inv._id.toString().substring(0, 8).toUpperCase()}`,
    poId: poIdStr,
    amount: inv.amount || 0,
    tax: inv.tax || 0,
    total: inv.total || 0,
    vendor: inv.vendor || {
      name: vendorName,
      address: vendorAddress
    },
    items: inv.items && inv.items.length > 0 ? inv.items : [
      { id: 1, name: "Legacy ERP Procured Goods", qty: 1, unitPrice: inv.amount || 0, tax: inv.amount ? Math.round((inv.tax / inv.amount) * 100) : 0 }
    ],
    status: inv.status || "Paid",
    dates: inv.dates || {
      invoiceDate: dateStr,
      dueDate: dateStr,
      paymentTerms: "Net 30"
    },
    discount: inv.discount || 0,
    logs: inv.logs && inv.logs.length > 0 ? inv.logs : [
      { timestamp: createdAtStr, level: "SUCCESS", user: "System", message: "Imported legacy invoice from ERP database" }
    ]
  };
}

async function getInvoices() {
  const list = await Invoice.find()
    .sort({ createdAt: -1 })
    .populate({
      path: "poId",
      select: "rfqId vendorId total status createdAt",
      populate: [
        { path: "rfqId", select: "title product quantity deadline status" },
        { path: "vendorId", select: "name category contact" },
      ],
    })
    .lean();
  return list.map(inv => mapLegacyInvoice(inv));
}

async function addInvoice(data) {
  let amount = 0;
  let tax = 0;
  
  if (Array.isArray(data.items)) {
    data.items.forEach(item => {
      const qty = Math.max(0, item.qty || 0);
      const price = Math.max(0, item.unitPrice || 0);
      const taxRate = Math.max(0, item.tax || 0);
      const itemSubtotal = qty * price;
      amount += itemSubtotal;
      tax += itemSubtotal * (taxRate / 100);
    });
  }
  
  const discount = Math.max(0, data.discount || 0);
  const total = Math.max(0, amount + tax - discount);
  
  const mongoose = require("mongoose");
  const invoiceId = data.id || data.invoiceId || `INV-${new mongoose.Types.ObjectId().toString().substring(0, 8).toUpperCase()}`;

  const invoice = new Invoice({
    invoiceId,
    poId: data.poId || "Draft PO",
    amount,
    tax,
    total,
    vendor: data.vendor || { name: "New Vendor Corp", address: "Enter Address Here" },
    items: data.items || [],
    status: data.status || "Draft",
    dates: data.dates || { invoiceDate: new Date().toISOString().substring(0, 10), dueDate: new Date().toISOString().substring(0, 10), paymentTerms: "Net 30" },
    discount,
    logs: data.logs || []
  });
  
  return await invoice.save();
}

async function updateInvoice(id, data) {
  let amount = 0;
  let tax = 0;
  
  if (Array.isArray(data.items)) {
    data.items.forEach(item => {
      const qty = Math.max(0, item.qty || 0);
      const price = Math.max(0, item.unitPrice || 0);
      const taxRate = Math.max(0, item.tax || 0);
      const itemSubtotal = qty * price;
      amount += itemSubtotal;
      tax += itemSubtotal * (taxRate / 100);
    });
  }
  
  const discount = Math.max(0, data.discount || 0);
  const total = Math.max(0, amount + tax - discount);

  return await Invoice.findOneAndUpdate(
    { invoiceId: id },
    {
      poId: data.poId,
      amount,
      tax,
      total,
      vendor: data.vendor,
      items: data.items,
      status: data.status,
      dates: data.dates,
      discount,
      logs: data.logs
    },
    { new: true }
  ).then(doc => {
    if (doc) return doc;
    if (mongoose.Types.ObjectId.isValid(id)) {
      return Invoice.findByIdAndUpdate(
        id,
        {
          poId: data.poId,
          amount,
          tax,
          total,
          vendor: data.vendor,
          items: data.items,
          status: data.status,
          dates: data.dates,
          discount,
          logs: data.logs
        },
        { new: true }
      );
    }
    throw new Error('Invoice not found');
  });
}

module.exports = {
  getInvoices,
  addInvoice,
  updateInvoice,
  mapLegacyInvoice,
};
