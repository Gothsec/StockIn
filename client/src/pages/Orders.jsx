import { OrderRow } from "../components/orders/OrderRow";
import { useEffect, useState } from "react";
import CreateOrderModal from "../components/orders/CreateOrderModal";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [searchOrder, setSearchOrder] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrderName, setNewOrderName] = useState("");

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

  const handleDeleteOrder = (id) => {
    fetch(`http://localhost:3000/delete-order/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
        } else {
          console.error("No se pudo eliminar el pedido.");
        }
      })
      .catch((err) => {
        console.error("Error: ", err);
      });
  };

  const handleCreateOrder = (e) => {
    e.preventDefault();
    const newOrder = {
      name: newOrderName,
    };

    fetch("http://localhost:3000/create-order", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newOrder),
    })
      .then((response) => {
        if (response.ok) {
          setOrders((prevOrders) => [...prevOrders, newOrder]);
          setNewOrderName("");
          fetchOrders();
        } else {
          console.error("No se pudo crear el pedido.");
        }
      })
      .catch((err) => {
        console.error("Error: ", err);
      });
  };

  const filteredOrders = Array.isArray(orders)
    ? orders.filter((order) =>
        order.name.toLowerCase().includes(searchOrder.toLowerCase())
      )
    : [];

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="flex max-h-screen overflow-hidden">
      <div className="py-6 px-10 w-full flex flex-col">
        <header className="flex justify-between items-baseline pb-8">
          <h1 className="font-bold text-4xl">Pedidos</h1>
            <input
              className="flex-auto border border-gray-400 h-9 rounded-xl pl-2 ml-9"
              type="search"
              placeholder="Buscar pedido"
              onChange={(e) => setSearchOrder(e.target.value)}
            />
            <button
              className="bg-blue-500 rounded-xl text-white hover:bg-blue-600 mt-3 w-48 h-9 ml-9"
              onClick={toggleModal}
            >
              Agregar Pedido
            </button>
        </header>

        <div className="flex-grow overflow-y-auto border rounded-lg">
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
                  onDelete={handleDeleteOrder}
                  onUpdate={fetchOrders}
                />
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <CreateOrderModal onCreate={fetchOrders} toggleModal={toggleModal} />
        )}
      </div>
    </div>
  );
}
