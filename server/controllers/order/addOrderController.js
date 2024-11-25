import db from "../../database/db.js";

export function createOrder(req, res) {

  try {
    const { name, description, quantity, content, category, date, supplier } = req.body;

    if (!name) {
      return res.status(400).json({ message: "El nombre del pedido es obligatorio" });
    }

    const query = "INSERT INTO order_ (name, description, quantity, content, category, date, supplier) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const result = db.query(query, [name, description, quantity, content, category, date, supplier]);

    res.status(201).json({ message: "Pedido creado exitosamente", orderId: result.insertId });
  } catch (error) {
    console.error("Error creando pedido:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
