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

function getRecentInvoices(limit = 5) {
  return Invoice.find()
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
}

function getRecentPurchaseOrders(limit = 5) {
  return PurchaseOrder.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("rfqId", "title product quantity status")
    .populate("vendorId", "name category contact")
    .lean();
}

function getInvoices() {
  return Invoice.find()
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
  getVendors
};
