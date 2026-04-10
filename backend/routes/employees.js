const express = require("express");
const router = express.Router();
const db = require("../db/knex");

router.get("/", async (req, res) => {
  try {
    const employees = await db("employees");

    const fixed = employees.map((e) => ({
      ...e,
      shiftTime: e.shift_time,
    }));

    res.json(fixed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { name, role, shift_time, password } = req.body;

  try {
    const [employee] = await db("employees")
      .insert({
        name,
        role,
        shift_time,
        password,
      })
      .returning("*");

    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;