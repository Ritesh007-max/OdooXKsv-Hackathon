const express = require("express");
const {
  getRfqs,
  addRfq,
  updateRfq,
} = require("../controllers/rfqController");

const router = express.Router();

router.get("/", getRfqs);
router.post("/", addRfq);
router.put("/:id", updateRfq);

module.exports = router;
