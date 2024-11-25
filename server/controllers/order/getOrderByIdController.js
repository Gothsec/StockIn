import db from '../../database/db.js';

export async function getOrderById(req, res) {
  const { id } = req.params;
  const consult = `SELECT * FROM order_ WHERE id = ?`;

  try {
    await db.query(consult, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error', error: err });
      }
      if (result.length > 0) {
        res.json(result[0]);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
}
