import { useEffect, useState } from "react";
import OrderRow from "../components/orders/OrderRow";
import ModalWindows from "../components/ModalWindows";
import supabase from "../utils/supabase";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [searchOrder, setSearchOrder] = useState("");
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    buttonText: "",
    onClickFunction: () => {},
  });
  const [windowsModal, setWindowsModal] = useState(false);
  const [error, setError] = useState(null);

  const abrirCerrarModal = (titleModal, buttonText, onClickFunction) => {
    setModalProps({
      titleModal,
      buttonText,
      onClickFunction,
    });
    setWindowsModal((prev) => !prev);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("order")
      .select("*")
      .eq("state", true);

    if (error) {
      console.error("Error fetching orders: ", error);
      setError("Error al cargar los pedidos.");
      setOrders([]);
    } else {

      if (Array.isArray(data)) {
        setOrders(data);
      } else if (data !== null && typeof data === "object") {
        setOrders([data]);
      } else {
        setOrders([]);
      }
      
      setError(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onUpdate = (e) => {
    if (e) e.preventDefault();
    fetchOrders();
  };

  const filteredOrders = Array.isArray(orders)
    ? orders.filter((order) => {
        if (!order.description) return false;
        if (searchOrder === "") return true;
        return order.description.toLowerCase().includes(searchOrder.toLowerCase());
      })
    : [];

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
            onClick={() => abrirCerrarModal("Nuevo Pedido", "Crear", onUpdate)}
          >
            Agregar Pedido
          </button>
        </header>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex-grow overflow-y-auto border rounded-lg">
          <table className="w-full border-collapse relative">
            <thead>
              <tr className="bg-gray-200 sticky top-0 left-0">
                <th className="py-2 text-left px-4">Descripcion</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <OrderRow
                  key={order.id}
                  id={order.id}
                  description={order.description}
                  className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                  onUpdate={fetchOrders}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ModalWindows
        open={windowsModal}
        onClose={() => abrirCerrarModal("", "", () => {})}
        titleModal={modalProps.titleModal}
        buttonText={modalProps.buttonText}
        onClickFunction={() => {
          modalProps.onClickFunction();
          setWindowsModal(false);
        }}
      />
    </div>
  );
}
