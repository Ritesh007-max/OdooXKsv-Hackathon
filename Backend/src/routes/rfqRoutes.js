const express = require("express");
const {
  getRfqs,
  addRfq,
  updateRfq,
} = require("../controllers/rfqController");
const { restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

// All authenticated users can view RFQs
router.get("/", getRfqs);
// Only officers, managers and admins can create or modify RFQs
router.post("/", restrictTo("admin", "officer", "manager"), addRfq);
router.put("/:id", restrictTo("admin", "officer", "manager"), updateRfq);

module.exports = router;
