const { RFQ, Vendor, Invoice, PurchaseOrder, Quotation, User } = require("../models");

async function getOverview() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [activeRfqs, pendingApprovals, monthlySpendResult, activeVendors] =
    await Promise.all([
      RFQ.countDocuments({ status: "open" }),
      PurchaseOrder.countDocuments({
        status: { $in: ["draft", "pending_approval"] },
      }),
      Invoice.aggregate([
        {
          $match: {
            date: {
              $gte: startOfMonth,
              $lt: startOfNextMonth,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]),
      Vendor.countDocuments(),
    ]);

  return {
    activeRfqs,
    pendingApprovals,
    monthlySpend: monthlySpendResult[0]?.total || 0,
    activeVendors,
  };
}

function getRecentRfqs(limit = 5) {
  return RFQ.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("vendors", "name category contact")
    .populate("createdBy", "name email role")
    .lean();
}

async function getRecentInvoices(limit = 5) {
  const list = await Invoice.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate({
      path: "poId",
      select: "rfqId vendorId total status createdAt",
      populate: [
        { path: "rfqId", select: "title product quantity status" },
        { path: "vendorId", select: "name category contact" },
      ],
    })
    .lean();
  return list.map(inv => mapLegacyInvoice(inv));
}

function getRecentPurchaseOrders(limit = 5) {
  return PurchaseOrder.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("rfqId", "title product quantity status")
    .populate("vendorId", "name category contact")
    .lean();
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

function getPurchaseOrders() {
  return PurchaseOrder.find()
    .sort({ createdAt: -1 })
    .populate("rfqId", "title product quantity deadline status")
    .populate("vendorId", "name category contact")
    .lean();
}

function getQuotations() {
  return Quotation.find()
    .sort({ createdAt: -1 })
    .populate("rfqId", "title product quantity deadline status")
    .populate("vendorId", "name category contact")
    .lean();
}

function getRfqs() {
  return RFQ.find()
    .sort({ createdAt: -1 })
    .populate("vendors", "name category contact")
    .populate("createdBy", "name email role")
    .lean();
}

function getUsers() {
  return User.find().select("-password").sort({ createdAt: -1 }).lean();
}

function getVendors() {
  return Vendor.find()
    .sort({ createdAt: -1 })
    .populate("userId", "name email role")
    .lean();
}

async function addVendor(data) {
  const mongoose = require("mongoose");
  const id = new mongoose.Types.ObjectId().toString();
  const vendor = new Vendor({
    _id: id,
    name: data.name,
    gst: data.gst,
    contact: data.contact,
    category: data.category,
    status: data.status || "Active",
    userId: data.userId || "USER_ID"
  });
  return await vendor.save();
}

async function updateVendor(id, data) {
  return await Vendor.findByIdAndUpdate(
    id,
    {
      name: data.name,
      gst: data.gst,
      contact: data.contact,
      category: data.category,
      status: data.status,
    },
    { new: true }
  );
}

async function deleteVendor(id) {
  return await Vendor.findByIdAndDelete(id);
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
  
  const invoice = new Invoice({
    invoiceId: data.id || data.invoiceId,
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
  });
}

async function addRfq(data) {
  const mongoose = require("mongoose");
  let creatorId = data.createdBy;
  if (!creatorId) {
    const defaultUser = await User.findOne({ role: { $in: ["admin", "officer", "manager"] } });
    if (defaultUser) {
      creatorId = defaultUser._id;
    } else {
      const anyUser = await User.findOne({});
      creatorId = anyUser ? anyUser._id : new mongoose.Types.ObjectId();
    }
  }
  const id = new mongoose.Types.ObjectId().toString();
  const rfq = new RFQ({
    _id: id,
    title: data.title,
    product: data.product,
    quantity: data.quantity,
    deadline: new Date(data.deadline),
    vendors: data.vendors || [],
    status: data.status || "draft",
    createdBy: creatorId,
    category: data.category,
    description: data.description,
  });
  return await rfq.save();
}

async function updateRfq(id, data) {
  return await RFQ.findByIdAndUpdate(
    id,
    {
      title: data.title,
      product: data.product,
      quantity: data.quantity,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
      vendors: data.vendors,
      status: data.status,
      category: data.category,
      description: data.description,
    },
    { new: true, omitUndefined: true }
  );
}

module.exports = {
  getOverview,
  getRecentRfqs,
  getRecentInvoices,
  getRecentPurchaseOrders,
  getInvoices,
  getPurchaseOrders,
  getQuotations,
  getRfqs,
  getUsers,
  getVendors,
  addVendor,
  updateVendor,
  deleteVendor,
  addInvoice,
  updateInvoice,
  addRfq,
  updateRfq
};
