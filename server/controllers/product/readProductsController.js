import db from "../../database/db.js";

export function readProduct(req, res) {
  //const consult = "SELECT id, name FROM product WHERE state = 'Y'";
const consult = `
SELECT id, name, total_stock, minimum_quantity, brand,
CASE 
  WHEN total_stock <= minimum_quantity THEN true
  ELSE false
END AS isLowStock
FROM product
WHERE state = 'TRUE'
  `;
    

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