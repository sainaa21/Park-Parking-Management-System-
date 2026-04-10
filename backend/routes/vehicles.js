const express = require("express");
const router = express.Router();
const db = require("../db/knex");

// ✅ CHECK-IN
router.post("/checkin", async (req, res) => {
  let { vehicle_number, driver_name, slot_id } = req.body;

  console.log("BODY:", req.body);

  try {
    // 🔥 FIX 1: ensure slot_id is number
    slot_id = Number(slot_id);

    const slot = await db("parking_slots")
      .where({ id: slot_id, status: "available" })
      .first();

    if (!slot) {
      return res.status(400).json({ message: "Slot not available" });
    }

    // 🔥 FIX 2: insert correct slot_id
    const [vehicle] = await db("vehicles")
      .insert({
        vehicle_number,
        driver_name,
        slot_id: slot.id, // ALWAYS use DB id
        entry_time: new Date(),
      })
      .returning("*");

    // 🔥 FIX 3: update slot status
    await db("parking_slots")
      .where({ id: slot.id })
      .update({ status: "occupied" });

    res.json({
      success: true,
      ticket: {
        id: vehicle.id,
        vehicle_number,
        slot_number: slot.slot_number,
      },
    });
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ ACTIVE VEHICLES
router.get("/active", async (req, res) => {
  try {
    const vehicles = await db("vehicles").whereNull("exit_time");
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PREVIEW AMOUNT
router.get("/preview/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const vehicle = await db("vehicles").where({ id }).first();

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const now = new Date();

    const duration = Math.ceil(
      (now - new Date(vehicle.entry_time)) / (1000 * 60 * 60)
    );

    const amount = duration * 20;

    res.json({ duration, amount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ CHECKOUT
router.post("/checkout", async (req, res) => {
  const { vehicle_id } = req.body;

  try {
    const vehicle = await db("vehicles")
      .where({ id: vehicle_id })
      .first();

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const exit_time = new Date();

    const duration = Math.ceil(
      (exit_time - new Date(vehicle.entry_time)) / (1000 * 60 * 60)
    );

    const amount = duration * 20;

    await db("payments").insert({
      vehicle_id,
      amount,
      duration,
      payment_time: exit_time,
    });

    await db("vehicles")
      .where({ id: vehicle_id })
      .update({ exit_time });

    // 🔥 FIX: free slot correctly
    await db("parking_slots")
      .where({ id: vehicle.slot_id })
      .update({ status: "available" });

    res.json({ success: true, amount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;