import db from "../../database/db.js";

export function readProduct(req, res) {
  const consult = 'SELECT id, name FROM product';

  try {
    db.query(consult, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error', error: err });
      }
      // console.log(result)
      res.json(result)
    })
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error', error: err.message })
  }
}