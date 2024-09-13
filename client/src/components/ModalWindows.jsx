import React, { useState } from 'react';

function ModalWidows({ open, onClose, titleModal, buttonText, onClickFunction }) {
  const [stock, setStock] = useState("");
  const [precioPublico, setPrecioPublico] = useState("");
  const [precioCosto, setPrecioCosto] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [codigo, setCodigo] = useState("");
  const [estadoProducto, setEstadoProducto] = useState("activo");
  const [categoria, setCategoria] = useState("");
  const [cantidadMinima, setCantidadMinima] = useState("");
  const [marca, setMarca] = useState("");
  const [bodega, setBodega] = useState("");
  const [proveedor, setProveedor] = useState("");

  const handleAddProduct = (e) => {
    e.preventDefault();

    if (newProductName.trim() === "") {
      console.log("Please enter a product name");
      return;
    }

    // Convertir valores a números si es necesario
    const newProduct = {
      codigo: parseInt(codigo, 10), // Asegúrate de que el código sea un número
      nombre: newProductName,
      stock: parseFloat(stock), // Convertir a número
      precioCosto: parseFloat(precioCosto), // Convertir a número
      precioPublico: parseFloat(precioPublico), // Convertir a número
      ganancia: calcularGanancia(),
      estado: estadoProducto,
      categoria,
      cantidadMinima: parseFloat(cantidadMinima), // Convertir a número
      marca,
      bodega,
      proveedor,
    };

    fetch('http://localhost:3000/add-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    })
      .then(response => response.json())
      .then(result => {
        if (result.message === 'Product added successfully') {
          setNewProductName("");
          setStock("");
          setPrecioPublico("");
          setPrecioCosto("");
          setCodigo("");
          setCategoria("");
          setCantidadMinima("");
          setMarca("");
          setBodega("");
          setProveedor("");
          onClickFunction(e); // Ejecuta la función pasada como prop
          onClose(); // Cierra el modal
        }
      })
      .catch(err => {
        console.error("Error: ", err);
      });
  };

  const calcularGanancia = () => {
    const costo = parseFloat(precioCosto) || 0;
    const publico = parseFloat(precioPublico) || 0;
    return publico - costo;
  };

  if (!open) return null;

  return (
    <div className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-50 p-10 flex items-center justify-center">
      <div className="w-[600px] min-h-[100px] bg-white relative rounded-lg shadow-lg p-5">
        <h1 className="text-xl font-bold mb-4"> {titleModal} </h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="my-4 col-span-3">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input 
              type="text" 
              className="w-full mt-1 p-2 border border-gray-300 rounded" 
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)} 
              required 
            />
          </div>
          <div className="my-4 col-span-2">
            <label className="block text-sm font-medium text-gray-700">Código</label>
            <input 
              type="number" 
              className="w-full mt-1 p-2 border border-gray-300 rounded" 
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required 
            />
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">Cantidad inicial</label>
            <input 
              type="number" 
              className="w-full mt-1 p-2 border border-gray-300 rounded" 
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required 
            />
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">Precio costo</label>
            <input 
              type="number" 
              className="w-full mt-1 p-2 border border-gray-300 rounded" 
              value={precioCosto}
              onChange={(e) => setPrecioCosto(e.target.value)}
              required 
            />
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">Precio público</label>
            <input 
              type="number" 
              className="w-full mt-1 p-2 border border-gray-300 rounded" 
              value={precioPublico}
              onChange={(e) => setPrecioPublico(e.target.value)}
              required 
            />
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select 
              className="w-full mt-1 p-2 border border-gray-300 rounded" 
              value={estadoProducto}
              onChange={(e) => setEstadoProducto(e.target.value)}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div className="my-4 col-span-2">
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <input 
              type="text" 
              className="w-full mt-1 p-2 border border-gray-300 rounded" 
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required 
            />
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">Cantidad mínima</label>
            <input 
              type="number" 
              className="w-full mt-1 p-2 border border-gray-300 rounded" 
              value={cantidadMinima}
              onChange={(e) => setCantidadMinima(e.target.value)}
              required 
            />
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">Marca</label>
            <input 
              type="text" 
              className="w-full mt-1 p-2 border border-gray-300 rounded" 
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              required 
            />
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">Bodega</label>
            <input 
              type="text" 
              className="w-full mt-1 p-2 border border-gray-300 rounded" 
              value={bodega}
              onChange={(e) => setBodega(e.target.value)}
            />
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">Proveedor</label>
            <input 
              type="text" 
              className="w-full mt-1 p-2 border border-gray-300 rounded" 
              value={proveedor}
              onChange={(e) => setProveedor(e.target.value)}
            />
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">Ganancia</label>
            <input 
              type="number" 
              className="w-full mt-1 p-2 border border-gray-300 rounded" 
              value={calcularGanancia()}
              readOnly 
            />
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">Stock total</label>
            <input 
              type="number" 
              className="w-full mt-1 p-2 border border-gray-300 rounded" 
              value={stock}
              readOnly 
            />
          </div>
        </div>
        <div className="mt-4">
          {buttonText === "Mostrar" ? (
            <div className="flex justify-center">
              <button onClick={onClose} className="bg-gray-300 text-black py-2 px-4 rounded">
                Volver
              </button>
            </div>
          ) : (
            <div className="flex justify-between">
              <button onClick={onClose} className="bg-gray-300 text-black py-2 px-4 rounded">
                Cancelar
              </button>
              {buttonText === "Crear" ? (
                <button onClick={handleAddProduct} className="bg-green-500 text-white py-2 px-4 rounded">
                  {buttonText}
                </button>
              ) : buttonText === "Modificar" ? (
                <button onClick={onClose} className="bg-blue-500 text-white py-2 px-4 rounded">
                  {buttonText}
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalWidows;
