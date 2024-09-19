import db from "../../database/db.js";

export function editProduct(req, res) {
    const { nombre, stock, precioCosto, precioPublico, estado, categoria, cantidadMinima, marca, bodega, proveedor } = req.body;
    const id = parseInt(req.params.id);
  
    // Validar ID
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid or missing product ID" });
    }
  
    // Construir la consulta SQL dinámica
    let query = "UPDATE product SET ";
    let queryParams = [];
    
    // Añadir atributos a actualizar
    if (nombre) { query += "nombre = ?, "; queryParams.push(nombre); }
    if (stock !== undefined) { query += "stock = ?, "; queryParams.push(stock); }
    if (precioCosto !== undefined) { query += "precioCosto = ?, "; queryParams.push(precioCosto); }
    if (precioPublico !== undefined) { query += "precioPublico = ?, "; queryParams.push(precioPublico); }
    if (estado) { query += "estado = ?, "; queryParams.push(estado); }
    if (categoria) { query += "categoria = ?, "; queryParams.push(categoria); }
    if (cantidadMinima !== undefined) { query += "cantidadMinima = ?, "; queryParams.push(cantidadMinima); }
    if (marca) { query += "marca = ?, "; queryParams.push(marca); }
    if (bodega) { query += "bodega = ?, "; queryParams.push(bodega); }
    if (proveedor) { query += "proveedor = ?, "; queryParams.push(proveedor); }
  
    // Eliminar la última coma y espacio de la consulta
    query = query.slice(0, -2);
    query += " WHERE id = ?";
    queryParams.push(id);
  
    try {
      db.query(query, queryParams, (err, result) => {
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
  