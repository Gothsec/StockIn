import { useState } from "react";
import { ModalOrder } from "./ModalOrder"; 
import supabase from "../../utils/supabase";

export default function OrderRow({ description, id, className }) {
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
        window.location.reload();
      }
    } catch (error) {
      console.error("Error al eliminar el pedido:", error);
    }
  };

  return (
    <>
      <tr className={`flex justify-between items-center w-full ${className}`}>
        <td className="p-3">{description}</td>
        <td className="flex justify-between p-3 w-[25%]">
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
