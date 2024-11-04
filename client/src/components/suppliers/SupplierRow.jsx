// Proposito: Nos permite mostrar una tabla de proveedores y gestionar sus acciones

import supabase from "../../utils/supabase";
import { useState } from "react";
import { ModalSupplier } from "./ModalSupplier";
import ConfirmationModal from "./ConfirmationModal";
import { useContext } from "react";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";
import EditIcon from "../../assets/EditIcon";
import InfoIcon from "../../assets/InfoIcon";
import DeleteIcon from "../../assets/DeleteIcon";

export default function SupplierRow({
  name,
  phone_number,
  id,
  className,
  onUpdate,
  address,
}) {
  const { showNotification } = useContext(ConfirmationDataContext);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [windowsModal, setWindowsModal] = useState(false);
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    supplierId: "",
    option: "",
  });

  const abrirCerrarModal = (titleModal, supplierId, option) => {
    setModalProps({
      titleModal,
      supplierId,
      option,
    });
    setWindowsModal(!windowsModal);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("supplier")
        .update({ state: false })
        .eq("id", id);

      if (error) {
        showNotification("Error al eliminar el proveedor", "error");
        console.error("Error eliminando el proveedor:", error.message);
      } else {
        showNotification(
          "El proveedor ha sido eliminado correctamente",
          "success"
        );
        onUpdate();
      }
    } catch (error) {
      console.error("Error al eliminar el proveedor:", error);
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
        <td className="p-3 text-center">{phone_number}</td>
        <td className="p-3 flex gap-2 justify-end">
        <button
            className="text-blue-400 px-3 flex items-center hover:text-blue-600 transition-all duration-300 ease"
            onClick={() => abrirCerrarModal("Información Proveedor", id, "info")}
          >
            <InfoIcon />
          </button>
          <button
            className="text-blue-400 px-3 flex items-center hover:text-blue-600 transition-all duration-300 ease"
            onClick={() => abrirCerrarModal("Modificar Proveedor", id, "update")}
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
        <ModalSupplier
          open={windowsModal}
          onClose={() => setWindowsModal(false)}
          title={modalProps.titleModal}
          supplierId={modalProps.supplierId}
          option={modalProps.option}
          onUpdate={onUpdate}
        />
      )}

      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        supplierName={name}
      />
    </>
  );
}
