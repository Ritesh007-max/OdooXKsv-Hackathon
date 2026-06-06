const express = require("express");
const { getHealth } = require("../controllers/healthController");
const dashboardRoutes = require("./dashboardRoutes");
const vendorRoutes = require("./vendorRoutes");
const rfqRoutes = require("./rfqRoutes");
const invoiceRoutes = require("./invoiceRoutes");
const purchaseOrderRoutes = require("./purchaseOrderRoutes");
const quotationRoutes = require("./quotationRoutes");
const userRoutes = require("./userRoutes");

const router = express.Router();

router.get("/health", getHealth);
router.use("/dashboard", dashboardRoutes);
router.use("/vendors", vendorRoutes);
router.use("/rfqs", rfqRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/purchase-orders", purchaseOrderRoutes);
router.use("/quotations", quotationRoutes);
router.use("/users", userRoutes);

module.exports = router;
