const express = require("express");
const router = express.Router();
const db = require("../db/knex");

router.get("/", async (req, res) => {
  try {

    const totalRevenueResult = await db("payments").sum("amount as total");
    const totalRevenue = totalRevenueResult[0].total || 0;

    const totalVehiclesResult = await db("vehicles").count("id as count");
    const totalVehicles = totalVehiclesResult[0].count;

    const revenueByDay = await db("payments")
      .select(db.raw("DATE(payment_time) as date"))
      .sum("amount as total")
      .groupBy("date")
      .orderBy("date");

    res.json({
      totalRevenue,
      totalVehicles,
      revenueByDay
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

module.exports = router;