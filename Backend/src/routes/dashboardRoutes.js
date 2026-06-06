const express = require("express");
const {
  getDashboardOverview,
  getRecentRfqs,
  getRecentInvoices,
  getRecentPurchaseOrders,
} = require("../controllers/dashboardController");

const router = express.Router();

router.get("/overview", getDashboardOverview);
router.get("/recent-rfqs", getRecentRfqs);
router.get("/recent-invoices", getRecentInvoices);
router.get("/recent-pos", getRecentPurchaseOrders);

module.exports = router;
