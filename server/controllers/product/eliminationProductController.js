import db from "../../database/db.js";

export function eliminationProduct(req, res) {
  const { estado } = req.body;
  const consult = "UPDATE product SET estado = ? WHERE id = ?";
  const id = parseInt(req.params.id);

  if (!id || isNaN(id) || !estado) {
    return res.status(400).json({ message: "Invalid or missing product ID or state" });
  }

  try {
    db.query(consult, [estado, id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error", error: err });
      }
      if (result.affectedRows === 0) {
        // No rows were affected, meaning the ID might not exist
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product updated successfully" });
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}