import supabase from "../../utils/supabase";
import { useState } from "react";
import { ModalSupplier } from "./ModalSupplier";
import ConfirmationModal from "./ConfirmationModal";
import { useContext } from "react";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";

export default function SupplierRow({ name, email, phone_number, id, className, onUpdate, }) {
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
        <td className="p-3">{email}</td>
        <td className="p-3 text-center">{phone_number}</td>
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
              abrirCerrarModal("Modificar Proveedor", id, "update")
            }
          >
            Editar
          </button>
          <button
            className="py-1 px-2 bg-blue-500 text-white rounded-md"
            onClick={() =>
              abrirCerrarModal("Información Proveedor", id, "info")
            }
          >
            Info
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
