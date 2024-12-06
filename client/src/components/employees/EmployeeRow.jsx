import { useState, useContext } from "react";
import supabase from "../../utils/supabase";
import { ModalEmployee } from "./ModalEmployee";
import ConfirmationModal from "./ConfirmationModal";
import { ConfirmationDataContext } from "../../contexts/ConfirmationData";
import InfoIcon from "../../assets/InfoIcon";
import EditIcon from "../../assets/EditIcon";
import DeleteIcon from "../../assets/DeleteIcon";

export default function EmployeeRow({
  name,
  email,
  phone_number,
  id,
  className,
  onUpdate,
}) {
  const { showNotification } = useContext(ConfirmationDataContext);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [windowsModal, setWindowsModal] = useState(false);
  const [modalProps, setModalProps] = useState({
    titleModal: "",
    userId: "",
    option: "",
  });

  const abrirCerrarModal = (titleModal, userId, option) => {
    setModalProps({
      titleModal,
      userId,
      option,
    });
    setWindowsModal(true);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("user")
        .update({ state: false })
        .eq("id", id);

      if (error) {
        showNotification("Error al eliminar el empleado", "error");
        console.error("Error eliminando el empleado:", error.message);
      } else {
        showNotification("El empleado ha sido eliminado correctamente", "success");
        onUpdate();
      }
    } catch (error) {
      console.error("Error al eliminar el empleado:", error);
      showNotification("Error al eliminar el empleado", "error");
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
        <td className="p-3 text-center">{email}</td>
        <td className="p-3 text-center">{phone_number}</td>
        <td className="p-3 justify-end flex text-center">
          <button
            className="text-blue-400 px-3 flex items-center hover:text-blue-600 transition-all duration-300 ease"
            onClick={() => abrirCerrarModal("Información del usuario", id, "info")}
          >
            <InfoIcon />
          </button>

          <button
            className="text-blue-400 px-3 flex items-center hover:text-blue-600 transition-all duration-300 ease"
            onClick={() => abrirCerrarModal("Modificar usuario", id, "update")}
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
        <ModalEmployee
          title={modalProps.titleModal}
          employeeId={modalProps.userId}
          option={modalProps.option}
          onClose={() => setWindowsModal(false)}
          onUpdate={onUpdate}
        />
      )}

      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        userName={name}
      />
    </>
  );
}



