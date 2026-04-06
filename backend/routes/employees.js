const express = require("express");
const router = express.Router();
const {
    addEmployee,
    getEmployees,
    deleteEmployee,
} = require("../controllers/employeeController");
router.post("/", addEmployee);
router.get("/", addEmployee);
router.delete("/:id", deleteEmployee);

module.exports = router;