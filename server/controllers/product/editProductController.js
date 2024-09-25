import db from "../../database/db.js";

export function updateProduct(req, res) {
    const { nombre, stock, precioCosto, ganancia, precioPublico, categoria, cantidadMinima, marca, bodega, proveedor } = req.body;
    const id = parseInt(req.params.id);

    // Validar ID
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: "Invalid or missing product ID" });
    }
  
    let query = "UPDATE product SET name = ?, total_stock = ?, cost_price = ?, public_price = ?, category = ?, minimum_quantity = ?, brand = ?, cellar = ?, supplier = ?, gain = ? WHERE id = ?";
    let queryParams = [nombre, stock, precioCosto, precioPublico, categoria, cantidadMinima, marca, bodega, proveedor, ganancia, id];

    try {
        db.query(query, queryParams, (err, result) => {
            if (err) {
                console.error(err); // Imprimir el error en la consola
                return res.status(500).json({ message: "Internal server error", error: err });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Product not found" });
            }
            return res.status(200).json({ message: "Product updated successfully" });
        });
    } catch (err) {
        console.error(err); // Imprimir el error en la consola
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}
