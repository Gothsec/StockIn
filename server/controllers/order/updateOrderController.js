import db from "../../database/db.js";

export async function updateOrder(req, res) {
  const { id } = req.params;
  const { name, quantity, content, category, supplier, date, description } = req.body;
  const consult = `UPDATE _order SET name = ?, quantity = ?, content = ?, category = ?, supplier = ?, date = ?, description = ? WHERE id = ?`;

  try {
    await db.query(consult, [name, quantity, content, category, supplier, date, description, id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error', error: err });
      }
      res.json(result)
    })
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error', error: err.message })
  }
}