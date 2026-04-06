exports.up = function (knex) {
  return knex.schema.createTable("employees", (table) => {
    table.increments("id").primary();
    table.string("name");
    table.string("email").unique();
    table.string("role");
    table.string("password");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("employees");
};