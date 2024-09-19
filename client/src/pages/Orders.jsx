import Nav from "../components/Nav";
import { OrderRow } from "../components/orders/OrderRow";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [searchOrder, setSearchOrder] = useState("");
  const [newOrderName, setNewOrderName] = useState(""); // Para el nombre del nuevo pedido
  const [isModalOpen, setIsModalOpen] = useState(false); // Para manejar la visibilidad del modal

  const fetchOrders = () => {
    fetch("http://localhost:3000/read-order", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        setOrders(result);
      })
      .catch((err) => {
        console.error("Error: ", err);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreateOrder = (e) => {
    e.preventDefault();
    const newOrder = {
      name: newOrderName, // Aquí puedes agregar otros campos que se requieran
    };

    fetch("http://localhost:3000/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newOrder),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Pedido creado: ", result);
        setNewOrderName(""); // Limpiar el input después de crear el pedido
        fetchOrders(); // Actualizar la lista de pedidos
        setIsModalOpen(false); // Cerrar el modal después de crear el pedido
      })
      .catch((error) => {
        console.error("Error creando pedido:", error);
      });
  };

  const filteredOrders = Array.isArray(orders)
    ? orders.filter((order) =>
        order.name.toLowerCase().includes(searchOrder.toLowerCase())
      )
    : [];

  // Función para abrir y cerrar el modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="flex max-h-screen overflow-hidden">
      <Nav />
      <div className="py-6 px-10 w-full flex flex-col">
        <header className="flex mb-5 justify-between items-baseline border-b border pb-8">
          <h1 className="font-bold text-4xl">Pedidos</h1>
          <div className="flex gap-4">
            <input
              className="border border-gray-400 w-96 pl-2 rounded-md"
              type="search"
              placeholder="Buscar pedido"
              onChange={(e) => setSearchOrder(e.target.value)}
            />
            <button className="bg-slate-400 py-1 px-2 rounded-md text-white hover:bg-slate-600">
              Buscar
            </button>
          </div>
        </header>

        <div className="flex-grow overflow-y-auto border border-gray-600">
          <table className="w-full border-collapse relative">
            <thead>
              <tr className="bg-gray-200 sticky top-0 left-0">
                <th className="py-2 text-left px-4">Nombre</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <OrderRow
                  key={order.id}
                  id={order.id}
                  name={order.name}
                  className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Botón para abrir el modal */}
        <button
          className="bg-yellow-500 py-1 px-2 rounded-md text-white hover:bg-yellow-600 mt-2 ml-auto"
          onClick={toggleModal}
        >
          Agregar Pedido
        </button>

        {/* Modal para crear nuevo pedido */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Crear nuevo pedido</h2>
              <form onSubmit={handleCreateOrder}>
                <input
                  type="text"
                  placeholder="Nombre del pedido"
                  value={newOrderName}
                  onChange={(e) => setNewOrderName(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full mb-4"
                  required
                />
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
        )}
      </div>
    </div>
  );
}
