import db from "../../database/db.js";

export function readOrder(req, res) {
  const consult = 'SELECT id, name FROM _order'

  try {
    db.query(consult, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error', error: err });
      }
      res.json(result)
    })
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error', error: err.message })
  }
}