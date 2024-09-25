import db from "../../database/db.js";

export function removeOrder(req, res) {
  const consult = "UPDATE order_ SET state = 'N' WHERE id = ?"; 
  const id = parseInt(req.params.id);

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Invalid or missing order ID" });
  }

  try {
    db.query(consult, [id], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Internal server error", error: err });
      }
      console.log(result);
      res.json({ message: "Order deleted successfully" });
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}
