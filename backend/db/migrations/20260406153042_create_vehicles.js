exports.up = function (knex) {
  return knex.schema.createTable("vehicles", (table) => {
    table.increments("id").primary();
    table.string("vehicle_number").notNullable();
    table.string("driver_name");
    table.integer("slot_id").references("id").inTable("parking_slots");
    table.timestamp("entry_time").defaultTo(knex.fn.now());
    table.timestamp("exit_time");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("vehicles");
};