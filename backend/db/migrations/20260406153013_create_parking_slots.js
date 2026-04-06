exports.up = function (knex) {
  return knex.schema.createTable("parking_slots", (table) => {
    table.increments("id").primary();
    table.string("slot_number").notNullable();
    table.string("status").defaultTo("available");
    table.string("type");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("parking_slots");
};