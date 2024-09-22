import Nav from "../components/Nav";
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
                  onDelete={handleDeleteOrder}
                  onUpdate={fetchOrders}
                />
              ))}
            </tbody>
          </table>
        </div>

        <button
          className="bg-yellow-500 py-1 px-2 rounded-md text-white hover:bg-yellow-600 mt-2 ml-auto"
          onClick={toggleModal}
        >
          Agregar Pedido
        </button>

        {isModalOpen && (
          <CreateOrderModal onCreate={fetchOrders} toggleModal={toggleModal} />
        )}
      </div>
    </div>
  );
}
