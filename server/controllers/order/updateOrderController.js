import db from "../../database/db.js";

export async function updateOrder(req, res) {
  const { id } = req.params;
  const { name, description, quantity, content, category, date, supplier } = req.body; 
  const consult = "UPDATE order_ SET name = ?, description = ?, quantity = ?, content = ?, category = ?, date = ?, supplier = ? WHERE id = ?";

  try {
    await db.query(consult, [name, description, quantity, content, category, date, supplier, id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error', error: err });
      }
      res.json(result)
    })
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error', error: err.message })
  }
}