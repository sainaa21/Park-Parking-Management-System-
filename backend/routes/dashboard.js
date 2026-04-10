const express = require("express");
const router = express.Router();
const db = require("../db/knex");

router.get("/stats", async (req, res) => {
  try {
    const total = await db("parking_slots").count("id as count").first();

    const available = await db("parking_slots")
      .where({ status: "available" })
      .count("id as count")
      .first();

    const occupied = await db("parking_slots")
      .where({ status: "occupied" })
      .count("id as count")
      .first();

    const revenue = await db("payments")
      .sum("amount as total")
      .first();

    res.json({
      total: Number(total.count),
      available: Number(available.count),
      occupied: Number(occupied.count),
      revenue: Number(revenue.total || 0),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;