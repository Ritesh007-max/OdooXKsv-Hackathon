const express = require("express");
const {
  getVendors,
  addVendor,
  updateVendor,
  deleteVendor,
} = require("../controllers/vendorController");
const { restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getVendors);
router.post("/", restrictTo("admin", "officer"), addVendor);
router.put("/:id", restrictTo("admin", "officer"), updateVendor);
router.delete("/:id", restrictTo("admin", "officer"), deleteVendor);

module.exports = router;
