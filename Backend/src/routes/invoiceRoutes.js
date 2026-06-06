const express = require("express");
const {
  getInvoices,
  addInvoice,
  updateInvoice,
} = require("../controllers/invoiceController");
const { restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

// All authenticated users can view invoices
router.get("/", getInvoices);
// Vendors can submit, officers and admins can create invoices
router.post("/", restrictTo("admin", "officer", "vendor"), addInvoice);
// Only officers and admins can update invoice status
router.put("/:id", restrictTo("admin", "officer"), updateInvoice);

module.exports = router;
