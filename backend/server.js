const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db/knex");

const app = express();
app.use(cors());
app.use(express.json());
console.log(process.env.DB_HOST);
console.log(process.env.DB_USER);
console.log(process.env.DB_NAME);
console.log(process.env.DB_PORT);
db.raw("SELECT 1+1 AS result")
  .then(() => console.log("DB connected ✅"))
  .catch((err) => console.log("DB error ❌", err));
app.get("/", (req, res) => {
    res.send("API is running");
});
const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});