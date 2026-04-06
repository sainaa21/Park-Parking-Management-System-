const db = require("../db/knex");

exports.checkInVehicle = async (req, res) => {
  const { vehicle_number, driver_name } = req.body;

  try {
    
    const slot = await db("parking_slots")
      .where({ status: "available" })
      .first();

    if (!slot) {
      return res.status(400).json({ message: "No slots available" });
    }

    
    const [vehicle] = await db("vehicles")
      .insert({
        vehicle_number,
        driver_name,
        slot_id: slot.id,
        entry_time: new Date(),
      })
      .returning("*");

    
    await db("parking_slots")
      .where({ id: slot.id })
      .update({ status: "occupied" });

    res.json({ vehicle, slot });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkOutVehicle = async (req, res) => {
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
      (new Date(exit_time) - new Date(vehicle.entry_time)) / (1000 * 60 * 60)
    );
    
    const rate = 20; 
    const amount = duration * rate;

    
    await db("payments").insert({
      vehicle_id,
      amount,
      duration,
      payment_time: exit_time,
    });


    await db("vehicles")
      .where({ id: vehicle_id })
      .update({ exit_time });

    
    await db("parking_slots")
      .where({ id: vehicle.slot_id })
      .update({ status: "available" });

    res.json({ message: "Checkout complete", amount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};