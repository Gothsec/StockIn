// Propósito: Nos permite mostrar una tabla de bodegas y gestionar sus acciones

import supabase from "../../utils/supabase";
import { useState, useContext } from "react";
import { ModalWarehouse } from "./ModalWarehouse"; // Modal adaptado para bodega
import ConfirmationModal from "./ConfirmationModal";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";

export default function WarehouseRow({
  id,
  name,
  address,
  cant_actual,
  cant_max_product,
  className,
  onUpdate,
}) {
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
        .from("warehouse")
        .update({ state: false })
        .eq("id", id);

      if (error) {
        showNotification("Error al eliminar la bodega", "error");
        console.error("Error eliminando la bodega:", error.message);
      } else {
        showNotification(
          "La bodega ha sido eliminada correctamente",
          "success"
        );
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
        <td className="p-3">{address}</td>
        <td className="p-3 text-center">{cant_actual}</td>
        <td className="p-3 text-center">{cant_max_product}</td>
        <td className="p-3 flex gap-2 justify-end">
          <button
            className="py-1 px-2 bg-red-500 text-white rounded-md"
            onClick={() => setConfirmModalOpen(true)}
          >
            Eliminar
          </button>
          <button
            className="py-1 px-2 bg-green-500 text-white rounded-md"
            onClick={() =>
              abrirCerrarModal("Modificar Bodega", id, "update")
            }
          >
            Editar
          </button>
          <button
            className="py-1 px-2 bg-blue-500 text-white rounded-md"
            onClick={() =>
              abrirCerrarModal("Información Bodega", id, "info")
            }
          >
            Info
          </button>
        </td>
      </tr>

      {windowsModal && (
        <ModalWarehouse
          open={windowsModal}
          onClose={() => setWindowsModal(false)}
          title={modalProps.titleModal}
          warehouseId={modalProps.warehouseId}
          option={modalProps.option}
          onUpdate={onUpdate}
        />
      )}

      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={name}
      />
    </>
  );
}
