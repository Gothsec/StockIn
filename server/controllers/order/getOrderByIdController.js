import db from "../../database/db.js";

export async function getOrderById(req, res) {
  const { id } = req.params;
  const consult = `SELECT * FROM _order WHERE id = ?`;

  try {
    await db.query(consult, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error', error: err });
      }
      console.log(result);
      res.json(result)
    })
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error', error: err.message })
  }
}