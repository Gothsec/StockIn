import db from "../../database/db.js";

export function getProductById(req, res) {
  const productId = req.params.id;

  const consult = "SELECT * FROM product WHERE id = ?";

  try {
    db.query(consult, [productId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error', error: err });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Devuelve la información del producto
      res.json(result[0]);
    });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
}
