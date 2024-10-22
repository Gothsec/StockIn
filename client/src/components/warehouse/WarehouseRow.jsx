import supabase from "../../utils/supabase";
import { useState, useContext } from "react";
import { ModalWarehouse } from "./ModalWarehouse"; // Adaptado para bodegas
import ConfirmationModal from "./ConfirmationModal";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";
import DeleteIcon from "../../assets/DeleteIcon";
import EditIcon from "../../assets/EditIcon";
import InfoIcon from "../../assets/InfoIcon";

export default function WarehouseRow({
  id,
  name,
  address,
  cant_actual,
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
    setModalProps({ titleModal, warehouseId, option });
    setWindowsModal(!windowsModal);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("warehouse")
        .update({ state: false }) // Cambio para actualizar el estado de la bodega
        .eq("id", id);

      if (error) {
        console.error("Error eliminando la bodega:", error.message);
        showNotification("Error al eliminar la bodega", "error");
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
      <tr id={id} className={className}>
        <td className="p-3">{name}</td>
        <td className="p-3 text-center">{address}</td>
        <td className="p-3 text-center">{cant_actual}</td>
        <td className="p-3 justify-end flex text-center">
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
        itemName={name} // Ajuste en el nombre del ítem a confirmar
      />
    </>
  );
}
