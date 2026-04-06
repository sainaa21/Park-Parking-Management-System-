exports.up = function (knex) {
  return knex.schema.createTable("payments", (table) => {
    table.increments("id").primary();
    table.integer("vehicle_id").references("id").inTable("vehicles");
    table.decimal("amount");
    table.integer("duration");
    table.timestamp("payment_time").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("payments");
};