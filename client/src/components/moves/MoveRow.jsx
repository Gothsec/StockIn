// proposito: Nos permite mostrar una tabla de pedidos y gestionar sus acciones

import supabase from "../../utils/supabase";
import { useState } from "react";
import { ModalMove } from "./ModalMove";
import ConfirmationModal from "./ConfirmationModal";
import { useContext } from "react";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";
import InfoIcon from "../../assets/InfoIcon";
import EditIcon from "../../assets/EditIcon";
import DeleteIcon from "../../assets/DeleteIcon";

export default function MoveRow({
  name,
  quantity,
  id,
  type,
  className,
  onUpdate,
}) {
  const { showNotification } = useContext(ConfirmationDataContext);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [windowsModal, setWindowsModal] = useState(false);
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    moveId: "",
    option: "",
  });

  const abrirCerrarModal = (titleModal, moveId, option) => {
    setModalProps({
      titleModal,
      moveId,
      option,
    });
    setWindowsModal(!windowsModal);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("move")
        .update({ state: false })
        .eq("id", id);

      if (error) {
        showNotification("Error al eliminar el pedido", "error");
        console.error("Error eliminando el pedido:", error.message);
      } else {
        showNotification(
          "El pedido ha sido eliminado correctamente",
          "success"
        );
        onUpdate();
      }
    } catch (error) {
      console.error("Error al eliminar el pedido:", error);
    }
  };

  const confirmDelete = () => {
    handleDelete();
    setConfirmModalOpen(false);
  };

  return (
    <>
      <tr className={`${className} text-left border-b`}>
        <td className="p-3">{name}</td>
        <td className="p-3">{quantity}</td>
        <td className="p-3 text-center">{type}</td>
        <td className="p-3 flex gap-2 justify-end">
          <button
            className="text-blue-400 px-3 flex items-center hover:text-blue-600 transition-all duration-300 ease"
            onClick={() =>
              abrirCerrarModal("Información movimiento", id, "info")
            }
          >
            <InfoIcon />
          </button>
          <button
            className="text-blue-400 px-3 flex items-center hover:text-blue-600 transition-all duration-300 ease"
            onClick={() =>
              abrirCerrarModal("Modificar movimiento", id, "update")
            }
          >
            <EditIcon />
          </button>
          <button
            className="text-red-400 px-3 rounded-lg flex items-center hover:text-red-600 transition-all duration-300 ease"
            onClick={() => setConfirmModalOpen(true)}
          >
            <DeleteIcon />
          </button>
        </td>
      </tr>

      {windowsModal && (
        <ModalMove
          open={windowsModal}
          onClose={() => setWindowsModal(false)}
          title={modalProps.titleModal}
          moveId={modalProps.moveId}
          option={modalProps.option}
          onUpdate={onUpdate}
        />
      )}

      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        moveName={name}
      />
    </>
  );
}
