const express = require("express");
const { getHealth } = require("../controllers/healthController");
const dashboardRoutes = require("./dashboardRoutes");

const router = express.Router();

router.get("/health", getHealth);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
