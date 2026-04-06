const db = require("../db/knex");
exports.getPayments = async (req, res) => {
    try {
        const payments = await db("payments");
        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}