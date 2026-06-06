const { PurchaseOrder } = require("../models");

function getPurchaseOrders() {
  return PurchaseOrder.find()
    .sort({ createdAt: -1 })
    .populate("rfqId", "title product quantity deadline status")
    .populate("vendorId", "name category contact")
    .lean();
}

module.exports = {
  getPurchaseOrders,
};
