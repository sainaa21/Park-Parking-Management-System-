const db=require("../db/knex");
exports.addEmployee = async (req, res) => {
  const { name, email, role, password } = req.body;

  try {
    const [employee] = await db("employees")
      .insert({ name, email, role, password })
      .returning("*");

    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEmployees = async (req, res) => {
  const employees = await db("employees");
  res.json(employees);
};

exports.deleteEmployee = async (req, res) => {
  await db("employees").where({ id: req.params.id }).del();
  res.json({ message: "Deleted" });
};