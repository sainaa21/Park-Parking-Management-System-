const express = require("express");
const router = express.Router();
const { checkInVehicle, checkOutVehicle } = require("../controllers/vehiclesController");
router.post("/checkin", checkInVehicle);
router.post("/checkout", checkOutVehicle);
module.exports = router;