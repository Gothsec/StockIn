// Propósito: Nos permite mostrar una tabla de bodegas y gestionar sus acciones

import supabase from "../../utils/supabase";
import { useState } from "react";
import { ModalWarehouse } from "./ModalWarehouse"; // Cambiar a ModalWarehouse
import ConfirmationModal from "./ConfirmationModal";
import { useContext } from "react";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";
import InfoIcon from "../../assets/InfoIcon";
import EditIcon from "../../assets/EditIcon";
import DeleteIcon from "../../assets/DeleteIcon";

export default function WarehouseRow({ name, quantity, id, className, onUpdate }) {
  const { showNotification } = useContext(ConfirmationDataContext);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [windowsModal, setWindowsModal] = useState(false);
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    warehouseId: "",
    option: "",
  });

  const abrirCerrarModal = (titleModal, warehouseId, option) => {
    setModalProps({
      titleModal,
      warehouseId,
      option,
    });
    setWindowsModal(!windowsModal);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("warehouse") // Cambiar de "order" a "warehouse"
        .update({ state: false })
        .eq("id", id);

      if (error) {
        showNotification("Error al eliminar la bodega", "error");
        console.error("Error eliminando la bodega:", error.message);
      } else {
        showNotification("La bodega ha sido eliminada correctamente", "success");
        onUpdate();
      }
    } catch (error) {
      console.error("Error al eliminar la bodega:", error);
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
        <td className="p-3 text-center">{quantity}</td>
        <td className="p-3 flex gap-2 justify-end">
          <button
            className="text-blue-400 px-3 flex items-center hover:text-blue-600 transition-all duration-300 ease"
            onClick={() => abrirCerrarModal("Información Bodega", id, "info")}
          >
            <InfoIcon />
          </button>
          <button
            className="text-blue-400 px-3 flex items-center hover:text-blue-600 transition-all duration-300 ease"
            onClick={() => abrirCerrarModal("Modificar Bodega", id, "update")}
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
        <ModalWarehouse // Cambiar a ModalWarehouse
          open={windowsModal}
          onClose={() => setWindowsModal(false)}
          title={modalProps.titleModal}
          warehouseId={modalProps.warehouseId} // Cambiar a warehouseId
          option={modalProps.option}
          onUpdate={onUpdate}
        />
      )}

      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        orderName={name} // Cambiar a warehouseName si es necesario
      />
    </>
  );
}
