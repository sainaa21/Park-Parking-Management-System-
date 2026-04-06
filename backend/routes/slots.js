const express = require("express");
const router = express.Router();
const { getSlots, updateSlot } = require("../controllers/slotsController")
router.get("/", getSlots);
router.put("/", updateSlot);
module.exports = router;