const { RFQ, Vendor, Invoice, PurchaseOrder } = require("../models");
const { mapLegacyInvoice } = require("./invoiceService");

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

module.exports = {
  getOverview,
  getRecentRfqs,
  getRecentInvoices,
  getRecentPurchaseOrders,
};
