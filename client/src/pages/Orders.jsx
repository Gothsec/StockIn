// proposito: Nos permite mostrar y gestionar los pedidos

import { useEffect, useState } from "react";
import OrderRow from "../components/orders/OrderRow";
import { ModalOrder } from "../components/orders/ModalOrder";
import supabase from "../utils/supabase";
import MessageConfirmation from "../components/MessageConfirmation";
import AddIcon from "../assets/AddIcon";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [searchOrder, setSearchOrder] = useState("");
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    buttonText: "",
    onClickFunction: () => {},
    orderId: "",
    option: "",
  });
  const [windowsModal, setWindowsModal] = useState(false);
  const [error, setError] = useState(null);

  const abrirCerrarModal = (
    titleModal,
    buttonText,
    onClickFunction,
    orderId = "",
    option = ""
  ) => {
    setModalProps({
      titleModal,
      buttonText,
      onClickFunction,
      orderId,
      option,
    });
    setWindowsModal((prev) => !prev);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("order")
      .select(
        `
        id, 
        quantity, 
        product:product_id(name)  -- JOIN con la tabla product para obtener el nombre
      `
      )
      .eq("state", true);

    if (error) {
      console.error("Error fetching orders: ", error);
      setError("Error al cargar los pedidos.");
      setOrders([]);
    } else {
      setOrders(data || []);
      setError(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = Array.isArray(orders)
    ? orders.filter((order) => {
        if (!order.product?.name) return false;
        if (searchOrder === "") return true;
        return order.product.name
          .toLowerCase()
          .includes(searchOrder.toLowerCase());
      })
    : [];

  return (
    <div className="flex max-h-screen overflow-hidden">
      <div className="py-6 px-10 w-full flex flex-col">
        <header className="flex justify-between items-baseline pb-8">
          <h1 className="font-bold text-4xl">Pedidos</h1>
          <input
            className="flex-auto border border-gray-400 h-9 rounded-lg pl-3 ml-9"
            type="search"
            placeholder="Buscar pedido"
            onChange={(e) => setSearchOrder(e.target.value)}
          />
          <button
            className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg w-48 h-9 ml-9 hover:bg-blue-700 transition-all duration-300 ease"
            onClick={() => abrirCerrarModal("Nuevo Pedido", "", "create")}
          >
            <AddIcon />
          </button>
        </header>
        <MessageConfirmation />
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex-grow overflow-y-auto border rounded-lg">
          <table className="w-full border-collapse relative">
            <thead>
              <tr className="bg-slate-200 sticky top-0 left-0">
                <th className="py-2 text-left px-4">Nombre del Producto</th>
                <th className="py-2 text-center px-4">Cantidad</th>
                <th className="py-2 text-left px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <OrderRow
                  key={order.id}
                  id={order.id}
                  name={order.product.name}
                  quantity={order.quantity}
                  className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                  onUpdate={fetchOrders}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {windowsModal && (
        <ModalOrder
          open={windowsModal}
          onClose={() => setWindowsModal(false)}
          title={modalProps.titleModal}
          orderId={modalProps.orderId}
          option={modalProps.option}
          onUpdate={fetchOrders}
        />
      )}
    </div>
  );
}
