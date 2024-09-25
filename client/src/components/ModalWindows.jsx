import React, { useState, useEffect } from "react";

function ModalWidows({
  open,
  onClose,
  titleModal,
  buttonText,
  onClickFunction,
  productInfo,
  productId,
}) {
  const [stock, setStock] = useState("");
  const [precioPublico, setPrecioPublico] = useState("");
  const [precioCosto, setPrecioCosto] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [estadoProducto, setEstadoProducto] = useState("activo");
  const [categoria, setCategoria] = useState("maquinas");
  const [cantidadMinima, setCantidadMinima] = useState("");
  const [marca, setMarca] = useState("");
  const [bodega, setBodega] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    if (productInfo) {
      console.log(productInfo);
      // Actualiza los campos con la información del producto
      setNewProductName(productInfo.name || "");
      setStock(productInfo.total_stock || "");
      setPrecioCosto(productInfo.cost_price || "");
      setPrecioPublico(productInfo.public_price || "");
      setCantidadMinima(productInfo.minimum_quantity || "");
      setMarca(productInfo.brand || "");
      setBodega(productInfo.cellar || "");
      setProveedor(productInfo.supplier || "");
      setEstadoProducto(productInfo.state || "activo");
      setCategoria(productInfo.category || "maquinas");
    }
  }, [productInfo]);

  const deleteInputs = () => {
    setNewProductName("");
    setStock("");
    setPrecioPublico("");
    setPrecioCosto("");
    setCantidadMinima("");
    setMarca("");
    setBodega("");
    setProveedor("");
    setErrorMessages([]);
  };

  const validateForm = () => {
    let errors = [];

    if (!newProductName) errors.push("El nombre del producto es requerido.");
    if (!stock) errors.push("La cantidad inicial es requerida.");
    if (!precioCosto) errors.push("El precio costo es requerido.");
    if (!precioPublico) errors.push("El precio público es requerido.");
    if (!cantidadMinima) errors.push("La cantidad mínima es requerida.");
    if (!marca) errors.push("La marca es requerida.");
    if (!bodega) errors.push("La bodega es requerida.");
    if (!proveedor) errors.push("El proveedor es requerido.");

    if (Number(stock) < 0)
      errors.push("La cantidad inicial no puede ser negativa.");
    if (Number(precioCosto) < 0)
      errors.push("El precio costo no puede ser negativo.");
    if (Number(precioPublico) < 0)
      errors.push("El precio público no puede ser negativo.");
    if (Number(cantidadMinima) < 0)
      errors.push("La cantidad mínima no puede ser negativa.");

    if (Number(cantidadMinima) > Number(stock))
      errors.push("La cantidad mínima no puede ser mayor que la cantidad inicial.");

    if (Number(precioCosto) > Number(precioPublico))
      errors.push("El precio costo no puede ser mayor que el precio público.");

    return errors;
  };

  const handleBtnCancel = (e) => {
    deleteInputs();
    onClose();
  };

  const handleUpdateProduct = (e) => {
    if (e) e.preventDefault();

    const validationErrors = validateForm();
    setErrorMessages(validationErrors);

    if (validationErrors.length > 0) {
      return;
    }

    const newProduct = {
      nombre: newProductName,
      stock: parseFloat(stock),
      precioCosto: parseFloat(precioCosto),
      precioPublico: parseFloat(precioPublico),
      ganancia: calcularGanancia(),
      estado: estadoProducto,
      categoria,
      cantidadMinima: parseFloat(cantidadMinima),
      marca,
      bodega,
      proveedor,
    };

    fetch(`http://localhost:3000/update-product/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.message === "Product updated successfully") {
          window.location.reload();
        }
      })
      .catch((err) => {
        console.error("Error: ", err);
      });
  };

  const handleAddProduct = (e) => {
    if (e) e.preventDefault();

    const validationErrors = validateForm();
    setErrorMessages(validationErrors);

    if (validationErrors.length > 0) {
      return;
    }

    const newProduct = {
      nombre: newProductName,
      stock: parseFloat(stock),
      precioCosto: parseFloat(precioCosto),
      precioPublico: parseFloat(precioPublico),
      ganancia: calcularGanancia(),
      estado: estadoProducto,
      categoria,
      cantidadMinima: parseFloat(cantidadMinima),
      marca,
      bodega,
      proveedor,
    };

    fetch("http://localhost:3000/add-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.message === "Product added successfully") {
          deleteInputs();
          onClickFunction(e);
          onClose();
        }
      })
      .catch((err) => {
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
      <div className="w-[800px] min-h-[100px] bg-white relative rounded-lg shadow-lg p-6">
        <h1 className="text-xl font-bold mb-4"> {titleModal} </h1>

        {errorMessages.length > 0 && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <ul>
              {errorMessages.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="my-4 col-span-3">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              name="name"
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              required
              readOnly={buttonText === "Mostrar"}
            />
          </div>
          <div className="my-4 col-span-1">
            <label className="block text-sm font-medium text-gray-700">Cantidad inicial</label>
            <input
              name="total_stock"
              type="number"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              readOnly={buttonText === "Mostrar"}
            />
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">Precio costo</label>
            <input
              name="cost_price"
              type="number"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={precioCosto}
              onChange={(e) => setPrecioCosto(e.target.value)}
              required
              readOnly={buttonText === "Mostrar"}
            />
          </div>
          <div className="my-4 col-span-1">
            <label className="block text-sm font-medium text-gray-700">Precio público</label>
            <input
              name="public_price"
              type="number"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={precioPublico}
              onChange={(e) => setPrecioPublico(e.target.value)}
              required
              readOnly={buttonText === "Mostrar"}
            />
          </div>
          <div className="my-4 col-span-1">
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={estadoProducto}
              onChange={(e) => setEstadoProducto(e.target.value)}
              disabled
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div className="my-4 col-span-1">
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <select
              name="category"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              disabled={buttonText === "Mostrar"}
            >
              <option value="maquinas">Maquinas</option>
              <option value="ropa interior">Ropa interior</option>
              <option value="cuidado capilar">Cuidado capilar</option>
              <option value="cremas">Cremas</option>
              <option value="utileria">Utileria</option>
            </select>
          </div>
          <div className="my-4 col-span-1">
            <label className="block text-sm font-medium text-gray-700">Cantidad mínima</label>
            <input
              name="minimum_quantity"
              type="number"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={cantidadMinima}
              onChange={(e) => setCantidadMinima(e.target.value)}
              required
              readOnly={buttonText === "Mostrar"}
            />
          </div>
          <div className="my-4 col-span-1">
            <label className="block text-sm font-medium text-gray-700">Marca</label>
            <input
              name="brand"
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              required
              readOnly={buttonText === "Mostrar"}
            />
          </div>
          <div className="my-4 col-span-1">
            <label className="block text-sm font-medium text-gray-700">Bodega</label>
            <input
              name="cellar"
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={bodega}
              onChange={(e) => setBodega(e.target.value)}
              readOnly={buttonText === "Mostrar"}
            />
          </div>
          <div className="my-4 col-span-1">
            <label className="block text-sm font-medium text-gray-700">Proveedor</label>
            <input
              name="supplier"
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={proveedor}
              onChange={(e) => setProveedor(e.target.value)}
              readOnly={buttonText === "Mostrar"}
            />
          </div>
          <div className="my-4 col-span-1">
            <label className="block text-sm font-medium text-gray-700">Ganancia</label>
            <input
              name="gain"
              type="number"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={calcularGanancia()}
              readOnly
            />
          </div>
          <div className="my-4 col-span-1">
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
              <button
                onClick={onClose}
                className="bg-gray-300 text-black py-2 px-4 rounded"
              >
                Volver
              </button>
            </div>
          ) : (
            <div className="flex justify-between">
              <button
                onClick={handleBtnCancel}
                className="bg-gray-300 text-black py-2 px-4 rounded"
              >
                Cancelar
              </button>
              {buttonText === "Crear" ? (
                <button
                  onClick={handleAddProduct}
                  className="bg-green-500 text-white py-2 px-4 rounded"
                >
                  {buttonText}
                </button>
              ) : buttonText === "Modificar" ? (
                <button
                  onClick={handleUpdateProduct}
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
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
