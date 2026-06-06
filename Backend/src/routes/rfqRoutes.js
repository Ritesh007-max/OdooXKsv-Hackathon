const express = require("express");
const {
  getRfqs,
  addRfq,
  updateRfq,
} = require("../controllers/rfqController");
const { restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getRfqs);
router.post("/", restrictTo("admin", "officer"), addRfq);
router.put("/:id", restrictTo("admin", "officer"), updateRfq);

module.exports = router;
