const express = require("express");
const {
  getQuotations,
} = require("../controllers/quotationController");

const router = express.Router();

router.get("/", getQuotations);

module.exports = router;
