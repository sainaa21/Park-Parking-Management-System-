const express = require("express");
const router = express.Router();
const { getPayments } = require("../controllers/paymentsController");
router.get("/", getPayments);
module.exports = router;