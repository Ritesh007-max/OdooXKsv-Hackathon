const { Quotation } = require("../models");

function getQuotations() {
  return Quotation.find()
    .sort({ createdAt: -1 })
    .populate("rfqId", "title product quantity deadline status")
    .populate("vendorId", "name category contact")
    .lean();
}

module.exports = {
  getQuotations,
};
