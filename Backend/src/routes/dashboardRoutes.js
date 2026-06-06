const express = require("express");
const {
  getDashboardOverview,
  getRecentRfqs,
  getRecentInvoices,
  getRecentPurchaseOrders,
  getVendors,
  getInvoices,
  getPurchaseOrders,
  getQuotations,
  getRfqs,
  getUsers,
  addVendor,
  updateVendor,
  deleteVendor,
  addInvoice,
  updateInvoice,
} = require("../controllers/dashboardController");

const router = express.Router();

router.get("/overview", getDashboardOverview);
router.get("/recent-rfqs", getRecentRfqs);
router.get("/recent-invoices", getRecentInvoices);
router.get("/recent-pos", getRecentPurchaseOrders);
router.get("/get-vendors", getVendors);
router.get("/get-invoices", getInvoices);
router.get("/get-purchase-orders", getPurchaseOrders);
router.get("/get-quotations", getQuotations);
router.get("/get-rfqs", getRfqs);
router.get("/get-users", getUsers);
router.post("/add-vendor", addVendor);
router.put("/update-vendor/:id", updateVendor);
router.delete("/delete-vendor/:id", deleteVendor);
router.post("/add-invoice", addInvoice);
router.put("/update-invoice/:id", updateInvoice);

module.exports = router;
