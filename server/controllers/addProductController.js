import db from "../database/db.js";

export function addProduct(req, res) {
  const { id, name } = req.body;
  const consult = 'INSERT INTO product (id, name) VALUES (?, ?)';

  try {
    db.query(consult, [id, name], (err, result) => {
      if (err) {
        console.error(err)
        return res.status(500).json({ message: 'Internal server error', error: err })
      }
      // console.log(result);
      res.status(201).json({ message: 'Product added successfully' });
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Internal server error', error: err.message })
  }
}