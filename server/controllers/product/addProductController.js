import db from "../../database/db.js";

export function addProduct(req, res) {
  const { nombre, stock, precioCosto, precioPublico, ganancia, estado, categoria, cantidadMinima, marca, bodega, proveedor } = req.body;
  const consult = 'INSERT INTO product (name, stock, precioCosto, precioPublico, ganancia, estado, categoria, cantidadMinima, marca, bodega, proveedor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';


  
  try {
    db.query(consult, [nombre, stock, precioCosto, precioPublico, ganancia, estado, categoria, cantidadMinima, marca, bodega, proveedor], (err, result) => {
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