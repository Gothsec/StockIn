import { useState, useEffect } from "react";

export default function ReadUpdateOrderModal({ option, id, onClose }) {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch(`http://localhost:3000/get-order/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const formattedDate = data.date ? data.date.split('/').reverse().join('-') : '';
        setData({
          ...data,
          quantity: data.quantity || 1,
          date: formattedDate,
        });
      })
      .catch((error) => {
        console.error("Error obteniendo datos:", error);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const dateToSend = data.date ? data.date.split('-').reverse().join('/') : '';
    
    fetch(`http://localhost:3000/update-order/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, date: dateToSend })
    })
      .then((response) => {
        if (response.ok) {
          console.log("Pedido modificado con éxito.");
          onClose();
          window.location.reload();
        } else {
          console.error("No se pudo modificar el pedido.");
        }
      })
      .catch((err) => {
        console.error("Error: ", err);
      });
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">
          {option === "read" ? "Ver pedido" : "Modificar pedido"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-sm" htmlFor="name">Nombre</label>
            <input
              id="name"
              name="name"
              type="text"
              readOnly={option === "read"}
              placeholder="Nombre del pedido"
              value={data.name || ""}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="text-sm" htmlFor="quantity">Cantidad</label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              readOnly={option === "read"}
              placeholder="Cantidad"
              value={data.quantity || 1}
              onChange={(e) => setData({ ...data, quantity: Number(e.target.value) })}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="text-sm" htmlFor="content">Contenido</label>
            <input
              id="content"
              name="content"
              type="text"
              readOnly={option === "read"}
              placeholder="Contenido"
              value={data.content || ""}
              onChange={(e) => setData({ ...data, content: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="text-sm" htmlFor="category">Categoría</label>
            <select
              id="category"
              name="category"
              value={data.category || ""}
              disabled={option === "read"}
              onChange={(e) => setData({ ...data, category: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            >
              <option value="" disabled>
                Seleccionar categoría
              </option>
              <option value="maquinas">Maquinas</option>
              <option value="ropa interior">Ropa interior</option>
              <option value="cuidado capilar">Cuidado capilar</option>
              <option value="cremas">Cremas</option>
              <option value="utileria">Utileria</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="text-sm" htmlFor="supplier">Proveedor</label>
            <input
              id="supplier"
              name="supplier"
              type="text"
              readOnly={option === "read"}
              placeholder="Proveedor"
              value={data.supplier || ""}
              onChange={(e) => setData({ ...data, supplier: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="text-sm" htmlFor="date">Fecha</label>
            <input
              id="date"
              name="date"
              type="date"
              readOnly={option === "read"}
              value={data.date || ""}
              onChange={(e) => setData({ ...data, date: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="text-sm" htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              placeholder="Descripción del pedido (opcional)"
              maxLength={1000}
              readOnly={option === "read"}
              value={data.description || ""}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="bg-gray-400 py-1 px-3 rounded-md text-white hover:bg-gray-600"
              onClick={onClose}
            >
              Cancelar
            </button>
            {option !== "read" && (
              <button
                type="submit"
                className="bg-yellow-500 py-1 px-3 rounded-md text-white hover:bg-yellow-600"
              >
                Modificar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
