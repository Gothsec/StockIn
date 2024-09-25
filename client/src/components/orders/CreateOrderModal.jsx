import { useState } from "react";

export default function CreateOrderModal({ onCreate, toggleModal }) {
  const [newOrderName, setNewOrderName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);

  const validateForm = () => {
    let formErrors = {};

    if (!newOrderName) {
      formErrors.newOrderName = "El nombre del pedido es obligatorio";
    }

    if (quantity <= 0) {
      formErrors.quantity = "La cantidad debe ser mayor que cero";
    }

    if (!content) {
      formErrors.content = "El contenido es obligatorio";
    }

    if (!category) {
      formErrors.category = "Debe seleccionar una categoría";
    }

    if (!supplier) {
      formErrors.supplier = "El proveedor es obligatorio";
    }

    if (!date) {
      formErrors.date = "La fecha es obligatoria";
    }

    return formErrors;
  };

  const handleCreateOrder = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrorMessages(Object.values(validationErrors));

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const formattedDate = date
      ? date.split('-').reverse().join('/') // Convierte de yyyy-mm-dd a dd/mm/yyyy
      : '';

    const newOrder = {
      name: newOrderName,
      description: description,
      quantity: quantity,
      content: content,
      category: category,
      date: formattedDate,
      supplier: supplier,
    };

    fetch("http://localhost:3000/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newOrder),
    })
      .then((response) => response.json())
      .then(() => {
        setNewOrderName("");
        setDescription("");
        setQuantity(1);
        setContent("");
        setCategory("");
        setDate("");
        setSupplier("");
        onCreate();
        toggleModal();
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error creando pedido:", error);
      });

  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Crear nuevo pedido</h2>
        {errorMessages.length > 0 && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <ul>
              {errorMessages.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={handleCreateOrder}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Nombre del pedido"
              value={newOrderName}
              onChange={(e) => setNewOrderName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              placeholder="Cantidad"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Contenido"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
            <input
              type="text"
              placeholder="Proveedor"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="Descripción del pedido (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="bg-gray-400 py-1 px-3 rounded-md text-white hover:bg-gray-600"
              onClick={toggleModal}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-yellow-500 py-1 px-3 rounded-md text-white hover:bg-yellow-600"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
