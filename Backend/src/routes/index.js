const express = require("express");
const { getHealth } = require("../controllers/healthController");
const { protect } = require("../middleware/authMiddleware");
const authRoutes = require("./authRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const vendorRoutes = require("./vendorRoutes");
const rfqRoutes = require("./rfqRoutes");
const invoiceRoutes = require("./invoiceRoutes");
const purchaseOrderRoutes = require("./purchaseOrderRoutes");
const quotationRoutes = require("./quotationRoutes");
const userRoutes = require("./userRoutes");

const router = express.Router();

router.get("/health", getHealth);
router.use("/auth", authRoutes);

// Protected routes
router.use("/dashboard", protect, dashboardRoutes);
router.use("/vendors", protect, vendorRoutes);
router.use("/rfqs", protect, rfqRoutes);
router.use("/invoices", protect, invoiceRoutes);
router.use("/purchase-orders", protect, purchaseOrderRoutes);
router.use("/quotations", protect, quotationRoutes);
router.use("/users", protect, userRoutes);

module.exports = router;
