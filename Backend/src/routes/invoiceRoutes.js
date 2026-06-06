const express = require("express");
const {
  getInvoices,
  addInvoice,
  updateInvoice,
} = require("../controllers/invoiceController");

const router = express.Router();

router.get("/", getInvoices);
router.post("/", addInvoice);
router.put("/:id", updateInvoice);

module.exports = router;
