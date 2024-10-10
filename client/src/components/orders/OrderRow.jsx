import { useState } from "react";
import { ModalOrder } from "./ModalOrder";

export default function OrderRow({ name, quantity, id, className, onUpdate }) {
  const [windowsModal, setWindowsModal] = useState(false);
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    orderId: "",
    option: "",
  });

  const abrirCerrarModal = (titleModal, orderId, option) => {
    setModalProps({
      titleModal,
      orderId,
      option,
    });
    setWindowsModal(!windowsModal);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("order")
        .update({ state: false })
        .eq("id", id);

      if (error) {
        console.error("Error eliminando el pedido:", error.message);
      } else {
        onUpdate();
      }
    } catch (error) {
      console.error("Error al eliminar el pedido:", error);
    }
  };

  return (
    <>
      <tr className={`${className} text-left border-b`}>
        <td className="p-3">{name}</td>
        <td className="p-3 text-center">{quantity}</td>
        <td className="p-3 flex gap-2 justify-end">
          <button
            className="py-1 px-2 bg-red-500 text-white rounded-md"
            onClick={handleDelete}
          >
            Eliminar
          </button>
          <button
            className="py-1 px-2 bg-green-500 text-white rounded-md"
            onClick={() => abrirCerrarModal("Modificar Pedido", id, "update")}
          >
            Editar
          </button>
          <button
            className="py-1 px-2 bg-blue-500 text-white rounded-md"
            onClick={() => abrirCerrarModal("Información Pedido", id, "info")}
          >
            Info
          </button>
        </td>
      </tr>

      {windowsModal && (
        <ModalOrder
          open={windowsModal}
          onClose={() => setWindowsModal(false)}
          title={modalProps.titleModal}
          orderId={modalProps.orderId}
          option={modalProps.option}
        />
      )}
    </>
  );
}
