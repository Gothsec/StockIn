import db from "../../database/db.js";

export function createOrder(req, res) {

  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "El nombre del pedido es obligatorio" });
    }

    const query = "INSERT INTO _order (name) VALUES (?)";
    const result = db.query(query, [name]);

    res.status(201).json({ message: "Pedido creado exitosamente", orderId: result.insertId });
  } catch (error) {
    console.error("Error creando pedido:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
