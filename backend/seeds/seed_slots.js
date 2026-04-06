exports.seed = async function (knex) {
  await knex("parking_slots").del();

  const slots = [];

  for (let i = 1; i <= 20; i++) {
    slots.push({
      slot_number: `A${i}`,
      status: "available",
      type: "car"
    });
  }

  await knex("parking_slots").insert(slots);
};