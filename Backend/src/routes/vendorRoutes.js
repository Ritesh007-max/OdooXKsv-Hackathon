const express = require("express");
const {
  getVendors,
  getVendorById,
  addVendor,
  updateVendor,
  deleteVendor,
} = require("../controllers/vendorController");
const { restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getVendors);
router.get("/:id", getVendorById);
router.post("/", restrictTo("admin", "officer", "vendor", "manager"), addVendor);
router.put("/:id", restrictTo("admin", "officer", "vendor", "manager"), updateVendor);
router.delete("/:id", restrictTo("admin", "officer", "manager"), deleteVendor);

module.exports = router;
